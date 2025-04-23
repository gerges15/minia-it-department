import React, { useState } from 'react';
import { FiRefreshCw, FiSave, FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import Modal from '../components/Common/Modal';
import ConfigurationPanel from '../components/Timetable/ConfigurationPanel';
import TimetableVersions from '../components/Timetable/TimetableVersions';
import { useTimetable } from '../hooks/useTimetable';
import { TIME_SLOTS, DAYS, CLASS_TYPES, CLASS_COLORS } from '../constants/timetable';

export default function ManageTimetable() {
  const {
    selectedYear,
    selectedSemester,
    professors,
    timetableData,
    courses,
    excludedCourses,
    excludedProfessors,
    excludedTimes,
    versions,
    selectedVersion,
    handleYearChange,
    handleSemesterChange,
    handleSaveVersion,
    handleRestoreVersion,
    handleDeleteVersion,
    handleAddCourse,
    handleAddProfessor,
    handleExcludeCourse,
    handleIncludeCourse,
    handleExcludeProfessor,
    handleIncludeProfessor,
    handleExcludeTime,
    handleIncludeTime,
    setTimetableData,
  } = useTimetable();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [editForm, setEditForm] = useState({
    course: '',
    instructor: '',
    room: '',
    type: CLASS_TYPES.THEORY,
    time: ''
  });

  const handleGenerateTimetable = async () => {
    try {
      // API call to the backend
      console.log('Generating timetable...');
      // API call delay (just for simulation)
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update timetable data with response
    } catch (error) {
      console.error('Error generating timetable:', error);
    }
  };

  const handleSaveTimetable = async () => {
    try {
      // API call to the backend
      console.log('Saving timetable...');
    } catch (error) {
      console.error('Error saving timetable:', error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4');
      
      doc.setFontSize(20);
      doc.text('Timetable', 20, 20);

      const startY = 30;
      const lineHeight = 7;
      const colWidth = 40;
      const headers = ['Day', 'Time', 'Course', 'Room', 'Instructor'];
      let currentY = startY;

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      headers.forEach((header, i) => {
        doc.text(header, 20 + (i * colWidth), currentY);
      });

      doc.setFont(undefined, 'normal');
      currentY += lineHeight;

      Object.entries(timetableData).forEach(([key, value]) => {
        const [day, time] = key.split('-');
        const row = [
          day,
          time,
          value.course || '',
          value.room || '',
          value.instructor || ''
        ];
        
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }

        row.forEach((cell, i) => {
          doc.text(cell, 20 + (i * colWidth), currentY);
        });

        currentY += lineHeight;
      });

      doc.save('timetable.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleCellClick = (day, time) => {
    const cellData = timetableData[`${day}-${time}`];
    setSelectedCell({ day, time });
    setEditForm({
      course: cellData?.course || '',
      instructor: cellData?.instructor || '',
      room: cellData?.room || '',
      type: cellData?.type || CLASS_TYPES.THEORY,
      time: time
    });
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (!selectedCell) return;

    const { day } = selectedCell;
    const oldKey = `${day}-${selectedCell.time}`;
    const newKey = `${day}-${editForm.time}`;
    
    const newData = { ...timetableData };
    
    if (oldKey !== newKey) {
      delete newData[oldKey];
    }
    
    newData[newKey] = {
      ...editForm,
      color: CLASS_COLORS[editForm.type]
    };
    
    setTimetableData(newData);
    setIsEditing(false);
    setSelectedCell(null);
  };

  const handleDelete = () => {
    if (!selectedCell) return;

    const { day, time } = selectedCell;
    const key = `${day}-${time}`;
    
    const newData = { ...timetableData };
    delete newData[key];
    
    setTimetableData(newData);
    setIsEditing(false);
    setSelectedCell(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Manage Timetable - {selectedYear} Year, {selectedSemester} Semester
        </h1>
        <div className="flex flex-wrap gap-2 md:gap-4">
          <button
            onClick={handleGenerateTimetable}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base"
          >
            <FiRefreshCw className="h-4 w-4 md:h-5 md:w-5" />
            Generate
          </button>
          <button
            onClick={handleSaveTimetable}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
          >
            <FiSave className="h-4 w-4 md:h-5 md:w-5" />
            Save
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            <FiDownload className="h-4 w-4 md:h-5 md:w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Year and Semester Selection */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {['First', 'Second', 'Third', 'Fourth'].map(year => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base ${
                selectedYear === year
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {['First', 'Second'].map(semester => (
            <button
              key={semester}
              onClick={() => handleSemesterChange(semester)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base ${
                selectedSemester === semester
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              }`}
            >
              {semester} Semester
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Versions */}
      <TimetableVersions
        versions={versions}
        onSaveVersion={handleSaveVersion}
        onRestoreVersion={handleRestoreVersion}
        onDeleteVersion={handleDeleteVersion}
      />

      {/* Configuration Panel */}
      <ConfigurationPanel
        courses={courses}
        professors={professors}
        excludedCourses={excludedCourses}
        excludedProfessors={excludedProfessors}
        excludedTimes={excludedTimes}
        onAddCourse={handleAddCourse}
        onAddProfessor={handleAddProfessor}
        onExcludeCourse={handleExcludeCourse}
        onIncludeCourse={handleIncludeCourse}
        onExcludeProfessor={handleExcludeProfessor}
        onIncludeProfessor={handleIncludeProfessor}
        onExcludeTime={handleExcludeTime}
        onIncludeTime={handleIncludeTime}
      />

      {/* Timetable Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full border-collapse timetable-table">
            <thead>
              <tr>
                <th className="border p-2 md:p-3 bg-gray-50 text-left text-xs md:text-sm font-semibold text-gray-600 sticky left-0 z-10">
                  Day / Time
                </th>
                {TIME_SLOTS.map(slot => (
                  <th
                    key={slot}
                    className="border p-2 md:p-3 bg-gray-50 text-left text-xs md:text-sm font-semibold text-gray-600 min-w-[120px] md:min-w-[150px]"
                  >
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(day => (
                <tr key={day}>
                  <td className="border p-2 md:p-3 font-medium text-xs md:text-sm text-gray-900 sticky left-0 bg-white z-10">
                    {day}
                  </td>
                  {TIME_SLOTS.map(slot => {
                    const cellData = timetableData[`${day}-${slot}`];
                    return (
                      <td
                        key={`${day}-${slot}`}
                        onClick={() => handleCellClick(day, slot)}
                        className={`border p-2 md:p-3 ${cellData?.color || ''} transition-colors hover:bg-gray-50 cursor-pointer`}
                      >
                        {cellData ? (
                          <div className="text-xs md:text-sm">
                            <div className="font-medium text-gray-900">{cellData.course}</div>
                            <div className="text-gray-600">{cellData.instructor}</div>
                            <div className="text-gray-500">{cellData.room}</div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-center"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Edit Class Schedule</h2>
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700">Time</label>
              <select
                value={editForm.time}
                onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs md:text-sm"
              >
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700">Course</label>
              <input
                type="text"
                value={editForm.course}
                onChange={(e) => setEditForm(prev => ({ ...prev, course: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs md:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700">Instructor</label>
              <input
                type="text"
                value={editForm.instructor}
                onChange={(e) => setEditForm(prev => ({ ...prev, instructor: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs md:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700">Room</label>
              <input
                type="text"
                value={editForm.room}
                onChange={(e) => setEditForm(prev => ({ ...prev, room: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs md:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700">Type</label>
              <select
                value={editForm.type}
                onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs md:text-sm"
              >
                <option value={CLASS_TYPES.THEORY}>Theory</option>
                <option value={CLASS_TYPES.LAB}>Lab</option>
              </select>
            </div>
          </div>
          <div className="mt-4 md:mt-6 flex justify-between">
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 md:px-4 md:py-2 border border-red-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              Delete
            </button>
            <div className="flex space-x-2 md:space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-3 py-1.5 md:px-4 md:py-2 border border-transparent rounded-md shadow-sm text-xs md:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
} 