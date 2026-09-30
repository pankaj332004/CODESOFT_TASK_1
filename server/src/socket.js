const { Server } = require('socket.io');
const Notification = require('./models/Notification');
const { store } = require('./config/db');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    // When a user logs in, their client joins a room identified by their user ID
    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId.toString());
      }
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  console.log('⚡ Socket.IO initialized for real-time notifications');
  return io;
};

/**
 * Creates an in-app notification in DB / in-memory store and emits via Socket.IO
 */
const sendRealtimeNotification = async ({
  recipientId,
  title,
  message,
  type = 'system',
  link = '',
}) => {
  try {
    if (!recipientId) return null;

    let notificationObj = null;

    if (store.isUsingMongo) {
      notificationObj = await Notification.create({
        recipient: recipientId,
        title,
        message,
        type,
        link,
        read: false,
      });
    } else {
      if (!store.notifications) store.notifications = [];
      notificationObj = {
        _id: 'notif-' + Date.now() + '-' + Math.round(Math.random() * 1e4),
        recipient: recipientId.toString(),
        title,
        message,
        type,
        link,
        read: false,
        createdAt: new Date(),
      };
      store.notifications.unshift(notificationObj);
    }

    // Emit live event to the recipient's room
    if (io) {
      io.to(recipientId.toString()).emit('notification', notificationObj);
    }

    return notificationObj;
  } catch (error) {
    console.error('sendRealtimeNotification error:', error.message);
    return null;
  }
};

module.exports = {
  initSocket,
  sendRealtimeNotification,
};
