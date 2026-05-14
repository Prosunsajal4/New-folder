const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

// Initialize AI service (Gemini preferred, fallback to OpenAI)
let aiService = null;
let serviceType = 'none';

if (process.env.GEMINI_API_KEY) {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    aiService = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    serviceType = 'gemini';
  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
  }
} else if (process.env.OPENAI_API_KEY) {
  try {
    const OpenAI = require("openai");
    aiService = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    serviceType = 'openai';
  } catch (error) {
    console.error("Failed to initialize OpenAI:", error);
  }
}

// @route   POST /api/ai/chat
// @desc    AI chat assistant
// @access  Private
router.post("/chat", protect, async (req, res) => {
  try {
    const { message, context, messages } = req.body;

    if (!aiService) {
      const text = String(message || "").toLowerCase();
      
      // Study routine requests
      if (text.includes("routine") || text.includes("schedule") || text.includes("plan")) {
        return res.json({
          response: "Here's a balanced daily study routine:\n\n📚 **Morning (9-11 AM):** Review yesterday's notes (45 min) + Light exercise\n\n🎯 **Midday (12-3 PM):** 2 focused study blocks (45 min each) with 10 min breaks\n\n📝 **Afternoon (4-6 PM):** Practice problems/assignments (60 min) + Short break\n\n🔄 **Evening (7-9 PM):** Quick review + Plan tomorrow's priorities\n\n💤 **Night:** Relax 30 min before bed\n\n💡 **Tips:** Use Pomodoro (25 min study + 5 min break), stay hydrated, and get 7-8 hours sleep. Want me to customize this for your subjects?",
        });
      }
      
      // Attendance calculations
      if (text.includes("attendance") || text.includes("miss") || text.includes("safe")) {
        return res.json({
          response: "I can help calculate attendance! Please provide:\n- Total classes held\n- Classes you've attended\n- Required attendance percentage (usually 75-80%)\n\nExample: 'I have 50 total classes, attended 40, need 75% minimum'\n\nI'll tell you how many more classes you can miss safely!",
        });
      }
      
      // Explanations
      if (text.includes("explain") || text.includes("what") || text.includes("how")) {
        return res.json({
          response: "I'll explain concepts step-by-step! Please tell me:\n- The specific topic/subject\n- Your current level (beginner/intermediate/advanced)\n- What you already understand\n\nFor example: 'Explain calculus derivatives, I'm intermediate level'",
        });
      }
      
      // Study tips and productivity
      if (text.includes("tip") || text.includes("productivity") || text.includes("focus") || text.includes("study")) {
        return res.json({
          response: "Here are proven study tips:\n\n🎯 **Active Recall:** Test yourself instead of re-reading\n\n📝 **Spaced Repetition:** Review material over increasing intervals\n\n🧠 **Feynman Technique:** Explain concepts in simple terms\n\n⏰ **Pomodoro:** 25 min focused work + 5 min break\n\n📚 **Environment:** Quiet, well-lit space with no distractions\n\n💡 **Sleep & Nutrition:** 7-8 hours sleep + healthy meals\n\nWant tips for a specific subject or issue?",
        });
      }
      
      // Default helpful response
      return res.json({
        response: "I'm your AI study assistant! I can help with:\n\n📚 Study planning and routines\n📊 Attendance calculations\n📝 Concept explanations\n💡 Productivity tips\n🎯 Goal setting\n\nWhat would you like help with? Be specific for better assistance!",
      });
    }

    // Use Gemini or OpenAI based on what's available
    if (serviceType === 'gemini') {
      const model = aiService.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const trimmedMessages = Array.isArray(messages)
        ? messages
            .filter(
              (m) =>
                m && (m.role === "user" || m.role === "assistant") && m.content,
            )
            .slice(-10)
        : [];
      
      const conversation = trimmedMessages.length > 0
        ? trimmedMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n')
        : message;

      const prompt = `You are StudentOS AI Assistant. Provide clear, accurate, and practical help for students. Ask clarifying questions when needed. Use concise steps, examples, and avoid fluff. If asked for calculations, request the required numbers. If a request is ambiguous, ask one short follow-up question.

${context ? `Context: ${String(context)}` : ''}

${conversation}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      res.json({ response });
    } else if (serviceType === 'openai') {
      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
      const trimmedMessages = Array.isArray(messages)
        ? messages
            .filter(
              (m) =>
                m && (m.role === "user" || m.role === "assistant") && m.content,
            )
            .slice(-10)
        : [];
      const conversation =
        trimmedMessages.length > 0
          ? trimmedMessages
          : [{ role: "user", content: message }];

      const completion = await aiService.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are StudentOS AI Assistant. Provide clear, accurate, and practical help for students. Ask clarifying questions when needed. Use concise steps, examples, and avoid fluff. If asked for calculations, request the required numbers. If a request is ambiguous, ask one short follow-up question.",
          },
          ...(context
            ? [{ role: "system", content: `Context: ${String(context)}` }]
            : []),
          ...conversation,
        ],
        max_tokens: 700,
        temperature: 0.4,
      });

      res.json({ response: completion.choices[0].message.content });
    }
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI service unavailable" });
  }
});

// @route   POST /api/ai/attendance-prediction
// @desc    Predict attendance and give suggestions
// @access  Private
router.post("/attendance-prediction", protect, async (req, res) => {
  try {
    const { courses } = req.body;
    const predictions = [];

    courses.forEach((course) => {
      const stats = course.attendanceStats || {};
      const totalPercentage = parseFloat(stats.total?.percentage || 0);
      const safeAbsences = parseInt(stats.total?.safeAbsences || 0);

      let suggestion = "";
      let riskLevel = "low";

      if (totalPercentage < 60) {
        riskLevel = "critical";
        suggestion =
          "Critical: Your attendance is very low. Attend all remaining classes to avoid debarment.";
      } else if (totalPercentage < 75) {
        riskLevel = "high";
        suggestion = `High risk: You need to attend the next ${Math.ceil(((75 - totalPercentage) / 100) * 60)} classes to reach 75%.`;
      } else if (totalPercentage < 80) {
        riskLevel = "medium";
        suggestion = `Medium risk: Attend the next ${Math.ceil(((80 - totalPercentage) / 100) * 60)} classes to reach 80%.`;
      } else if (safeAbsences > 0) {
        riskLevel = "low";
        suggestion = `Good: You can safely miss ${safeAbsences} more classes while staying above 80%.`;
      } else {
        riskLevel = "low";
        suggestion = "Excellent: Your attendance is in great shape!";
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
router.post("/study-planner", protect, async (req, res) => {
  try {
    const { subjects, examDates, weakSubjects, dailyFreeTime } = req.body;

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one subject." });
    }

    const parsedExamDates = Array.isArray(examDates)
      ? examDates
          .map((entry) => {
            if (typeof entry === "string") {
              const parts = entry.split(":");
              if (parts.length >= 2) {
                return {
                  subject: parts[0].trim(),
                  date: parts.slice(1).join(":").trim(),
                };
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
        priority: weakSubjects.includes(subject) ? "high" : "normal",
      });
    });

    // Generate recommendations
    if (weakSubjects.length > 0) {
      plan.recommendations.push(
        `Focus more on: ${weakSubjects.join(", ")} - these are your weak areas.`,
      );
    }

    if (parsedExamDates.length > 0) {
      const upcomingExams = parsedExamDates
        .filter((e) => new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

      upcomingExams.forEach((exam) => {
        const daysUntil = Math.ceil(
          (new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24),
        );
        plan.recommendations.push(
          `${exam.subject} exam in ${daysUntil} days - Start revising now!`,
        );
      });
    }

    plan.recommendations.push(
      "Use Pomodoro technique: 25 minutes study, 5 minutes break.",
      "Review your notes at the end of each day.",
      "Practice previous year questions for better preparation.",
    );

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/ai/routine-generator
// @desc    Generate daily routine
// @access  Private
router.post("/routine-generator", protect, async (req, res) => {
  try {
    const { sleepTime, wakeTime, classSchedule, studyGoals } = req.body;

    const routine = [];

    // Parse times
    const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);
    const [sleepHour, sleepMinute] = sleepTime.split(":").map(Number);

    // Morning routine
    routine.push({ time: wakeTime, activity: "Wake up & freshen up" });
    routine.push({
      time: `${String(wakeHour + 1).padStart(2, "0")}:00`,
      activity: "Breakfast",
    });

    // Add class schedule
    if (classSchedule && classSchedule.length > 0) {
      classSchedule.forEach((cls) => {
        routine.push({ time: cls.time, activity: `${cls.subject} Class` });
      });
    }

    // Study blocks
    routine.push({ time: "14:00", activity: "Lunch break" });
    routine.push({
      time: "15:00",
      activity: "Study Session 1: Review morning classes",
    });
    routine.push({ time: "17:00", activity: "Break/Exercise" });
    routine.push({
      time: "18:00",
      activity: "Study Session 2: Practice problems",
    });
    routine.push({ time: "20:00", activity: "Dinner" });
    routine.push({ time: "21:00", activity: "Study Session 3: Revision" });
    routine.push({ time: "22:00", activity: "Relax/Prepare for bed" });
    routine.push({ time: sleepTime, activity: "Sleep" });

    res.json({ routine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
