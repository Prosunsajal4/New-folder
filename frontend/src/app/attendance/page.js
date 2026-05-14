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
  Save,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Attendance() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);
  const refreshIntervalMs = 30000;

  const [newCourse, setNewCourse] = useState({
    name: "",
    sectionA: { totalClasses: 30, attended: [] },
    sectionB: { totalClasses: 30, attended: [] },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchCourses();
    const intervalId = setInterval(() => {
      fetchCourses({ silent: true });
    }, refreshIntervalMs);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const fetchCourses = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoadingCourses(true);
      const response = await axios.get("/courses");
      setCourses(response.data);
      if (response.data.length > 0) {
        const current = selectedCourse
          ? response.data.find((course) => course._id === selectedCourse._id)
          : response.data[0];
        setSelectedCourse(current || response.data[0]);
      } else {
        setSelectedCourse(null);
      }
    } catch (error) {
      if (!silent) toast.error("Failed to load courses");
      console.error(error);
    } finally {
      if (!silent) setLoadingCourses(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/courses", newCourse);
      toast.success("Course added successfully");
      setShowAddModal(false);
      setNewCourse({
        name: "",
        sectionA: { totalClasses: 30, attended: [] },
        sectionB: { totalClasses: 30, attended: [] },
      });
      fetchCourses();
    } catch (error) {
      toast.error("Failed to add course");
      console.error(error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/courses/${courseId}`);
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      toast.error("Failed to delete course");
      console.error(error);
    }
  };

  const toggleAttendance = async (section, classNumber) => {
    if (!selectedCourse) return;

    setSaving(true);
    const updatedCourse = { ...selectedCourse };
    const attendedArray = updatedCourse[section].attended;
    const index = attendedArray.indexOf(classNumber);

    if (index > -1) {
      attendedArray.splice(index, 1);
    } else {
      attendedArray.push(classNumber);
    }

    try {
      await axios.put(`/courses/${selectedCourse._id}`, updatedCourse);
      setSelectedCourse(updatedCourse);
      setCourses(
        courses.map((c) => (c._id === selectedCourse._id ? updatedCourse : c)),
      );
      toast.success("Attendance updated");
      fetchCourses({ silent: true });
    } catch (error) {
      toast.error("Failed to update attendance");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleGetPredictions = async () => {
    try {
      const response = await axios.post("/ai/attendance-prediction", {
        courses,
      });
      setPredictions(response.data.predictions);
      setShowPredictions(true);
    } catch (error) {
      toast.error("Failed to get predictions");
      console.error(error);
    }
  };

  const renderAttendanceGrid = (section, totalClasses) => {
    const attended = selectedCourse[section].attended;
    return (
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
        {Array.from({ length: totalClasses }, (_, i) => i + 1).map(
          (classNum) => (
            <motion.button
              key={classNum}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleAttendance(section, classNum)}
              disabled={saving}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                attended.includes(classNum)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {classNum}
            </motion.button>
          ),
        )}
      </div>
    );
  };

  if (loading || loadingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const stats = selectedCourse?.attendanceStats || {};

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
                Attendance Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage your course attendance
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleGetPredictions}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
              >
                <TrendingUp size={20} />
                AI Predictions
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Add Course
              </button>
            </div>
          </div>

          {/* Course Selection */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              {courses.map((course) => (
                <button
                  key={course._id}
                  onClick={() => setSelectedCourse(course)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCourse?._id === course._id
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {course.name}
                </button>
              ))}
              {courses.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">
                  No courses added yet. Add your first course!
                </p>
              )}
            </div>
          </div>

          {/* AI Predictions Modal */}
          {showPredictions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 glass-card rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Attendance Predictions
                </h3>
                <button
                  onClick={() => setShowPredictions(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {predictions.map((pred) => (
                  <div
                    key={pred.courseId}
                    className={`p-4 rounded-lg ${
                      pred.riskLevel === "critical"
                        ? "bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700"
                        : pred.riskLevel === "high"
                          ? "bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700"
                          : pred.riskLevel === "medium"
                            ? "bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700"
                            : "bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {pred.riskLevel === "critical" ||
                      pred.riskLevel === "high" ? (
                        <AlertTriangle
                          size={20}
                          className="text-red-600 flex-shrink-0 mt-1"
                        />
                      ) : (
                        <CheckCircle
                          size={20}
                          className="text-green-600 flex-shrink-0 mt-1"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {pred.courseName}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {pred.suggestion}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Current: {pred.currentAttendance}% | Safe absences:{" "}
                          {pred.safeAbsences}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Course Details */}
          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Attendance
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total?.percentage || 0}%
                  </p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Marks
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total?.marks || 0}/10
                  </p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Attended
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.total?.attended || 0}
                  </p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Safe Absences
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.total?.safeAbsences || 0}
                  </p>
                </div>
              </div>

              {/* Section A */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Section A
                  </h3>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {stats.sectionA?.attended || 0}/
                      {selectedCourse.sectionA.totalClasses} attended
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {stats.sectionA?.percentage || 0}%
                    </span>
                  </div>
                </div>
                {renderAttendanceGrid(
                  "sectionA",
                  selectedCourse.sectionA.totalClasses,
                )}
              </div>

              {/* Section B */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Section B
                  </h3>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {stats.sectionB?.attended || 0}/
                      {selectedCourse.sectionB.totalClasses} attended
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {stats.sectionB?.percentage || 0}%
                    </span>
                  </div>
                </div>
                {renderAttendanceGrid(
                  "sectionB",
                  selectedCourse.sectionB.totalClasses,
                )}
              </div>

              {/* Delete Course Button */}
              <button
                onClick={() => handleDeleteCourse(selectedCourse._id)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-all"
              >
                <Trash2 size={20} />
                Delete this course
              </button>
            </motion.div>
          )}

          {/* Add Course Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-6 w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add New Course
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={newCourse.name}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, name: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Digital Signal Processing"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Section A Total Classes
                    </label>
                    <input
                      type="number"
                      value={newCourse.sectionA.totalClasses}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          sectionA: {
                            ...newCourse.sectionA,
                            totalClasses: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Section B Total Classes
                    </label>
                    <input
                      type="number"
                      value={newCourse.sectionB.totalClasses}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          sectionB: {
                            ...newCourse.sectionB,
                            totalClasses: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
                  >
                    Add Course
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
