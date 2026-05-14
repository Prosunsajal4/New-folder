"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  Clock,
  Target,
  MessageSquare,
  Timer,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event) => setIsDesktop(event.matches);

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = async () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark");

    // Update theme in backend
    try {
      await fetch("/api/auth/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: newTheme ? "dark" : "light" }),
      });
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    { icon: Home, label: "Landing Page", path: "/?landing=1" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Attendance", path: "/attendance" },
    { icon: Calendar, label: "Assignments", path: "/assignments" },
    { icon: FileText, label: "Exams", path: "/exams" },
    { icon: MessageSquare, label: "Notes", path: "/notes" },
    { icon: Timer, label: "Focus Mode", path: "/focus" },
    { icon: Target, label: "Goals", path: "/goals" },
    { icon: Clock, label: "Study Planner", path: "/study-planner" },
    { icon: MessageSquare, label: "AI Chat", path: "/ai-chat" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isDesktop ? 0 : isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25 }}
        className={`fixed left-0 top-0 h-full w-64 glass-card z-40 lg:static lg:translate-x-0 lg:h-auto lg:min-h-screen flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold gradient-text">StudentOS</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome, {user?.name?.split(" ")[0]}
          </p>
        </div>

        <nav className="px-4 space-y-2 flex-1 overflow-y-auto pb-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-gray-300"
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 mt-auto">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-gray-300"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-600 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
