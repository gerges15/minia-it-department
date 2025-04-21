import { useDispatch, useSelector } from 'react-redux';
import { setUserName } from '../state/userSlice.js';

import { clearError } from '../store/useErrorMessageStore.js';

export default function UserNameInput() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.loading.value);
  const aUserName = useSelector(state => state.user.value.name);

  const handleInputChange = function (e) {
    const targetValue = e.target.value;
    dispatch(setUserName(targetValue));
    clearError();
  };

  return (
    <div className="mb-5">
      <input
        type="text"
        placeholder="Username"
        value={aUserName}
        onChange={handleInputChange}
        required
        disabled={isLoading}
        className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7e57c2] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}
