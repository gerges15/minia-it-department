import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Course } from '../../types/course';

interface CourseTableProps {
  courses: Course[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Course Code', 'Course Name', 'Year', 'Semester', 'Credits', 'Instructor', 'Type', 'Actions'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{course.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.year}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.semester}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.credits}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.instructor}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      course.type === 'Theory'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {course.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(course.id)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onDelete(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable; 