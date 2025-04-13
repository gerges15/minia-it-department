import { useState } from 'react';
import Spinner from '../Components/Common/Spinner';
export default function SubmitButton() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex justify-center items-center p-4 bg-[#7e57c2] text-white rounded-xl font-semibold mt-8 hover:bg-[#6a4aaa] transition-colors shadow-md cursor-pointer duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isLoading ? <Spinner /> : 'Log in'}
    </button>
  );
}
