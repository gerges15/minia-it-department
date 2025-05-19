import React from 'react';
import { FiFilter, FiClock, FiRefreshCw } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_RANGES = [
  { label: 'Morning (8:00 - 12:00)', start: 8, end: 12 },
  { label: 'Afternoon (12:00 - 16:00)', start: 12, end: 16 },
  { label: 'Evening (16:00 - 18:00)', start: 16, end: 18 },
  { label: 'All Day (8:00 - 18:00)', start: 8, end: 18 }
];

const ScheduleFilter = ({ filter, setFilter, viewMode, entities, onReset }) => {
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

  const handleTimeRangeChange = (e) => {
    const range = TIME_RANGES.find(r => r.label === e.target.value);
    if (range) {
      setFilter(prev => ({
        ...prev,
        timeRange: {
          start: range.start,
          end: range.end
        }
      }));
    }
  };

  // Get today's day index (0-6)
  const today = new Date().getDay();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-500" />
          <h2 className="text-lg font-medium">Filter Schedules</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Day Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day
          </label>
          <select
            value={filter.day === '' ? today : filter.day}
            onChange={handleDayChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Days</option>
            {DAYS.map((day, index) => (
              <option key={day} value={index}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Entity Filter (Staff/Room) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            value={TIME_RANGES.find(r => r.start === filter.timeRange.start && r.end === filter.timeRange.end)?.label || TIME_RANGES[3].label}
            onChange={handleTimeRangeChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {TIME_RANGES.map(range => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filter.day !== '' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {DAYS[filter.day]}
          </span>
        )}
        {filter.entityId && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {viewMode === 'staff' ? 'Staff Selected' : 'Room Selected'}
          </span>
        )}
        {filter.timeRange.start !== 8 || filter.timeRange.end !== 18 ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <FiClock className="mr-1" />
            {filter.timeRange.start}:00 - {filter.timeRange.end}:00
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ScheduleFilter; 