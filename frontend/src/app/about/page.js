"use client";

import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Code,
  Database,
  Server,
  Wrench,
  GraduationCap,
  Award,
  Globe,
  Star,
  Calendar,
  User,
  Target,
} from "lucide-react";
import Link from "next/link";

const AboutUs = () => {
  const skills = {
    languages: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C",
      "C++",
      "MATLAB",
    ],
    frontend: ["React.js", "Next.js", "Tailwind CSS", "HTML", "CSS"],
    backend: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "JWT",
      "Firebase Authentication",
    ],
    database: ["MongoDB", "Firebase"],
    tools: ["Git", "GitHub", "Postman", "Vercel"],
  };

  const projects = [
    {
      title: "SkillMatchAI – AI-Based Job Matching Platform",
      description:
        "Developed an AI-based job matching system with personalized skill recommendations and real-time analytics dashboard, improving match accuracy and boosting user engagement by 30%.",
      tech: ["Next.js", "Node.js", "Express.js", "MongoDB"],
      links: {
        live: "#",
        github: "#",
      },
      highlights: [
        "Developed an AI-powered skill matching system for students and job seekers using Next.js and Node.js",
        "Integrated machine learning models to deliver personalized skill recommendations, improving match accuracy",
        "Built an interactive dashboard with real-time data visualization, increasing user engagement by 30%",
      ],
    },
    {
      title: "BookCourier – Online Book Selling Platform",
      description:
        "Developed a scalable online book selling platform with React and Node.js, implementing RBAC, secure authentication, protected routing, and responsive UI components to enhance user experience.",
      tech: ["React", "Node.js", "Express.js", "MongoDB"],
      links: {
        live: "#",
        github: "#",
      },
      highlights: [
        "Developed role-specific dashboards for admin, seller, and customer users using React and Node.js",
        "Implemented role-based access control (RBAC) with protected routes for secure navigation",
        "Built dynamic UI components to enhance interactivity and overall user experience",
      ],
    },
  ];

  const education = [
    {
      degree: "BSc in Electronics and Communication Engineering",
      institution: "Khulna University",
      period: "2023 – Present",
      location: "Khulna",
      gpa: "CGPA – 3.30",
    },
    {
      degree: "Complement Web Development",
      institution: "Programming Hero",
      period: "July 2025 – Dec 2025",
      location: "Online",
      type: "Certificate",
    },
    {
      degree: "Full Stack Development with MERN",
      institution: "CodersTrust",
      period: "Feb 2026 – Mar 2026",
      location: "Online",
      type: "Certificate",
    },
  ];

  const languages = [
    { name: "Bangla", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Fluent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">
              StudentOS
            </Link>
            <div className="flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <User size={64} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Prosun Mukherjee
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Frontend Developer
            </p>

            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a
                href="https://github.com"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Github size={20} />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:prosunsajal123@gmail.com"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mail size={20} />
                <span>prosunsajal123@gmail.com</span>
              </a>
              <a
                href="tel:+8801911572117"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Phone size={20} />
                <span>+8801911572117</span>
              </a>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin size={20} />
                <span>Khulna, Bangladesh</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Career Objective */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Target className="text-blue-600" />
            Career Objective
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Passionate Frontend Developer with hands-on experience in React.js,
            Next.js, TypeScript, and Tailwind CSS, focused on building
            responsive and user-friendly web applications. Skilled in converting
            Figma designs into clean, pixel-perfect interfaces and integrating
            REST APIs using modern frontend practices. Seeking to join WhiteBox
            to contribute to high-quality frontend development, improve
            problem-solving skills, and grow in a collaborative learning
            environment.
          </p>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="text-blue-600" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Languages
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="text-green-600" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Frontend
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.frontend.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Server className="text-purple-600" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Backend
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.backend.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-orange-600" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Database
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.database.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="text-red-600" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tools
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Projects
          </h2>
          <div className="space-y-8">
            {projects.map((project, index) => (
              <div key={index} className="glass-card rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {project.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-4 lg:mt-0">
                    <a
                      href={project.links.live}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <ExternalLink size={16} />
                      Live
                    </a>
                    <a
                      href={project.links.github}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <Github size={16} />
                      GitHub
                    </a>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Technologies Used:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Key Highlights:
                  </h4>
                  <ul className="space-y-2">
                    {project.highlights.map((highlight, highlightIndex) => (
                      <li
                        key={highlightIndex}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <Star
                          size={16}
                          className="text-yellow-500 mt-0.5 flex-shrink-0"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education & Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Education & Certifications
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="glass-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    {edu.type === "Certificate" ? (
                      <Award className="text-white" size={24} />
                    ) : (
                      <GraduationCap className="text-white" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {edu.degree}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                      {edu.institution}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{edu.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{edu.location}</span>
                      </div>
                      {edu.gpa && (
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {edu.gpa}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Languages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languages.map((lang, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="text-2xl mb-2">
                  {lang.name === "Bangla"
                    ? "🇧🇩"
                    : lang.name === "English"
                      ? "🇺🇸"
                      : "🇮🇳"}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {lang.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{lang.level}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold gradient-text mb-4">
                StudentOS
              </h3>
              <p className="text-gray-400 mb-4">
                Empowering students worldwide with intelligent academic
                management tools.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:prosunsajal123@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:prosunsajal123@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2026 StudentOS. All rights reserved. Made with ❤️ by Prosun
              Mukherjee.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
