import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { STAFF_LEVELS, GENDER_OPTIONS } from '../../types/staff';

const StaffForm = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 0,
    level: 7, // Default to Teaching Lecturer
    dateOfBirth: '',
    password: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        gender: initialData.gender || 0,
        level: initialData.level || 7,
        dateOfBirth: initialData.dateOfBirth || '',
        password: '',
      });
    } else {
      // Reset form to defaults for new staff
      setFormData({
        firstName: '',
        lastName: '',
        gender: 0,
        level: 7,
        dateOfBirth: '',
        password: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Staff Member' : 'Add Staff Member'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                required
              >
                {Object.entries(GENDER_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                required
              >
                {Object.entries(STAFF_LEVELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required={!isEditing}
              placeholder={isEditing ? "Leave empty to keep current password" : ""}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;
