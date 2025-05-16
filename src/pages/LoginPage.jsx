import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-700 to-indigo-900"></div>
      <div className="relative bg-white/10 backdrop-blur-md shadow-lg p-6 sm:p-8 rounded-2xl w-full max-w-md sm:max-w-lg text-center border border-white/20 z-10">
        <div className="flex justify-center mb-4">
          <img src="https://res.cloudinary.com/dsk0mhwfq/image/upload/v1740387795/Logo-transparent_shwtpl.png" alt="Company Logo" className="w-40 sm:w-48 md:w-56 h-auto" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
        <p className="text-gray-300 text-sm mb-6">Login to access the Conference Room Booking System</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-pointer"
              tabIndex={-1}
            >
              👁
            </button>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-gray-300 text-sm mt-4">Don't have an account? <span className="text-blue-400">Contact your onfloor Support Engineer</span></p>
      </div>
    </div>
  );
}
