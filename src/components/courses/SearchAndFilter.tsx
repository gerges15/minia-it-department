import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  selectedSemester: string;
  onSemesterChange: (value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedSemester,
  onSemesterChange,
}) => {
  return (
    <div className="mt-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
        />
      </div>

      <div className="flex items-center gap-2">
        <FiFilter className="text-gray-400" />
        <select
          value={selectedYear}
          onChange={e => onYearChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="1">First Year</option>
          <option value="2">Second Year</option>
          <option value="3">Third Year</option>
          <option value="4">Fourth Year</option>
        </select>
      </div>

      <div>
        <select
          value={selectedSemester}
          onChange={e => onSemesterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="All">All Semesters</option>
          <option value="1">First Semester</option>
          <option value="2">Second Semester</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter;
