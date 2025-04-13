import { useState } from 'react';
import { Link } from 'react-router';
export default function ForgotPasswordLink() {
  const [isLoading, setIsLoading] = useState(false);
  return (
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
  );
}
