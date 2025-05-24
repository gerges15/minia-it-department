import React, { useState, useEffect } from 'react';
import { FiX, FiClock, FiCalendar, FiLoader, FiBook, FiMapPin, FiFileText } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i);

const ScheduleForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isTimeSlotForm = true, 
  initialData = null, 
  viewMode = 'staff',
  isSaving = false,
  existingEntities = [],
  availableDays = [...Array(7).keys()] // Default to all days
}) => {
  const [formData, setFormData] = useState(
    isTimeSlotForm ? {
      day: 1, // Monday
      startFrom: 8,
      endTo: 10,
      entityId: initialData?.id || '',
      courseCode: '',
      location: '',
      notes: ''
    } : {
      identifier: '',
      firstName: '',
      lastName: '',
      name: ''
    }
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize form data based on initialData when form opens
    if (initialData) {
      if (isTimeSlotForm) {
        setFormData({
          day: initialData.day || 1,
          startFrom: initialData.startFrom || 8,
          endTo: initialData.endTo || 10,
          entityId: initialData.id || '',
          id: initialData.id || undefined, // Keep existing ID for edits
          courseCode: initialData.courseCode || '',
          location: initialData.location || '',
          notes: initialData.notes || ''
        });
      } else {
        setFormData({
          identifier: initialData.identifier || '',
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || '',
          name: initialData.name || ''
        });
      }
    } else {
      // Reset to defaults
      if (isTimeSlotForm) {
        setFormData({
          day: availableDays.length > 0 ? availableDays[0] : 1,
          startFrom: 8,
          endTo: 10,
          entityId: '',
          courseCode: '',
          location: '',
          notes: ''
        });
      } else {
        setFormData({
          identifier: '',
          firstName: '',
          lastName: '',
          name: ''
        });
      }
    }
  }, [initialData, isTimeSlotForm, isOpen, availableDays]);

  const validateForm = () => {
    const newErrors = {};
    
    if (isTimeSlotForm) {
      if (formData.startFrom >= formData.endTo) {
        newErrors.timeRange = 'End time must be after start time';
      }

      if (formData.endTo - formData.startFrom > 8) {
        newErrors.duration = 'Time slot cannot exceed 8 hours';
      }
    } else {
      if (!formData.identifier.trim()) {
        newErrors.identifier = `${viewMode === 'staff' ? 'Staff ID' : 'Room ID'} is required`;
      }
      
      if (viewMode === 'staff') {
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
      } else {
        if (!formData.name.trim()) {
          newErrors.name = 'Room name is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && !isSaving) {
      if (isTimeSlotForm) {
        onSubmit(formData.entityId, formData);
      } else {
        onSubmit(formData);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle number fields versus string fields
    const numberFields = ['startFrom', 'endTo', 'day'];
    const newValue = numberFields.includes(name) ? parseInt(value, 10) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user makes changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const formatTime = (hour) => {
    return hour === 12 ? '12:00 PM' :
           hour === 0 ? '12:00 AM' :
           hour < 12 ? `${hour}:00 AM` : 
           `${hour - 12}:00 PM`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4"
      onClick={isSaving ? null : onClose}
    >
      <div 
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
            {isTimeSlotForm ? 
              (initialData && initialData.id ? 'Edit Time Slot' : 'Add Time Slot') : 
              `Add ${viewMode === 'staff' ? 'Staff Member' : 'Room'}`
            }
          </h2>
          {!isSaving && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isTimeSlotForm ? (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Day
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isSaving}
                  >
                    {availableDays.map(dayIndex => (
                      <option key={DAYS[dayIndex]} value={dayIndex}>
                        {DAYS[dayIndex]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Start Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="startFrom"
                      value={formData.startFrom}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      disabled={isSaving}
                    >
                      {TIME_SLOTS.map(hour => (
                        <option key={`start-${hour}`} value={hour}>
                          {formatTime(hour)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    End Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="endTo"
                      value={formData.endTo}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      disabled={isSaving}
                    >
                      {TIME_SLOTS.map(hour => (
                        <option key={`end-${hour}`} value={hour}>
                          {formatTime(hour)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Course Code Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Course Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBook className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    placeholder="e.g., CS101"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              {/* Location Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Room 101"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              {/* Notes Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Notes
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FiFileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional information..."
                    rows={3}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Form fields for adding staff or room */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  {viewMode === 'staff' ? 'Username' : 'Room ID'}
                </label>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  disabled={isSaving}
                  required
                  placeholder={viewMode === 'staff' ? 'e.g., john.doe' : 'e.g., LAB101'}
                />
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
                )}
              </div>
              
              {viewMode === 'staff' ? (
                <>
                  {/* First Name and Last Name fields for Staff */}
                  <div className="grid grid-cols-2 gap-4">
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
                        disabled={isSaving}
                        required
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
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
                        disabled={isSaving}
                        required
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Room Name field for Rooms */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Room Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      disabled={isSaving}
                      required
                      placeholder="Computer Lab 101"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {Object.keys(errors).length > 0 && isTimeSlotForm && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              {Object.entries(errors).map(([key, message]) => (
                key !== 'identifier' && key !== 'firstName' && key !== 'lastName' && key !== 'name' && (
                  <p key={key} className="text-sm text-red-600">
                    {message}
                  </p>
                )
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={isSaving}
            >
              {isSaving && <FiLoader className="animate-spin h-4 w-4" />}
              {isTimeSlotForm ? 
                (initialData && initialData.id ? 'Update' : 'Add') : 
                `Add ${viewMode === 'staff' ? 'Staff' : 'Room'}`
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm; 