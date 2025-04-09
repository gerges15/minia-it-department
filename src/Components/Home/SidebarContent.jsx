import React from "react";
import MobileNavToggle from "./MobileNavToggle";
import MobileSidebar from "./MobileSidebar";
import { Link, NavLink } from "react-router-dom";
import {
    FiHome, // Home
    FiCalendar, // Timetables (better fit than FaTable)
    FiEdit, // Manage (direct equivalent to FaEdit)
    FiBookOpen, // Registration Rules (good fit)
    FiClipboard, // Manage Hall/Lab (suggests managing resources/lists)
    FiUsers, // Teaching Staff / Student (common for user groups)
    FiLogOut, // Logout (standard)
    FiX,
} from "react-icons/fi";
import useSidebarStore from "../../Stores/useSidebarStore";
export default function SidebarContent() {
    const navigation = [
        { name: "Home", href: "/", icon: FiHome },
        { name: "Timetables", href: "/timetables", icon: FiCalendar },
        { name: "Manage", href: "/manage", icon: FiEdit }, // General management/editing
        { name: "Registration Rules", href: "/rules", icon: FiBookOpen },
        { name: "Manage Hall/Lab", href: "/halls-labs", icon: FiClipboard }, // Or FiBriefcase
        { name: "Teaching Staff", href: "/staff", icon: FiUsers }, // Or FiAward
        { name: "Student", href: "/students", icon: FiUsers }, // Or FiUser
        // { name: 'Student', href: '/students', icon: FaUserCog }, // If you must use FaUserCog
    ];

    const activeLinkStyle = "bg-[#ede7f6] text-[#7e57c2] font-semibold";
    const defaultLinkStyle = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    const { toggle } = useSidebarStore();

    return (
        <>
            {/* Logo/Brand Area & Close Button (Mobile) */}
            <div className="flex items-center justify-between flex-shrink-0 px-4 h-16 border-b border-gray-200">
                <h1 className="text-lg font-semibold text-[#7e57c2]">Welcome Name</h1>
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

            {/* Navigation */}
            <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        end
                        className={({ isActive }) =>
                            `group flex items-center px-3 py-2.5 text-sm rounded-md transition-colors duration-150 ease-in-out ${
                                isActive ? activeLinkStyle : defaultLinkStyle
                            }`
                        }
                        onClick={() => toggle()} // Close sidebar on mobile nav click
                    >
                        <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            {/* Optional: Footer/User section in sidebar */}
            <div className="flex-shrink-0 px-2 pt-4 pb-4 border-t border-gray-200">
                <Link
                    to="/logout" // Or handle logout via onClick
                    className={`group flex items-center px-3 py-2.5 text-sm rounded-md transition-colors duration-150 ease-in-out ${defaultLinkStyle}`}
                >
                    <FiLogOut className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                    Logout
                </Link>
            </div>
        </>
    );
}
