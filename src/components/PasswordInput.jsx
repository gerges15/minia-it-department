import EyeIcon from '../assets/svg/EyeIcon';
import EyeOffIcon from '../assets/svg/EyeOffIcon';
import { useState } from 'react';
import { useUserStore } from '../store/useUserStore.js';
import { clearError } from '../store/useErrorMessageStore.js';
import { useLoadingStore } from '../store/useLoadingStore.js';

export default function PasswordInput() {
  const { setPassword, userPassword } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading } = useLoadingStore();

  const handleInputChange = function (e) {
    setPassword(e.target.value);
    clearError();
  };

  return (
    <div className="mb-5 relative">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        value={userPassword}
        onChange={handleInputChange}
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
  );
}
