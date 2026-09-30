const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['candidate', 'employer', 'admin'],
      default: 'candidate',
    },

    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    companyName: {
      type: String,
      default: '',
    },
    companyWebsite: {
      type: String,
      default: '',
    },
    resume: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    skills: {
      type: [String],
      default: ['React', 'JavaScript', 'Node.js'],
    },
    jobAlerts: [
      {
        keyword: { type: String, default: '' },
        category: { type: String, default: '' },
        location: { type: String, default: '' },
        frequency: { type: String, default: 'Weekly' },
        active: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Remove password from JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
