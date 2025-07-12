// ✅ Chat.jsx - Responsive Version with Timestamp & Message Status

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { socketConnection } from '../utils/socket';

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });
      const chatsMsgs = chat?.data?.messages.map((message) => ({
        _id: message?._id,
        firstName: message?.sender?.firstName,
        lastName: message?.sender?.lastName,
        text: message?.text,
        createdAt: message?.createdAt,
        status: message?.status || 'sent',
      }));
      setMessages(chatsMsgs);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = socketConnection();

    socket.emit('joinChat', {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.emit('markAsSeen', { userId, targetUserId });

    socket.on('receiveMessage', ({ firstName, lastName, text, createdAt, status }) => {
      setMessages((prev) => [
        ...prev,
        { firstName, lastName, text, createdAt, status: status || 'sent' },
      ]);
      scrollToBottom();
    });

    socket.on('updateMessageStatus', ({ messageId, status }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, status } : msg
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendText = () => {
    const socket = socketConnection();
    const createdAt = new Date().toISOString();

    socket.emit('sendMessage', {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
      createdAt,
    });

    setNewMessage('');
    scrollToBottom();
  };

  return (
    <div className="w-full flex justify-start sm:justify-center">
      <div className='w-full sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-[40%] m-3 sm:m-5 h-[70vh] flex flex-col rounded border border-gray-600'>

        <h1 className='p-4 sm:p-5 border-b border-gray-600 font-bold text-indigo-700 text-lg sm:text-xl'>
          Chat
        </h1>

        <div className='flex-1 overflow-y-auto p-3 sm:p-5'>
          {messages.map((message, index) => (
            <div
              key={index}
              className={'chat ' + (user.firstName === message.firstName ? 'chat-end' : 'chat-start')}
            >
              <div className='chat-header text-sm sm:text-base'>
                {`${message.firstName} ${message.lastName}`}
                <time className='text-xs opacity-50 ml-2'>
                  {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ''}
                </time>
              </div>
              <div className='chat-bubble break-words'>{message.text}</div>
              <div className='chat-footer text-xs opacity-50 capitalize'>
                {user.firstName === message.firstName ? message.status : ''}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className='p-3 sm:p-5 border-t border-gray-600 flex flex-col sm:flex-row items-center gap-2'>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className='w-full sm:flex-1 border border-gray-500 rounded p-2'
            placeholder="Type your message..."
          />
          <button onClick={sendText} className='btn btn-secondary w-full sm:w-auto'>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
