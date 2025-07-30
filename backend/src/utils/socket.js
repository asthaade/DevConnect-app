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

    socket.on('joinChat', ({ firstName, userId, targetUserId }) => {
      const roomId = secretRoomId(userId, targetUserId);
      console.log(`${firstName} joined room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on('sendMessage', async ({ firstName, lastName, userId, targetUserId, text, createdAt }) => {
  try {
    if (!text || !text.trim()) {
      console.log("❌ Empty message, not saving.");
      return;
    }

    const roomId = secretRoomId(userId, targetUserId);
    console.log(`${firstName} ➤ ${text}`);

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: []
      });
    }

    chat.messages.push({
  sender: userId,
  text: text.trim(),
  status: 'sent',
  createdAt: createdAt || new Date()
});


    await chat.save();

    io.to(roomId).emit('receiveMessage', {
      firstName,
      lastName,
      text: text.trim(),
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
    socket.on('disconnect', () => {});
  });
};

module.exports = initializeSocket;
