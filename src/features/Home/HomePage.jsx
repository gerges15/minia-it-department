import { FiPlusCircle } from 'react-icons/fi';
import { Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DesktopSidebar from './Sidebar/DesktopSidebar';
import HomeQuickStats from './HomeQuickStats';
import HomeWelcomeSection from './HomeWelcomSection';
import MobileNavToggle from './MobileNavToggle';
import MobileSidebar from './Sidebar/MobileSidebar';
import useSidebarStore from '../../store/useSidebarStore';
import useRecentCoursesStore from '../../store/useRecentCoursesStore';

export default function HomePage() {
  const { isSidebarOpen, toggle } = useSidebarStore();
  const { recentCourses } = useRecentCoursesStore();
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Just a short loading state for UI smoothness
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleQuickAction = path => {
    navigate(path);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderMainPage = () => {
    if (currentPath === '/home')
      return (
        <div className="space-y-6">
          <HomeWelcomeSection />
          <HomeQuickStats />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Courses */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recently Added / Updated Courses
                </h2>
                <FiPlusCircle
                  className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={() => handleQuickAction('/manage-courses')}
                />
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading courses...</p>
                  </div>
                ) : recentCourses.length > 0 ? (
                  recentCourses.map((course, index) => (
                    <div
                      key={course.id || index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleQuickAction('/manage-courses')}
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {course.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Code: {course.code}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Updated {formatDate(course.updatedAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No recent courses found
                  </div>
                )}
              </div>
            </div>

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
