import React from 'react';
import { FiClock, FiUser, FiMapPin, FiBook, FiFileText } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

const ScheduleCalendar = ({ schedules = [], filter, onScheduleClick, viewMode }) => {
  // Format time for display
  const formatTimeDisplay = (hour) => {
    return hour < 12 ? `${hour}:00 AM` : hour === 12 ? `${hour}:00 PM` : `${hour - 12}:00 PM`;
  };

  // Extract all schedule entries across entities for a specific day
  const getScheduleBlocks = (day) => {
    if (!Array.isArray(schedules) || schedules.length === 0) return [];
    
    // Flatten all schedules for the given day
    const allSchedules = [];
    
    // Process schedules differently based on whether we're viewing all entities or a specific one
    if (filter.entityId) {
      // If a specific entity is selected, only process that entity's schedules
      const selectedEntity = schedules.find(entity => entity.id === filter.entityId);
      
      if (selectedEntity && Array.isArray(selectedEntity.schedules)) {
        selectedEntity.schedules
          .filter(s => s.day === day)
          .forEach(schedule => {
            allSchedules.push({
              ...schedule,
              entityName: selectedEntity.name,
              entityId: selectedEntity.id,
              userName: selectedEntity.userName || '',
              placeId: selectedEntity.placeId || '',
              courseCode: schedule.courseCode || '',
              location: schedule.location || '',
              notes: schedule.notes || ''
            });
          });
      }
    } else {
      // If no specific entity is selected, process schedules from all entities
      schedules.forEach(entity => {
        if (Array.isArray(entity.schedules)) {
          entity.schedules
            .filter(s => s.day === day)
            .forEach(schedule => {
              allSchedules.push({
                ...schedule,
                entityName: entity.name,
                entityId: entity.id,
                userName: entity.userName || '',
                placeId: entity.placeId || '',
                courseCode: schedule.courseCode || '',
                location: schedule.location || '',
                notes: schedule.notes || ''
              });
            });
        }
      });
    }
    
    console.log(`Day ${day} (${DAYS[day]}) has ${allSchedules.length} schedules`);
    
    // Create UI blocks for each schedule
    return allSchedules.map(schedule => {
      const startHour = schedule.startFrom;
      const endHour = schedule.endTo;
      const duration = endHour - startHour;
      
      // Skip if outside the time range filter
      if (filter.timeRange) {
        const { start, end } = filter.timeRange;
        if (endHour <= start || startHour >= end) return null;
      }
      
      // Determine colors based on entity type
      const colors = {
        text: viewMode === 'staff' ? 'text-blue-700' : 'text-green-700',
        bg: viewMode === 'staff' ? 'bg-blue-50 hover:bg-blue-100 border-blue-200' : 'bg-green-50 hover:bg-green-100 border-green-200'
      };
      
      return (
        <div
          key={schedule.id}
          className={`absolute ${colors.bg} border rounded-lg p-2 text-xs cursor-pointer transition-colors duration-200 shadow-sm`}
          style={{
            top: `${(startHour - 8) * 48}px`,
            height: `${duration * 48}px`,
            width: 'calc(100% - 8px)',
            left: '4px'
          }}
          onClick={() => onScheduleClick(schedule)}
        >
          <div className="flex flex-col h-full">
            <div className={`flex items-center ${colors.text} font-medium mb-1`}>
              <FiClock className="mr-1" />
              <span>{formatTimeDisplay(startHour)} - {formatTimeDisplay(endHour)}</span>
            </div>
            
            {/* Course Code */}
            {schedule.courseCode && (
              <div className="flex items-center text-gray-800 font-medium mb-1">
                <FiBook className="mr-1" />
                <span className="truncate">{schedule.courseCode}</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-600">
              {viewMode === 'staff' ? (
                <>
                  <FiUser className="mr-1" />
                  <span className="truncate">{schedule.entityName || schedule.userName || 'Unknown'}</span>
                </>
              ) : (
                <>
                  <FiMapPin className="mr-1" />
                  <span className="truncate">{schedule.entityName || schedule.placeId || 'Unknown'}</span>
                </>
              )}
            </div>
            
            {/* Location */}
            {schedule.location && (
              <div className="mt-1 text-gray-600 text-xs flex items-center">
                <FiMapPin className="mr-1" />
                <span className="truncate">{schedule.location}</span>
              </div>
            )}
            
            {/* Notes */}
            {schedule.notes && (
              <div className="mt-1 text-gray-500 text-xs flex items-center">
                <FiFileText className="mr-1" />
                <span className="truncate">{schedule.notes}</span>
              </div>
            )}
          </div>
        </div>
      );
    }).filter(Boolean); // Remove nulls from filtered schedules
  };
  
  // Check if we have any data to display
  const hasScheduleData = schedules.some(entity => 
    entity.schedules && entity.schedules.length > 0
  );
  
  return (
    <div className="relative bg-white rounded-lg overflow-hidden">
      {/* Time column */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gray-50 border-r border-gray-200 z-10">
        <div className="h-12" /> {/* Spacer for day headers */}
        {HOURS.map(hour => (
          <div 
            key={hour} 
            className="h-12 text-sm text-gray-500 flex items-center justify-end pr-2 border-b border-gray-100"
          >
            {formatTimeDisplay(hour)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="ml-20">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {DAYS.map((day, index) => (
            <div 
              key={day} 
              className={`h-12 flex items-center justify-center font-medium px-2
                ${filter.day === index 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-50 text-gray-700'} 
                border-r border-gray-200 last:border-r-0`}
            >
              <span className="truncate">{day}</span>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-7 divide-x divide-gray-200">
          {DAYS.map((_, dayIndex) => (
            <div 
              key={dayIndex} 
              className={`relative ${filter.day === dayIndex ? 'bg-blue-50' : ''}`}
              style={{ height: '528px' }} // 11 hours * 48px
            >
              {getScheduleBlocks(dayIndex)}
              {HOURS.map(hour => (
                <div
                  key={hour}
                  className="border-b border-gray-100"
                  style={{ height: '48px' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Current time indicator - only show if day filter matches today */}
      {(filter.day === '' || filter.day === new Date().getDay()) && (
        <div 
          className="absolute left-20 right-0 border-t-2 border-red-400 z-20 pointer-events-none"
          style={{
            top: `${((new Date().getHours() - 8) + (new Date().getMinutes() / 60)) * 48 + 12}px`,
            left: filter.day === '' ? `calc(${new Date().getDay() * 14.28}% + 20px)` : '20px',
            width: filter.day === '' ? '14.28%' : 'calc(100% - 20px)'
          }}
        >
          <div className="absolute -left-2 -top-2 w-3 h-3 bg-red-400 rounded-full" />
        </div>
      )}
      
      {/* Empty state message when no schedules */}
      {!hasScheduleData && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-30">
          <div className="text-center p-4 max-w-md">
            <p className="text-gray-500">
              {filter.entityId 
                ? 'No schedules found for the selected entity.' 
                : 'No schedules found. Add schedules to start tracking.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar; 