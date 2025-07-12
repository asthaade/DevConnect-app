import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { removeUserFromFeed } from '../utils/feedSlice';

const UserCard = ({ user, showActions = false }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const loggedInUser = useSelector(state => state.user?.user);

  const handleSendRequest = async (status, user_id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${user_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(user_id));
    } catch (err) {
      console.error('Error sending request:', err);
    }
  };

  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img src={photoUrl} alt="photo" />
      </figure>
      <div className="card-body">
        <h2>{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>

        {showActions && loggedInUser?._id !== _id && (
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
        )}
      </div>
    </div>
  );
};

export default UserCard;
