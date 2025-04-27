import React from 'react';
import useSidebarStore from '../../../store/useSidebarStore';
import SidebarContent from './SidebarContent';
export default function MobileSidebar() {
  const { isSidebarOpen } = useSidebarStore();
  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform md:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <SidebarContent />
    </div>
  );
}
