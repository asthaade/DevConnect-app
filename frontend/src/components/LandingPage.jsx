import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const containerRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }
    );
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center px-4 pt-22 overflow-hidden"
    >
      {/* Content */}
      <div className="text-center max-w-3xl z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md">
          Welcome to{' '}
          <span className="text-purple-400 animate-pulse">DevConnect</span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-gray-300 font-medium">
          Build your profile.Make meaningful connections. <br/>Connect. Collaborate. Grow.
        </p>

        <div className="mt-10">
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
