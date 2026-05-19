# StudentOS - AI-Powered Student Productivity Platform

A full-stack AI-powered student productivity web application built with Next.js, Express.js, MongoDB, and Google Gemini AI. Deployed on Vercel with real-time features.

## 🔗 Live Demo

- **Frontend:** https://studentos-liart.vercel.app
- **Backend API:** https://studentosbackend.vercel.app

## ✨ Features

### Core Features
- **Authentication System** - JWT-based secure authentication with register, login, and logout
- **Smart Dashboard** - Overview with stats cards, charts, and productivity metrics
- **Attendance Tracker** - Track course attendance with AI-powered predictions
- **Assignment Manager** - Manage assignments with priority, deadlines, and status tracking
- **Exam Tracker** - Track exams with countdown, readiness percentage, and topics
- **Smart Notes System** - Create and manage notes with markdown support
- **Focus Mode** - Pomodoro timer with session tracking and statistics
- **Goal Tracker** - Set and track academic and personal goals with progress visualization
- **AI Study Planner** - Generate personalized study plans based on your schedule
- **Daily Routine Generator** - AI-powered daily routine optimization
- **AI Chat Assistant** - Get help with studies, productivity tips, and file analysis

### Latest Features (v2.0)
- **Real-time Notifications** - Socket.io powered instant notifications
- **File Upload in AI Chat** - Upload PDF, TXT, DOC files for AI analysis
- **Notification Bell** - Top-right header with notification dropdown
- **Progress Bar** - Dynamic goal progress visualization with live updates

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Chart.js** - Analytics charts
- **Socket.io Client** - Real-time notifications
- **React Markdown** - Markdown rendering
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time events
- **Google Gemini AI** - AI features
- **Multer** - File uploads

## 📁 Project Structure

```
studentos/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js                # Landing page
│   │   │   ├── layout.js             # Root layout
│   │   │   ├── login/page.js         # Login
│   │   │   ├── register/page.js      # Register
│   │   │   ├── dashboard/page.js     # Dashboard
│   │   │   ├── attendance/page.js    # Attendance
│   │   │   ├── assignments/page.js  # Assignments
│   │   │   ├── exams/page.js         # Exams
│   │   │   ├── notes/page.js         # Notes
│   │   │   ├── focus/page.js         # Focus mode
│   │   │   ├── goals/page.js         # Goals
│   │   │   ├── study-planner/page.js # Study planner
│   │   │   ├── routine/page.js       # Routine
│   │   │   └── ai-chat/page.js       # AI chat
│   │   ├── components/
│   │   │   ├── Sidebar.js            # Navigation
│   │   │   ├── Header.js             # Header with notifications
│   │   │   ├── Notifications.js      # Notification dropdown
│   │   │   ├── StatCard.js           # Dashboard cards
│   │   │   └── FocusChart.js         # Focus chart
│   │   ├── context/
│   │   │   └── AuthContext.js        # Auth state
│   │   ├── hooks/
│   │   │   └── useNotifications.js   # Notifications hook
│   │   ├── lib/
│   │   │   ├── axios.js              # API client
│   │   │   └── socket.js             # Socket.io client
│   │   └── styles/
│   │       └── globals.css           # Global styles
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js            # MongoDB
│   │   │   └── socket.js             # Socket.io
│   │   ├── models/
│   │   │   ├── User.js, Course.js, Assignment.js
│   │   │   ├── Exam.js, Note.js, Goal.js
│   │   │   ├── FocusSession.js, Notification.js
│   │   ├── routes/
│   │   │   ├── auth.js, courses.js, assignments.js
│   │   │   ├── exams.js, notes.js, goals.js
│   │   │   ├── focus.js, ai.js, dashboard.js
│   │   │   └── notifications.js
│   │   ├── utils/
│   │   │   └── notifications.js     # Notification helper
│   │   └── server.js                 # Express server
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Vercel Deployment

The app is deployed on Vercel with two projects:
- `studentos` - Frontend (Next.js)
- `studentosbackend` - Backend (Express.js)

### Environment Variables (Backend)

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://studentos-liart.vercel.app
GEMINI_API_KEY=your_gemini_key
NODE_ENV=production
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `PUT /api/auth/theme` - Update theme

### Courses & Attendance
- `GET/POST /api/courses` - Get/Create courses
- `PUT/DELETE /api/courses/:id` - Update/Delete

### Assignments
- `GET/POST /api/assignments` - Get/Create
- `PUT/DELETE /api/assignments/:id` - Update/Delete

### Exams
- `GET/POST /api/exams` - Get/Create
- `PUT/DELETE /api/exams/:id` - Update/Delete

### Notes
- `GET/POST /api/notes` - Get/Create
- `PUT/DELETE /api/notes/:id` - Update/Delete

### Goals
- `GET/POST /api/goals` - Get/Create
- `PUT/DELETE /api/goals/:id` - Update/Delete

### Focus
- `GET/POST /api/focus` - Get/Create sessions

### AI Features
- `POST /api/ai/chat` - AI chat (supports file uploads)
- `POST /api/ai/attendance-prediction` - Attendance predictions
- `POST /api/ai/study-planner` - Generate study plans
- `POST /api/ai/routine-generator` - Generate routines

### Dashboard
- `GET /api/dashboard/stats` - Statistics
- `GET /api/dashboard/focus-chart-data` - Chart data
- `GET /api/dashboard/upcoming-deadlines` - Deadlines

### Notifications
- `GET /api/notifications` - Get all
- `GET /api/notifications/unread-count` - Unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all read
- `DELETE /api/notifications/:id` - Delete

## 🎨 UI Features

- **Dark/Light Mode** - Theme toggle with persistence
- **Responsive Design** - Mobile-first
- **Glassmorphism** - Modern card styling
- **Smooth Animations** - Framer Motion
- **Real-time Updates** - Socket.io

## 🔧 Local Development

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

## 📝 License

MIT License - Open source for educational purposes.

## 👨‍💻 Developer

Built with ❤️ by **Prosun Mukherjee**
- Location: Khulna, Bangladesh
- Email: prosunsajal123@gmail.com
- GitHub: github.com