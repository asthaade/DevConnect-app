import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaCheck, FaSpinner, FaTimes, FaUserClock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
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
        `${BASE_URL}/request/review/${status}/${requestId}`,
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
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] px-4 text-center">
        <FaSpinner className="animate-spin text-3xl text-primary mb-4" />
        <p>Loading connection requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-md mx-auto my-10 px-4 text-center">
        <div className="flex-1 flex gap-2 items-center justify-center">
          <FaTimes className="text-xl" />
          <label>{error}</label>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-10 gap-4 px-4 text-center">
        <FaUserClock className="text-5xl text-gray-400" />
        <h1 className="text-2xl text-gray-600">No Connection Requests Found</h1>
        <p className="text-gray-500">When you receive requests, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="my-10 px-4 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-center mb-8">Connection Requests</h1>

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
              className="flex flex-col sm:flex-row items-center gap-4 p-6 mb-6 rounded-xl bg-base-100 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="avatar">
                <div className="w-20 h-20 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    alt={`${firstName}'s profile`}
                    className="w-full h-full object-cover"
                    src={photoUrl || '/default-avatar.png'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-bold text-xl">
                  {firstName} {lastName}
                </h2>
                {(age || gender) && (
                  <p className="text-gray-600">
                    {[age, gender].filter(Boolean).join(', ')}
                  </p>
                )}
                {about && (
                  <p className="mt-2 text-gray-700 line-clamp-2">{about}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                <button
                  className="btn btn-outline btn-error gap-2"
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
                  className="btn btn-primary gap-2"
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
  );
};

export default Requests;
