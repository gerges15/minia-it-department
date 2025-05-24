import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import {
  getCourses,
  getCourseDependencies,
  addCourseDependencies,
  removeCourseDependencies,
} from '../../api/endpoints';
import AddDependenciesModal from '../components/courses/AddDependenciesModal';

export default function ManageDependencies() {
  // State management
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dependencies, setDependencies] = useState({ parents: [], childs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAllCourses, setIsLoadingAllCourses] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [showAddDependency, setShowAddDependency] = useState(false);
  const [selectedDependencies, setSelectedDependencies] = useState([]);
  const [dependencySearchTerm, setDependencySearchTerm] = useState('');

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const level = parseInt(selectedYear);
        const semester = selectedSemester !== 'All' ? parseInt(selectedSemester) : null;
        
        const response = await getCourses(0, level, semester);
        if (response && response.results) {
          setCourses(response.results);
        } else {
          setCourses([]);
        }
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [selectedYear, selectedSemester]);

  // Fetch all courses when opening the add dependencies modal
  useEffect(() => {
    const fetchAllCourses = async () => {
      if (!showAddDependency) return;

      try {
        setIsLoadingAllCourses(true);
        setError(null);
        
        const allCoursesData = [];
        for (let year = 1; year <= 4; year++) {
          for (let semester = 1; semester <= 2; semester++) {
            const response = await getCourses(0, year, semester);
            if (response && response.results) {
              allCoursesData.push(...response.results);
            }
          }
        }
        
        setAllCourses(allCoursesData);
      } catch (err) {
        setError('Failed to fetch all courses. Please try again later.');
      } finally {
        setIsLoadingAllCourses(false);
      }
    };

    fetchAllCourses();
  }, [showAddDependency]);

  // Fetch dependencies when a course is selected
  useEffect(() => {
    const fetchDependencies = async () => {
      if (!selectedCourse) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await getCourseDependencies(selectedCourse.id);
        if (response && response.parents && response.childs) {
          setDependencies(response);
        } else {
          setDependencies({ parents: [], childs: [] });
        }
      } catch (err) {
        setError('Failed to fetch dependencies. Please try again later.');
        setDependencies({ parents: [], childs: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDependencies();
  }, [selectedCourse]);

  // Handle dependency operations
  const handleAddDependencies = async () => {
    if (!selectedCourse || selectedDependencies.length === 0) return;

    try {
      setError(null);
      await addCourseDependencies(selectedCourse.id, selectedDependencies);
      const response = await getCourseDependencies(selectedCourse.id);
      if (response && response.parents && response.childs) {
        setDependencies(response);
      } else {
        setDependencies({ parents: [], childs: [] });
      }
      setShowAddDependency(false);
      setSelectedDependencies([]);
      setDependencySearchTerm('');
    } catch (err) {
      setError('Failed to add dependencies. Please try again later.');
    }
  };

  const handleRemoveDependencies = async (courseIds) => {
    if (!selectedCourse) return;

    try {
      setError(null);
      await removeCourseDependencies(selectedCourse.id, courseIds);
      const response = await getCourseDependencies(selectedCourse.id);
      if (response && response.parents && response.childs) {
        setDependencies(response);
      } else {
        setDependencies({ parents: [], childs: [] });
      }
    } catch (err) {
      setError('Failed to remove dependencies. Please try again later.');
    }
  };

  const handleDependencySelect = (courseId) => {
    setSelectedDependencies(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Filter courses based on search
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button
          onClick={() => setError(null)}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="sr-only">Dismiss</span>
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-3 sm:px-6 md:px-0">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Course Dependencies</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              View and manage course dependencies
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="All">All Semesters</option>
              <option value="1">First Semester</option>
              <option value="2">Second Semester</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course list */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Courses</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center text-gray-500 h-48 flex items-center justify-center">
              <p>No courses found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedCourse?.id === course.id
                      ? 'bg-purple-100 border-2 border-purple-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-gray-800">{course.code}</div>
                  <div className="text-sm text-gray-600">{course.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dependencies list */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedCourse ? `Dependencies for ${selectedCourse.code}` : 'Select a Course'}
            </h2>
            {selectedCourse && (
              <button
                onClick={() => setShowAddDependency(true)}
                className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Add Dependencies
              </button>
            )}
          </div>

          {selectedCourse ? (
            isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : dependencies.parents.length === 0 ? (
              <div className="text-center text-gray-500 h-48 flex items-center justify-center">
                <p>No dependencies found for this course.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {dependencies.parents.map((dep) => (
                  <div
                    key={dep.id}
                    className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-gray-800">{dep.code}</div>
                      <div className="text-sm text-gray-600">{dep.name}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveDependencies([dep.id])}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 h-48 flex items-center justify-center">
              <p>Select a course to view its dependencies</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Dependencies Modal */}
      <AddDependenciesModal
        isOpen={showAddDependency}
        onClose={() => {
          setShowAddDependency(false);
          setSelectedDependencies([]);
          setDependencySearchTerm('');
        }}
        onAdd={handleAddDependencies}
        allCourses={allCourses}
        isLoading={isLoadingAllCourses}
        selectedDependencies={selectedDependencies}
        onDependencySelect={handleDependencySelect}
        searchTerm={dependencySearchTerm}
        onSearchChange={setDependencySearchTerm}
        dependencies={dependencies}
        selectedCourse={selectedCourse}
      />
    </div>
  );
} 