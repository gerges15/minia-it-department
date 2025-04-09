import SidebarContent from "./SidebarContent";

export default function DesktopSidebar() {
    return (
        <div className="hidden md:flex md:flex-col md:w-64">
            <div className="flex flex-col flex-grow bg-white overflow-y-auto border-r border-gray-200">
                <SidebarContent />
            </div>
        </div>
    );
}
