import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConsentPage() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (checked) navigate("/login");
  };

  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen p-4 relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md" style={{ backgroundImage: "url('https://res.cloudinary.com/dsk0mhwfq/image/upload/v1740482960/FS-3_hxyomy.jpg')" }}></div>
      <div className="relative bg-white/10 backdrop-blur-md shadow-lg p-6 sm:p-8 rounded-2xl w-full max-w-md sm:max-w-lg text-center border border-white/20 z-10">
        <div className="flex justify-center mb-4">
          <img src="https://res.cloudinary.com/dsk0mhwfq/image/upload/v1740387795/Logo-transparent_shwtpl.png" alt="Company Logo" className="w-40 sm:w-48 md:w-56 h-auto" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">Welcome to Conference Room Booking App</h1>
        <p className="text-gray-200 text-sm sm:text-base mb-5">
          This platform is for internal employees of skillMatch only. By continuing, you acknowledge that you understand and accept the company policies.
        </p>
        <div className="flex items-center justify-center space-x-2 mb-6">
          <input
            type="checkbox"
            id="consent"
            className="w-5 h-5 text-blue-500 focus:ring-2 focus:ring-blue-500"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <label htmlFor="consent" className="text-gray-200 text-sm cursor-pointer">I Understand</label>
        </div>
        <button
          className={`px-6 py-2 rounded-full text-lg font-semibold w-full sm:w-auto transition-all duration-300 ${checked ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" : "bg-gray-500 text-white cursor-not-allowed"}`}
          disabled={!checked}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
