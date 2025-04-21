import { useErrorMessageStore } from '../store/useErrorMessageStore';

export default function ErrorMsg() {
  let { errorMessage } = useErrorMessageStore();

  return (
    <>
      {errorMessage && (
        <div className="mb-4 p-3 tracking-wide bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
    </>
  );
}
