import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiTrash2 } from 'react-icons/fi';

export default function AddScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  days,
  hours,
  loading,
  initialSchedule = null,
}) {
  const defaultSchedule = {
    day: 0,
    startFrom: 8,
    endTo: 9
  };

  const [schedule, setSchedule] = useState(defaultSchedule);
  const isEditing = Boolean(initialSchedule?.id);

  useEffect(() => {
    if (isOpen) {
      setSchedule(initialSchedule || defaultSchedule);
    }
  }, [isOpen, initialSchedule]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(schedule);
  };

  const handleDelete = () => {
    if (isEditing && onDelete) {
      onDelete(initialSchedule.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FiCalendar className="mr-2 h-5 w-5 text-purple-600" />
          {isEditing ? 'Edit Schedule' : 'Add New Schedule'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day
            </label>
            <select
              value={schedule.day}
              onChange={(e) => setSchedule({ ...schedule, day: parseInt(e.target.value) })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              {days.map((day, index) => (
                <option key={day} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <select
                value={schedule.startFrom}
                onChange={(e) => setSchedule({ ...schedule, startFrom: parseInt(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                {hours.map((hour) => (
                  <option key={`start-${hour}`} value={hour}>
                    {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <select
                value={schedule.endTo}
                onChange={(e) => setSchedule({ ...schedule, endTo: parseInt(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                {hours.map((hour) => (
                  <option key={`end-${hour}`} value={hour}>
                    {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <FiTrash2 className="inline-block mr-2 h-4 w-4" />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Schedule' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 