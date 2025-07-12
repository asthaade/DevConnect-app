import { Skeleton } from '@mui/material'; // For loading state
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addConnection } from '../utils/connectionSlice';
import { BASE_URL } from '../utils/constants';

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connections);
    const [isLoading, setIsLoading] = useState(true);

    const fetchConnections = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
            dispatch(addConnection(res.data.data));
        } catch (err) {
            console.error("Error fetching connections:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    // Loading State
    if (isLoading) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-6">Connections</h1>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 mb-4 border rounded-lg">
                        <Skeleton variant="circular" width={56} height={56} />
                        <div className="flex-1 w-full">
                            <Skeleton width="60%" height={24} />
                            <Skeleton width="40%" height={20} />
                            <Skeleton width="80%" height={16} />
                        </div>
                        <Skeleton width={80} height={36} />
                    </div>
                ))}
            </div>
        );
    }

    // Empty State
    if (!connections || connections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 sm:px-6 py-6">
                <div className="bg-gray-100 p-6 sm:p-8 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Connections Yet</h1>
                <p className="text-gray-500 mb-6 text-sm sm:text-base">Start building your network by connecting with people.</p>
            </div>
        );
    }

    // Connections UI
    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Your Connections ({connections.length})</h1>
            </div>

            <div className="space-y-4">
                {connections.map((connection) => (
                    <div
                        key={connection._id}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                        <img
                            src={connection.photoUrl || "https://via.placeholder.com/150"}
                            alt={`${connection.firstName} ${connection.lastName}`}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                        />

                        <div className="flex-1 w-full text-left">
                            <h3 className="font-semibold text-lg">
                                {connection.firstName} {connection.lastName}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {connection.age && `${connection.age} yrs`}
                                {connection.gender && ` • ${connection.gender}`}
                            </p>
                            {connection.about && (
                                <p className="text-gray-600 mt-1 text-sm line-clamp-1">
                                    {connection.about}
                                </p>
                            )}
                        </div>

                        <div className="w-full sm:w-auto">
                            <Link
                                to={`/chat/${connection._id}`}
                                className="block text-center btn btn-outline-primary px-4 py-2 rounded-full text-sm w-full sm:w-auto"
                            >
                                Message
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Connections;
