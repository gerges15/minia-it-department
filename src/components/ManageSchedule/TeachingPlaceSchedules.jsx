import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiClock, FiMapPin, FiCalendar, FiSearch, FiCheck } from 'react-icons/fi';
import { Combobox } from '@headlessui/react';
import {
  getTeachingPlaces,
  getTeachingPlaceSchedules,
  addTeachingPlaceSchedules,
  removeTeachingPlaceSchedules,
} from '../../../api/endpoints';
import AddScheduleModal from './ScheduleModal';
import debounce from 'lodash/debounce';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

export default function TeachingPlaceSchedules({ teachingPlaces = [] }) {
  const [selectedPlace, setSelectedPlace] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    day: 0,
    startFrom: 8,
    endTo: 9
  });

  // Debounced search function
  const debouncedSetQuery = useCallback(
    debounce((value) => {
      setQuery(value);
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    event.target.value = value; // Update input value immediately
    debouncedSetQuery(value);
  };

  // Improved filtering logic
  const filteredPlaces = React.useMemo(() => {
    if (!query.trim()) {
      return teachingPlaces;
    }
    const searchTerm = query.toLowerCase().trim();
    return teachingPlaces.filter((place) =>
      place.name.toLowerCase().includes(searchTerm)
    );
  }, [teachingPlaces, query]);

  // Improved default selection logic
  useEffect(() => {
    if (teachingPlaces.length > 0 && !selectedPlace) {
      setSelectedPlace(teachingPlaces[0].id);
    }
  }, [teachingPlaces]);

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

  const handleSlotClick = (day, hour) => {
    // Find if there's an existing schedule at this slot
    const existingSchedule = schedules.find(s => 
      s.day === DAYS.indexOf(day) && 
      s.startFrom <= hour && 
      s.endTo > hour
    );

    if (existingSchedule) {
      setEditingSchedule(existingSchedule);
    } else {
      setEditingSchedule({
        day: DAYS.indexOf(day),
        startFrom: hour,
        endTo: hour + 1,
        location: ''
      });
    }
    setIsModalOpen(true);
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
          <div className="w-full sm:w-64">
            <Combobox value={selectedPlace} onChange={setSelectedPlace}>
              <div className="relative">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={(id) => teachingPlaces.find(place => place.id === id)?.name || ''}
                    onChange={handleSearchChange}
                    placeholder="Search places..."
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Combobox.Button>
                </div>
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredPlaces.length === 0 ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      {query.trim() ? 'Nothing found.' : 'No places available.'}
                    </div>
                  ) : (
                    filteredPlaces.map((place) => (
                      <Combobox.Option
                        key={place.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-purple-600 text-white' : 'text-gray-900'
                          }`
                        }
                        value={place.id}
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {place.name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-purple-600'
                                }`}
                              >
                                <FiCheck className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>
        </div>

        {selectedPlace && !loading && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex justify-end p-4 border-b border-gray-200">
              <button
                onClick={() => {
                  setEditingSchedule(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer"
              >
                <FiPlus className="mr-2 h-5 w-5" />
                Add Schedule
              </button>
            </div>
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
                              className="relative p-0 border-l border-gray-200 align-top h-full cursor-pointer hover:bg-green-50"
                              style={{ minWidth: 120, height: `${rowSpan * 48}px`, padding: 0 }}
                              onClick={() => handleSlotClick(day, hour)}
                            >
                              <div className="h-full w-full flex flex-col items-center justify-center bg-green-100 border border-green-300 rounded-lg p-2 text-xs text-green-900 shadow-sm min-h-0 hover:bg-green-200 transition-colors duration-150" style={{height: '100%'}}>
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
                            <td 
                              key={`${day}-${hour}`} 
                              className="px-2 py-1 border-l border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-150" 
                              style={{ minWidth: 120 }}
                              onClick={() => handleSlotClick(day, hour)}
                            >
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
      </div>

      {/* Add/Edit Schedule Modal */}
      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSchedule(null);
        }}
        onSubmit={async (schedule) => {
          setIsModalOpen(false);
          setLoading(true);
          setError(null);
          try {
            if (editingSchedule?.id) {
              // Update existing schedule
              await removeTeachingPlaceSchedules(selectedPlace, [editingSchedule.id]);
              await addTeachingPlaceSchedules(selectedPlace, [schedule]);
            } else {
              // Add new schedule
              await addTeachingPlaceSchedules(selectedPlace, [schedule]);
            }
            await fetchSchedules();
          } catch (error) {
            setError('Failed to update schedule. Please try again.');
          } finally {
            setLoading(false);
            setEditingSchedule(null);
          }
        }}
        onDelete={async (scheduleId) => {
          setIsModalOpen(false);
          setLoading(true);
          setError(null);
          try {
            await removeTeachingPlaceSchedules(selectedPlace, [scheduleId]);
            await fetchSchedules();
          } catch (error) {
            setError('Failed to delete schedule. Please try again.');
          } finally {
            setLoading(false);
            setEditingSchedule(null);
          }
        }}
        days={DAYS}
        hours={HOURS}
        loading={loading}
        initialSchedule={editingSchedule}
      />
    </div>
  );
} 