import { FiLogOut } from 'react-icons/fi';
import { useLogoutModalStore } from '../../../store/useLogoutModalStore';
import LogoutModal from '../../../components/Modal';

export default function SidebarLogoutBtn() {
  const defaultBtnStyle = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
  const { openModal } = useLogoutModalStore();
  return (
    <div className="flex-shrink-0 px-2 pt-4 pb-4 border-t border-gray-200">
      <button
        onClick={openModal}
        className={`group flex items-center px-3 py-2.5 text-sm rounded-md transition-colors duration-150 ease-in-out cursor-pointer w-full ${defaultBtnStyle}`}
      >
        <FiLogOut className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
        Logout
      </button>
      <LogoutModal />
    </div>
  );
}
