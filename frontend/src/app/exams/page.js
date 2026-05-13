"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import axios from "../../lib/axios";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle,
  Circle,
} from "lucide-react";
import toast from "react-hot-toast";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const isOverdue = new Date(targetDate) < new Date();

  if (isOverdue) {
    return (
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
        <Clock size={16} />
        Overdue
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="text-center">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg px-3 py-2 font-bold text-lg shadow-md">
          {timeLeft.days}
        </div>
        <div className="text-xs text-gray-500 mt-1 font-medium">Days</div>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg px-3 py-2 font-bold text-lg shadow-md">
          {timeLeft.hours}
        </div>
        <div className="text-xs text-gray-500 mt-1 font-medium">Hours</div>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg px-3 py-2 font-bold text-lg shadow-md">
          {timeLeft.minutes}
        </div>
        <div className="text-xs text-gray-500 mt-1 font-medium">Min</div>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg px-3 py-2 font-bold text-lg shadow-md">
          {timeLeft.seconds}
        </div>
        <div className="text-xs text-gray-500 mt-1 font-medium">Sec</div>
      </div>
    </div>
  );
};

export default function Exams() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [loadingExams, setLoadingExams] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    date: "",
    topics: "",
    readinessCheckboxes: {
      questionsCollected: false,
      ctQuestionsCovered: false,
      booksAndPdfsCollected: false,
      answersReady: false,
      fullTopicCovered: false,
    },
    notes: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchExams();
    }
  }, [isAuthenticated]);

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      const response = await axios.get("/exams");
      setExams(response.data);
    } catch (error) {
      toast.error("Failed to load exams");
      console.error(error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const examData = {
        ...formData,
        topics: formData.topics
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      if (editingExam) {
        await axios.put(`/exams/${editingExam._id}`, examData);
        toast.success("Exam updated successfully");
      } else {
        await axios.post("/exams", examData);
        toast.success("Exam added successfully");
      }
      setShowModal(false);
      setEditingExam(null);
      setFormData({
        title: "",
        subject: "",
        date: "",
        topics: "",
        readinessCheckboxes: {
          questionsCollected: false,
          ctQuestionsCovered: false,
          booksAndPdfsCollected: false,
          answersReady: false,
          fullTopicCovered: false,
        },
        notes: "",
      });
      fetchExams();
    } catch (error) {
      toast.error("Failed to save exam");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    try {
      await axios.delete(`/exams/${id}`);
      toast.success("Exam deleted successfully");
      fetchExams();
    } catch (error) {
      toast.error("Failed to delete exam");
      console.error(error);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      subject: exam.subject,
      date: exam.date ? exam.date.split("T")[0] : "",
      topics: exam.topics ? exam.topics.join(", ") : "",
      readinessCheckboxes: exam.readinessCheckboxes || {
        questionsCollected: false,
        ctQuestionsCovered: false,
        booksAndPdfsCollected: false,
        answersReady: false,
        fullTopicCovered: false,
      },
      notes: exam.notes || "",
    });
    setShowModal(true);
  };

  const getDaysRemaining = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getReadinessColor = (readiness) => {
    if (readiness >= 80) return "bg-green-500";
    if (readiness >= 60) return "bg-yellow-500";
    if (readiness >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  if (loading || loadingExams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <Sidebar />

      <main className="lg:ml-64 p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Calendar size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Exam Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Track your exams and preparation progress
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingExam(null);
                setFormData({
                  title: "",
                  subject: "",
                  date: "",
                  topics: "",
                  readinessCheckboxes: {
                    questionsCollected: false,
                    ctQuestionsCovered: false,
                    booksAndPdfsCollected: false,
                    answersReady: false,
                    fullTopicCovered: false,
                  },
                  notes: "",
                });
                setShowModal(true);
              }}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 font-semibold"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Plus size={20} className="relative z-10" />
              <span className="relative z-10">Add New Exam</span>
            </motion.button>
          </div>

          {/* Exams List */}
          <div className="space-y-6">
            {exams.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-16 text-center shadow-2xl border border-white/20 dark:border-gray-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10"></div>
                <div className="relative z-10">
                  <div className="inline-flex p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl mb-6">
                    <Calendar
                      size={64}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No Exams Scheduled
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
                    Start your exam preparation journey by adding your first
                    exam. Track deadlines and stay organized!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    <Plus size={20} />
                    Add Your First Exam
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              exams.map((exam, index) => {
                const daysRemaining = getDaysRemaining(exam.date);
                const isOverdue = daysRemaining < 0;

                return (
                  <motion.div
                    key={exam._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`group relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border ${
                      isOverdue
                        ? "border-red-200 dark:border-red-800"
                        : "border-white/20 dark:border-gray-700/50"
                    }`}
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Overdue indicator */}
                    {isOverdue && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
                    )}

                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-xl ${
                                  isOverdue
                                    ? "bg-red-100 dark:bg-red-900/30"
                                    : "bg-blue-100 dark:bg-blue-900/30"
                                }`}
                              >
                                <Calendar
                                  size={20}
                                  className={
                                    isOverdue
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-blue-600 dark:text-blue-400"
                                  }
                                />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                  {exam.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 font-medium capitalize">
                                  {exam.subject}
                                </p>
                              </div>
                            </div>
                            {isOverdue && (
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                <Clock size={14} />
                                Overdue
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              <Calendar
                                size={18}
                                className="text-blue-600 dark:text-blue-400"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Exam Date
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(exam.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                              <Clock
                                size={18}
                                className="text-blue-600 dark:text-blue-400"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                  Time Remaining
                                </p>
                                <CountdownTimer targetDate={exam.date} />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {exam.topics && exam.topics.length > 0 && (
                              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                  Topics to Cover
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {exam.topics.map((topic, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {exam.notes && (
                              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                  Notes
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {exam.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Readiness Checkboxes */}
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              Preparation Checklist
                            </p>
                            <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-bold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700">
                              {exam.readiness || 0}% Ready
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                              {
                                key: "questionsCollected",
                                label: "Questions collected",
                                icon: "📝",
                              },
                              {
                                key: "ctQuestionsCovered",
                                label: "CT questions covered",
                                icon: "📋",
                              },
                              {
                                key: "booksAndPdfsCollected",
                                label: "Books & PDFs collected",
                                icon: "📚",
                              },
                              {
                                key: "answersReady",
                                label: "Answers ready",
                                icon: "✅",
                              },
                              {
                                key: "fullTopicCovered",
                                label: "Full topic covered",
                                icon: "🎯",
                              },
                            ].map((item) => (
                              <div
                                key={item.key}
                                className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50"
                              >
                                <span className="text-lg">{item.icon}</span>
                                {exam.readinessCheckboxes?.[item.key] ? (
                                  <CheckCircle
                                    size={16}
                                    className="text-green-600 dark:text-green-400 flex-shrink-0"
                                  />
                                ) : (
                                  <Circle
                                    size={16}
                                    className="text-gray-400 flex-shrink-0"
                                  />
                                )}
                                <span
                                  className={`text-sm ${
                                    exam.readinessCheckboxes?.[item.key]
                                      ? "text-green-700 dark:text-green-300 line-through"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                >
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(exam)}
                          className="p-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                          title="Edit"
                        >
                          <Edit2 size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(exam._id)}
                          className="p-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-gray-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                        {editingExam ? (
                          <Edit2 size={24} className="text-white" />
                        ) : (
                          <Plus size={24} className="text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          {editingExam ? "Edit Exam" : "Add New Exam"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {editingExam
                            ? "Update your exam details"
                            : "Create a new exam entry"}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setShowModal(false);
                        setEditingExam(null);
                      }}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                    >
                      <Trash2 size={20} className="text-gray-500" />
                    </motion.button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          Exam Title
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-700/70 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="e.g., Midterm Exam"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-700/70 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="e.g., Mathematics"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Exam Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-700/70 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Topics to Cover
                      </label>
                      <input
                        type="text"
                        value={formData.topics}
                        onChange={(e) =>
                          setFormData({ ...formData, topics: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-700/70 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="e.g., Calculus, Algebra, Geometry"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Preparation Checklist
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        {[
                          {
                            key: "questionsCollected",
                            label: "Questions collected",
                            icon: "📝",
                          },
                          {
                            key: "ctQuestionsCovered",
                            label: "CT questions covered",
                            icon: "📋",
                          },
                          {
                            key: "booksAndPdfsCollected",
                            label: "Books & PDFs collected",
                            icon: "📚",
                          },
                          {
                            key: "answersReady",
                            label: "Answers ready",
                            icon: "✅",
                          },
                          {
                            key: "fullTopicCovered",
                            label: "Full topic covered",
                            icon: "🎯",
                          },
                        ].map((item) => (
                          <label
                            key={item.key}
                            className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.readinessCheckboxes[item.key]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  readinessCheckboxes: {
                                    ...formData.readinessCheckboxes,
                                    [item.key]: e.target.checked,
                                  },
                                })
                              }
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Additional Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-700/70 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                        placeholder="Any additional notes or reminders about this exam..."
                        rows={3}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
                    >
                      {editingExam ? "Update Exam" : "Create Exam"}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
