import React from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import SidebarLogoutBtn from './SidebarLogoutBtn';

export default function SidebarContent() {
  return (
    <>
      <SidebarHeader />
      <SidebarNavigation />
      <SidebarLogoutBtn />
    </>
  );
}
