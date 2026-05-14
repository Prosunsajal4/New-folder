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
    const { message, context, messages } = req.body;

    if (!openai) {
      const text = String(message || '').toLowerCase();
      if (text.includes('routine')) {
        return res.json({
          response: "Here is a simple daily routine: 1) Morning: review notes 30–45m. 2) Midday: 2 focused study blocks (25–40m each). 3) Evening: practice problems 45–60m. 4) Night: quick recap + plan tomorrow. Want it customized by subjects and free time?",
        });
      }
      if (text.includes('attendance')) {
        return res.json({
          response: "I can calculate attendance and safe absences. Share: total classes, attended classes, and required percentage (e.g., 75% or 80%).",
        });
      }
      if (text.includes('explain')) {
        return res.json({
          response: "I can explain step-by-step. Tell me the exact topic and your current level (beginner/intermediate/advanced).",
        });
      }
      return res.json({
        response: "I can help with study plans, explanations, summaries, and productivity tips. Tell me your subject, deadline, and how much time you have each day.",
      });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const trimmedMessages = Array.isArray(messages)
      ? messages
          .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && m.content)
          .slice(-10)
      : [];
    const conversation = trimmedMessages.length > 0
      ? trimmedMessages
      : [{ role: 'user', content: message }];

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are StudentOS AI Assistant. Provide clear, accurate, and practical help for students. Ask clarifying questions when needed. Use concise steps, examples, and avoid fluff. If asked for calculations, request the required numbers. If a request is ambiguous, ask one short follow-up question.',
        },
        ...(context
          ? [{ role: 'system', content: `Context: ${String(context)}` }]
          : []),
        ...conversation,
      ],
      max_tokens: 700,
      temperature: 0.4,
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

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one subject.' });
    }

    const parsedExamDates = Array.isArray(examDates)
      ? examDates
          .map((entry) => {
            if (typeof entry === 'string') {
              const parts = entry.split(':');
              if (parts.length >= 2) {
                return { subject: parts[0].trim(), date: parts.slice(1).join(':').trim() };
              }
            }
            return entry && entry.subject && entry.date ? entry : null;
          })
          .filter(Boolean)
      : [];

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

    if (parsedExamDates.length > 0) {
      const upcomingExams = parsedExamDates
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
