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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Desktop view - full table */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Name
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
          <tbody className="bg-white divide-y divide-gray-200">
            {staff && staff.length > 0 ? (
              staff.map((member, index) => (
                <tr key={member.id || member.userName || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.userName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.firstName || ''} {member.lastName || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getGenderLabel(member.gender)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getLevelLabel(member.level)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(member.dateOfBirth)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onEdit(member)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit staff member"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(member)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete staff member"
                      >
                        <FiTrash2 className="h-5 w-5" />
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
      </div>

      {/* Mobile view - card layout */}
      <div className="md:hidden">
        {staff && staff.length > 0 ? (
          staff.map((member, index) => (
            <div 
              key={member.id || member.userName || index} 
              className="border-b border-gray-200 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">
                    {member.firstName || ''} {member.lastName || ''}
                  </h3>
                  <p className="text-sm text-gray-500">{member.userName || 'N/A'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(member)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Edit staff member"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(member)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Delete staff member"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="text-gray-500">Gender:</div>
                <div>{getGenderLabel(member.gender)}</div>
                
                <div className="text-gray-500">Level:</div>
                <div>{getLevelLabel(member.level)}</div>
                
                <div className="text-gray-500">Date of Birth:</div>
                <div>{formatDate(member.dateOfBirth)}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No teaching staff found
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffTable;
