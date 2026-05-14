const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a course name'],
    trim: true,
  },
  sectionA: {
    totalClasses: {
      type: Number,
      default: 30,
    },
    attended: {
      type: [Number],
      default: [],
    },
  },
  sectionB: {
    totalClasses: {
      type: Number,
      default: 30,
    },
    attended: {
      type: [Number],
      default: [],
    },
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

// Calculate attendance statistics
courseSchema.virtual('attendanceStats').get(function () {
  const sectionAAttended = this.sectionA.attended.length;
  const sectionBAttended = this.sectionB.attended.length;
  const sectionAPercentage = (sectionAAttended / this.sectionA.totalClasses) * 100;
  const sectionBPercentage = (sectionBAttended / this.sectionB.totalClasses) * 100;
  const totalAttended = sectionAAttended + sectionBAttended;
  const totalClasses = this.sectionA.totalClasses + this.sectionB.totalClasses;
  const totalPercentage = (totalAttended / totalClasses) * 100;
  
  // Section marks (5 marks each)
  const sectionAMarks = (sectionAPercentage / 100) * 5;
  const sectionBMarks = (sectionBPercentage / 100) * 5;
  const totalMarks = sectionAMarks + sectionBMarks;
  
  // Safe absences calculation (assuming 80% is safe)
  const requiredAttendance = totalClasses * 0.8;
  const safeAbsences = Math.floor(totalClasses - requiredAttendance - (totalClasses - totalAttended));
  
  return {
    sectionA: {
      attended: sectionAAttended,
      missed: this.sectionA.totalClasses - sectionAAttended,
      percentage: sectionAPercentage.toFixed(2),
      marks: sectionAMarks.toFixed(2),
    },
    sectionB: {
      attended: sectionBAttended,
      missed: this.sectionB.totalClasses - sectionBAttended,
      percentage: sectionBPercentage.toFixed(2),
      marks: sectionBMarks.toFixed(2),
    },
    total: {
      attended: totalAttended,
      missed: totalClasses - totalAttended,
      percentage: totalPercentage.toFixed(2),
      marks: totalMarks.toFixed(2),
      safeAbsences: Math.max(0, safeAbsences),
    },
  };
});

courseSchema.set('toJSON', { virtuals: true });

courseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema);
