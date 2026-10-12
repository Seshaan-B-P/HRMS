const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/clientportal');
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('=== COLLECTIONS & COUNTS ===');
  for (let c of collections) {
    const count = await mongoose.connection.db.collection(c.name).countDocuments();
    console.log(`${c.name}: ${count}`);
  }
  const users = await mongoose.connection.db.collection('users').find({}, { projection: { email: 1, role: 1, name: 1 } }).toArray();
  console.log('\n=== USERS IN DB ===');
  console.log(JSON.stringify(users, null, 2));

  const templates = await mongoose.connection.db.collection('lettertemplates').find({}).toArray();
  const settings = await mongoose.connection.db.collection('hrsettings').find({}).toArray();
  console.log('\n=== LETTER TEMPLATES ===', JSON.stringify(templates, null, 2));
  console.log('\n=== HR SETTINGS ===', JSON.stringify(settings, null, 2));
  await mongoose.disconnect();
}

check().catch(console.error);
