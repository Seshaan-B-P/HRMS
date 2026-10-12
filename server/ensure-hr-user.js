const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clientportal');
    console.log('Connected to MongoDB');

    const userCollection = mongoose.connection.collection('users');
    const salt = await bcrypt.genSalt(10);
    const hrPasswordHash = await bcrypt.hash('Hr@123', salt);

    // 1. Ensure hr@genfrex.com exists and has password Hr@123
    const hrAccount = await userCollection.findOne({ email: 'hr@genfrex.com' });
    if (!hrAccount) {
      await userCollection.insertOne({
        name: 'Anisha',
        email: 'hr@genfrex.com',
        password: hrPasswordHash,
        role: 'HR',
        title: 'HR Talent Lead',
        companyName: 'GENFREX',
        phone: '+91 98765 43210',
        avatar: '',
        skills: [],
        status: 'ACTIVE',
        isActive: true,
        tokenVersion: 0,
        hiredFromCandidate: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Created hr@genfrex.com account with password Hr@123');
    } else {
      await userCollection.updateOne(
        { email: 'hr@genfrex.com' },
        {
          $set: {
            password: hrPasswordHash,
            status: 'ACTIVE',
            isActive: true,
            role: 'HR'
          }
        }
      );
      console.log('✅ Updated hr@genfrex.com password to Hr@123');
    }

    // 2. Also ensure anisha@genfrex.com has password Hr@123
    await userCollection.updateOne(
      { email: 'anisha@genfrex.com' },
      {
        $set: {
          password: hrPasswordHash,
          status: 'ACTIVE',
          isActive: true,
          role: 'HR'
        }
      }
    );
    console.log('✅ Updated anisha@genfrex.com password to Hr@123');

    // 3. Print verified users
    const users = await userCollection.find({}, { projection: { email: 1, role: 1, name: 1, status: 1 } }).toArray();
    console.log('\nVerified Users in Database:');
    users.forEach(u => console.log(`- ${u.name} (${u.email}) [${u.role}] - Status: ${u.status}`));

    await mongoose.disconnect();
    console.log('\nTesting Login API...');
    for (const testEmail of ['hr@genfrex.com', 'anisha@genfrex.com', 'admin@genfrex.com']) {
      const pass = testEmail.includes('admin') ? 'Admin@123' : 'Hr@123';
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: pass })
      });
      const data = await res.json();
      console.log(`Login ${testEmail} [${pass}]:`, data.success ? `SUCCESS (Role: ${data.user.role})` : `FAILED (${data.message})`);
    }
    console.log('\nAll done.');
  } catch (err) {
    console.error('Error ensuring HR account:', err);
    process.exit(1);
  }
}

run();
