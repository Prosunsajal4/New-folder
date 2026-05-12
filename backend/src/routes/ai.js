const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const OpenAI = require('openai');

// Initialize OpenAI (will use environment variable if available)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// @route   POST /api/ai/chat
// @desc    AI chat assistant
// @access  Private
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!openai) {
      // Return mock response if no API key
      const mockResponses = [
        "I'd be happy to help with your studies! Based on your question, I recommend breaking down the topic into smaller parts and practicing regularly.",
        "Great question! For effective studying, try the Pomodoro technique - 25 minutes of focused study followed by a 5-minute break.",
        "To improve your attendance, aim to attend at least 80% of your classes. You can safely miss a few classes if you maintain this ratio.",
        "For better productivity, set specific daily goals and track your progress. Consistency is key!",
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return res.json({ response: randomResponse });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant for students. Help them with study planning, attendance calculations, and productivity tips.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'AI service unavailable' });
  }
});

// @route   POST /api/ai/attendance-prediction
// @desc    Predict attendance and give suggestions
// @access  Private
router.post('/attendance-prediction', protect, async (req, res) => {
  try {
    const { courses } = req.body;
    const predictions = [];

    courses.forEach(course => {
      const stats = course.attendanceStats || {};
      const totalPercentage = parseFloat(stats.total?.percentage || 0);
      const safeAbsences = parseInt(stats.total?.safeAbsences || 0);

      let suggestion = '';
      let riskLevel = 'low';

      if (totalPercentage < 60) {
        riskLevel = 'critical';
        suggestion = 'Critical: Your attendance is very low. Attend all remaining classes to avoid debarment.';
      } else if (totalPercentage < 75) {
        riskLevel = 'high';
        suggestion = `High risk: You need to attend the next ${Math.ceil((75 - totalPercentage) / 100 * 60)} classes to reach 75%.`;
      } else if (totalPercentage < 80) {
        riskLevel = 'medium';
        suggestion = `Medium risk: Attend the next ${Math.ceil((80 - totalPercentage) / 100 * 60)} classes to reach 80%.`;
      } else if (safeAbsences > 0) {
        riskLevel = 'low';
        suggestion = `Good: You can safely miss ${safeAbsences} more classes while staying above 80%.`;
      } else {
        riskLevel = 'low';
        suggestion = 'Excellent: Your attendance is in great shape!';
      }

      predictions.push({
        courseId: course._id,
        courseName: course.name,
        currentAttendance: totalPercentage,
        riskLevel,
        suggestion,
        safeAbsences,
      });
    });

    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/ai/study-planner
// @desc    Generate study plan
// @access  Private
router.post('/study-planner', protect, async (req, res) => {
  try {
    const { subjects, examDates, weakSubjects, dailyFreeTime } = req.body;

    // Simple study planner logic
    const plan = {
      dailySchedule: [],
      weeklyPlan: [],
      recommendations: [],
    };

    // Generate daily schedule based on free time
    const hoursPerSubject = Math.floor(dailyFreeTime / subjects.length);
    const remainingMinutes = (dailyFreeTime % subjects.length) * 60;

    subjects.forEach((subject, index) => {
      plan.dailySchedule.push({
        subject,
        duration: hoursPerSubject + (index < remainingMinutes / 60 ? 1 : 0),
        priority: weakSubjects.includes(subject) ? 'high' : 'normal',
      });
    });

    // Generate recommendations
    if (weakSubjects.length > 0) {
      plan.recommendations.push(
        `Focus more on: ${weakSubjects.join(', ')} - these are your weak areas.`
      );
    }

    if (examDates && examDates.length > 0) {
      const upcomingExams = examDates
        .filter(e => new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

      upcomingExams.forEach(exam => {
        const daysUntil = Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24));
        plan.recommendations.push(
          `${exam.subject} exam in ${daysUntil} days - Start revising now!`
        );
      });
    }

    plan.recommendations.push(
      'Use Pomodoro technique: 25 minutes study, 5 minutes break.',
      'Review your notes at the end of each day.',
      'Practice previous year questions for better preparation.'
    );

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/ai/routine-generator
// @desc    Generate daily routine
// @access  Private
router.post('/routine-generator', protect, async (req, res) => {
  try {
    const { sleepTime, wakeTime, classSchedule, studyGoals } = req.body;

    const routine = [];

    // Parse times
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);

    // Morning routine
    routine.push({ time: wakeTime, activity: 'Wake up & freshen up' });
    routine.push({ time: `${String(wakeHour + 1).padStart(2, '0')}:00`, activity: 'Breakfast' });

    // Add class schedule
    if (classSchedule && classSchedule.length > 0) {
      classSchedule.forEach(cls => {
        routine.push({ time: cls.time, activity: `${cls.subject} Class` });
      });
    }

    // Study blocks
    routine.push({ time: '14:00', activity: 'Lunch break' });
    routine.push({ time: '15:00', activity: 'Study Session 1: Review morning classes' });
    routine.push({ time: '17:00', activity: 'Break/Exercise' });
    routine.push({ time: '18:00', activity: 'Study Session 2: Practice problems' });
    routine.push({ time: '20:00', activity: 'Dinner' });
    routine.push({ time: '21:00', activity: 'Study Session 3: Revision' });
    routine.push({ time: '22:00', activity: 'Relax/Prepare for bed' });
    routine.push({ time: sleepTime, activity: 'Sleep' });

    res.json({ routine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
