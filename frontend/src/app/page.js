'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Shield,
  Zap,
  BarChart3,
  Clock,
  Award,
  Smartphone,
  Globe,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Phone
} from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  const router = useRouter();

  const features = [
    {
      icon: <Calendar size={32} className="text-blue-600" />,
      title: "Exam Management",
      description: "Track your exams with countdown timers and preparation checklists. Never miss a deadline again.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Target size={32} className="text-green-600" />,
      title: "Goal Setting",
      description: "Set and achieve your academic goals with progress tracking and milestone celebrations.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <BookOpen size={32} className="text-purple-600" />,
      title: "Assignment Tracker",
      description: "Organize your assignments with due dates, priorities, and completion status.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <BarChart3 size={32} className="text-orange-600" />,
      title: "Progress Analytics",
      description: "Visualize your academic progress with detailed charts and performance insights.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Clock size={32} className="text-red-600" />,
      title: "Focus Sessions",
      description: "Boost productivity with timed focus sessions and break reminders.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <Award size={32} className="text-indigo-600" />,
      title: "Achievement System",
      description: "Earn badges and rewards as you complete tasks and reach milestones.",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
    { number: "50+", label: "Universities" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "StudentOS transformed my academic life. The exam countdown and preparation checklists keep me organized and stress-free.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Engineering Student",
      content: "The goal tracking feature helped me improve my grades significantly. Highly recommend to all students!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Medical Student",
      content: "Managing assignments and study sessions has never been easier. The interface is intuitive and beautiful.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <BookOpen size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                StudentOS
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">About</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Testimonials</a>
              <Link href="/login">
                <button className="px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
              <Star size={16} className="mr-2" />
              #1 Student Productivity Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Master Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Academic Journey
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your academic experience with intelligent tools for exam preparation, assignment tracking,
              goal setting, and progress analytics. Join thousands of successful students worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center gap-2"
              >
                <Play size={20} />
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Hero Image/Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                    <Calendar className="text-blue-600 mb-4" size={32} />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Exam Countdown</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Real-time countdown with preparation checklists</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                    <Target className="text-green-600 mb-4" size={32} />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Goal Tracking</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Set and achieve academic milestones</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                    <TrendingUp className="text-purple-600 mb-4" size={32} />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Progress Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Visual insights into your performance</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Powerful Features for
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Academic Success
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to excel in your studies, from exam preparation to progress tracking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Loved by Students
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See what students are saying about their academic transformation with StudentOS.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Ready to Transform Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Academic Journey?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful students who have improved their grades and reduced stress with StudentOS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center gap-2"
                >
                  Start Your Success Story
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link href="/login">
                <button className="px-8 py-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-lg transition-colors">
                  Sign In Instead
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <BookOpen size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold">StudentOS</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Empowering students worldwide with intelligent academic management tools.
                Built with modern technologies to help you stay organized, focused, and achieve your academic goals.
              </p>
              <div className="flex space-x-4 mb-6">
                <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                  <Github size={24} />
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin size={24} />
                </a>
                <a href="mailto:prosunsajal123@gmail.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Email">
                  <Mail size={24} />
                </a>
                <a href="tel:+8801911572117" className="text-gray-400 hover:text-white transition-colors" aria-label="Phone">
                  <Phone size={24} />
                </a>
              </div>
              <div className="text-sm text-gray-400">
                <p className="mb-1"><strong>Developed by:</strong> Prosun Mukherjee</p>
                <p className="mb-1"><strong>Location:</strong> Khulna, Bangladesh</p>
                <p><strong>Contact:</strong> prosunsajal123@gmail.com | +8801911572117</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Developer</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#stats" className="hover:text-white transition-colors">Statistics</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Support & Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="mailto:prosunsajal123@gmail.com" className="hover:text-white transition-colors">Contact Developer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bug Reports</a></li>
              </ul>
            </div>
          </div>

          {/* Developer Skills Highlight */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold mb-4">Built with Modern Technologies</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {['React.js', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'TypeScript'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2026 StudentOS. All rights reserved. Made with ❤️ by Prosun Mukherjee.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Frontend Developer</span>
                <span className="hidden md:block">•</span>
                <span>Khulna, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading StudentOS...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <LandingPage />;
}
