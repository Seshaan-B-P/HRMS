require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Candidate = require('./models/Candidate');
const AppointmentLetter = require('./models/AppointmentLetter');
const HRApproval = require('./models/HRApproval');
const HRAuditLog = require('./models/HRAuditLog');
const HRSettings = require('./models/HRSettings');
const File = require('./models/File');
const Notification = require('./models/Notification');

async function deleteCandidates() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clientportal';
  console.log(`[Delete Candidates] Connecting to MongoDB: ${mongoUri}`);
  await mongoose.connect(mongoUri);

  // Check candidates before deletion
  const candidatesBefore = await Candidate.find({}, { name: 1, email: 1, designation: 1 });
  console.log(`[Delete Candidates] Found ${candidatesBefore.length} candidate(s):`);
  candidatesBefore.forEach(c => console.log(`  - ${c.name} (${c.email}) - ${c.designation}`));

  const [
    delCandidates,
    delLetters,
    delApprovals,
    delAuditLogs,
    delFiles,
    delNotifications
  ] = await Promise.all([
    Candidate.deleteMany({}),
    AppointmentLetter.deleteMany({}),
    HRApproval.deleteMany({}),
    HRAuditLog.deleteMany({}),
    File.deleteMany({ module: 'HR' }),
    Notification.deleteMany({ type: { $in: ['HR', 'APPOINTMENT'] } })
  ]);

  console.log('\n[Delete Candidates] Purged:');
  console.log(`  - Candidates: ${delCandidates.deletedCount}`);
  console.log(`  - Appointment Letters: ${delLetters.deletedCount}`);
  console.log(`  - HR Approvals: ${delApprovals.deletedCount}`);
  console.log(`  - HR Audit Logs: ${delAuditLogs.deletedCount}`);
  console.log(`  - HR Files: ${delFiles.deletedCount}`);
  console.log(`  - HR Notifications: ${delNotifications.deletedCount}`);

  // Reset HR sequence to 1
  await HRSettings.updateMany({}, { $set: { currentSequence: 1 } });
  console.log('  - HR Reference Sequence reset back to 1.');

  // Clean generated PDFs in server/uploads
  const uploadsDir = path.join(__dirname, 'uploads');
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    let removed = 0;
    for (const f of files) {
      if (f !== '.gitkeep') {
        try {
          fs.unlinkSync(path.join(uploadsDir, f));
          removed++;
        } catch (e) {
          console.warn(`Could not delete ${f}: ${e.message}`);
        }
      }
    }
    console.log(`  - Cleaned server/uploads (${removed} files deleted).`);
  }

  await mongoose.disconnect();
  console.log('\n✅ [Delete Candidates] All candidate data deleted successfully.');
}

deleteCandidates().catch(err => {
  console.error('[Error]', err);
  process.exit(1);
});
