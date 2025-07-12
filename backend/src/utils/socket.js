const socket = require('socket.io');
const crypto = require('crypto');
const { Chat } = require('../models/chat');

// Create consistent room ID
const secretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join('_'))
    .digest('hex');
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('✅ A user connected');

    socket.on('joinChat', ({ firstName, userId, targetUserId }) => {
      const roomId = secretRoomId(userId, targetUserId);
      console.log(`${firstName} joined room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on('sendMessage', async ({ firstName, lastName, userId, targetUserId, text, createdAt }) => {
      try {
        const roomId = secretRoomId(userId, targetUserId);

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: []
          });
        }

        const newMessage = {
          sender: userId,
          text,
          createdAt: createdAt || new Date(),
          status: 'sent',
        };

        chat.messages.push(newMessage);
        await chat.save();

        io.to(roomId).emit('receiveMessage', {
          firstName,
          lastName,
          text,
          createdAt: newMessage.createdAt,
          status: newMessage.status
        });
      } catch (err) {
        console.error("❌ Error saving message:", err);
      }
    });

    socket.on('markAsSeen', async ({ userId, targetUserId }) => {
      try {
        const chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        });

        if (!chat) return;

        let updated = false;
        chat.messages.forEach((msg) => {
          if (msg.sender.toString() === targetUserId && msg.status !== 'seen') {
            msg.status = 'seen';
            updated = true;
          }
        });

        if (updated) {
          await chat.save();

          const roomId = secretRoomId(userId, targetUserId);
          io.to(roomId).emit('updateMessageStatus', {
            status: 'seen',
          });
        }
      } catch (err) {
        console.error('❌ Error marking messages as seen:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('🚪 A user disconnected');
    });
  });
};

module.exports = initializeSocket;
