import React, { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { debounce } from 'lodash';
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
  
  // Create a debounced search handler to avoid too many API calls while typing
  const handleSearchChange = debounce((value) => {
    setLocalSearchTerm(value);
    onSearchChange(value);
  }, 500);
  
  return (
    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or ID..."
          defaultValue={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiFilter className="text-gray-400 flex-shrink-0" />
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            className="w-full sm:w-auto px-2 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            aria-label="Select level"
          >
            {Object.entries(STAFF_LEVELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedGender}
            onChange={(e) => onGenderChange(e.target.value)}
            className="w-full sm:w-auto px-2 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            aria-label="Select gender"
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
    </div>
  );
};

export default StaffFilter; 