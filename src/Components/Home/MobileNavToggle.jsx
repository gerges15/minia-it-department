import React from "react";
import { FiMenu } from "react-icons/fi";
import useSidebarStore from "../../Stores/useSidebarStore";

export default function MobileNavToggle() {
    const { toggle } = useSidebarStore();
    return (
        <div className="relative z-10 flex-shrink-0 h-16 bg-white shadow-sm flex items-center px-4 md:hidden">
            <button
                type="button"
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#7e57c2]"
                onClick={() => toggle()}
            >
                <span className="sr-only">Open sidebar</span>
                <FiMenu className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>
    );
}
