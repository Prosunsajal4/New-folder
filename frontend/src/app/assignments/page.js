"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import axios from "../../lib/axios";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Check, X, Calendar, Flag } from "lucide-react";
import toast from "react-hot-toast";

export default function Assignments() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const refreshIntervalMs = 30000;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    deadline: "",
    priority: "medium",
    status: "pending",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchAssignments();
    const intervalId = setInterval(() => {
      fetchAssignments({ silent: true });
    }, refreshIntervalMs);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const fetchAssignments = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoadingAssignments(true);
      const response = await axios.get("/assignments");
      setAssignments(response.data);
    } catch (error) {
      if (!silent) toast.error("Failed to load assignments");
      console.error(error);
    } finally {
      if (!silent) setLoadingAssignments(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await axios.put(`/assignments/${editingAssignment._id}`, formData);
        toast.success("Assignment updated successfully");
      } else {
        await axios.post("/assignments", formData);
        toast.success("Assignment added successfully");
      }
      setShowModal(false);
      setEditingAssignment(null);
      setFormData({
        title: "",
        description: "",
        subject: "",
        deadline: "",
        priority: "medium",
        status: "pending",
      });
      fetchAssignments();
    } catch (error) {
      toast.error("Failed to save assignment");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await axios.delete(`/assignments/${id}`);
      toast.success("Assignment deleted successfully");
      fetchAssignments();
    } catch (error) {
      toast.error("Failed to delete assignment");
      console.error(error);
    }
  };

  const handleToggleStatus = async (assignment) => {
    try {
      const newStatus =
        assignment.status === "completed" ? "pending" : "completed";
      await axios.put(`/assignments/${assignment._id}`, { status: newStatus });
      toast.success(`Assignment marked as ${newStatus}`);
      fetchAssignments();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description || "",
      subject: assignment.subject,
      deadline: assignment.deadline ? assignment.deadline.split("T")[0] : "",
      priority: assignment.priority,
      status: assignment.status,
    });
    setShowModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  if (loading || loadingAssignments) {
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Assignments
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your assignments and deadlines
              </p>
            </div>
            <button
              onClick={() => {
                setEditingAssignment(null);
                setFormData({
                  title: "",
                  description: "",
                  subject: "",
                  deadline: "",
                  priority: "medium",
                  status: "pending",
                });
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Add Assignment
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {assignments.length}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Pending
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {assignments.filter((a) => a.status === "pending").length}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Completed
              </p>
              <p className="text-2xl font-bold text-green-600">
                {assignments.filter((a) => a.status === "completed").length}
              </p>
            </div>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No assignments yet. Add your first assignment!
                </p>
              </div>
            ) : (
              assignments.map((assignment) => (
                <motion.div
                  key={assignment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card rounded-xl p-6 ${
                    assignment.status === "completed" ? "opacity-60" : ""
                  } ${isOverdue(assignment.deadline) && assignment.status !== "completed" ? "border-l-4 border-red-500" : ""}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className={`text-lg font-semibold ${
                            assignment.status === "completed"
                              ? "text-gray-500 dark:text-gray-400 line-through"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {assignment.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}
                        >
                          {assignment.priority}
                        </span>
                        {assignment.status === "completed" && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            Completed
                          </span>
                        )}
                        {isOverdue(assignment.deadline) &&
                          assignment.status !== "completed" && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                              Overdue
                            </span>
                          )}
                      </div>

                      {assignment.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {assignment.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            {new Date(assignment.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flag size={16} />
                          <span className="capitalize">
                            {assignment.subject}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(assignment)}
                        className={`p-2 rounded-lg transition-all ${
                          assignment.status === "completed"
                            ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                        title={
                          assignment.status === "completed"
                            ? "Mark as pending"
                            : "Mark as completed"
                        }
                      >
                        {assignment.status === "completed" ? (
                          <X size={20} />
                        ) : (
                          <Check size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-all"
                        title="Edit"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment._id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
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
                    {editingAssignment ? "Edit Assignment" : "Add Assignment"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingAssignment(null);
                    }}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="Assignment title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Assignment description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Mathematics"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
                  >
                    {editingAssignment ? "Update Assignment" : "Add Assignment"}
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
