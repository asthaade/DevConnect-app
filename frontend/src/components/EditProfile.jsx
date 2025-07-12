import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';
import UserCard from './UserCard';

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || '');
  const [gender, setGender] = useState(user.gender || '');
  const [about, setAbout] = useState(user.about || '');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError('');
    try {
      const res = await axios.patch(
        BASE_URL + '/profile/edit',
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Something went wrong');
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleAboutChange = (event) => {
    setAbout(event.target.value);
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="flex justify-center mx-10">
          <div className="card card-border bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend py-2">First Name :</legend>
                  <input
                    type="text"
                    value={firstName}
                    className="input"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend py-2">Last Name :</legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend py-2">PhotoUrl :</legend>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend py-2">Age :</legend>
                  <input
                    type="text"
                    value={age}
                    className="input"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Gender :</legend>
                  <select
                    value={gender}
                    onChange={handleGenderChange}
                    className="select"
                  >
                    <option disabled={true}>Choose</option>
                    <option>male</option>
                    <option>female</option>
                    <option>others</option>
                  </select>
                </fieldset>
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend py-2">About :</legend>
                  <input
                    type="text"
                    value={about}
                    className="input"
                    onChange={handleAboutChange}
                  />
                </fieldset>
              </div>
              <p className="text-red-600">{error}</p>
              <div className="card-actions justify-center m-2">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <UserCard
          user={{
            ...user,
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about,
          }}
        />
      </div>

      {/* ✅ Toast for success message with z-index fix */}
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Profile updated successfully...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
