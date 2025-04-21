import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

export default function SidebarLogoutBtn() {
  const defaultLinkStyle =
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

  return (
    <div className="flex-shrink-0 px-2 pt-4 pb-4 border-t border-gray-200">
      <Link
        to="/logout"
        className={`group flex items-center px-3 py-2.5 text-sm rounded-md transition-colors duration-150 ease-in-out ${defaultLinkStyle}`}
      >
        <FiLogOut className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
        Logout
      </Link>
    </div>
  );
}
