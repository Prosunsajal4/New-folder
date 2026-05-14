const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

// Initialize AI service (OpenAI preferred, fallback to Gemini)
let aiService = null;
let serviceType = "none";

console.log("Initializing AI service...");
console.log("Environment check - OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "SET" : "NOT SET");
console.log("Environment check - GEMINI_API_KEY_NEW:", process.env.GEMINI_API_KEY_NEW ? "SET" : "NOT SET");
console.log("Environment check - GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "SET" : "NOT SET");

// Try OpenAI first (more reliable)
if (process.env.OPENAI_API_KEY) {
  try {
    const OpenAI = require("openai");
    aiService = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    serviceType = "openai";
    console.log("✅ OpenAI service initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize OpenAI:", error.message);
  }
}

// Fall back to Gemini if OpenAI not available (prefer new key)
if (!aiService) {
  const geminiKey = process.env.GEMINI_API_KEY_NEW || process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      aiService = new GoogleGenerativeAI(geminiKey);
      serviceType = "gemini";
      console.log("✅ Gemini AI service initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize Gemini:", error.message);
    }
  }
} 

if (!aiService) {
  console.warn("⚠️  No AI API keys found - will use fallback responses only");
}

// High-quality fallback responses for intelligent conversation
const qualityResponses = {
  study: "Here are 7 proven study techniques for better learning:\n\n✅ **Active Recall:** Test yourself instead of re-reading. Flashcards and practice problems strengthen memory by 50%.\n\n✅ **Spaced Repetition:** Review at intervals (1 day, 3 days, 1 week, 1 month). Proven most effective for exams.\n\n✅ **Feynman Technique:** Explain concepts simply as if teaching a child. Reveals gaps in understanding.\n\n✅ **Pomodoro:** 25 min intense study + 5 min break. After 4 cycles, take 15-30 min break.\n\n✅ **Interleaving:** Mix different topics instead of blocking same topics. Improves concept distinction.\n\n✅ **Elaboration:** Connect new info to what you know. Ask 'why' and 'how' constantly.\n\n✅ **Sleep:** 7-8 hours consolidates memories 30-40% better! Non-negotiable for exams.",
  routine: "Here's an effective daily routine:\n\n📚 **Morning (8-10 AM):** Review yesterday's notes (30 min) + Warm-up (15 min)\n\n🎯 **Late Morning (10-12 PM):** Deep study block 1 - New concepts (90 min with 10 min break at 45 min)\n\n🍽️ **Lunch (12-1 PM):** Eat well, rest\n\n📝 **Afternoon (1-3 PM):** Deep study block 2 - Practice problems (90 min with breaks)\n\n💪 **Break (3-4 PM):** Exercise, walk, refresh\n\n🔄 **Late Afternoon (4-6 PM):** Review + Homework (60 min)\n\n🌙 **Evening (7-9 PM):** Plan tomorrow + Light review (45 min)\n\n⏰ **Sleep:** Target 7-8 hours\n\nCustomize based on your energy levels. Study hardest subjects during peak energy (usually morning). What subjects are you studying?",
  exam: "Here's complete exam preparation strategy:\n\n📅 **3 Weeks Before:**\nReview all notes and textbook chapters. Make summary notes. Create concept maps.\n\n📅 **2 Weeks Before:**\nSolve previous year papers (last 5 years). Identify weak areas. Join study groups.\n\n📅 **Final Week:**\nSolve full mock exams under timed conditions. Focus on weak areas. Sleep well!\n\n⏰ **Day Before:**\nLight revision only (30 min max). Organize materials. Get 8+ hours sleep.\n\n🎯 **During Exam:**\nRead entire paper first. Answer easy questions first. Manage time (1 min per mark). Review if time permits.",
  memory: "Here are 8 ways to improve memory:\n\n🧠 **Memory Palace:** Visualize placing info in familiar locations (your home). Walk mentally during recall. Ancient scholars used this!\n\n🧠 **Chunking:** Break info into meaningful groups. 5551234567 → 555-123-4567 (easier).\n\n🧠 **Spaced Repetition:** Review at: 1 day, 3 days, 1 week, 2 weeks, 1 month. Most proven method.\n\n🧠 **Mnemonics:** Create acronyms or associations. PEMDAS for order of operations.\n\n🧠 **Elaboration:** Connect new info to what you know. Ask 'why' and 'how'.\n\n🧠 **Sleep:** 7-8 hours sleep consolidates memories 30-40% better!\n\n🧠 **Teaching:** Explain to a friend. Teaching forces deeper processing.\n\n🧠 **Visualization:** Create vivid mental images. Color, movement, emotion make memories stick!",
  attendance: "Here's strategic attendance management:\n\n✅ **Why Attendance Matters:**\n- Most institutions require 75-80% minimum\n- Missing classes = missing context and exam hints\n- Teachers include topics on exams during lectures\n\n📊 **How to Calculate:**\nAttendance % = (Classes Attended ÷ Total Classes) × 100\nExample: 45/60 classes = 75%\n\n⚠️ **Safe Absences:**\nIf you need 75% attendance with 100 total classes:\n- You can miss: 25 classes maximum\n- But aim for 80-85% (buffer for emergencies)\n\n💡 **Strategy:**\n- Attend regularly\n- Avoid missing final 2-3 weeks\n- Inform teachers in advance\n- Track weekly\n\nTell me: How many total classes and how many attended? I'll calculate exactly how many you can miss!",
  productivity: "Here are 10 productivity tips:\n\n⚡ **1. Single-Task:** One task at a time. Multi-tasking reduces efficiency by 40%!\n\n⚡ **2. Time Blocking:** 9-10 AM = Math, 10-11 AM = English\n\n⚡ **3. Remove Distractions:** Phone away, quiet space. One notification kills focus for 20 min!\n\n⚡ **4. Energy Management:** Study hardest subjects at peak energy (usually 8-12 AM).\n\n⚡ **5. Take Proper Breaks:** 5-10 min every 25 min. NO phone during breaks!\n\n⚡ **6. Dedicated Space:** Same desk trains your brain for focus.\n\n⚡ **7. Start Small:** 2-3 hours focused work, not 8.\n\n⚡ **8. Track Progress:** Keep study log. Seeing progress motivates you!\n\n⚡ **9. Plan Tomorrow:** 5 min planning before sleep.\n\n⚡ **10. Sleep & Exercise:** More important than motivation!",
  default: "I'm StudentOS AI Assistant! I help with:\n\n📚 **Study Techniques:** Active recall, spaced repetition, Feynman technique\n📅 **Study Planning:** Daily routines, weekly schedules, exam prep\n🧠 **Memory:** Memory palace, chunking, visualization\n📊 **Attendance:** Calculate safe absences\n⏰ **Productivity:** Focus, time blocking, distraction removal\n🎯 **Goals:** SMART goal setting\n\nTry asking:\n- 'Give me study techniques'\n- 'Create a study routine'\n- 'How many classes can I miss?'\n- 'Productivity tips'\n- 'How to improve memory?'\n\nWhat can I help with?"
};

function findBestResponse(message) {
  const text = (message || "").toLowerCase();
  if (text.match(/study|technique|method|recall|spaced|pomodoro|feynman|learning/i)) return qualityResponses.study;
  if (text.match(/routine|schedule|plan|daily|time|organize|structure/i)) return qualityResponses.routine;
  if (text.match(/exam|test|prepare|score|marks|final|viva/i)) return qualityResponses.exam;
  if (text.match(/memory|remember|memorize|retention|brain/i)) return qualityResponses.memory;
  if (text.match(/attendance|classes|miss|safe|absent/i)) return qualityResponses.attendance;
  if (text.match(/productivity|focus|distraction|efficient|concentrate/i)) return qualityResponses.productivity;
  return qualityResponses.default;
}

// @route   POST /api/ai/chat
// @desc    AI chat assistant
// @access  Private
router.post("/chat", protect, async (req, res) => {
  try {
    const { message, context, messages } = req.body;
    console.log("AI Chat request:", { msgLength: message?.length, serviceType });

    // If no service configured, use intelligent fallback
    if (!aiService) {
      console.log("No AI service, using fallback responses");
      return res.json({ response: findBestResponse(message) });
    }

    // Try OpenAI
    if (serviceType === "openai") {
      try {
        console.log("Using OpenAI API");
        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
        const trimmedMessages = Array.isArray(messages)
          ? messages.filter((m) => m && m.role && m.content).slice(-10)
          : [];
        const conversation = trimmedMessages.length > 0 ? trimmedMessages : [{ role: "user", content: message }];

        const completion = await aiService.chat.completions.create({
          model,
          messages: [
            { role: "system", content: "You are StudentOS AI Assistant. Help with study, productivity, exams. Be practical and concise." },
            ...(context ? [{ role: "system", content: `Context: ${String(context)}` }] : []),
            ...conversation,
          ],
          max_tokens: 800,
          temperature: 0.7,
        });

        return res.json({ response: completion.choices[0].message.content });
      } catch (openaiError) {
        console.warn("OpenAI error:", openaiError.message?.substring(0, 80));
      }
    }

    // Try Gemini
    if (serviceType === "gemini") {
      try {
        console.log("Using Gemini API");
        const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
        let model = null;

        for (const modelName of models) {
          try {
            model = aiService.getGenerativeModel({ model: modelName });
            console.log("Loaded:", modelName);
            break;
          } catch (e) {
            console.warn("Unavailable:", modelName);
          }
        }

        if (!model) throw new Error("No models available");

        const trimmedMessages = Array.isArray(messages)
          ? messages.filter((m) => m && m.role && m.content).slice(-10)
          : [];

        const conversation = trimmedMessages.length > 0
          ? trimmedMessages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n")
          : message;

        const prompt = `You are StudentOS AI Assistant. Help with study, productivity, exams. Be practical and concise.

${context ? `Context: ${String(context)}` : ""}

${conversation}`;

        const result = await aiService.generateContent(prompt);
        return res.json({ response: result.response.text() });
      } catch (geminiError) {
        const msg = geminiError.message || "";
        console.warn("Gemini error:", msg.substring(0, 80));
        // If quota error, use intelligent fallback
        if (msg.includes("429") || msg.includes("quota")) {
          console.log("Quota exceeded, using fallback");
          return res.json({
            response: findBestResponse(message) + "\n\n_AI Note: Using optimized responses. For live AI, upgrade your Gemini API plan._",
          });
        }
      }
    }

    // Fallback to intelligent responses
    console.log("Using intelligent fallback responses");
    return res.json({ response: findBestResponse(message) });
  } catch (error) {
    console.error("Chat error:", error.message?.substring(0, 100));
    // Return helpful response even on error
    return res.json({ response: findBestResponse((req.body?.message || "").toString()) });
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
