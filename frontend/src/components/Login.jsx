import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { emailId: formData.emailId, password: formData.password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.emailId,
          password: formData.password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
    >
      <div
        ref={cardRef}
        className="relative bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md mx-4"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLoginForm ? "Login" : "Sign Up"}
        </h2>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign Up Fields */}
        {!isLoginForm && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}

        {/* Email Field */}
        <input
          type="email"
          name="emailId"
          value={formData.emailId}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Password Field */}
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Submit Button */}
        <motion.button
          onClick={isLoginForm ? handleLogin : handleSignup}
          disabled={isLoading}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          className={`w-full py-3 rounded-full text-white font-semibold transition-all ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500"
          }`}
        >
          {isLoading
            ? isLoginForm
              ? "Logging in..."
              : "Signing up..."
            : isLoginForm
            ? "Login"
            : "Sign Up"}
        </motion.button>

        {/* Switch Mode */}
        <div
          className="mt-6 text-sm text-center text-gray-600 hover:underline cursor-pointer"
          onClick={() => {
            setIsLoginForm((prev) => !prev);
            setError("");
          }}
        >
          {isLoginForm ? (
            <p>
              Don’t have an account?{" "}
              <span className="text-indigo-600 font-medium">Sign Up</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span className="text-indigo-600 font-medium">Login</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
