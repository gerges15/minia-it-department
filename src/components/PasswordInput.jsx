import EyeIcon from '../assets/svg/EyeIcon';
import EyeOffIcon from '../assets/svg/EyeOffIcon';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPassword } from '../state/userSlice.js';
import { clearErrorMsg } from '../state/errorMsgSlice.js';

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.loading.value);
  const password = useSelector(state => state.user.value.password);

  const handleInputChange = function (e) {
    const targetValue = e.target.value;
    dispatch(setPassword(targetValue));

    dispatch(clearErrorMsg());
  };
  return (
    <div className="mb-5 relative">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        value={password}
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
