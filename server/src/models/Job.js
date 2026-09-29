const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Design', 'Development', 'Marketing', 'Sales', 'Finance', 'Management', 'Other'],
      default: 'Development',
    },
    type: {
      type: String,
      required: true,
      enum: ['Full Time', 'Part Time', 'Contract', 'Remote', 'Internship'],
      default: 'Full Time',
    },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: '$' },
      period: { type: String, default: 'yr' },
    },
    experience: {
      type: String,
      enum: ['0-1 years', '1-3 years', '3-5 years', '5+ years'],
      default: '1-3 years',
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: [
      {
        type: String,
      },
    ],
    requirements: [
      {
        type: String,
      },
    ],
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
