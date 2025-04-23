import React, { useState } from 'react';
import { FiPlus, FiX, FiCheck, FiChevronDown, FiChevronRight, FiClock } from 'react-icons/fi';

const ConfigurationPanel = ({ 
  courses, 
  professors, 
  excludedCourses, 
  excludedProfessors,
  excludedTimes,
  onAddCourse,
  onAddProfessor,
  onExcludeCourse,
  onExcludeProfessor,
  onIncludeCourse,
  onIncludeProfessor,
  onExcludeTime,
  onIncludeTime
}) => {
  const [newCourse, setNewCourse] = useState('');
  const [newProfessor, setNewProfessor] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    courses: false,
    professors: false,
    times: false
  });

  const timeSlots = [
    '8:00 - 9:00',
    '9:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-900">Timetable Configuration</h2>
      
      {/* Courses Section */}
      <div className="space-y-4">
        <div 
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 cursor-pointer"
          onClick={() => toggleSection('courses')}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Courses</h3>
            <span className="text-gray-500">
              {expandedSections.courses ? <FiChevronDown className="h-4 w-4 md:h-5 md:w-5" /> : <FiChevronRight className="h-4 w-4 md:h-5 md:w-5" />}
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:space-x-2">
            <input
              type="text"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              placeholder="Add new course"
              className="px-3 py-1 border rounded-md text-sm w-full md:w-auto"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (newCourse.trim()) {
                  onAddCourse(newCourse.trim());
                  setNewCourse('');
                }
              }}
              className="p-1 text-green-600 hover:text-green-700 self-end md:self-auto"
            >
              <FiPlus className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
        
        {expandedSections.courses && (
          <div className="space-y-2 pl-4">
            {courses.map(course => (
              <div key={course} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm md:text-base text-gray-700">{course}</span>
                <button
                  onClick={() => 
                    excludedCourses.includes(course) 
                      ? onIncludeCourse(course)
                      : onExcludeCourse(course)
                  }
                  className={`p-1 rounded-full ${
                    excludedCourses.includes(course)
                      ? 'text-green-600 hover:text-green-700'
                      : 'text-red-600 hover:text-red-700'
                  }`}
                >
                  {excludedCourses.includes(course) ? (
                    <FiCheck className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <FiX className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Professors Section */}
      <div className="space-y-4">
        <div 
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 cursor-pointer"
          onClick={() => toggleSection('professors')}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Professors</h3>
            <span className="text-gray-500">
              {expandedSections.professors ? <FiChevronDown className="h-4 w-4 md:h-5 md:w-5" /> : <FiChevronRight className="h-4 w-4 md:h-5 md:w-5" />}
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:space-x-2">
            <input
              type="text"
              value={newProfessor}
              onChange={(e) => setNewProfessor(e.target.value)}
              placeholder="Add new professor"
              className="px-3 py-1 border rounded-md text-sm w-full md:w-auto"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (newProfessor.trim()) {
                  onAddProfessor(newProfessor.trim());
                  setNewProfessor('');
                }
              }}
              className="p-1 text-green-600 hover:text-green-700 self-end md:self-auto"
            >
              <FiPlus className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
        
        {expandedSections.professors && (
          <div className="space-y-2 pl-4">
            {professors.map(professor => (
              <div key={professor} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm md:text-base text-gray-700">{professor}</span>
                <button
                  onClick={() => 
                    excludedProfessors.includes(professor)
                      ? onIncludeProfessor(professor)
                      : onExcludeProfessor(professor)
                  }
                  className={`p-1 rounded-full ${
                    excludedProfessors.includes(professor)
                      ? 'text-green-600 hover:text-green-700'
                      : 'text-red-600 hover:text-red-700'
                  }`}
                >
                  {excludedProfessors.includes(professor) ? (
                    <FiCheck className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <FiX className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Time Slots Section */}
      <div className="space-y-4">
        <div 
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 cursor-pointer"
          onClick={() => toggleSection('times')}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Time Slots</h3>
            <span className="text-gray-500">
              {expandedSections.times ? <FiChevronDown className="h-4 w-4 md:h-5 md:w-5" /> : <FiChevronRight className="h-4 w-4 md:h-5 md:w-5" />}
            </span>
          </div>
        </div>
        
        {expandedSections.times && (
          <div className="space-y-2 pl-4">
            {timeSlots.map(time => (
              <div key={time} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <FiClock className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                  <span className="text-sm md:text-base text-gray-700">{time}</span>
                </div>
                <button
                  onClick={() => 
                    excludedTimes.includes(time)
                      ? onIncludeTime(time)
                      : onExcludeTime(time)
                  }
                  className={`p-1 rounded-full ${
                    excludedTimes.includes(time)
                      ? 'text-green-600 hover:text-green-700'
                      : 'text-red-600 hover:text-red-700'
                  }`}
                >
                  {excludedTimes.includes(time) ? (
                    <FiCheck className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <FiX className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPanel; 