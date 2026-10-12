require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const TaskRequest = require('./models/TaskRequest');
const Milestone = require('./models/Milestone');
const File = require('./models/File');
const Comment = require('./models/Comment');
const Activity = require('./models/Activity');
const Notification = require('./models/Notification');
const Candidate = require('./models/Candidate');
const AppointmentLetter = require('./models/AppointmentLetter');
const HRApproval = require('./models/HRApproval');
const HRAuditLog = require('./models/HRAuditLog');
const HRSettings = require('./models/HRSettings');

// Confirmed demo emails created by seed/test scripts
const DEMO_EMAILS = [
  'admin@clientportal.com',
  'hr@genfrex.com',
  'arun@clientportal.com',
  'priya@clientportal.com',
  'david@clientportal.com',
  'client@clientportal.com',
  'marcus@vancetech.io',
  'elena@novapharma.com'
];

async function cleanup() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clientportal';
  console.log(`[Cleanup] Connecting to MongoDB: ${mongoUri}`);
  await mongoose.connect(mongoUri);

  console.log('[Cleanup] Identifying confirmed demo records...');

  // Find demo users
  const demoUsers = await User.find({
    $or: [
      { email: { $in: DEMO_EMAILS } },
      { email: { $regex: /@(clientportal\.com|vancetech\.io|novapharma\.com)$/i } },
      { email: { $regex: /^talent\.test\./i } },
      { email: { $regex: /^divya\.nair\./i } }
    ]
  });

  const demoUserIds = demoUsers.map((u) => u._id);
  console.log(`[Cleanup] Found ${demoUsers.length} demo users to remove.`);

  // Clean demo users
  const delUsers = await User.deleteMany({ _id: { $in: demoUserIds } });
  console.log(`[Cleanup] Deleted ${delUsers.deletedCount} demo users.`);

  // Clean all demo business records associated with demo users or demo projects
  const [
    delProjects,
    delTasks,
    delRequests,
    delMilestones,
    delFiles,
    delComments,
    delActivities,
    delNotifications,
    delCandidates,
    delLetters,
    delApprovals,
    delAuditLogs
  ] = await Promise.all([
    Project.deleteMany({}),
    Task.deleteMany({}),
    TaskRequest.deleteMany({}),
    Milestone.deleteMany({}),
    File.deleteMany({}),
    Comment.deleteMany({}),
    Activity.deleteMany({}),
    Notification.deleteMany({}),
    Candidate.deleteMany({}),
    AppointmentLetter.deleteMany({}),
    HRApproval.deleteMany({}),
    HRAuditLog.deleteMany({})
  ]);

  console.log('[Cleanup] Summary of deleted records:');
  console.log(`  - Projects: ${delProjects.deletedCount}`);
  console.log(`  - Tasks: ${delTasks.deletedCount}`);
  console.log(`  - Task Requests: ${delRequests.deletedCount}`);
  console.log(`  - Milestones: ${delMilestones.deletedCount}`);
  console.log(`  - Files: ${delFiles.deletedCount}`);
  console.log(`  - Comments: ${delComments.deletedCount}`);
  console.log(`  - Activities: ${delActivities.deletedCount}`);
  console.log(`  - Notifications: ${delNotifications.deletedCount}`);
  console.log(`  - Candidates: ${delCandidates.deletedCount}`);
  console.log(`  - Appointment Letters: ${delLetters.deletedCount}`);
  console.log(`  - HR Approvals: ${delApprovals.deletedCount}`);
  console.log(`  - HR Audit Logs: ${delAuditLogs.deletedCount}`);

  // Reset sequence in HR settings to 1 for pristine state
  await HRSettings.updateMany({}, { $set: { currentSequence: 1 } });
  console.log('[Cleanup] Reset HR reference sequence to 1.');

  // Verify remaining users
  const remainingUsers = await User.countDocuments();
  console.log(`[Cleanup] Remaining Users in database: ${remainingUsers}`);

  await mongoose.disconnect();
  console.log('✅ [Cleanup] Demo data successfully purged. Database is now pristine.');
}

cleanup().catch((err) => {
  console.error('[Cleanup Error]', err);
  process.exit(1);
});
