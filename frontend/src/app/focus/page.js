'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import axios from '../../lib/axios';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Focus() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Timer state
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const [currentSubject, setCurrentSubject] = useState('');
  const [interruptions, setInterruptions] = useState(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchSessions();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await axios.get('/focus/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load focus stats');
      console.error(error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/focus');
      setSessions(response.data.slice(0, 10));
    } catch (error) {
      console.error(error);
    }
  };

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    // Save the completed session
    try {
      const duration = sessionType === 'pomodoro' ? 25 : sessionType === 'shortBreak' ? 5 : 15;
      await axios.post('/focus', {
        duration,
        subject: currentSubject || 'General',
        type: 'pomodoro',
        completed: true,
        interruptions,
      });
      toast.success('Focus session completed!');
      fetchStats();
      fetchSessions();
    } catch (error) {
      toast.error('Failed to save session');
      console.error(error);
    }

    // Play notification sound
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance('Focus session completed!');
      window.speechSynthesis.speak(utterance);
    }

    // Reset timer
    setMinutes(25);
    setSeconds(0);
    setInterruptions(0);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(25);
    setSeconds(0);
    setInterruptions(0);
  };

  const handleSessionType = (type) => {
    setSessionType(type);
    setIsRunning(false);
    if (type === 'pomodoro') {
      setMinutes(25);
    } else if (type === 'shortBreak') {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
    setSeconds(0);
  };

  const handleInterruption = () => {
    setInterruptions(interruptions + 1);
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="lg:ml-64 p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Focus Mode
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay focused with Pomodoro technique
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="text-center mb-8">
                <div className="text-8xl font-bold text-gray-900 dark:text-white mb-4 font-mono">
                  {formatTime(minutes, seconds)}
                </div>
                
                <div className="flex justify-center gap-3 mb-6">
                  <button
                    onClick={() => handleSessionType('pomodoro')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      sessionType === 'pomodoro'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Pomodoro (25m)
                  </button>
                  <button
                    onClick={() => handleSessionType('shortBreak')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      sessionType === 'shortBreak'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Short Break (5m)
                  </button>
                  <button
                    onClick={() => handleSessionType('longBreak')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      sessionType === 'longBreak'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Long Break (15m)
                  </button>
                </div>

                <input
                  type="text"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  placeholder="What are you studying?"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center mb-6"
                />

                <div className="flex justify-center gap-4">
                  {!isRunning ? (
                    <button
                      onClick={handleStart}
                      className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 font-semibold"
                    >
                      <Play size={20} />
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2 font-semibold"
                    >
                      <Pause size={20} />
                      Pause
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2 font-semibold"
                  >
                    <RotateCcw size={20} />
                    Reset
                  </button>
                </div>

                <button
                  onClick={handleInterruption}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-all text-sm"
                >
                  Log Interruption ({interruptions})
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="space-y-6">
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Focus Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Hours</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalHours}
                      </p>
                    </div>
                    <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.todayHours}h
                      </p>
                    </div>
                    <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Week</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.weekHours}h
                      </p>
                    </div>
                    <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sessions</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.completedSessions}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recent Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Sessions
                </h3>
                <div className="space-y-3">
                  {sessions.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No sessions yet
                    </p>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <Clock size={20} className="text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {session.subject}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(session.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {session.duration}m
                          </p>
                          {session.interruptions > 0 && (
                            <p className="text-xs text-red-500">
                              {session.interruptions} interruptions
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
