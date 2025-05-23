import React, { useState, useEffect } from 'react';
import { FiX, FiClock, FiCalendar, FiLoader } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i);

const ScheduleForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isTimeSlotForm = true, 
  initialData = null, 
  viewMode = 'staff',
  isSaving = false
}) => {
  const [formData, setFormData] = useState(
    isTimeSlotForm ? {
      day: 1, // Monday
      startFrom: 8,
      endTo: 10,
      entityId: initialData?.id || ''
    } : {
      identifier: ''
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
          id: initialData.id || undefined // Keep existing ID for edits
        });
      } else {
        setFormData({
          identifier: initialData.identifier || ''
        });
      }
    } else {
      // Reset to defaults
      if (isTimeSlotForm) {
        setFormData({
          day: 1,
          startFrom: 8,
          endTo: 10,
          entityId: ''
        });
      } else {
        setFormData({
          identifier: ''
        });
      }
    }
  }, [initialData, isTimeSlotForm, isOpen]);

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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'identifier' ? value : parseInt(value, 10)
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
                    {DAYS.map((day, index) => (
                      <option key={day} value={index}>
                        {day}
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
            </>
          ) : (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {viewMode === 'staff' ? 'Staff ID' : 'Room ID'}
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                disabled={isSaving}
                required
              />
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
              )}
            </div>
          )}

          {Object.keys(errors).length > 0 && isTimeSlotForm && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              {Object.entries(errors).map(([key, message]) => (
                key !== 'identifier' && (
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