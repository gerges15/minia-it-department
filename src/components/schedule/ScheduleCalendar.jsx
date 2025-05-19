import React from 'react';
import { FiClock, FiUser, FiMapPin } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

const ScheduleCalendar = ({ schedules = [], filter, onScheduleClick, viewMode }) => {
  const getScheduleBlocks = (day) => {
    if (!Array.isArray(schedules)) return [];
    
    const daySchedules = schedules.flatMap(schedule => {
      if (filter.entityId && schedule.id !== filter.entityId) return [];
      
      return Array.isArray(schedule?.schedules) 
        ? schedule.schedules.filter(s => s?.day === day)
        : [];
    });

    return daySchedules.map(schedule => {
      const startHour = schedule.startFrom;
      const endHour = schedule.endTo;
      const duration = endHour - startHour;
      
      return (
        <div
          key={schedule.id}
          className="absolute bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs cursor-pointer hover:bg-blue-100 transition-colors duration-200 shadow-sm"
          style={{
            top: `${(startHour - 8) * 48}px`,
            height: `${duration * 48}px`,
            width: 'calc(100% - 8px)',
            left: '4px'
          }}
          onClick={() => onScheduleClick(schedule)}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center text-blue-700 font-medium mb-1">
              <FiClock className="mr-1" />
              <span>{startHour}:00 - {endHour}:00</span>
            </div>
            <div className="flex items-center text-gray-600">
              {viewMode === 'staff' ? (
                <>
                  <FiUser className="mr-1" />
                  <span className="truncate">{schedule.courseCode}</span>
                </>
              ) : (
                <>
                  <FiMapPin className="mr-1" />
                  <span className="truncate">{schedule.teachingAssistant}</span>
                </>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

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
            {hour}:00
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="ml-20">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {DAYS.map(day => (
            <div 
              key={day} 
              className="h-12 flex items-center justify-center font-medium text-gray-700 bg-gray-50 border-r border-gray-200 last:border-r-0 px-2"
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
              className="relative"
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

      {/* Current time indicator */}
      <div 
        className="absolute left-0 right-0 border-t-2 border-red-400 z-20 pointer-events-none"
        style={{
          top: `${((new Date().getHours() - 8) + (new Date().getMinutes() / 60)) * 48}px`
        }}
      >
        <div className="absolute -left-2 -top-2 w-3 h-3 bg-red-400 rounded-full" />
      </div>
    </div>
  );
};

export default ScheduleCalendar;


