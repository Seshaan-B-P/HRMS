const fs = require('fs');
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3Client, isS3Configured, bucketName } = require('../config/s3');

/**
 * Upload a private/confidential file to Amazon S3 or S3-compatible storage
 * @param {Object} options
 * @param {Buffer} [options.buffer] - In-memory buffer
 * @param {string} [options.filePath] - Local file path on disk
 * @param {string} options.key - Unique S3 object key (e.g. hr/letters/...)
 * @param {string} options.mimeType - MIME type
 * @param {boolean} [options.isConfidential=true]
 */
const uploadToS3 = async ({ buffer, filePath, key, mimeType, isConfidential = true }) => {
  if (!isS3Configured || !s3Client) {
    throw new Error('S3 client is not configured.');
  }

  let body = buffer;
  if (!body && filePath) {
    body = fs.readFileSync(filePath);
  }

  if (!body) {
    throw new Error('No file content or path provided for S3 upload.');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: mimeType || 'application/octet-stream',
    // Confidential documents use strict private ACL
    ACL: 'private',
    Metadata: {
      confidential: isConfidential ? 'true' : 'false',
      uploadedAt: new Date().toISOString()
    }
  });

  await s3Client.send(command);

  // If local file path was used, clean it up
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn(`[Storage] Failed to unlink temp file ${filePath}: ${err.message}`);
    }
  }

  return {
    storageProvider: 'S3',
    storageKey: key,
    fileUrl: `s3://${bucketName}/${key}`
  };
};

/**
 * Generate a short-lived pre-signed download/view URL for a private S3 document
 * @param {string} key - S3 object key
 * @param {number} [expiresIn=900] - Expiration in seconds (default: 15 minutes)
 * @returns {Promise<string>} Pre-signed URL
 */
const getSignedDownloadUrl = async (key, expiresIn = 900) => {
  if (!isS3Configured || !s3Client) {
    throw new Error('S3 is not configured.');
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Get object stream from S3 for authenticated proxy streaming
 * @param {string} key - S3 object key
 */
const getS3ObjectStream = async (key) => {
  if (!isS3Configured || !s3Client) {
    throw new Error('S3 is not configured.');
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  const response = await s3Client.send(command);
  return {
    stream: response.Body,
    contentType: response.ContentType,
    contentLength: response.ContentLength
  };
};

/**
 * Delete a private document from S3
 * @param {string} key - S3 object key
 */
const deleteFromS3 = async (key) => {
  if (!isS3Configured || !s3Client) {
    return;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    await s3Client.send(command);
  } catch (err) {
    console.warn(`[Storage] Failed to delete S3 object ${key}: ${err.message}`);
  }
};

module.exports = {
  uploadToS3,
  getSignedDownloadUrl,
  getS3ObjectStream,
  deleteFromS3,
  isS3Configured
};
