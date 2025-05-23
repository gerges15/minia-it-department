import React, { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { STAFF_LEVELS, GENDER_OPTIONS } from '../../types/staff';

const StaffFilter = ({
  searchTerm,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  selectedGender,
  onGenderChange
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  const handleSearch = () => {
    onSearchChange(localSearchTerm);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleTeachingLecturerFilter = () => {
    // Set level to 7 which is Teaching Lecturer
    onLevelChange('7');
  };
  
  const handleTeachingAssistantFilter = () => {
    // Set level to 6 which is Teaching Assistant  
    onLevelChange('6');
  };
  
  const clearFilters = () => {
    onLevelChange('');
    onGenderChange('');
    setLocalSearchTerm('');
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
          <button 
            onClick={handleSearch}
            className="absolute inset-y-0 right-0 px-3 flex items-center bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-r-md"
          >
            Search
          </button>
        </div>

        <div>
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
          >
            <option value="">All Levels</option>
            {Object.entries(STAFF_LEVELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedGender}
            onChange={(e) => onGenderChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
          >
            <option value="">All Genders</option>
            {Object.entries(GENDER_OPTIONS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2 flex-wrap">
        <button 
          onClick={handleTeachingLecturerFilter}
          className={`px-3 py-1 text-sm rounded-full ${selectedLevel === '7' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        >
          Teaching Lecturers
        </button>
        <button 
          onClick={handleTeachingAssistantFilter}
          className={`px-3 py-1 text-sm rounded-full ${selectedLevel === '6' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        >
          Teaching Assistants
        </button>
        <button 
          onClick={clearFilters}
          className="px-3 py-1 text-sm rounded-full bg-red-100 hover:bg-red-200 text-red-700 ml-auto"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default StaffFilter; 