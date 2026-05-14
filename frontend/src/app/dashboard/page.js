'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import FocusChart from '../../components/FocusChart';
import axios from '../../lib/axios';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Clock,
  Calendar,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [deadlines, setDeadlines] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const refreshIntervalMs = 30000;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchDashboardData();
    const intervalId = setInterval(() => {
      fetchDashboardData({ silent: true });
    }, refreshIntervalMs);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const fetchDashboardData = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoadingStats(true);
      
      const [statsRes, chartRes, deadlinesRes] = await Promise.all([
        axios.get('/dashboard/stats'),
        axios.get('/dashboard/focus-chart-data'),
        axios.get('/dashboard/upcoming-deadlines'),
      ]);

      setStats(statsRes.data);
      setChartData(chartRes.data);
      setDeadlines(deadlinesRes.data);
    } catch (error) {
      if (!silent) toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      if (!silent) setLoadingStats(false);
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:flex">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's your productivity overview.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Overall Attendance"
              value={`${stats?.overallAttendance || 0}%`}
              icon={Users}
              color="blue"
              trend={5}
            />
            <StatCard
              title="Productivity Score"
              value={`${stats?.productivityScore || 0}`}
              icon={TrendingUp}
              color="green"
              trend={8}
            />
            <StatCard
              title="Study Hours Today"
              value={`${stats?.studyHoursToday || 0}h`}
              icon={Clock}
              color="purple"
            />
            <StatCard
              title="Upcoming Exams"
              value={stats?.upcomingExams || 0}
              icon={Calendar}
              color="orange"
            />
            <StatCard
              title="Pending Assignments"
              value={stats?.pendingAssignments || 0}
              icon={BookOpen}
              color="pink"
            />
            <StatCard
              title="Active Goals"
              value={stats?.goalsProgress?.length || 0}
              icon={Target}
              color="blue"
            />
          </div>

          {/* Charts and Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Focus Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Weekly Focus Hours
              </h3>
              <div className="h-64">
                {chartData && <FocusChart data={chartData} />}
              </div>
            </motion.div>

            {/* Upcoming Deadlines */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {deadlines?.assignments?.slice(0, 3).map((assignment) => (
                  <div
                    key={assignment._id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5"
                  >
                    <BookOpen size={20} className="text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {assignment.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(assignment.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.priority === 'high'
                          ? 'bg-red-100 text-red-600'
                          : assignment.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {assignment.priority}
                    </span>
                  </div>
                ))}
                {deadlines?.exams?.slice(0, 3).map((exam) => (
                  <div
                    key={exam._id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5"
                  >
                    <Calendar size={20} className="text-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {exam.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(exam.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                      Exam
                    </span>
                  </div>
                ))}
                {(!deadlines?.assignments?.length && !deadlines?.exams?.length) && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No upcoming deadlines
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Goals Progress */}
          {stats?.goalsProgress?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Goals Progress
              </h3>
              <div className="space-y-4">
                {stats.goalsProgress.map((goal, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">{goal.title}</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {goal.current.toFixed(1)} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Alerts */}
          {(stats?.overdueAssignments > 0 || stats?.overallAttendance < 75) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 glass-card rounded-2xl p-6 border-l-4 border-red-500"
            >
              <div className="flex items-start gap-3">
                <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Attention Required
                  </h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    {stats.overdueAssignments > 0 && (
                      <li>• You have {stats.overdueAssignments} overdue assignments</li>
                    )}
                    {stats.overallAttendance < 75 && (
                      <li>• Your attendance is below 75%. Attend more classes!</li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
