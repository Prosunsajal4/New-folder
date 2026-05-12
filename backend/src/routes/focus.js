const express = require('express');
const router = express.Router();
const FocusSession = require('../models/FocusSession');
const protect = require('../middleware/auth');

// @route   GET /api/focus
// @desc    Get all focus sessions for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const sessions = await FocusSession.find({ user: req.user._id }).sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/focus/stats
// @desc    Get focus statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const sessions = await FocusSession.find({ user: req.user._id });
    
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
    const totalHours = totalMinutes / 60;
    const completedSessions = sessions.filter(s => s.completed).length;
    const averageDuration = sessions.length > 0 ? totalMinutes / sessions.length : 0;
    
    // Get today's focus time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = sessions.filter(s => new Date(s.date) >= today);
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    
    // Get this week's focus time
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo);
    const weekMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);

    res.json({
      totalHours: totalHours.toFixed(2),
      totalMinutes,
      completedSessions,
      totalSessions: sessions.length,
      averageDuration: averageDuration.toFixed(2),
      todayMinutes,
      todayHours: (todayMinutes / 60).toFixed(2),
      weekMinutes,
      weekHours: (weekMinutes / 60).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/focus
// @desc    Create a new focus session
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const session = await FocusSession.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/focus/:id
// @desc    Update a focus session
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const session = await FocusSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Focus session not found' });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    Object.assign(session, req.body);
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/focus/:id
// @desc    Delete a focus session
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const session = await FocusSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Focus session not found' });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await session.deleteOne();
    res.json({ message: 'Focus session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
