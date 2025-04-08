import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
// Added FiMenu for hamburger icon and FiX for close icon
import { FiHome, FiCompass, FiSettings, FiLogOut, FiBarChart2, FiMenu, FiX } from "react-icons/fi";
import MobileNavToggle from "../Components/Home/MobileNavToggle";
import MobileSidebar from "../Components/Home/MobileSidebar";
import SidebarContent from "../Components/Home/SidebarContent";
import DesktopSidebar from "../Components/Home/DesktopSidebar";

const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control mobile sidebar
    const currentPath = useLocation().pathname;

    const renderMainPage = () => {
        if (currentPath === "/")
            return (
                <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">hello world this is the main</h1>
                </>
            );
    };

    return (
        <div className="flex h-screen w-screen bg-[#f5f5f0] overflow-hidden">
            {/* --- Mobile Sidebar Overlay --- */}
            {/* Background overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Sidebar panel */}
            <MobileSidebar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />

            {/* --- Static Sidebar for Desktop --- */}
            <DesktopSidebar setIsSidebarOpen={setIsSidebarOpen} />

            {/* --- Main Content Area --- */}
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                {/* Top bar for mobile nav toggle */}
                <MobileNavToggle setIsSidebarOpen={setIsSidebarOpen} />

                <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 md:p-10">
                    {/* The Outlet component renders the matched child route's element */}
                    {renderMainPage()}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default HomePage;
