import { useEffect, useState, useRef } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import { getTimetableByUserName } from '../../../api/endpoints';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '8:00 - 9:00',
  '9:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
];

export default function StaffTimeTableView() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const decodedToken = jwtDecode(token);
        if (!decodedToken || !decodedToken.nameid) {
          throw new Error('Invalid token format');
        }

        const userName = decodedToken.nameid;
        const response = await getTimetableByUserName(userName);
        setTimetable(response.table || {});
      } catch (error) {
        console.error('Error fetching timetable:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const getScheduleForTimeSlot = (day, timeSlot) => {
    if (!timetable || !timetable[day.toLowerCase()]) return null;
    
    const [startHour] = timeSlot.split(' - ')[0].split(':').map(Number);
    return timetable[day.toLowerCase()].find(
      schedule => schedule.startFrom === startHour
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Teaching Schedule</h1>
        <p className="text-gray-600">View your complete teaching schedule for the semester.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
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
                              {schedule.info.courseCode}
                            </div>
                            <div className="mt-1 flex items-center text-purple-600">
                              <FiMapPin className="mr-1 h-4 w-4" />
                              <span className="text-xs">{schedule.info.teachingPlace}</span>
                            </div>
                            <div className="mt-1 flex items-center text-purple-600">
                              <FiUser className="mr-1 h-4 w-4" />
                              <span className="text-xs">{schedule.info.teachingAssistant}</span>
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
        )}
      </div>
    </div>
  );
} 