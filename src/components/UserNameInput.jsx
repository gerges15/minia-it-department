import { useSelector } from 'react-redux';
import { useUserStore } from '../store/useUserStore.js';
import { clearError } from '../store/useErrorMessageStore.js';

export default function UserNameInput() {
  const { setUserName, userName } = useUserStore();
  const isLoading = useSelector(state => state.loading.value);

  const handleInputChange = function (e) {
    setUserName(e.target.value);
    clearError();
  };

  return (
    <div className="mb-5">
      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={handleInputChange}
        required
        disabled={isLoading}
        className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7e57c2] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}
