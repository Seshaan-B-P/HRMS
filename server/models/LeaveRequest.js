const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    leaveType: {
      type: String,
      enum: ['CASUAL', 'SICK', 'PAID', 'UNPAID'],
      default: 'CASUAL'
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    totalDays: {
      type: Number,
      required: true,
      min: 0.5
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewNote: {
      type: String,
      default: ''
    },
    reviewedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
