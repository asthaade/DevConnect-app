import axios from 'axios';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();
  const cardRef = useRef(null);

  const handleSendRequest = async (status, user_id) => {
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/request/send/' + status + '/' + user_id,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(user_id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex justify-center items-center px-4 py-8">
      <div
        ref={cardRef}
        className="card w-96 shadow bg-white/60 backdrop-blur hover:shadow-xl text-gray-900 dark:text-gray-900"
      >
        <figure>
          <img src={photoUrl} alt="photo" />
        </figure>
        <div className="card-body">
          <h2>{firstName + ' ' + lastName}</h2>
          {age && gender && <p className="text-gray-700 dark:text-gray-900">{age + ', ' + gender}</p>}
          <p className="text-gray-700 dark:text-gray-900">{about}</p>
          <div className="card-actions justify-center my-4">
            <button
              className="btn btn-primary"
              onClick={() => handleSendRequest('ignored', _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleSendRequest('interested', _id)}
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
