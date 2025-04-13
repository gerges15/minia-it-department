import { useState } from 'react';
export default function UserNameInput() {
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = setter => e => {
    setter(e.target.value);
    if (error) {
      setError('');
    }
  };
  return (
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
  );
}
