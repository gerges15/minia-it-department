import React from 'react';
import { FiFilter, FiClock, FiRefreshCw, FiCalendar, FiUsers, FiMapPin } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_RANGES = [
  { label: 'Morning (8:00 - 12:00)', start: 8, end: 12 },
  { label: 'Afternoon (12:00 - 16:00)', start: 12, end: 16 },
  { label: 'Evening (16:00 - 18:00)', start: 16, end: 18 },
  { label: 'All Day (8:00 - 18:00)', start: 8, end: 18 }
];

const ScheduleFilter = ({ 
  filter, 
  setFilter, 
  viewMode, 
  entities, 
  onReset, 
  isDisabled = false,
  availableDays = [...Array(7).keys()]  // Default to all days
}) => {
  const handleDayChange = (e) => {
    const value = e.target.value;
    console.log('Day changed to:', value);
    
    // Parse the value to an integer if it's not an empty string
    const dayValue = value === '' ? '' : parseInt(value, 10);
    
    setFilter({
      day: dayValue
    });
  };

  const handleEntityChange = (e) => {
    setFilter({
      entityId: e.target.value
    });
  };

  const handleTimeRangeChange = (e) => {
    const range = TIME_RANGES.find(r => r.label === e.target.value);
    if (range) {
      setFilter({
        timeRange: {
          start: range.start,
          end: range.end
        }
      });
    }
  };

  // Get today's day index (0-6)
  const today = new Date().getDay();

  // Find the entity name based on its ID
  const getEntityName = (entityId) => {
    const entity = entities.find(e => e.id === entityId);
    if (entity) {
      if (viewMode === 'staff') {
        return entity.name || entity.userName || 'Unknown';
      } else {
        return entity.name || entity.placeId || 'Unknown';
      }
    }
    return 'Selected';
  };

  // Filter entities based on view mode
  const filteredEntities = entities.filter(entity => {
    if (viewMode === 'staff') {
      return !!entity.userName; // Only show staff entities with a username
    } else {
      return !!entity.placeId; // Only show room entities with a placeId
    }
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Day Filter */}
        <div className="relative w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Day
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-4 w-4 text-gray-500" />
            </div>
            <select
              value={filter.day === '' ? '' : filter.day}
              onChange={handleDayChange}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              disabled={isDisabled}
            >
              <option value="">All Days</option>
              {availableDays.map(dayIndex => (
                <option key={DAYS[dayIndex]} value={dayIndex}>
                  {DAYS[dayIndex]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Entity Filter (Staff/Room) */}
        <div className="relative w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {viewMode === 'staff' ? 'Teaching Staff' : 'Room'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {viewMode === 'staff' ? (
                <FiUsers className="h-4 w-4 text-gray-500" />
              ) : (
                <FiMapPin className="h-4 w-4 text-gray-500" />
              )}
            </div>
            <select
              value={filter.entityId || ''}
              onChange={handleEntityChange}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              disabled={isDisabled}
            >
              <option value="">All {viewMode === 'staff' ? 'Staff' : 'Rooms'}</option>
              {filteredEntities.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {viewMode === 'staff' 
                    ? (entity.name || entity.userName) 
                    : (entity.name || entity.placeId)
                  }
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="relative w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Range
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiClock className="h-4 w-4 text-gray-500" />
            </div>
            <select
              value={TIME_RANGES.find(r => r.start === filter.timeRange.start && r.end === filter.timeRange.end)?.label || TIME_RANGES[3].label}
              onChange={handleTimeRangeChange}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              disabled={isDisabled}
            >
              {TIME_RANGES.map(range => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 mr-2">Active filters:</span>
        {filter.day !== '' ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
            <FiCalendar className="mr-1 h-3 w-3" />
            {DAYS[filter.day]}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            <FiCalendar className="mr-1 h-3 w-3" />
            All Days
          </span>
        )}
        
        {filter.entityId ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
            {viewMode === 'staff' ? <FiUsers className="mr-1 h-3 w-3" /> : <FiMapPin className="mr-1 h-3 w-3" />}
            {viewMode === 'staff' ? 'Staff: ' : 'Room: '}
            {getEntityName(filter.entityId)}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            {viewMode === 'staff' ? <FiUsers className="mr-1 h-3 w-3" /> : <FiMapPin className="mr-1 h-3 w-3" />}
            All {viewMode === 'staff' ? 'Staff' : 'Rooms'}
          </span>
        )}
        
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
          <FiClock className="mr-1 h-3 w-3" />
          {filter.timeRange.start}:00 - {filter.timeRange.end}:00
        </span>
        
        <button
          onClick={onReset}
          className={`ml-auto inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled}
        >
          <FiRefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default ScheduleFilter; 