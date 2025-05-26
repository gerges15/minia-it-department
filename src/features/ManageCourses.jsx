import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import CourseTable from '../components/courses/CourseTable';
import CourseForm from '../components/courses/CourseForm';
import SearchAndFilter from '../components/courses/SearchAndFilter';
import {
  getCourses,
  editCourse,
  deleteCourses,
  addNewCourse,
  getCourseDependencies,
} from '../../api/endpoints';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageCourses() {
  // State management
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [showDependencies, setShowDependencies] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dependencies, setDependencies] = useState({ parents: [], childs: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // fetch courses on component mount and when filters change
  useEffect(() => {
    fetchCourses();
  }, [selectedYear, selectedSemester]);

  // Function to fetch courses with current filters
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Parse filters appropriately
      const level = parseInt(selectedYear);
      const semester = selectedSemester !== 'All' ? parseInt(selectedSemester) : null;
      
      const response = await getCourses(0, level, semester);
      
      if (response && response.results) {
        setCourses(response.results);
        console.log('Courses loaded:', response.results.length);
      } else {
        console.error('Unexpected response format:', response);
        setCourses([]);
      }
    } catch (err) {
      setError('Failed to fetch courses. Please try again later.');
      console.error('Error fetching courses:', err);
      toast.error('Failed to load courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Modal handlers
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setEditCourseId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditCourseId(null);
  };

  // Check if a course already exists (by code)
  const courseExists = (code, excludeId = null) => {
    return courses.some(course => 
      course.code.toLowerCase() === code.toLowerCase() && 
      course.id !== excludeId
    );
  };

  // Course CRUD operations
  const handleSubmitCourse = async formData => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Check if course code already exists
      if (courseExists(formData.code, isEditing ? editCourseId : null)) {
        toast.error(`Course with code "${formData.code}" already exists!`);
        setIsSubmitting(false);
        return;
      }

      if (isEditing && editCourseId) {
        // Prepare data for update
        const updateData = {
          id: editCourseId,
          code: formData.code,
          name: formData.name,
          creditHours: parseInt(formData.creditHours, 10),
          level: parseInt(formData.level, 10),
          semester: parseInt(formData.semester, 10),
          type: parseInt(formData.type, 10),
          lectureHours: parseInt(formData.lectureHours, 10)
        };
        
        // Call the API to update the course
        await editCourse(editCourseId, updateData);
        toast.success('Course updated successfully!');
        
        // Update local state
        setCourses(prev =>
          prev.map(course =>
            course.id === editCourseId ? {...course, ...updateData} : course
          )
        );
      } else {
        // Prepare data for new course
        const newCourseData = {
          code: formData.code,
          name: formData.name,
          creditHours: parseInt(formData.creditHours, 10),
          level: parseInt(formData.level, 10),
          semester: parseInt(formData.semester, 10),
          type: parseInt(formData.type, 10),
          lectureHours: parseInt(formData.lectureHours, 10)
        };
        
        // Call API to add new course
        const response = await addNewCourse(newCourseData);
        toast.success('Course added successfully!');
        
        // Refresh courses to get the newly added one with server-generated ID
        fetchCourses();
      }
      
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save course. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error saving course:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCourse = id => {
    const course = courses.find(c => c.id === id);
    if (course) {
      setEditCourseId(id);
      setIsEditing(true);
      setIsModalOpen(true);
    } else {
      toast.error('Course not found!');
    }
  };

  const handleDeleteCourse = async id => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        setIsLoading(true);
        // Pass an array of IDs to the deleteCourses endpoint
        await deleteCourses([id]);
        
        toast.success('Course deleted successfully!');
        setCourses(prev => prev.filter(course => course.id !== id));
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete course. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error deleting course:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewDependencies = async (courseId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const course = courses.find(c => c.id === courseId);
      if (!course) {
        toast.error('Course not found!');
        return;
      }
      
      setSelectedCourse(course);
      const response = await getCourseDependencies(courseId);
      
      if (response && (response.parents || response.childs)) {
        setDependencies({
          parents: response.parents || [],
          childs: response.childs || []
        });
      } else {
        setDependencies({ parents: [], childs: [] });
        console.log('No dependencies found or unexpected response format:', response);
      }
      
      setShowDependencies(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch dependencies. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching dependencies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // filter courses based on search and filters (course code, course name)
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 px-3 sm:px-6 md:px-0">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Error Alert */}
      {error && (
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
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Courses</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              View and manage all courses in the department
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer"
          >
            <FiPlus className="h-5 w-5 flex-shrink-0" />
            <span>Add New Course</span>
          </button>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
        />
      </div>

      {/* Table area */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 h-48 sm:h-64 flex items-center justify-center">
          <p className="text-sm sm:text-base">No courses found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <CourseTable
              courses={filteredCourses}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onViewDependencies={handleViewDependencies}
            />
          </div>
        </div>
      )}

      <CourseForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCourse}
        initialData={
          isEditing && editCourseId
            ? {
                ...courses.find(c => c.id === editCourseId),
                dependencies:
                  courses
                    .find(c => c.id === editCourseId)
                    ?.dependencies?.join(', ') || '',
              }
            : undefined
        }
        isEditing={isEditing}
        isSubmitting={isSubmitting}
      />

      {/* Dependencies Modal */}
      {showDependencies && selectedCourse && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Dependencies for {selectedCourse.code}: {selectedCourse.name}
              </h3>
              <button
                onClick={() => {
                  setShowDependencies(false);
                  setSelectedCourse(null);
                  setDependencies({ parents: [], childs: [] });
                }}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Prerequisites</h4>
                {dependencies.parents && dependencies.parents.length > 0 ? (
                  <div className="space-y-2">
                    {dependencies.parents.map((dep) => (
                      <div key={dep.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-800">{dep.code}</div>
                        <div className="text-sm text-gray-600">{dep.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No prerequisites required</p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Required For</h4>
                {dependencies.childs && dependencies.childs.length > 0 ? (
                  <div className="space-y-2">
                    {dependencies.childs.map((dep) => (
                      <div key={dep.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-800">{dep.code}</div>
                        <div className="text-sm text-gray-600">{dep.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Not a prerequisite for any course</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
