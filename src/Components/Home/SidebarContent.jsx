import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FiHome, FiCalendar, FiBook, FiUsers, FiBriefcase, FiGrid, FiLogOut, FiX } from "react-icons/fi";
import useSidebarStore from "../../store/useSidebarStore";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function SidebarContent() {
    const activeLinkStyle = "bg-[#ede7f6] text-[#7e57c2] font-semibold";
    const defaultLinkStyle = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    const { toggle } = useSidebarStore();

    let decodedToken = null;
    let role = null;
    let userName = "User";

    try {
        const token = Cookies.get("access_token");
        if (token) {
            decodedToken = jwtDecode(token);
            role = decodedToken?.role;
        }
    } catch (error) {
        console.error("Error decoding token:", error);
        window.location.href = "/login";
    }

    const adminNavigation = [
        { name: "Home", href: "/", icon: FiHome },
        { name: "Manage Timetables", href: "/manage-timetables", icon: FiCalendar },
        { name: "Manage Courses", href: "/manage-courses", icon: FiBook },
        { name: "Manage Students", href: "/manage-students", icon: FiUsers },
        { name: "Manage Teaching Places", href: "/manage-places", icon: FiBriefcase },
    ];

    const teachingStaffNavigation = [
        { name: "Home", href: "/", icon: FiHome },
        { name: "View Timetable", href: "/timetables", icon: FiCalendar },
    ];

    const studentsNavigation = [
        { name: "Home", href: "/", icon: FiHome },
        { name: "View Timetable", href: "/timetables", icon: FiCalendar },
    ];

    let navigation = [];
    switch (role) {
        case "Admin":
            navigation = adminNavigation;
            break;
        case "TeachingStaff":
            navigation = teachingStaffNavigation;
            break;
        case "Student":
            navigation = studentsNavigation;
            break;
        default:
            navigation = [{ name: "Home", href: "/", icon: FiHome }];
            break;
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0 px-4 h-16 border-b border-gray-200">
                <h1 className="text-lg font-semibold text-[#7e57c2] truncate">Welcome, {userName}</h1>
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
            <nav className="mt-5 flex-1 px-2 space-y-1 overflow-y-auto">
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
                        onClick={() => toggle()}
                    >
                        <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="flex-shrink-0 px-2 pt-4 pb-4 border-t border-gray-200">
                <Link
                    to="/logout"
                    className={`group flex items-center px-3 py-2.5 text-sm rounded-md transition-colors duration-150 ease-in-out ${defaultLinkStyle}`}
                >
                    <FiLogOut className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                    Logout
                </Link>
            </div>
        </>
    );
}
