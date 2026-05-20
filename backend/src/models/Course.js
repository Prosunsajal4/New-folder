const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please add a course name"],
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
courseSchema.virtual("attendanceStats").get(function () {
  const sectionATotal = Number(this.sectionA.totalClasses) || 0;
  const sectionBTotal = Number(this.sectionB.totalClasses) || 0;
  
  const validSectionA = (this.sectionA.attended || []).filter(n => typeof n === 'number' && n > 0 && n <= sectionATotal);
  const validSectionB = (this.sectionB.attended || []).filter(n => typeof n === 'number' && n > 0 && n <= sectionBTotal);
  
  const sectionAAttended = validSectionA.length;
  const sectionBAttended = validSectionB.length;
  
  const sectionAPercentage = sectionATotal > 0 ? (sectionAAttended / sectionATotal) * 100 : 0;
  const sectionBPercentage = sectionBTotal > 0 ? (sectionBAttended / sectionBTotal) * 100 : 0;
  
  const totalAttended = sectionAAttended + sectionBAttended;
  const totalClasses = sectionATotal + sectionBTotal;
  const totalPercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

  // Section marks (5 marks each)
  const sectionAMarks = (sectionAPercentage / 100) * 5;
  const sectionBMarks = (sectionBPercentage / 100) * 5;
  const totalMarks = sectionAMarks + sectionBMarks;

  // Safe absences calculation (assuming 80% is safe)
  const requiredAttendance = totalClasses * 0.8;
  const safeAbsences = Math.floor(
    totalClasses - requiredAttendance - (totalClasses - totalAttended),
  );

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

courseSchema.set("toJSON", { virtuals: true });

courseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Course", courseSchema);
