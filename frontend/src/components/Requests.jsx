import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaCheck, FaSpinner, FaTimes, FaUserClock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequest } from '../utils/requestSlice';

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [error, setError] = useState(null);

  const reviewRequest = async (status, requestId) => {
    try {
      setProcessing((prev) => ({ ...prev, [requestId]: true }));
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error(err);
      setError('Failed to process request. Please try again.');
    } finally {
      setProcessing((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
      setError('Failed to load requests. Please refresh to try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔄 Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50 px-4">
        <div className="flex flex-col items-center text-center">
          <FaSpinner className="animate-spin text-3xl text-primary mb-4" />
          <p className="text-lg text-gray-700">Loading connection requests...</p>
        </div>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4">
        <div className="bg-white shadow rounded-lg p-6 text-center max-w-md w-full">
          <div className="flex items-center justify-center text-red-600 mb-4">
            <FaTimes className="text-2xl" />
          </div>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  // 🚫 No Requests
  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 text-center">
        <div className="bg-white p-6 rounded-full shadow">
          <FaUserClock className="text-4xl text-gray-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">
          No Connection Requests Found
        </h1>
        <p className="text-gray-500 mt-2">
          When you receive requests, they’ll appear here.
        </p>
      </div>
    );
  }

  // ✅ UI
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen bg-teal-50 px-4 pt-24 pb-10"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-3xl font-bold text-indigo-800 text-center mb-10">
          Connection Requests ({requests.length})
        </h1>

        <AnimatePresence>
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              request.fromUserId;

            return (
              <motion.div
                key={_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white/80 backdrop-blur-md shadow-lg rounded-xl mb-6 transition-all duration-200 hover:shadow-xl"
              >
                <img
                  src={photoUrl || '/default-avatar.png'}
                  alt={`${firstName} ${lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                  onError={(e) => (e.target.src = '/default-avatar.png')}
                />

                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {[age && `${age} yrs`, gender].filter(Boolean).join(' • ')}
                  </p>
                  {about && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{about}</p>
                  )}
                </div>

                <div className="flex gap-2 mt-4 sm:mt-0 sm:flex-col">
  <button
    className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-slate-500 to-slate-700 text-white shadow hover:scale-105 transition-transform flex items-center gap-2"
    onClick={() => reviewRequest('rejected', request._id)}
    disabled={processing[request._id]}
  >
    {processing[request._id] ? (
      <FaSpinner className="animate-spin" />
    ) : (
      <>
        <FaTimes /> Reject
      </>
    )}
  </button>
  <button
    className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-600 text-white shadow hover:scale-105 transition-transform flex items-center gap-2"
    onClick={() => reviewRequest('accepted', request._id)}
    disabled={processing[request._id]}
  >
    {processing[request._id] ? (
      <FaSpinner className="animate-spin" />
    ) : (
      <>
        <FaCheck /> Accept
      </>
    )}
  </button>
</div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Requests;
