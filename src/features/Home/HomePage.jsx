'use clint';
import { Outlet, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import MobileNavToggle from './MobileNavToggle';
import MobileSidebar from './Sidebar/MobileSidebar';
import DesktopSidebar from './Sidebar/DesktopSidebar';
import useSidebarStore from '../../store/useSidebarStore';
import {
  FiCalendar,
  FiUsers,
  FiBook,
  FiBriefcase,
  FiPlusCircle,
  FiAlignJustify,
  FiUser,
} from 'react-icons/fi';

import { getStatistics } from '../../../api/endpoints';
import HomeWelcomeSection from './HomeWelcomSection';
import HomeStat from './HomeStat';

export default function HomePage() {
  const { isSidebarOpen, toggle } = useSidebarStore();
  const [statistics, setStatistics] = useState({});
  const currentPath = useLocation().pathname;

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };
    fetchStatistics();
  }, []);

  // mokc recent courses added
  const recentCourses = [
    {
      title: 'Software Engineering',
      updatedAt: 'Today',
      instructor: 'Mohamed Ahmed',
    },
    {
      title: 'Database Design',
      updatedAt: 'Yesterday',
      instructor: 'David Nady',
    },
    {
      title: 'Web Development',
      updatedAt: '2 days ago',
      instructor: 'Girgis Samy',
    },
    {
      title: 'Data Structures',
      updatedAt: '3 days ago',
      instructor: 'Moaz Ebrahim',
    },
  ];

  const renderMainPage = () => {
    if (currentPath === '/home')
      return (
        <div className="space-y-6">
          <HomeWelcomeSection />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <HomeStat
              color="text-blue-500"
              icon={FiUsers}
              name="Total Students"
              value={statistics.totalStudents}
            />

            <HomeStat
              color="text-green-500"
              icon={FiBook}
              name="Active Courses"
              value={statistics.totalCourses}
            />

            <HomeStat
              color="text-purple-500"
              icon={FiBriefcase}
              name="Teaching Staff"
              value={statistics.totalTeachingStaff}
            />

            <HomeStat
              color="text-orange-500"
              icon={FiCalendar}
              name="Classrooms"
              value={statistics.totalTeachingPlaces}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Courses */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recently Added / Updated Courses
                </h2>
                <FiPlusCircle className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentCourses.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {course.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Instructor: {course.instructor}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {course.updatedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <button className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors w-full">
                  Add New Course
                </button>
                <button className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors w-full">
                  Schedule Class
                </button>
                <button className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors w-full">
                  Manage Students
                </button>
                <button className="p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors w-full">
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
