const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['cgpa', 'daily_study', 'attendance', 'weekly_productivity', 'custom'],
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a goal title'],
    trim: true,
  },
  target: {
    type: Number,
    required: [true, 'Please add a target value'],
  },
  current: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    default: '',
  },
  deadline: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
  completedAt: {
    type: Date,
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

goalSchema.virtual('progress').get(function () {
  if (this.target === 0) return 0;
  return Math.min(100, (this.current / this.target) * 100);
});

goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

goalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.current >= this.target && this.status !== 'completed') {
    this.status = 'completed';
    this.completedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
