const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const FocusSession = require('../models/FocusSession');
const Goal = require('../models/Goal');
const protect = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get courses and calculate overall attendance
    const courses = await Course.find({ user: userId });
    let totalAttendance = 0;
    let courseCount = 0;

    courses.forEach(course => {
      const sectionAAttended = course.sectionA.attended.length;
      const sectionBAttended = course.sectionB.attended.length;
      const totalCourseClasses = course.sectionA.totalClasses + course.sectionB.totalClasses;
      const totalCourseAttended = sectionAAttended + sectionBAttended;
      
      if (totalCourseClasses > 0) {
        const courseAttendance = (totalCourseAttended / totalCourseClasses) * 100;
        totalAttendance += courseAttendance;
        courseCount++;
      }
    });

    // Calculate average attendance across all courses
    totalAttendance = courseCount > 0 ? totalAttendance / courseCount : 0;

    // Get assignments
    const assignments = await Assignment.find({ user: userId });
    const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
    const completedAssignments = assignments.filter(a => a.status === 'completed').length;
    const overdueAssignments = assignments.filter(
      a => a.status !== 'completed' && new Date(a.deadline) < new Date()
    ).length;

    // Get exams
    const exams = await Exam.find({ user: userId });
    const upcomingExams = exams.filter(e => new Date(e.date) > new Date()).length;

    // Get focus sessions for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = await FocusSession.find({
      user: userId,
      date: { $gte: today },
    });
    const todayStudyMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

    // Get goals progress
    const goals = await Goal.find({ user: userId, status: 'active' });
    const goalsProgress = goals.map(g => ({
      title: g.title,
      progress: g.progress,
      target: g.target,
      current: g.current,
    }));

    // Calculate productivity score
    const productivityScore = Math.min(100, (
      (totalAttendance * 0.3) +
      (completedAssignments * 5) +
      (todayStudyMinutes / 6) +
      (goals.filter(g => g.progress > 50).length * 10)
    ));

    res.json({
      overallAttendance: totalAttendance.toFixed(2),
      productivityScore: productivityScore.toFixed(2),
      studyHoursToday: (todayStudyMinutes / 60).toFixed(2),
      upcomingExams,
      pendingAssignments,
      completedAssignments,
      overdueAssignments,
      goalsProgress,
      totalCourses: courses.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/dashboard/attendance-summary
// @desc    Get attendance summary by course
// @access  Private
router.get('/attendance-summary', protect, async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user._id });
    const summary = courses.map(course => ({
      id: course._id,
      name: course.name,
      attendanceStats: course.attendanceStats,
    }));
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/dashboard/upcoming-deadlines
// @desc    Get upcoming deadlines
// @access  Private
router.get('/upcoming-deadlines', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({
      user: req.user._id,
      status: { $ne: 'completed' },
    }).sort({ deadline: 1 }).limit(5);

    const exams = await Exam.find({
      user: req.user._id,
      date: { $gt: new Date() },
    }).sort({ date: 1 }).limit(5);

    res.json({
      assignments,
      exams,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/dashboard/focus-chart-data
// @desc    Get focus chart data for the last 7 days
// @access  Private
router.get('/focus-chart-data', protect, async (req, res) => {
  try {
    const days = [];
    const focusData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const sessions = await FocusSession.find({
        user: req.user._id,
        date: { $gte: date, $lt: nextDate },
      });

      const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      focusData.push(totalMinutes);
    }

    res.json({ days, focusData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
