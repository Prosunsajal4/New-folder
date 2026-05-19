const Notification = require('../models/Notification');
const { sendNotification } = require('../config/socket');

exports.createNotification = async (userId, { title, message, type, link }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type: type || 'system',
      link: link || '',
    });

    sendNotification(userId, notification);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};

exports.bulkCreateNotifications = async (userIds, data) => {
  try {
    const notifications = userIds.map(userId => ({
      user: userId,
      title: data.title,
      message: data.message,
      type: data.type || 'system',
      link: data.link || '',
    }));

    const created = await Notification.insertMany(notifications);

    created.forEach(notification => {
      sendNotification(notification.user.toString(), notification);
    });

    return created;
  } catch (error) {
    console.error('Error creating bulk notifications:', error.message);
  }
};