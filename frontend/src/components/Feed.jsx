import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length === 0)
    return (
      <h1 className="flex justify-center my-10 text-2xl font-bold text-slate-700">
        No new User Found
      </h1>
    );

  return (
    <div className="relative min-h-screen bg-teal-50 overflow-hidden">
      {/* Animated Blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-96 h-96 bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-96 h-96 bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 py-16">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;
