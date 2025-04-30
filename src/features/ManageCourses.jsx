import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import CourseTable from '../components/courses/CourseTable';
import CourseForm from '../components/courses/CourseForm';
import SearchAndFilter from '../components/courses/SearchAndFilter';
import { getCourses } from '../../api/endpoints';

export default function ManageCourses() {
  // State management
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);

  // fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const theCourses = await getCourses();
        const data = await theCourses.results;

        setCourses(data);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error('Error fetching courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

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

  // Course CRUD operations
  const handleSubmitCourse = async formData => {
    try {
      setError(null);
      if (isEditing && editCourseId) {
        // todo: replace with the API call
        // await fetch(`/api/courses/${editCourseId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        const updatedCourse = {
          ...formData,
          id: editCourseId,
          dependencies: formData.dependencies
            ? formData.dependencies.split(',').map(d => d.trim())
            : [],
        };
        setCourses(prev =>
          prev.map(course =>
            course.id === editCourseId ? updatedCourse : course
          )
        );
      } else {
        // todo: replace with the API call
        // const response = await fetch('/api/courses', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        // const newCourse = await response.json();
        const newCourse = {
          ...formData,
          id: Date.now(), // temp id until API real one
          dependencies: formData.dependencies
            ? formData.dependencies.split(',').map(d => d.trim())
            : [],
        };
        setCourses(prev => [...prev, newCourse]);
      }
      handleCloseModal();
    } catch (err) {
      setError('Failed to save course. Please try again later.');
      console.error('Error saving course:', err);
    }
  };

  const handleEditCourse = id => {
    const course = courses.find(c => c.id === id);
    if (course) {
      setEditCourseId(id);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteCourse = async id => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        // todo: replace with the API call
        // await fetch(`/api/courses/${id}`, { method: 'DELETE' });
        setCourses(prev => prev.filter(course => course.id !== id));
      } catch (err) {
        setError('Failed to delete course. Please try again later.');
        console.error('Error deleting course:', err);
      }
    }
  };

  // filter courses based on search and filters (course code, course name)
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear =
      selectedYear === 'All' || course.level === parseInt(selectedYear);
    const matchesSemester =
      selectedSemester === 'All' ||
      course.semester === parseInt(selectedSemester);
    return matchesSearch && matchesYear && matchesSemester;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Courses</h1>
            <p className="text-gray-600 mt-1">
              View and manage all courses in the department
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiPlus className="h-5 w-5" />
            Add New Course
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

      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
          No courses found matching your criteria.
        </div>
      ) : (
        <CourseTable
          courses={filteredCourses}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
        />
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
      />
    </div>
  );
}
