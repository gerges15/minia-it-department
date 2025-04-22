import { logout } from '../services/auth';
import { useLogoutModalStore } from '../store/useLogoutModalStore';
import { useNavigate } from 'react-router';
export default function LogoutModal() {
  const { isOpen, closeModal } = useLogoutModalStore();
  const navigate = useNavigate();
  const handelConfirm = async () => {
    try {
      await logout();
      closeModal();
      navigate('/');
    } catch {
      console.error('Logout error:', err);
    }
  };

  if (isOpen) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black 
     opacity-75  z-50"
      >
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>

          <p className="mb-6">Are you sure you want to logout?</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={handelConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Yes
            </button>

            <button
              onClick={closeModal}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
