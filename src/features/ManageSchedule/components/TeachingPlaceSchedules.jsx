import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';
import {
  getTeachingPlaceSchedules,
  addTeachingPlaceSchedules,
  removeTeachingPlaceSchedules,
} from '../../../../api/endpoints';
import AddScheduleModal from '../../../components/AddScheduleModal';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

export default function TeachingPlaceSchedules({ teachingPlaces = [] }) {
  const [selectedPlace, setSelectedPlace] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    day: 0,
    startFrom: 8,
    endTo: 9
  });

  useEffect(() => {
    if (teachingPlaces.length > 0 && !selectedPlace) {
      setSelectedPlace(teachingPlaces[0].id);
    }
  }, [teachingPlaces, selectedPlace]);

  useEffect(() => {
    if (selectedPlace) {
      fetchSchedules();
    }
  }, [selectedPlace]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTeachingPlaceSchedules(selectedPlace);
      const schedulesData = Array.isArray(response) 
        ? response 
        : response.data?.items || [];
      
      const validSchedules = schedulesData.filter(schedule => 
        schedule && 
        typeof schedule.day === 'number' && 
        typeof schedule.startFrom === 'number' && 
        typeof schedule.endTo === 'number'
      );

      setSchedules(validSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError('Failed to load schedules. Please try again.');
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      await addTeachingPlaceSchedules(selectedPlace, [newSchedule]);
      await fetchSchedules();
      setIsModalOpen(false);
      setNewSchedule({ day: 0, startFrom: 8, endTo: 9 });
    } catch (error) {
      console.error('Error adding schedule:', error);
      setError('Failed to add schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSchedules = async (scheduleIds) => {
    try {
      setLoading(true);
      setError(null);
      await removeTeachingPlaceSchedules(selectedPlace, scheduleIds);
      await fetchSchedules();
    } catch (error) {
      console.error('Error removing schedules:', error);
      setError('Failed to remove schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSlotScheduled = (day, hour) => {
    return schedules.some(schedule => 
      schedule.day === DAYS.indexOf(day) && 
      schedule.startFrom <= hour && 
      schedule.endTo > hour
    );
  };

  const formatTime = (hour) => {
    return `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`;
  };

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">{error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Teaching Place Schedules</h2>
            <p className="text-sm text-gray-500 mt-1">Select a place and manage its schedule</p>
          </div>
          <select
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            className="block w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            disabled={loading}
          >
            <option value="">Select a teaching place</option>
            {teachingPlaces.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
        </div>

        {selectedPlace && !loading && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 bg-gray-50">
                      Time
                    </th>
                    {DAYS.map((day) => (
                      <th
                        key={day}
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {HOURS.map((hour, rowIdx) => (
                    <tr key={hour} style={{ height: '48px' }}>
                      <td className="sticky left-0 z-10 px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium bg-white border-r border-gray-200">
                        {formatTime(hour)}
                      </td>
                      {DAYS.map((day, colIdx) => {
                        // Find if a schedule starts at this cell
                        const schedule = schedules.find(s => s.day === colIdx && s.startFrom === hour);
                        // Find if a schedule covers this cell but doesn't start here
                        const covered = schedules.some(s => s.day === colIdx && s.startFrom < hour && s.endTo > hour);
                        if (schedule) {
                          const rowSpan = schedule.endTo - schedule.startFrom;
                          return (
                            <td
                              key={`${day}-${hour}`}
                              rowSpan={rowSpan}
                              className="relative p-0 border-l border-gray-200 align-top h-full"
                              style={{ minWidth: 120, height: `${rowSpan * 48}px`, padding: 0 }}
                            >
                              <div className="h-full w-full flex flex-col items-center justify-center bg-green-100 border border-green-300 rounded-lg p-2 text-xs text-green-900 shadow-sm min-h-0" style={{height: '100%'}}>
                                <span className="font-semibold">
                                  {formatTime(schedule.startFrom)} - {formatTime(schedule.endTo)}
                                </span>
                                {schedule.location && (
                                  <span className="flex items-center mt-1 text-green-800">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {schedule.location}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        } else if (covered) {
                          // Don't render a cell if it's covered by a rowSpan above
                          return null;
                        } else {
                          return (
                            <td key={`${day}-${hour}`} className="px-2 py-1 border-l border-gray-200 bg-gray-50" style={{ minWidth: 120 }}>
                              {/* Empty slot */}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          </div>
        )}

        {selectedPlace && !loading && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FiClock className="mr-2 h-5 w-5 text-purple-600" />
                Current Schedules
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FiPlus className="mr-2 h-5 w-5" />
                Add Schedule
              </button>
            </div>

            {schedules.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {DAYS.map((day, dayIndex) => {
                  const daySchedules = schedules.filter(schedule => schedule.day === dayIndex);
                  if (daySchedules.length === 0) return null;
                  
                  return (
                    <div key={day} className="bg-white shadow rounded-lg p-4 border border-gray-200">
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FiCalendar className="mr-2 h-5 w-5 text-purple-600" />
                        {day}
                      </h4>
                      <div className="space-y-3">
                        {daySchedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-purple-300 transition-colors duration-150"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <FiClock className="mr-2 h-4 w-4 text-purple-600" />
                                {formatTime(schedule.startFrom)} - {formatTime(schedule.endTo)}
                              </div>
                              {schedule.location && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <FiMapPin className="mr-2 h-4 w-4 text-purple-600" />
                                  {schedule.location}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveSchedules([schedule.id])}
                              disabled={loading}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 p-2 rounded-full hover:bg-red-50 transition-colors duration-150"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No schedules found for this place.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Schedule Modal */}
      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (schedule) => {
          setIsModalOpen(false);
          setLoading(true);
          setError(null);
          try {
            await addTeachingPlaceSchedules(selectedPlace, [schedule]);
            await fetchSchedules();
          } catch (error) {
            setError('Failed to add schedule. Please try again.');
          } finally {
            setLoading(false);
          }
        }}
        days={DAYS}
        hours={HOURS}
        loading={loading}
      />
    </div>
  );
} 