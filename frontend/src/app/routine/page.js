'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import axios from '../../lib/axios';
import { motion } from 'framer-motion';
import { Clock, Sun, Moon, Coffee, BookOpen, Utensils, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Routine() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [routine, setRoutine] = useState(null);
  const [loadingRoutine, setLoadingRoutine] = useState(false);

  const [formData, setFormData] = useState({
    sleepTime: '23:00',
    wakeTime: '07:00',
    classSchedule: '',
    studyGoals: '',
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleGenerateRoutine = async (e) => {
    e.preventDefault();
    setLoadingRoutine(true);
    
    try {
      const routineData = {
        sleepTime: formData.sleepTime,
        wakeTime: formData.wakeTime,
        classSchedule: formData.classSchedule
          ? formData.classSchedule.split(',').map(c => {
            const [time, subject] = c.trim().split(':');
            return { time: time?.trim(), subject: subject?.trim() };
          }).filter(c => c.time && c.subject)
          : [],
        studyGoals: formData.studyGoals,
      };

      const response = await axios.post('/ai/routine-generator', routineData);
      setRoutine(response.data.routine);
      toast.success('Daily routine generated successfully!');
    } catch (error) {
      toast.error('Failed to generate routine');
      console.error(error);
    } finally {
      setLoadingRoutine(false);
    }
  };

  const getActivityIcon = (activity) => {
    const lowerActivity = activity.toLowerCase();
    if (lowerActivity.includes('wake') || lowerActivity.includes('freshen')) return <Sun size={20} className="text-yellow-500" />;
    if (lowerActivity.includes('breakfast') || lowerActivity.includes('lunch') || lowerActivity.includes('dinner')) return <Utensils size={20} className="text-orange-500" />;
    if (lowerActivity.includes('class')) return <BookOpen size={20} className="text-blue-500" />;
    if (lowerActivity.includes('study')) return <Zap size={20} className="text-purple-500" />;
    if (lowerActivity.includes('sleep')) return <Moon size={20} className="text-indigo-500" />;
    if (lowerActivity.includes('relax') || lowerActivity.includes('break')) return <Coffee size={20} className="text-green-500" />;
    return <Clock size={20} className="text-gray-500" />;
  };

  if (loading) {
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
              Daily Routine Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create a personalized daily routine for maximum productivity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Zap size={24} className="text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Customize Your Schedule
                </h2>
              </div>

              <form onSubmit={handleGenerateRoutine} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wake Time
                    </label>
                    <input
                      type="time"
                      value={formData.wakeTime}
                      onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sleep Time
                    </label>
                    <input
                      type="time"
                      value={formData.sleepTime}
                      onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Class Schedule (comma-separated, format: HH:MM:Subject)
                  </label>
                  <input
                    type="text"
                    value={formData.classSchedule}
                    onChange={(e) => setFormData({ ...formData, classSchedule: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 09:00:Mathematics, 11:00:Physics, 14:00:Chemistry"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Optional - Leave empty if no classes
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Study Goals
                  </label>
                  <textarea
                    value={formData.studyGoals}
                    onChange={(e) => setFormData({ ...formData, studyGoals: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Complete 3 chapters, Practice 20 problems"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingRoutine}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingRoutine ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Generate Routine
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Generated Routine */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              {routine ? (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Clock size={24} className="text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Your Daily Routine
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {routine.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-lg bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 transition-all"
                      >
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          {getActivityIcon(item.activity)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.activity}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                          {item.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      💡 Tip: Stick to this routine for at least 21 days to build a habit!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Clock size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Fill in the form to generate your personalized daily routine
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
