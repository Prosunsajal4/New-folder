require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/database');
const { init: initSocket } = require('./config/socket');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignments');
const examRoutes = require('./routes/exams');
const noteRoutes = require('./routes/notes');
const goalRoutes = require('./routes/goals');
const focusRoutes = require('./routes/focus');
const aiRoutes = require('./routes/ai');
const dashboardRoutes = require('./routes/dashboard');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
