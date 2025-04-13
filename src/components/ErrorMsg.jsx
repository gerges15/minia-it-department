import { useState } from 'react';
export default function ErrorMsg() {
  const [error, setError] = useState('');
  return (
    <>
      {error && (
        <div className="mb-4 p-3 tracking-wide bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </>
  );
}
