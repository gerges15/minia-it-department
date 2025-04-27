import React from 'react';
import { FiX } from 'react-icons/fi';
import { CourseFormData } from '../../types/course';

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: CourseFormData) => void;
  initialData?: CourseFormData;
  isEditing: boolean;
}

const defaultFormData: CourseFormData = {
  code: '',
  name: '',
  year: 'First',
  semester: 'First',
  credits: 3,
  instructor: '',
  prerequisites: '',
  type: 'Theory',
};

const CourseForm: React.FC<CourseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = defaultFormData,
  isEditing,
}) => {
  const [formData, setFormData] = React.useState<CourseFormData>(initialData);

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value) : value,
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            name="code"
            placeholder="Course Code"
            value={formData.code}
            onChange={handleInputChange}
            className="input"
            required
          />
          <input
            name="name"
            placeholder="Course Name"
            value={formData.name}
            onChange={handleInputChange}
            className="input"
            required
          />
          <input
            name="instructor"
            placeholder="Instructor"
            value={formData.instructor}
            onChange={handleInputChange}
            className="input"
            required
          />
          <input
            name="prerequisites"
            placeholder="Prerequisites (comma separated)"
            value={formData.prerequisites}
            onChange={handleInputChange}
            className="input"
          />
          <div className="flex gap-2">
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="flex-1 input"
              required
            >
              {['First', 'Second', 'Third', 'Fourth'].map((y) => (
                <option key={y} value={y}>
                  {y} Year
                </option>
              ))}
            </select>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              className="flex-1 input"
              required
            >
              {['First', 'Second'].map((s) => (
                <option key={s} value={s}>
                  {s} Semester
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              name="credits"
              type="number"
              min={1}
              value={formData.credits}
              onChange={handleInputChange}
              className="flex-1 input"
              placeholder="Credits"
              required
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="flex-1 input"
              required
            >
              <option value="Theory">Theory</option>
              <option value="Lab">Lab</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            {isEditing ? 'Update Course' : 'Add Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm; 