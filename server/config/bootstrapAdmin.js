const User = require('../models/User');

/**
 * Secure Initial Bootstrap Mechanism for GENFREX Unified Platform
 * Ensures exactly one primary Administrator account exists:
 * Email: admin@genfrex.com
 * Initial Password: Admin@123 (hashed with bcrypt via User model pre-save hook)
 * If an Admin already exists, duplicate account creation is strictly prevented.
 */
const bootstrapAdmin = async () => {
  try {
    // Check if ANY Admin already exists
    const existingAdmin = await User.findOne({ role: 'ADMIN' });
    if (existingAdmin) {
      // Admin account already maintained; do not create duplicate
      return;
    }

    // Check if the specific admin email exists
    const existingEmail = await User.findOne({ email: 'admin@genfrex.com' });
    if (existingEmail) {
      if (existingEmail.role !== 'ADMIN') {
        existingEmail.role = 'ADMIN';
        existingEmail.status = 'ACTIVE';
        existingEmail.isActive = true;
        await existingEmail.save();
      }
      return;
    }

    // Create the sole initial bootstrap Admin account
    // Note: User.pre('save') automatically hashes this password using bcrypt (10 rounds).
    // Plain-text password is NEVER stored in MongoDB.
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@genfrex.com',
      password: 'Admin@123',
      role: 'ADMIN',
      title: 'Platform Administrator',
      companyName: 'GENFREX',
      phone: '',
      status: 'ACTIVE',
      isActive: true,
      tokenVersion: 0
    });

    await adminUser.save();
    console.log('[Bootstrap] Primary Administrator bootstrapped successfully: admin@genfrex.com');
  } catch (error) {
    console.error('[Bootstrap Error] Failed to bootstrap primary administrator:', error.message);
  }
};

module.exports = bootstrapAdmin;
