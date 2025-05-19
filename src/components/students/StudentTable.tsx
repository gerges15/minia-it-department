import React from 'react';
import { Student, Gender, Level } from '../../types/student';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onViewSchedule: (student: Student) => void;
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
      return 'First Year';
    case Level.Second:
      return 'Second Year';
    case Level.Third:
      return 'Third Year';
    case Level.Fourth:
      return 'Fourth Year';
    default:
      return 'Unknown';
  }
};

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onEdit,
  onDelete,
  onViewSchedule,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gender
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date of Birth
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map(student => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {student.userName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {`${student.firstName} ${student.lastName}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getGenderText(student.gender)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getLevelText(student.level)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {student.dateOfBirth}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(student)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onViewSchedule(student)}
                    className="text-green-600 hover:text-green-900"
                  >
                    View Schedule
                  </button>
                  <button
                    onClick={() => onDelete(student)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
