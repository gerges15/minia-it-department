import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import MobileNavToggle from "../Components/Home/MobileNavToggle";
import MobileSidebar from "../Components/Home/MobileSidebar";
import DesktopSidebar from "../Components/Home/DesktopSidebar";
import useSidebarStore from "../store/useSidebarStore";

export default function HomePage() {
    const { isSidebarOpen, toggle } = useSidebarStore();
    const currentPath = useLocation().pathname;
    console.log("current in home page")
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
                <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => toggle()} aria-hidden="true" />
            )}

            {/* Mobile Sidebar panel */}
            <MobileSidebar />

            {/* --- Static Sidebar for Desktop --- */}
            <DesktopSidebar />

            {/* --- Main Content Area --- */}
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                {/* Top bar for mobile nav toggle */}
                <MobileNavToggle />

                <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 md:p-10">
                    {renderMainPage()}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

