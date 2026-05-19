const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const protect = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// @route   GET /api/exams
// @desc    Get all exams for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const exams = await Exam.find({ user: req.user._id }).sort({ date: 1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/exams
// @desc    Create a new exam
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const exam = await Exam.create({
      user: req.user._id,
      ...req.body,
    });

    const daysUntilExam = Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExam > 0 && daysUntilExam <= 7) {
      createNotification(req.user._id.toString(), {
        title: 'Exam Coming Up!',
        message: `"${exam.subject}" exam in ${daysUntilExam} day(s) - Start preparing!`,
        type: 'exam',
        link: '/exams',
      });
    } else if (daysUntilExam <= 0) {
      createNotification(req.user._id.toString(), {
        title: 'Exam Day!',
        message: `Good luck with your "${exam.subject}" exam today!`,
        type: 'exam',
        link: '/exams',
      });
    }

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/exams/:id
// @desc    Update an exam
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (exam.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    Object.assign(exam, req.body);
    await exam.save();
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/exams/:id
// @desc    Delete an exam
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (exam.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await exam.deleteOne();
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
