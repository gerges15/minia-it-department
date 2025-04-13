import React, { useState } from 'react';
import { Link } from 'react-router';
import { login } from '../../API/auth';
import useAuthStore from '../Stores/useAuthStore';
import EyeIcon from '../assets/svg/EyeIcon';
import EyeOffIcon from '../assets/svg/EyeOffIcon';
import Spinner from '../Components/Common/Spinner';

export default function LoginRightSide() {
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth_store = useAuthStore();

  const handleSubmit = async e => {
    e.preventDefault();

    const credentials = { userName, password };

    await login(credentials, setError, auth_store, setIsLoading);
  };

  // Clear error when user starts typing again
  const handleInputChange = setter => e => {
    setter(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="w-fit  p-6 md:p-5 flex items-center justify-center bg-white rounded-xl">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Log in</h1>

        <form onSubmit={handleSubmit}>
          {/* userName input */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={handleInputChange(setUserName)}
              required
              disabled={isLoading}
              className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7e57c2] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" // Added disabled styles
            />
          </div>

          {/* password input */}
          <div className="mb-5 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={handleInputChange(setPassword)}
              required
              disabled={isLoading}
              className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7e57c2] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" // Added disabled styles
            />
            {/* show password btn */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" // Added hover
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-right mb-5">
            <Link
              to="/forgot-password"
              className={`text-[#7e57c2] text-sm hover:underline ${
                isLoading ? 'pointer-events-none opacity-50' : ''
              }`}
              aria-disabled={isLoading}
              tabIndex={isLoading ? -1 : undefined}
            >
              Forgot password?
            </Link>
          </div>

          {/* error msg */}
          {error && (
            <div className="mb-4 p-3 tracking-wide bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center p-4 bg-[#7e57c2] text-white rounded-xl font-semibold mt-8 hover:bg-[#6a4aaa] transition-colors shadow-md cursor-pointer duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner /> : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
