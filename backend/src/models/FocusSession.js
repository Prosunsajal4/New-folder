const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in minutes'],
  },
  subject: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['pomodoro', 'custom'],
    default: 'pomodoro',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  interruptions: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

focusSessionSchema.virtual('dateString').get(function () {
  return this.date.toISOString().split('T')[0];
});

module.exports = mongoose.model('FocusSession', focusSessionSchema);
