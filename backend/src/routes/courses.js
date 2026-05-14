const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const protect = require('../middleware/auth');

// @route   GET /api/courses
// @desc    Get all courses for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user._id }).sort({ createdAt: -1 });
    // Ensure virtuals are included
    const coursesWithStats = courses.map(course => course.toJSON());
    res.json(coursesWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const course = await Course.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(course.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    Object.assign(course, req.body);
    await course.save();
    res.json(course.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
