import React from 'react';
import { FiCalendar, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function ManageTimetable() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Timetable</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
          <FiPlus /> Add New Schedule
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Sunday
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  9:00 AM - 10:30 AM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Data Structures
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Room 101
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit2 />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 