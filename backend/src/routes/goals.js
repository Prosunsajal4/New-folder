const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const protect = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// @route   GET /api/goals
// @desc    Get all goals for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const goal = await Goal.create({
      user: req.user._id,
      ...req.body,
    });

    createNotification(req.user._id.toString(), {
      title: 'New Goal Created!',
      message: `Goal: "${goal.title}". Let's crush it!`,
      type: 'goal',
      link: '/goals',
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const wasCompleted = goal.status === 'completed';
    Object.assign(goal, req.body);
    await goal.save();

    if (!wasCompleted && goal.status === 'completed') {
      createNotification(req.user._id.toString(), {
        title: 'Goal Achieved! 🎉',
        message: `Congratulations! You completed "${goal.title}"`,
        type: 'goal',
        link: '/goals',
      });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await goal.deleteOne();
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
