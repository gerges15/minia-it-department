import React, { useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { getCoursesByLevelAndSemester } from '../../../api/endpoints';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  selectedSemester: string;
  onSemesterChange: (value: string) => void;
  onCoursesLoaded: (courses: any[]) => void;
  setIsLoading: (loading: boolean) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedSemester,
  onSemesterChange,
  onCoursesLoaded,
  setIsLoading,
}) => {
  // Function to fetch courses
  const fetchCourses = async (search: string) => {
    try {
      setIsLoading(true);
      const level = parseInt(selectedYear);
      const semester = selectedSemester !== 'All' ? parseInt(selectedSemester) : 0;
      
      const response = await getCoursesByLevelAndSemester(level, semester, search);
      if (response && response.results) {
        onCoursesLoaded(response.results);
      }
    } catch (error) {
      console.error('Error searching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Always fetch courses, whether search term is empty or not
      fetchCourses(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedYear, selectedSemester]);

  return (
    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 transition-colors text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiFilter className="text-gray-400 flex-shrink-0" />
          <select
            value={selectedYear}
            onChange={e => onYearChange(e.target.value)}
            className="w-full sm:w-auto px-2 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
            aria-label="Select year"
          >
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedSemester}
            onChange={e => onSemesterChange(e.target.value)}
            className="w-full sm:w-auto px-2 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
            aria-label="Select semester"
          >
            <option value="All">All</option>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
