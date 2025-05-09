import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ScheduleForm = ({ viewMode, onSubmit, onClose, isTimeSlotForm = false, initialData = null }) => {
  const [formData, setFormData] = useState(
    isTimeSlotForm
      ? {
          day: 0,
          startFrom: 8,
          endTo: 9
        }
      : {
          identifier: '' // userName or placeId
        }
  );

  useEffect(() => {
    if (initialData && isTimeSlotForm) {
      setFormData({
        day: initialData.day || 0,
        startFrom: initialData.startFrom || 8,
        endTo: initialData.endTo || 9
      });
    }
  }, [initialData, isTimeSlotForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isTimeSlotForm && initialData?.id) {
      onSubmit(initialData.id, formData);
    } else {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'day' || name === 'startFrom' || name === 'endTo' 
        ? parseInt(value) 
        : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isTimeSlotForm ? 'Add Time Slot' : `Add New ${viewMode === 'staff' ? 'Staff' : 'Room'}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isTimeSlotForm ? (
            // Staff/Room Form
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {viewMode === 'staff' ? 'User Name' : 'Room ID'}
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          ) : (
            // Time Slot Form
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day
                </label>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  {DAYS.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <select
                    name="startFrom"
                    value={formData.startFrom}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    {Array.from({ length: 11 }, (_, i) => i + 8).map(hour => (
                      <option key={hour} value={hour}>
                        {hour}:00
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <select
                    name="endTo"
                    value={formData.endTo}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    {Array.from({ length: 11 }, (_, i) => i + 9).map(hour => (
                      <option key={hour} value={hour}>
                        {hour}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiSave />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm; 