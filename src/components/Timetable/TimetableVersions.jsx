import React, { useState } from 'react';
import { FiSave, FiClock, FiTrash2, FiRotateCcw } from 'react-icons/fi';

const TimetableVersions = ({ 
  versions, 
  onSaveVersion, 
  onRestoreVersion, 
  onDeleteVersion 
}) => {
  const [newVersionName, setNewVersionName] = useState('');

  const handleSaveNewVersion = () => {
    if (newVersionName.trim()) {
      onSaveVersion(newVersionName.trim());
      setNewVersionName('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Timetable Versions</h2>
        <div className="flex flex-col md:flex-row gap-2 md:space-x-2">
          <input
            type="text"
            value={newVersionName}
            onChange={(e) => setNewVersionName(e.target.value)}
            placeholder="Version name"
            className="px-3 py-1 border rounded-md text-sm w-full md:w-auto"
          />
          <button
            onClick={handleSaveNewVersion}
            className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 self-end md:self-auto"
          >
            <FiSave className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {versions.length === 0 ? (
          <p className="text-sm md:text-base text-gray-500 text-center py-4">No saved versions yet</p>
        ) : (
          versions.map((version) => (
            <div
              key={version.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-3">
                <FiClock className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                <div>
                  <h3 className="text-sm md:text-base font-medium text-gray-900">{version.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500">
                    {new Date(version.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRestoreVersion(version.id)}
                  className="p-1 md:p-2 text-green-600 hover:text-green-700"
                  title="Restore this version"
                >
                  <FiRotateCcw className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <button
                  onClick={() => onDeleteVersion(version.id)}
                  className="p-1 md:p-2 text-red-600 hover:text-red-700"
                  title="Delete this version"
                >
                  <FiTrash2 className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimetableVersions; 