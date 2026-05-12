const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add an exam title'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please add an exam date'],
  },
  topics: [{
    type: String,
    trim: true,
  }],
  readiness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

examSchema.virtual('daysRemaining').get(function () {
  const now = new Date();
  const diff = this.date - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

examSchema.virtual('isOverdue').get(function () {
  return new Date() > this.date;
});

examSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Exam', examSchema);
