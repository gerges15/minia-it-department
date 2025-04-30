import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

// Course type enums
enum CourseType {
  Lecture = 0,
  Practical = 1,
}

interface CourseFormData {
  code: string;
  name: string;
  creditHours: number;
  level: number;
  semester: number;
  type: CourseType;
  lectureHours: number;
  dependencies?: string;
}

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourseFormData) => void;
  initialData?: CourseFormData;
  isEditing: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}) => {
  const [formData, setFormData] = useState<CourseFormData>({
    code: '',
    name: '',
    creditHours: 3,
    level: 1,
    semester: 1,
    type: CourseType.Lecture,
    lectureHours: 2,
    dependencies: '',
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData(
        initialData || {
          code: '',
          name: '',
          creditHours: 3,
          level: 1,
          semester: 1,
          type: CourseType.Lecture,
          lectureHours: 2,
          dependencies: '',
        }
      );
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: [
        'creditHours',
        'lectureHours',
        'level',
        'semester',
        'type',
      ].includes(name)
        ? Number(value)
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
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Credit Hours
            </label>
            <select
              name="creditHours"
              value={formData.creditHours}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              {[1, 2, 3].map(hours => (
                <option key={hours} value={hours}>
                  {hours} Hours
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              {[1, 2, 3, 4].map(level => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Semester
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              {[1, 2].map(semester => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              <option value={CourseType.Lecture}>Lecture</option>
              <option value={CourseType.Practical}>Practical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lecture Hours
            </label>
            <select
              name="lectureHours"
              value={formData.lectureHours}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              {[0, 1, 2].map(hours => (
                <option key={hours} value={hours}>
                  {hours} Hours
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dependencies (comma-separated course codes)
            </label>
            <input
              type="text"
              name="dependencies"
              value={formData.dependencies}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="e.g. CS101, CS102"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
