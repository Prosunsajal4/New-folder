"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import axios from "../../lib/axios";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Target, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

export default function Goals() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const refreshIntervalMs = 30000;

  const [formData, setFormData] = useState({
    type: "custom",
    title: "",
    target: 100,
    current: 0,
    unit: "",
    deadline: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchGoals();
    const intervalId = setInterval(() => {
      fetchGoals({ silent: true });
    }, refreshIntervalMs);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const fetchGoals = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoadingGoals(true);
      const response = await axios.get("/goals");
      setGoals(response.data);
    } catch (error) {
      if (!silent) toast.error("Failed to load goals");
      console.error(error);
    } finally {
      if (!silent) setLoadingGoals(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await axios.put(`/goals/${editingGoal._id}`, formData);
        toast.success("Goal updated successfully");
      } else {
        await axios.post("/goals", formData);
        toast.success("Goal added successfully");
      }
      setShowModal(false);
      setEditingGoal(null);
      setFormData({
        type: "custom",
        title: "",
        target: 100,
        current: 0,
        unit: "",
        deadline: "",
      });
      fetchGoals();
    } catch (error) {
      toast.error("Failed to save goal");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      await axios.delete(`/goals/${id}`);
      toast.success("Goal deleted successfully");
      fetchGoals();
    } catch (error) {
      toast.error("Failed to delete goal");
      console.error(error);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      type: goal.type,
      title: goal.title,
      target: goal.target,
      current: goal.current,
      unit: goal.unit,
      deadline: goal.deadline ? goal.deadline.split("T")[0] : "",
    });
    setShowModal(true);
  };

  const handleProgressUpdate = async (goal, newCurrent) => {
    try {
      await axios.put(`/goals/${goal._id}`, { current: newCurrent });
      toast.success("Progress updated");
      fetchGoals();
    } catch (error) {
      toast.error("Failed to update progress");
      console.error(error);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "from-green-500 to-green-600";
    if (progress >= 75) return "from-blue-500 to-blue-600";
    if (progress >= 50) return "from-yellow-500 to-yellow-600";
    return "from-orange-500 to-orange-600";
  };

  const getTypeIcon = (type) => {
    return <Target size={20} />;
  };

  if (loading || loadingGoals) {
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

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header title="Goals" subtitle="Track your academic and personal goals" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div></div>
            <button
              onClick={() => {
                setEditingGoal(null);
                setFormData({
                  type: "custom",
                  title: "",
                  target: 100,
                  current: 0,
                  unit: "",
                  deadline: "",
                });
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Add Goal
            </button>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.length === 0 ? (
              <div className="col-span-full glass-card rounded-2xl p-12 text-center">
                <Target size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No goals set yet. Create your first goal!
                </p>
              </div>
            ) : (
              goals.map((goal) => (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card rounded-2xl p-6 ${
                    goal.status === "completed"
                      ? "border-2 border-green-500"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {getTypeIcon(goal.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {goal.title}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {goal.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(goal._id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {(goal.progress || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, goal.progress || 0)}%` }}
                        transition={{ duration: 1 }}
                        className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(goal.progress || 0)}`}
                      />
                    </div>
                  </div>

                  {/* Current / Target */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {goal.current || 0} {goal.unit || ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Target
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {goal.target || 0} {goal.unit || ''}
                      </p>
                    </div>
                  </div>

                  {/* Quick Update */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleProgressUpdate(goal, goal.current + 1)
                      }
                      className="flex-1 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-all text-sm font-medium"
                    >
                      +1
                    </button>
                    <button
                      onClick={() =>
                        handleProgressUpdate(
                          goal,
                          Math.max(0, goal.current - 1),
                        )
                      }
                      className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-all text-sm font-medium"
                    >
                      -1
                    </button>
                  </div>

                  {goal.deadline && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}

                  {goal.status === "completed" && (
                    <div className="mt-3 p-2 bg-green-100 text-green-600 rounded-lg text-center text-sm font-medium dark:bg-green-900/30 dark:text-green-400">
                      🎉 Goal Completed!
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingGoal ? "Edit Goal" : "Add Goal"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingGoal(null);
                    }}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="custom">Custom</option>
                      <option value="cgpa">CGPA</option>
                      <option value="daily_study">Daily Study Hours</option>
                      <option value="attendance">Attendance Target</option>
                      <option value="weekly_productivity">
                        Weekly Productivity
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Achieve 3.5 CGPA"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target
                      </label>
                      <input
                        type="number"
                        value={formData.target}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            target: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current
                      </label>
                      <input
                        type="number"
                        value={formData.current}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            current: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unit (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., hours, %, points"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deadline (optional)
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
                  >
                    {editingGoal ? "Update Goal" : "Add Goal"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
