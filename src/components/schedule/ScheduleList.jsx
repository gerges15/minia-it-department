import React from 'react';
import { FiTrash2, FiPlus, FiClock, FiEdit2, FiUser, FiMapPin, FiCalendar } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ScheduleList = ({ 
  schedules, 
  viewMode, 
  onAdd, 
  onAddTimeSlot, 
  onEditTimeSlot, 
  onDeleteTimeSlot 
}) => {
  const formatTime = (hour) => {
    return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
  };

  const getScheduleColor = (day) => {
    const colors = {
      0: 'bg-red-50 border-red-200', // Sunday
      1: 'bg-blue-50 border-blue-200', // Monday
      2: 'bg-green-50 border-green-200', // Tuesday
      3: 'bg-yellow-50 border-yellow-200', // Wednesday
      4: 'bg-purple-50 border-purple-200', // Thursday
      5: 'bg-pink-50 border-pink-200', // Friday
      6: 'bg-indigo-50 border-indigo-200', // Saturday
    };
    return colors[day] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        <FiPlus className="w-5 h-5" />
        Add New {viewMode === 'staff' ? 'Staff' : 'Room'}
      </button>

      <div className="space-y-6">
        {schedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No schedules found. Add a new {viewMode === 'staff' ? 'staff member' : 'room'} to get started.
          </div>
        ) : (
          schedules.map(schedule => (
            <div key={schedule.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  {viewMode === 'staff' ? (
                    <FiUser className="text-blue-500" />
                  ) : (
                    <FiMapPin className="text-green-500" />
                  )}
                  <h3 className="font-medium text-gray-900">
                    {viewMode === 'staff' ? schedule.userName : schedule.placeId}
                  </h3>
                </div>
                <button
                  onClick={() => onAddTimeSlot(schedule.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Time Slot
                </button>
              </div>
              
              <div className="p-4 space-y-3">
                {schedule.schedules.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No time slots scheduled
                  </div>
                ) : (
                  schedule.schedules.map(timeSlot => (
                    <div
                      key={timeSlot.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${getScheduleColor(timeSlot.day)}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiCalendar className="w-4 h-4" />
                          <span className="font-medium">{DAYS[timeSlot.day]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiClock className="w-4 h-4" />
                          <span>
                            {formatTime(timeSlot.startFrom)} - {formatTime(timeSlot.endTo)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditTimeSlot(schedule.id, timeSlot)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit time slot"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTimeSlot(schedule.id, timeSlot.id)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete time slot"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleList; 