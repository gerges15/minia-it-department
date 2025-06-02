import { useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { getUserSchedules } from '../../../api/endpoints';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const TIME_SLOTS = [
  '8:00 - 9:30',
  '9:45 - 11:15',
  '11:30 - 13:00',
  '13:30 - 15:00',
  '15:15 - 16:45',
  '17:00 - 18:30',
];

export default function StaffTimeTableView() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = Cookies.get('accessToken');
        const decodedToken = jwtDecode(token);
        const userName = decodedToken.userName;

        const response = await getUserSchedules(userName);
        setSchedules(response || []);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const getScheduleForTimeSlot = (day, timeSlot) => {
    return schedules.find(
      schedule => schedule.day === day && schedule.time === timeSlot
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Teaching Schedule</h1>
        <p className="text-gray-600">View your complete teaching schedule for the semester.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              {DAYS.map(day => (
                <th
                  key={day}
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {TIME_SLOTS.map(timeSlot => (
              <tr key={timeSlot}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {timeSlot}
                </td>
                {DAYS.map(day => {
                  const schedule = getScheduleForTimeSlot(day, timeSlot);
                  return (
                    <td
                      key={`${day}-${timeSlot}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {schedule ? (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="font-medium text-purple-700">
                            {schedule.courseName}
                          </div>
                          <div className="mt-1 flex items-center text-purple-600">
                            <FiMapPin className="mr-1 h-4 w-4" />
                            <span className="text-xs">{schedule.place}</span>
                          </div>
                          <div className="mt-1 flex items-center text-purple-600">
                            <FiClock className="mr-1 h-4 w-4" />
                            <span className="text-xs">{schedule.duration} hours</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 