'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await axios.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await axios.put(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await axios.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await axios.delete(`/notifications/${notificationId}`);
      setNotifications(prev => {
        const deleted = prev.find(n => n._id === notificationId);
        if (deleted && !deleted.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        return prev.filter(n => n._id !== notificationId);
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  useEffect(() => {
    const handleNewNotification = (event) => {
      const notification = event.detail;
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border-l-4 border-blue-500 shadow-lg rounded p-4 max-w-sm`}
        >
          <div className="font-semibold text-gray-800">{notification.title}</div>
          <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
        </div>
      ), { duration: 4000 });
    };

    window.addEventListener('new-notification', handleNewNotification);
    return () => window.removeEventListener('new-notification', handleNewNotification);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};