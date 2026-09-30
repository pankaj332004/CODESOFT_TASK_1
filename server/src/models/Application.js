const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    candidateName: {
      type: String,
      required: true,
    },
    candidateEmail: {
      type: String,
      required: true,
    },
    candidatePhone: {
      type: String,
      default: '',
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Under Review', 'Interview', 'Hired', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    interview: {
      date: { type: String, default: '' },
      time: { type: String, default: '' },
      type: { type: String, default: 'Video Call' },
      meetingLink: { type: String, default: '' },
      notes: { type: String, default: '' },
      scheduledAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', applicationSchema);
