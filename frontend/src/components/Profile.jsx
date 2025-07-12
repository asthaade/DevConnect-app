import { useSelector } from 'react-redux';
import EditProfile from './EditProfile';

const Profile = () => {
  const user = useSelector((store) => store.user);

  return (
    user && (
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-6 w-full max-w-7xl mx-auto">
        <EditProfile user={user} />
      </div>
    )
  );
};

export default Profile;
