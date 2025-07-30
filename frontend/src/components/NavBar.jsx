import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeUser } from '../utils/userSlice';

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="navbar fixed top-0 left-0 w-full bg-indigo-950 backdrop-blur-md shadow-md z-50">
      <div className="flex-1">
        <Link to="/" className="text-xl text-white font-bold tracking-wide px-3 py-2 rounded hover:bg-white/10 transition">
          DevConnect
        </Link>
      </div>

      {user && (
        <div className="flex gap-2 items-center">
          <p className='px-2 py-2 text-white hidden sm:block'>Welcome, {user.firstName}</p>

          <div className="dropdown dropdown-end mx-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full border-2 border-white">
                <img
                  alt="user profile photo"
                  src={user.photoUrl}
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white text-black rounded-box z-50 mt-3 w-52 p-2 shadow-lg"
            >
              <li>
                <Link to="/profile" className="justify-between">Profile</Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
