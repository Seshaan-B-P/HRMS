const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: String, // Stored as 'YYYY-MM-DD' for accurate calendar grouping
      required: true
    },
    firstLogin: {
      type: Date,
      required: true
    },
    lastLogin: {
      type: Date,
      required: true
    },
    lastLogout: {
      type: Date
    },
    sessions: [
      {
        loginAt: { type: Date, required: true },
        logoutAt: { type: Date },
        durationMinutes: { type: Number, default: 0 }
      }
    ],
    totalMinutes: {
      type: Number,
      default: 0
    },
    totalHours: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['PRESENT', 'HALF_DAY', 'ON_LEAVE', 'ABSENT'],
      default: 'PRESENT'
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Unique index to ensure one record per user per calendar day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
