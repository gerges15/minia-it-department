import React from 'react';
import { FiClock } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

const ScheduleCalendar = ({ schedules = [], filter, onScheduleClick }) => {
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
          className="absolute bg-blue-100 border border-blue-200 rounded p-1 text-xs cursor-pointer hover:bg-blue-200"
          style={{
            top: `${(startHour - 8) * 40}px`,
            height: `${duration * 40}px`,
            width: 'calc(100% - 2px)',
            left: '1px'
          }}
          onClick={() => onScheduleClick(schedule)}
        >
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{startHour}:00 - {endHour}:00</span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="relative">
      {/* Spacer to align with day headers */}
      <div className="ml-16 h-10" />

      {/* Time column */}
      <div className="absolute top-20 left-0 w-16">
        {HOURS.map(hour => (
          <div key={hour} className="h-10 text-sm text-gray-500 flex items-center justify-end pr-2">
            {hour}:00
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="ml-16">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Day headers */}
          {DAYS.map(day => (
            <div key={day} className="bg-white p-2 text-center font-medium h-10">
              {day}
            </div>
          ))}

          {/* Time slots */}
          {DAYS.map((_, dayIndex) => (
            <div key={dayIndex} className="relative bg-white" style={{ height: '440px' }}>
              {getScheduleBlocks(dayIndex)}
              {HOURS.map(hour => (
                <div
                  key={hour}
                  className="border-t border-gray-100"
                  style={{ height: '40px' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
