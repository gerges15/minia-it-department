import useSidebarStore from '../../../store/useSidebarStore';
import { FiX } from 'react-icons/fi';
import { useAuthStore } from '../../../store/useAuthStore';
import { getInventory } from '../../../store/usInventoryStore';
import { Token } from '../../../utils/token';
export default function SidebarHeader() {
  const inventory = getInventory();
  const decodedToken = new Token(inventory).decodeAccessToken;
  const { toggle } = useSidebarStore();

  return (
    <div className="flex items-center justify-between flex-shrink-0 px-4 h-16 border-b border-gray-200">
      <h1 className="text-lg font-semibold text-[#7e57c2] truncate">
        Hi {decodedToken.given_name} {decodedToken.family_name}
      </h1>

      {/* Close button - only visible inside the mobile overlay */}
      <button
        type="button"
        className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#7e57c2]"
        onClick={() => toggle()}
      >
        <span className="sr-only">Close sidebar</span>
        <FiX className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}
