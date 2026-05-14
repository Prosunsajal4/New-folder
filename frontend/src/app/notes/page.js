'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import axios from '../../lib/axios';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, FileText, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function Notes() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const refreshIntervalMs = 30000;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    tags: '',
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchNotes();
    const intervalId = setInterval(() => {
      fetchNotes({ silent: true });
    }, refreshIntervalMs);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const fetchNotes = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoadingNotes(true);
      const response = await axios.get('/notes');
      setNotes(response.data);
      setFilteredNotes(response.data);
    } catch (error) {
      if (!silent) toast.error('Failed to load notes');
      console.error(error);
    } finally {
      if (!silent) setLoadingNotes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const noteData = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
      };

      if (editingNote) {
        await axios.put(`/notes/${editingNote._id}`, noteData);
        toast.success('Note updated successfully');
      } else {
        await axios.post('/notes', noteData);
        toast.success('Note added successfully');
      }
      setShowModal(false);
      setEditingNote(null);
      setSelectedNote(null);
      setFormData({
        title: '',
        content: '',
        subject: '',
        tags: '',
      });
      fetchNotes();
    } catch (error) {
      toast.error('Failed to save note');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await axios.delete(`/notes/${id}`);
      toast.success('Note deleted successfully');
      if (selectedNote?._id === id) setSelectedNote(null);
      fetchNotes();
    } catch (error) {
      toast.error('Failed to delete note');
      console.error(error);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      subject: note.subject || '',
      tags: note.tags ? note.tags.join(', ') : '',
    });
    setShowModal(true);
  };

  if (loading || loadingNotes) {
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
                Notes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage your study notes
              </p>
            </div>
            <button
              onClick={() => {
                setEditingNote(null);
                setFormData({
                  title: '',
                  content: '',
                  subject: '',
                  tags: '',
                });
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Add Note
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notes List */}
            <div className="lg:col-span-1 space-y-4">
              {filteredNotes.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery ? 'No notes found' : 'No notes yet. Create your first note!'}
                  </p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedNote(note)}
                    className={`glass-card rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedNote?._id === note._id
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {note.title}
                    </h3>
                    {note.subject && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
                        {note.subject}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">
                      {note.content.substring(0, 100)}...
                    </p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {note.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Note Detail */}
            <div className="lg:col-span-2">
              {selectedNote ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedNote.title}
                      </h2>
                      {selectedNote.subject && (
                        <p className="text-gray-600 dark:text-gray-400 capitalize">
                          {selectedNote.subject}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(selectedNote)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-all"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(selectedNote._id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {selectedNote.tags && selectedNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedNote.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                        >
                          <Tag size={14} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                  </div>
                </motion.div>
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a note to view details
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingNote ? 'Edit Note' : 'Add Note'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingNote(null);
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
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Note title"
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
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Mathematics"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content (Markdown supported)
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      placeholder="Write your note content here..."
                      rows={10}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., important, exam, chapter1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
                  >
                    {editingNote ? 'Update Note' : 'Add Note'}
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
