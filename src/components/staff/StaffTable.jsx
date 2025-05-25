import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { STAFF_LEVELS, GENDER_OPTIONS } from '../../types/staff';

const StaffTable = ({ staff, onEdit, onDelete }) => {
  // Helper function to safely get values
  const getGenderLabel = (gender) => {
    return GENDER_OPTIONS[gender] || 'Unknown';
  };

  const getLevelLabel = (level) => {
    return STAFF_LEVELS[level] || 'Unknown Level';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            User Name
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
        {staff && staff.length > 0 ? (
          staff.map((member, index) => (
            <tr key={member.id || member.userName || index} className="hover:bg-gray-50">
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                {member.userName || 'N/A'}
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {member.firstName || ''} {member.lastName || ''}
              </td>
              <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                {getGenderLabel(member.gender)}
              </td>
              <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                {getLevelLabel(member.level)}
              </td>
              <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                {formatDate(member.dateOfBirth)}
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => onEdit(member)}
                    className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition-colors"
                    aria-label="Edit staff member"
                  >
                    <FiEdit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(member)}
                    className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Delete staff member"
                  >
                    <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
              No teaching staff found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StaffTable;
