import React from 'react';
import { FiFilter } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ScheduleFilter = ({ filter, setFilter, viewMode, entities }) => {
  const handleDayChange = (e) => {
    setFilter(prev => ({
      ...prev,
      day: e.target.value === '' ? '' : parseInt(e.target.value)
    }));
  };

  const handleEntityChange = (e) => {
    setFilter(prev => ({
      ...prev,
      entityId: e.target.value
    }));
  };

  // Get today's day index (0-6)
  const today = new Date().getDay();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="text-gray-500" />
        <h2 className="text-lg font-medium">Filter Schedules</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Day Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Day
          </label>
          <select
            value={filter.day === '' ? today : filter.day}
            onChange={handleDayChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {DAYS.map((day, index) => (
              <option key={day} value={index}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Entity Filter (Staff/Room) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {viewMode === 'staff' ? 'Teaching Staff' : 'Room'}
          </label>
          <select
            value={filter.entityId || ''}
            onChange={handleEntityChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All {viewMode === 'staff' ? 'Staff' : 'Rooms'}</option>
            {entities.map(entity => (
              <option key={entity.id} value={entity.id}>
                {viewMode === 'staff' ? entity.userName : entity.placeId}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFilter; 