const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please add an exam title"],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, "Please add a subject"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Please add an exam date"],
  },
  topics: [
    {
      type: String,
      trim: true,
    },
  ],
  readinessCheckboxes: {
    questionsCollected: {
      type: Boolean,
      default: false,
    },
    ctQuestionsCovered: {
      type: Boolean,
      default: false,
    },
    booksAndPdfsCollected: {
      type: Boolean,
      default: false,
    },
    answersReady: {
      type: Boolean,
      default: false,
    },
    fullTopicCovered: {
      type: Boolean,
      default: false,
    },
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

examSchema.virtual("readiness").get(function () {
  const checkboxes = this.readinessCheckboxes;
  const total = 5;
  let completed = 0;
  if (checkboxes.questionsCollected) completed++;
  if (checkboxes.ctQuestionsCovered) completed++;
  if (checkboxes.booksAndPdfsCollected) completed++;
  if (checkboxes.answersReady) completed++;
  if (checkboxes.fullTopicCovered) completed++;
  return Math.round((completed / total) * 100);
});

examSchema.virtual("daysRemaining").get(function () {
  const now = new Date();
  const diff = this.date - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

examSchema.virtual("isOverdue").get(function () {
  return new Date() > this.date;
});

examSchema.set("toJSON", { virtuals: true });
examSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Exam", examSchema);
