const mongoose = require('mongoose');

const jobReportSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reporterEmail: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      required: true,
      enum: [
        'Spam or Scam',
        'Misleading Information',
        'Discriminatory Content',
        'Expired Listing',
        'Incorrect Salary or Benefits',
        'Other',
      ],
      default: 'Spam or Scam',
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Dismissed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobReport', jobReportSchema);
