import React, { useState, useEffect } from 'react';
import { FiCalendar } from 'react-icons/fi';

export default function AddScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  days,
  hours,
  loading,
  initialSchedule = { day: 0, startFrom: 8, endTo: 9 },
}) {
  const [schedule, setSchedule] = useState(initialSchedule);

  useEffect(() => {
    if (isOpen) {
      setSchedule(initialSchedule);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FiCalendar className="mr-2 h-5 w-5 text-purple-600" />
          Add New Schedule
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Day</label>
            <select
              value={schedule.day}
              onChange={e => setSchedule({ ...schedule, day: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              {days.map((day, idx) => (
                <option key={day} value={idx}>{day}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <select
                value={schedule.startFrom}
                onChange={e => setSchedule({ ...schedule, startFrom: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {hours.map(hour => (
                  <option key={`start-${hour}`} value={hour}>{hour}:00</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <select
                value={schedule.endTo}
                onChange={e => setSchedule({ ...schedule, endTo: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {hours.map(hour => (
                  <option key={`end-${hour}`} value={hour}>{hour}:00</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(schedule)}
            disabled={loading || schedule.startFrom >= schedule.endTo}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            Add Schedule
          </button>
        </div>
      </div>
    </div>
  );
} 