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
      <div className="text-red-600 dark:text-red-400 font-semibold">
        Exam Overdue
      </div>
    );
  }

  return (
    <div className="flex gap-2 text-sm">
      <div className="text-center">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded px-2 py-1 font-bold">
          {timeLeft.days}
        </div>
        <div className="text-xs text-gray-500">Days</div>
      </div>
      <div className="text-center">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded px-2 py-1 font-bold">
          {timeLeft.hours}
        </div>
        <div className="text-xs text-gray-500">Hrs</div>
      </div>
      <div className="text-center">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded px-2 py-1 font-bold">
          {timeLeft.minutes}
        </div>
        <div className="text-xs text-gray-500">Min</div>
      </div>
      <div className="text-center">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded px-2 py-1 font-bold">
          {timeLeft.seconds}
        </div>
        <div className="text-xs text-gray-500">Sec</div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="lg:ml-64 p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Exams
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your exams and preparation progress
              </p>
            </div>
            <button
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Add Exam
            </button>
          </div>

          {/* Exams List */}
          <div className="space-y-4">
            {exams.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No exams scheduled yet. Add your first exam!
                </p>
              </div>
            ) : (
              exams.map((exam) => {
                const daysRemaining = getDaysRemaining(exam.date);
                const isOverdue = daysRemaining < 0;

                return (
                  <motion.div
                    key={exam._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass-card rounded-xl p-6 ${isOverdue ? "border-l-4 border-red-500" : ""}`}
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {exam.title}
                          </h3>
                          {isOverdue && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                              Overdue
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-3 capitalize">
                          {exam.subject}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                              {new Date(exam.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <CountdownTimer targetDate={exam.date} />
                          </div>
                        </div>

                        {exam.topics && exam.topics.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Topics:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {exam.topics.map((topic, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {exam.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {exam.notes}
                          </p>
                        )}

                        {/* Readiness Checkboxes */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Readiness Checklist ({exam.readiness || 0}%)
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              {exam.readinessCheckboxes?.questionsCollected ? (
                                <CheckCircle
                                  size={16}
                                  className="text-green-500"
                                />
                              ) : (
                                <Circle size={16} className="text-gray-400" />
                              )}
                              <span className="text-sm">
                                Questions collected
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {exam.readinessCheckboxes?.ctQuestionsCovered ? (
                                <CheckCircle
                                  size={16}
                                  className="text-green-500"
                                />
                              ) : (
                                <Circle size={16} className="text-gray-400" />
                              )}
                              <span className="text-sm">
                                CT questions covered
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {exam.readinessCheckboxes
                                ?.booksAndPdfsCollected ? (
                                <CheckCircle
                                  size={16}
                                  className="text-green-500"
                                />
                              ) : (
                                <Circle size={16} className="text-gray-400" />
                              )}
                              <span className="text-sm">
                                Book and PDF collected
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {exam.readinessCheckboxes?.answersReady ? (
                                <CheckCircle
                                  size={16}
                                  className="text-green-500"
                                />
                              ) : (
                                <Circle size={16} className="text-gray-400" />
                              )}
                              <span className="text-sm">
                                Answer of questions ready
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {exam.readinessCheckboxes?.fullTopicCovered ? (
                                <CheckCircle
                                  size={16}
                                  className="text-green-500"
                                />
                              ) : (
                                <Circle size={16} className="text-gray-400" />
                              )}
                              <span className="text-sm">
                                Covered full topic
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(exam)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-all"
                          title="Edit"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(exam._id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
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
                    {editingExam ? "Edit Exam" : "Add Exam"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingExam(null);
                    }}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Trash2 size={20} />
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
                      placeholder="e.g., Midterm Exam"
                      required
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
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Topics (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.topics}
                      onChange={(e) =>
                        setFormData({ ...formData, topics: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Calculus, Algebra, Geometry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Readiness Checklist
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            formData.readinessCheckboxes.questionsCollected
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              readinessCheckboxes: {
                                ...formData.readinessCheckboxes,
                                questionsCollected: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Questions collected</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            formData.readinessCheckboxes.ctQuestionsCovered
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              readinessCheckboxes: {
                                ...formData.readinessCheckboxes,
                                ctQuestionsCovered: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm">CT questions covered</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            formData.readinessCheckboxes.booksAndPdfsCollected
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              readinessCheckboxes: {
                                ...formData.readinessCheckboxes,
                                booksAndPdfsCollected: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Book and PDF collected</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.readinessCheckboxes.answersReady}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              readinessCheckboxes: {
                                ...formData.readinessCheckboxes,
                                answersReady: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm">
                          Answer of questions ready
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            formData.readinessCheckboxes.fullTopicCovered
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              readinessCheckboxes: {
                                ...formData.readinessCheckboxes,
                                fullTopicCovered: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Covered full topic</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional notes about the exam"
                      rows={3}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
                  >
                    {editingExam ? "Update Exam" : "Add Exam"}
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
