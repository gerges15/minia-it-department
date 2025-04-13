

import { useSelector } from 'react-redux';

export default function ErrorMsg() {
  const errorMsg = useSelector(state => state.errorMsg.value);

  return (
    <>
      {errorMsg && (
        <div className="mb-4 p-3 tracking-wide bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}
    </>
  );
}
