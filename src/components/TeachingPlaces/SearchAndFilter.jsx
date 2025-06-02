import React, { useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { getTeachingPlacesByName, getTeachingPlaces } from '../../../api/endpoints';

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  onPlacesLoaded,
  setIsLoading,
}) => {
  // Function to fetch teaching places
  const fetchPlaces = async (search) => {
    try {
      setIsLoading(true);
      const type = selectedType !== 'All' ? parseInt(selectedType) : 0;
      
      let response;
      if (search.trim() === '') {
        // If search is empty, get all places
        response = await getTeachingPlaces();
      } else {
        // If search has text, use the search endpoint
        response = await getTeachingPlacesByName(0, type, search);
      }
      
      if (response && response.results) {
        onPlacesLoaded(response.results);
      }
    } catch (error) {
      console.error('Error searching teaching places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPlaces(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedType]);

  return (
    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search teaching places..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-colors text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiFilter className="text-gray-400 flex-shrink-0" />
          <select
            value={selectedType}
            onChange={e => onTypeChange(e.target.value)}
            className="w-full sm:w-auto px-2 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
            aria-label="Select type"
          >
            <option value="All">All Types</option>
            <option value="0">Lecture Hall</option>
            <option value="1">Lab</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter; 