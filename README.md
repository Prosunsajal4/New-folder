# StudentOS - AI-Powered Student Productivity App

A full-stack AI-powered student productivity web application built with Next.js, Express.js, MongoDB, and OpenAI API.

## Features

### Core Features
- **Authentication System** - JWT-based secure authentication with register, login, and logout
- **Smart Dashboard** - Overview with stats cards, charts, and productivity metrics
- **Attendance Tracker** - Track course attendance with AI-powered predictions
- **Assignment Manager** - Manage assignments with priority, deadlines, and status tracking
- **Exam Tracker** - Track exams with countdown, readiness percentage, and topics
- **Smart Notes System** - Create and manage notes with markdown support and search/filter
- **Focus Mode** - Pomodoro timer with session tracking and statistics
- **Goal Tracker** - Set and track academic and personal goals with progress visualization
- **AI Study Planner** - Generate personalized study plans based on your schedule
- **Daily Routine Generator** - AI-powered daily routine optimization
- **AI Chat Assistant** - Get help with studies, productivity tips, and planning

### Additional Features
- **Dark/Light Mode** - Toggle between themes with persistence
- **Responsive Design** - Mobile-optimized layout
- **Glassmorphism UI** - Modern, beautiful interface with gradients
- **Smooth Animations** - Framer Motion animations throughout
- **Productivity Analytics** - Chart.js visualizations for focus hours and progress

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Chart.js** - Chart library for analytics
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **React Markdown** - Markdown rendering for notes

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **OpenAI API** - AI-powered features (optional)
- **Bcrypt** - Password hashing

## Project Structure

```
studentos/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js              # Home/redirect page
│   │   │   ├── layout.js            # Root layout
│   │   │   ├── login/page.js        # Login page
│   │   │   ├── register/page.js     # Register page
│   │   │   ├── dashboard/page.js    # Dashboard
│   │   │   ├── attendance/page.js   # Attendance tracker
│   │   │   ├── assignments/page.js  # Assignment manager
│   │   │   ├── exams/page.js        # Exam tracker
│   │   │   ├── notes/page.js        # Notes system
│   │   │   ├── focus/page.js        # Focus mode (Pomodoro)
│   │   │   ├── goals/page.js        # Goal tracker
│   │   │   ├── study-planner/page.js # AI study planner
│   │   │   ├── routine/page.js      # Daily routine generator
│   │   │   └── ai-chat/page.js      # AI chat assistant
│   │   ├── components/
│   │   │   ├── Sidebar.js           # Navigation sidebar
│   │   │   ├── StatCard.js          # Dashboard stat card
│   │   │   └── FocusChart.js        # Focus hours chart
│   │   ├── context/
│   │   │   └── AuthContext.js       # Authentication context
│   │   ├── lib/
│   │   │   └── axios.js             # Axios instance with interceptors
│   │   └── styles/
│   │       └── globals.css          # Global styles
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js              # User model
│   │   │   ├── Course.js            # Course model
│   │   │   ├── Assignment.js        # Assignment model
│   │   │   ├── Exam.js              # Exam model
│   │   │   ├── Note.js              # Note model
│   │   │   ├── Goal.js              # Goal model
│   │   │   └── FocusSession.js      # Focus session model
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── courses.js           # Course routes
│   │   │   ├── assignments.js       # Assignment routes
│   │   │   ├── exams.js             # Exam routes
│   │   │   ├── notes.js             # Note routes
│   │   │   ├── goals.js             # Goal routes
│   │   │   ├── focus.js             # Focus session routes
│   │   │   ├── ai.js                # AI routes
│   │   │   └── dashboard.js         # Dashboard stats routes
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication middleware
│   │   │   └── errorHandler.js      # Error handling middleware
│   │   ├── utils/
│   │   │   └── generateToken.js     # JWT token generation
│   │   └── server.js                # Express server
│   ├── package.json
│   └── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)
- OpenAI API Key (optional, for AI features)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studentos
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/theme` - Update user theme preference

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a new course
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course

### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create a new assignment
- `PUT /api/assignments/:id` - Update an assignment
- `DELETE /api/assignments/:id` - Delete an assignment

### Exams
- `GET /api/exams` - Get all exams
- `POST /api/exams` - Create a new exam
- `PUT /api/exams/:id` - Update an exam
- `DELETE /api/exams/:id` - Delete an exam

### Notes
- `GET /api/notes` - Get all notes (with search/filter)
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create a new goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal

### Focus Sessions
- `GET /api/focus` - Get all focus sessions
- `POST /api/focus` - Create a new focus session
- `GET /api/focus/stats` - Get focus statistics

### AI Features
- `POST /api/ai/chat` - AI chat assistant
- `POST /api/ai/attendance-prediction` - Get attendance predictions
- `POST /api/ai/study-planner` - Generate study plan
- `POST /api/ai/routine-generator` - Generate daily routine

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/focus-chart-data` - Get focus chart data
- `GET /api/dashboard/upcoming-deadlines` - Get upcoming deadlines

## Usage

1. **Register** - Create a new account on the registration page
2. **Login** - Log in with your credentials
3. **Dashboard** - View your productivity overview
4. **Attendance** - Add courses and track your attendance
5. **Assignments** - Manage your assignments with deadlines
6. **Exams** - Track exams and your preparation progress
7. **Notes** - Create and organize study notes
8. **Focus Mode** - Use the Pomodoro timer for focused study sessions
9. **Goals** - Set and track your academic goals
10. **Study Planner** - Get AI-powered study plans
11. **Routine** - Generate optimized daily routines
12. **AI Chat** - Get help with studies and productivity

## AI Features

The AI features use the OpenAI API. To enable them:
1. Get an API key from https://platform.openai.com/
2. Add it to your backend `.env` file as `OPENAI_API_KEY`
3. If no API key is provided, the AI features will use mock responses

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm start
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend
npm start
```

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please open an issue on the repository.
