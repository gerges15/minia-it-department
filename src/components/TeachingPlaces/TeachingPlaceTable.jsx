import React from 'react';
import { FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';

const TeachingPlaceTable = ({ places, onEdit, onDelete, onViewSchedule }) => {
  const getTypeLabel = (type) => {
    switch (type) {
      case 0:
        return 'Hall';
      case 1:
        return 'Lab';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {places.length > 0 ? (
              places.map((place) => (
                <tr key={place.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{place.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{getTypeLabel(place.type)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{place.capacity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onViewSchedule(place)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="View Schedule"
                      >
                        <FiCalendar className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onEdit(place.id)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="Edit"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(place.id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Delete"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No teaching places found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeachingPlaceTable; 