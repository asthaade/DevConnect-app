import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed || []);
  const user = useSelector((store) => store.user); // ✅ Get current logged-in user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getFeed = async () => {
    // ✅ Don't fetch if user not logged in
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    if (feed.length > 0) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data || []));
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching the feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, [user]); // ✅ Trigger getFeed when user updates (i.e., after login)

  // 🕒 While loading
  if (loading) {
    return (
      <h1 className="flex justify-center my-10 text-xl px-4 text-center">
        Loading...
      </h1>
    );
  }

  // ❌ On error (like 401 or 500)
  if (error) {
    return (
      <h1 className="flex justify-center my-10 text-red-600 text-xl px-4 text-center">
        {error}
      </h1>
    );
  }

  // 📭 Empty state
  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          No New Users Found
        </h2>
        <p className="text-gray-500 mt-2">
          Try again later — we'll show new users here as soon as they arrive.
        </p>
        <button
          onClick={getFeed}
          className="mt-6 px-4 py-2 rounded-lg bg-purple-700 text-white font-medium hover:bg-purple-800 transition"
        >
          Refresh
        </button>
      </div>
    );
  }

  // ✅ Show feed
  return (
    <div className="flex justify-center my-10 px-4">
      <div className="w-full max-w-md">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;
