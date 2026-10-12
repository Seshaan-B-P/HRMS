const { S3Client } = require('@aws-sdk/client-s3');

const isS3Configured = Boolean(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  (process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET_NAME)
);

const bucketName = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET_NAME || '';
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

let s3Client = null;

if (isS3Configured) {
  const s3Config = {
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  };

  // Optional custom endpoint for S3-compatible providers (Cloudflare R2, MinIO, Wasabi, DigitalOcean Spaces)
  if (process.env.AWS_S3_ENDPOINT) {
    s3Config.endpoint = process.env.AWS_S3_ENDPOINT;
  }

  // Force path style for MinIO, LocalStack, or private S3 clusters
  if (process.env.AWS_S3_FORCE_PATH_STYLE === 'true') {
    s3Config.forcePathStyle = true;
  }

  s3Client = new S3Client(s3Config);
  console.log(`[Storage] Private S3-compatible storage configured for bucket: ${bucketName} (${region})`);
} else {
  console.log('[Storage] Private S3 storage credentials not detected. Secure local disk fallback active.');
}

module.exports = {
  s3Client,
  isS3Configured,
  bucketName,
  region
};
