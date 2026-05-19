"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import axios from "../../lib/axios";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Upload, X, FileText, Image, File } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from 'react-markdown';

export default function AIChat() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI study assistant. You can also upload files (PDF, images, text) for me to analyze. How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });
    
    if (invalidFiles.length > 0) {
      toast.error('Images not supported yet. Please upload PDF, TXT, or DOC files.');
    }
    
    if (validFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...validFiles]);
    }
    e.target.value = '';
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image size={16} />;
    if (file.type === 'application/pdf') return <FileText size={16} />;
    return <File size={16} />;
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && attachedFiles.length === 0) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please log in to use AI chat.");
      router.push("/login");
      return;
    }

    const userMessage = inputMessage.trim() || (attachedFiles.length > 0 ? "Please analyze these files." : "");
    setInputMessage("");

    const fileAttachments = attachedFiles.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size
    }));

    const userMsgWithFiles = {
      role: "user",
      content: userMessage,
      files: fileAttachments
    };

    const nextMessages = [...messages, userMsgWithFiles];
    setMessages(nextMessages);
    setAttachedFiles([]);
    setSendingMessage(true);

    try {
      const formData = new FormData();
      formData.append('message', userMessage);
      
      attachedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post("/ai/chat", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      console.error("Full error details:", { status: error.response?.status, data: error.response?.data, message: error.message });
      toast.error("AI service error: " + errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Error: " + errorMsg + ". Please try again.",
        },
      ]);
    } finally {
      setSendingMessage(false);
    }
  };

  const suggestedQuestions = [
    "Make my study routine",
    "Explain Fourier Series",
    "Generate viva questions",
    "How many classes can I miss?",
    "Summarize my notes",
    "Tips for better productivity",
  ];

  if (loading) {
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

      <main className="flex-1 p-6 lg:p-8 flex flex-col overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col"
        >
          <Header 
            title="AI Study Assistant" 
            subtitle="Ask me anything about your studies, productivity, or get help with planning"
          />

          {/* Chat Container */}
          <div className="flex-1 glass-card rounded-2xl p-6 overflow-y-auto mb-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Bot size={20} className="text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    {message.role === "user" ? (
                      <div>
                        {message.files && message.files.length > 0 && (
                          <div className="mb-2 flex flex-wrap gap-1">
                            {message.files.map((file, fIndex) => (
                              <div
                                key={fIndex}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-400/30 rounded text-xs"
                              >
                                <FileText size={12} />
                                <span className="truncate max-w-[100px]">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    ) : (
                      <div className="text-gray-900 dark:text-white text-sm leading-relaxed">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="mb-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-blue-600 dark:text-blue-400" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {sendingMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attached Files Display */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm"
                >
                  {getFileIcon(file)}
                  <span className="text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.txt,.doc,.docx,.md"
              multiple
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={sendingMessage}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              <Upload size={20} />
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message or upload files..."
              className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={sendingMessage}
            />
            <button
              type="submit"
              disabled={sendingMessage || (!inputMessage.trim() && attachedFiles.length === 0)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={20} />
              <Send size={20} />
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
