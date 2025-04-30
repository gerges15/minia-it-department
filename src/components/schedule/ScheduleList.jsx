import React from 'react';
import { FiTrash2, FiPlus, FiClock, FiEdit2 } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ScheduleList = ({ schedules, viewMode, onDelete, onAdd, onEdit, onAddTimeSlot, onEditTimeSlot, onDeleteTimeSlot }) => {
  const formatTime = (hour) => {
    return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        <FiPlus />
        Add New {viewMode === 'staff' ? 'Staff' : 'Room'}
      </button>

      <div className="space-y-4">
        {schedules.map(schedule => (
          <div key={schedule.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">
                {viewMode === 'staff' ? schedule.userName : schedule.placeId}
              </h3>
              <button
                onClick={() => onAddTimeSlot(schedule.id)}
                className="text-green-500 hover:text-green-600"
              >
                <FiPlus />
              </button>
            </div>
            
            <div className="space-y-2">
              {schedule.schedules.map(timeSlot => (
                <div
                  key={timeSlot.id}
                  className="flex items-center justify-between gap-2 bg-white p-2 rounded border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <FiClock className="text-gray-500" />
                    <span className="font-medium">{DAYS[timeSlot.day]}</span>
                    <span className="text-gray-600">
                      {formatTime(timeSlot.startFrom)} - {formatTime(timeSlot.endTo)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditTimeSlot(schedule.id, timeSlot)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onDeleteTimeSlot(schedule.id, timeSlot.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleList; 