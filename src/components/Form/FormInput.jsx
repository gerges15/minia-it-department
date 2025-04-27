import EyeIcon from '../../assets/svg/EyeIcon.jsx';
import EyeOffIcon from '../../assets/svg/EyeOffIcon.jsx';
import { useLoadingStore } from '../../store/useLoadingStore.js';
import { clearError } from '../../store/useErrorMessageStore.js';
import { useState } from 'react';
export default function FormInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  showToggle = false,
}) {
  const { isLoading } = useLoadingStore();
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showToggle ? (showPassword ? 'text' : 'password') : type;

  const handleInputChange = e => {
    onChange(e.target.value);
    clearError();
  };

  return (
    <div className="mb-5 relative">
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        required
        disabled={isLoading}
        className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7e57c2] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" // Added hover
        >
          {showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      )}
    </div>
  );
}
