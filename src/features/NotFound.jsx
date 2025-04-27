import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#f5f5f0]">
      <div className="w-full max-w-md text-center">
        <h1 className="text-7xl font-bold text-[#7e57c2] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          Sorry, the page you are looking for doesn't exist, might have been
          removed, or is temporarily unavailable.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 w-full max-w-xs p-4 bg-[#7e57c2] text-white rounded-lg font-semibold hover:bg-[#6a4aaa] transition-colors shadow-md"
        >
          <FiArrowLeft className="h-5 w-5" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
