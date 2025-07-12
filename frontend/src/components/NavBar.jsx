import axios from 'axios';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/userSlice';

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.div
      className="navbar bg-purple-950 shadow-lg sticky top-0 z-50 px-4 sm:px-6 md:px-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Link
            to="/"
            className="btn btn-ghost text-lg sm:text-xl text-white hover:bg-white/10 transition-colors duration-300"
          >
            <motion.span
              className="font-bold"
              whileHover={{
                backgroundPosition: '100% 50%',
                transition: { duration: 1.5 }
              }}
              style={{
                background: 'linear-gradient(to right, #fff 50%, #a5b4fc 100%)',
                backgroundSize: '200% 100%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              DevConnect
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {user && (
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.p
            className="text-white font-medium text-sm sm:text-base hidden sm:block"
            whileHover={{ scale: 1.03 }}
          >
            Welcome, {user.firstName}
          </motion.p>

          <motion.div
            className="dropdown dropdown-end"
            whileHover={{ scale: 1.05 }}
          >
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform"
            >
              <div className="w-10 sm:w-11 rounded-full ring-2 ring-white/80 ring-offset-2 ring-offset-indigo-700">
                <motion.img
                  alt="user profile photo"
                  src={user.photoUrl}
                  className="object-cover w-full h-full"
                  whileHover={{ scale: 1.1 }}
                />
              </div>
            </div>

            <motion.ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white rounded-box w-48 sm:w-52 border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.li whileHover={{ x: 2 }}>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  Profile
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 2 }}>
                <Link
                  to="/connections"
                  className="text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  Connections
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 2 }}>
                <Link
                  to="/requests"
                  className="text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  Requests
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 2 }}>
                <a
                  onClick={handleLogout}
                  className="text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  Logout
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default NavBar;
