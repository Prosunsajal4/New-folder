'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import axios from '../../lib/axios';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudyPlanner() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [formData, setFormData] = useState({
    subjects: '',
    examDates: '',
    weakSubjects: '',
    dailyFreeTime: 4,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setLoadingPlan(true);
    
    try {
      const planData = {
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
        examDates: formData.examDates.split(',').map(d => d.trim()).filter(d => d),
        weakSubjects: formData.weakSubjects.split(',').map(s => s.trim()).filter(s => s),
        dailyFreeTime: formData.dailyFreeTime,
      };

      const response = await axios.post('/ai/study-planner', planData);
      setPlan(response.data);
      toast.success('Study plan generated successfully!');
    } catch (error) {
      toast.error('Failed to generate study plan');
      console.error(error);
    } finally {
      setLoadingPlan(false);
    }
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
              AI Study Planner
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized study plans based on your schedule and goals
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
                <Sparkles size={24} className="text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Generate Your Plan
                </h2>
              </div>

              <form onSubmit={handleGeneratePlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subjects (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.subjects}
                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exam Dates (comma-separated, format: Subject:YYYY-MM-DD)
                  </label>
                  <input
                    type="text"
                    value={formData.examDates}
                    onChange={(e) => setFormData({ ...formData, examDates: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mathematics:2024-06-15, Physics:2024-06-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weak Subjects (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.weakSubjects}
                    onChange={(e) => setFormData({ ...formData, weakSubjects: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mathematics, Chemistry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Daily Free Time (hours)
                  </label>
                  <input
                    type="number"
                    value={formData.dailyFreeTime}
                    onChange={(e) => setFormData({ ...formData, dailyFreeTime: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="16"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingPlan}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingPlan ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Study Plan
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Generated Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              {plan ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={24} className="text-green-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Your Study Plan
                </h2>
                  </div>

                  {/* Daily Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Clock size={20} className="text-blue-500" />
                      Daily Schedule
                    </h3>
                    <div className="space-y-2">
                      {plan.dailySchedule.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg ${
                            item.priority === 'high'
                              ? 'bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500'
                              : 'bg-blue-100 dark:bg-blue-900/20 border-l-4 border-blue-500'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {item.subject}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {item.duration}h
                            </span>
                          </div>
                          {item.priority === 'high' && (
                            <span className="text-xs text-red-600 dark:text-red-400 mt-1">
                              ⚠️ Priority subject - Focus more here!
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen size={20} className="text-purple-500" />
                      AI Recommendations
                    </h3>
                    <div className="space-y-2">
                      {plan.recommendations.map((rec, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-gray-900 dark:text-white"
                        >
                          💡 {rec}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Plan */}
                  {plan.weeklyPlan && plan.weeklyPlan.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Calendar size={20} className="text-green-500" />
                        Weekly Overview
                      </h3>
                      <div className="space-y-2">
                        {plan.weeklyPlan.map((item, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 text-gray-900 dark:text-white"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Calendar size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Fill in the form to generate your personalized study plan
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
