const Notification = require('../models/Notification');
const { store } = require('../config/db');

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (store.isUsingMongo) {
      const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(30);

      const unreadCount = await Notification.countDocuments({
        recipient: userId,
        read: false,
      });

      return res.json({
        success: true,
        unreadCount,
        data: notifications,
      });
    } else {
      if (!store.notifications) store.notifications = [];
      const userNotifs = store.notifications.filter(
        (n) => n.recipient.toString() === userId
      );

      const unreadCount = userNotifs.filter((n) => !n.read).length;

      return res.json({
        success: true,
        unreadCount,
        data: userNotifs,
      });
    }
  } catch (error) {
    console.error('getNotifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isUsingMongo) {
      await Notification.findByIdAndUpdate(id, { read: true });
      return res.json({ success: true });
    } else {
      if (store.notifications) {
        const notif = store.notifications.find((n) => n._id.toString() === id.toString());
        if (notif) notif.read = true;
      }
      return res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all user notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (store.isUsingMongo) {
      await Notification.updateMany({ recipient: userId }, { read: true });
      return res.json({ success: true });
    } else {
      if (store.notifications) {
        store.notifications.forEach((n) => {
          if (n.recipient.toString() === userId) n.read = true;
        });
      }
      return res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
