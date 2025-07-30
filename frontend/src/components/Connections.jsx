import { Skeleton } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addConnection } from '../utils/connectionSlice';

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.data));
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // 🔄 Loading UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50 px-4">
        <div className="w-full max-w-3xl space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg shadow bg-white/60 backdrop-blur">
              <Skeleton variant="circular" width={56} height={56} />
              <div className="flex-1 w-full">
                <Skeleton width="60%" height={24} />
                <Skeleton width="40%" height={20} />
                <Skeleton width="80%" height={16} />
              </div>
              <Skeleton width={80} height={36} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ❌ Empty State
  if (!connections || connections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 text-center">
        <div className="bg-white p-6 rounded-full shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">No Connections Yet</h1>
        <p className="text-gray-500 mt-2">Start building your network by connecting with developers.</p>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className="min-h-screen bg-teal-50 px-4 pt-24 pb-10"
>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-3xl sm:text-3xl font-bold text-indigo-800 mb-10">
          Your Connections ({connections.length})
        </h1>

        <div className="space-y-6">
          {connections.map((connection) => (
            <motion.div
              key={connection._id}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white/80 backdrop-blur-md shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl"
            >
              <img
                src={connection.photoUrl || 'https://via.placeholder.com/150'}
                alt={`${connection.firstName} ${connection.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              />

              <div className="flex-1 w-full text-left">
                <h3 className="text-lg font-semibold text-gray-800">
                  {connection.firstName} {connection.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {connection.age && `${connection.age} yrs`}
                  {connection.gender && ` • ${connection.gender}`}
                </p>
                {connection.about && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {connection.about}
                  </p>
                )}
              </div>

              <Link
                to={`/chat/${connection._id}`}
                className="text-sm px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:scale-105 transition-transform"
              >
                Message
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Connections;
