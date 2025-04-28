import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import {
  Course,
  CourseLevel,
  CourseSemester,
  CourseType,
} from '../../types/course';

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Omit<Course, 'id'>) => void;
  initialData?: Omit<Course, 'id'>;
  isEditing: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
    code: '',
    name: '',
    level: CourseLevel.First,
    semester: CourseSemester.First,
    creditHours: 0,
    lectureHours: 0,
    type: CourseType.Lecture,
  },
  isEditing,
}) => {
  const [formData, setFormData] = useState<Omit<Course, 'id'>>({
    code: '',
    name: '',
    level: CourseLevel.First,
    semester: CourseSemester.First,
    creditHours: 0,
    lectureHours: 0,
    type: CourseType.Lecture,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'creditHours' || name === 'lectureHours'
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <FiX className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Edit Course' : 'Add New Course'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Course Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Course Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700"
              >
                Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {Object.values(CourseLevel)
                  .filter(value => typeof value === 'number')
                  .map(level => (
                    <option key={level} value={level}>
                      {CourseLevel[level as number]} Year
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium text-gray-700"
              >
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {Object.values(CourseSemester)
                  .filter(value => typeof value === 'number')
                  .map(semester => (
                    <option key={semester} value={semester}>
                      {CourseSemester[semester as number]} Semester
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="creditHours"
                className="block text-sm font-medium text-gray-700"
              >
                Credit Hours
              </label>
              <input
                type="number"
                id="creditHours"
                name="creditHours"
                value={formData.creditHours}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="lectureHours"
                className="block text-sm font-medium text-gray-700"
              >
                Lecture Hours
              </label>
              <input
                type="number"
                id="lectureHours"
                name="lectureHours"
                value={formData.lectureHours}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Course Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {Object.values(CourseType)
                  .filter(value => typeof value === 'number')
                  .map(type => (
                    <option key={type} value={type}>
                      {CourseType[type as number]}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {isEditing ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
