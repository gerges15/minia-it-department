import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchAndFilter = ({ searchTerm, onSearchChange, selectedType, onTypeChange }) => {
  return (
    <div className="mt-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="w-full sm:w-48">
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
        >
          <option value="All">All Types</option>
          <option value="0">Hall</option>
          <option value="1">Lab</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter; 