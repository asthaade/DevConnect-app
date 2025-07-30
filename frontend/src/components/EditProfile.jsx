import axios from 'axios';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';
import UserCard from './UserCard';

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const cardRef = useRef(null);
  

  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    photoUrl: user.photoUrl || '',
    age: user.age || '',
    gender: user.gender || '',
    about: user.about || '',
  });

  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    setError('');
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        form,
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setError(err?.response?.data || 'Failed to update profile');
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
    <>
      <div className=" in-h-[calc(100vh-8rem)] flex flex-col md:flex-row items-center justify-center my-10 gap-10 px-4">
        {/* Edit Form */}
        <div ref={cardRef} className=" max-w-md card  w-96 shadow bg-white/60 backdrop-blur p-6 space-y-4 border border-gray-100 transition-all duration-200 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-center text-indigo-700">Edit Profile</h2>

          {['firstName', 'lastName', 'photoUrl', 'age', 'about'].map((field) => (
            <div key={field} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          ))}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option disabled value="">Choose</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="text-center">
            <button className="btn btn-primary" onClick={saveProfile}>
              Save Profile
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <UserCard user={form} />
      </div>

      {/* Toast */}
      {showToast && (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
    <div className="alert alert-success shadow-lg">
      <span>Profile updated successfully...</span>
    </div>
  </div>
)}

    </>
  );
};

export default EditProfile;
