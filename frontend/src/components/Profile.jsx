import { useSelector } from 'react-redux';
import EditProfile from './EditProfile';

const Profile = () => {
    const user = useSelector((store) => store.user);
    return (
        user && (
            <div 
            className="relative min-h-screen bg-teal-50 overflow-hidden">
                {/* Floating Blobs for aesthetic background */}

                {/* Main content */}
                <div >
                    <EditProfile user={user} />
                </div>
            </div>
        )
    );
};

export default Profile;
