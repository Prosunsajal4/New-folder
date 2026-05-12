const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const protect = require('../middleware/auth');

// @route   GET /api/assignments
// @desc    Get all assignments for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user._id }).sort({ deadline: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/assignments
// @desc    Create a new assignment
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const assignment = await Assignment.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update an assignment
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.body.status === 'completed' && assignment.status !== 'completed') {
      req.body.completedAt = new Date();
    }

    Object.assign(assignment, req.body);
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete an assignment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await assignment.deleteOne();
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
