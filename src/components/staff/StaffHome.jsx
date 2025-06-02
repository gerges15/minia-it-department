import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiBook, FiClock, FiUser } from 'react-icons/fi';
import { getUserSchedules, getStatistics } from '../../../api/endpoints';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function StaffHome() {
  const [schedules, setSchedules] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalHours: 0,
    upcomingClasses: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accessToken');
        const decodedToken = jwtDecode(token);
        const userName = decodedToken.userName;

        // Fetch staff schedules
        const schedulesResponse = await getUserSchedules(userName);
        setSchedules(schedulesResponse || []);

        // Fetch statistics
        const statsResponse = await getStatistics();
        setStats(statsResponse || {
          totalCourses: 0,
          totalHours: 0,
          upcomingClasses: 0
        });
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchData();
  }, []);

  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Here's an overview of your teaching schedule and progress.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiBook className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <FiClock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalHours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <FiCalendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Classes</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.upcomingClasses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {schedules.length > 0 ? (
              schedules.map((schedule, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{schedule.courseName}</p>
                    <p className="text-sm text-gray-600">{schedule.time} - {schedule.place}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {schedule.duration} hours
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No classes scheduled for today</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <button
              className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors w-full cursor-pointer flex items-center"
              onClick={() => handleQuickAction('/timetables')}
            >
              <FiCalendar className="mr-3 h-5 w-5" />
              View Full Timetable
            </button>
            <button
              className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors w-full cursor-pointer flex items-center"
              onClick={() => handleQuickAction('/staff-profile')}
            >
              <FiUser className="mr-3 h-5 w-5" />
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 