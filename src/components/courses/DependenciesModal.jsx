import React from 'react';

export default function DependenciesModal({
  isOpen,
  onClose,
  onAdd,
  allCourses,
  isLoading,
  selectedDependencies,
  onDependencySelect,
  searchTerm,
  onSearchChange,
  dependencies,
  selectedCourse,
}) {
  if (!isOpen) return null;

  // Filter available dependencies based on search and current dependencies
  const availableDependencies = allCourses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotAlreadyDependency = !dependencies.parents.some(dep => dep.id === course.id);
    const isNotSelectedCourse = course.id !== selectedCourse?.id;
    return matchesSearch && isNotAlreadyDependency && isNotSelectedCourse;
  });

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Dependencies</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : allCourses.length === 0 ? (
            <div className="text-center text-gray-500 h-48 flex items-center justify-center">
              <p>Loading courses...</p>
            </div>
          ) : availableDependencies.length === 0 ? (
            <div className="text-center text-gray-500 h-48 flex items-center justify-center">
              <p>No courses available to add as dependencies.</p>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              {availableDependencies.map((course) => (
                <div
                  key={course.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDependencies.includes(course.id)
                      ? 'bg-purple-100 border-2 border-purple-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => onDependencySelect(course.id)}
                >
                  <div className="font-medium text-gray-800">{course.code}</div>
                  <div className="text-sm text-gray-600">{course.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Year {course.level}, Semester {course.semester}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={selectedDependencies.length === 0}
              className={`px-4 py-2 rounded-lg ${
                selectedDependencies.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
              }`}
            >
              Add Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 