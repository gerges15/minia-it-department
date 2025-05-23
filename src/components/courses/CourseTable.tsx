import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Course, CourseLevel, CourseSemester, CourseType } from '../../types/course';

interface CourseTableProps {
  courses: Course[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const getLevelName = (level: CourseLevel): string => {
  return CourseLevel[level];
};

const getSemesterName = (semester: CourseSemester): string => {
  return CourseSemester[semester];
};

const getTypeName = (type: CourseType): string => {
  return CourseType[type];
};

const CourseTable: React.FC<CourseTableProps> = ({ courses, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Code
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Name
              </th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Semester
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit Hours
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lecture Hours
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">{course.code}</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">{course.name}</td>
                <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">{getLevelName(course.level)} Year</td>
                <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">{getSemesterName(course.semester)} Semester</td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">{course.creditHours}</td>
                <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">{course.lectureHours}</td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      course.type === CourseType.Lecture
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {getTypeName(course.type)}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => onEdit(course.id)}
                      className="p-1.5 text-purple-600 hover:text-purple-900 hover:bg-purple-100 rounded-full transition-colors"
                      aria-label="Edit course"
                    >
                      <FiEdit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(course.id)}
                      className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors"
                      aria-label="Delete course"
                    >
                      <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
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