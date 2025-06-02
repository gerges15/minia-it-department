import { Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import DesktopSidebar from './Sidebar/DesktopSidebar';
import HomeQuickStats from './HomeQuickStats';
import HomeWelcomeSection from './HomeWelcomSection';
import MobileNavToggle from './MobileNavToggle';
import MobileSidebar from './Sidebar/MobileSidebar';
import useSidebarStore from '../../store/useSidebarStore';
import RecentCourses from './RecentCourses';
import { getRole } from '../../store/useAuthStore';
import StudentHome from '../../components/students/StudentHome';
import StaffHome from '../../components/staff/StaffHome';

export default function HomePage() {
  const { isSidebarOpen, toggle } = useSidebarStore();
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();
  const role = getRole();

  const handleQuickAction = path => {
    navigate(path);
  };

  const renderMainPage = () => {
    if (currentPath === '/home') {
      switch (role) {
        case 'Admin':
          return (
            <div className="space-y-6">
              <HomeWelcomeSection />
              <HomeQuickStats />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Courses */}
                <RecentCourses />
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    <button
                      className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors w-full cursor-pointer"
                      onClick={() => handleQuickAction('/manage-courses')}
                    >
                      Add New Course
                    </button>
                    <button
                      className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors w-full cursor-pointer"
                      onClick={() => handleQuickAction('/manage-timetables')}
                    >
                      Schedule Class
                    </button>
                    <button
                      className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors w-full cursor-pointer"
                      onClick={() => handleQuickAction('/manage-students')}
                    >
                      Manage Students
                    </button>
                    <button
                      className="p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors w-full cursor-pointer"
                      onClick={() => handleQuickAction('/manage-teaching-staff')}
                    >
                      Manage Teaching Staff
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'Student':
          return <StudentHome />;
        case 'TeachingStaff':
          return <StaffHome />;
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <div className="flex h-screen w-screen bg-[#f5f5f0] overflow-hidden">
      {/* --- Mobile Sidebar Overlay --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => toggle()}
          aria-hidden="true"
        />
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
}
