import React from 'react';
import { Student, Gender, Level } from '../../types/student';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

const getGenderText = (gender: Gender): string => {
  switch (gender) {
    case Gender.Male:
      return 'Male';
    case Gender.Female:
      return 'Female';
    default:
      return 'Other';
  }
};

const getLevelText = (level: Level): string => {
  switch (level) {
    case Level.First:
      return '1st Year';
    case Level.Second:
      return '2nd Year';
    case Level.Third:
      return '3rd Year';
    case Level.Fourth:
      return '4th Year';
    default:
      return 'Unknown';
  }
};

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onEdit,
  onDelete,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Username
            </th>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
          <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gender
            </th>
          <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Level
            </th>
          <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date of Birth
            </th>
          <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
      <tbody className="bg-white divide-y divide-gray-200">
          {students.map(student => (
            <tr key={student.id} className="hover:bg-gray-50">
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                {student.userName}
              </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {`${student.firstName} ${student.lastName}`}
              </td>
            <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                {getGenderText(student.gender)}
              </td>
            <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                {getLevelText(student.level)}
              </td>
            <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                {student.dateOfBirth}
              </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
              <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => onEdit(student)}
                  className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition-colors"
                  aria-label="Edit student"
                >
                  <FiEdit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(student)}
                  className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors"
                  aria-label="Delete student"
                  >
                  <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  );
};

export default StudentTable;
