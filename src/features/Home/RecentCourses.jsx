import { FiPlusCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getStatistics } from '../../../api/endpoints';
import { useNavigate } from 'react-router-dom';

export default function RecentCourses() {
  const [recentCourses, setRecentCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        setStatistics(data);
        setRecentCourses(data.recentlyAddedCourses);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };
    fetchStatistics();
  }, []);

  const handleQuickAction = path => {
    navigate(path);
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recently Added Courses
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
                {console.log(statistics.recentlyAddedCourses)}
                <p className="font-medium text-gray-900">{course.name}</p>
                <p className="text-sm text-gray-500">Code: {course.code}</p>
              </div>

              <div className="text-right">
                <p className="text-xs m-1 text-black-500">
                  Level: {course.level}
                </p>
                <p className="text-xs mb-1 text-gray-500">
                  {course.creditHours} credit Hours
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
  );
}
