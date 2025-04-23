import React, { useState, useRef } from 'react';
import { FiRefreshCw, FiSave, FiDownload, FiCalendar, FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from '../components/Common/Modal';
import ConfigurationPanel from '../components/Timetable/ConfigurationPanel';

export default function ManageTimetable() {
  const [selectedYear, setSelectedYear] = useState('First');
  const timeSlots = [
    '8:00 - 9:00',
    '9:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
  ];

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // This will come from the API
  const [timetableData, setTimetableData] = useState({
    'Sunday-8:00 - 9:00': {
      course: 'COMP401',
      instructor: 'Mohamed Ahmed',
      room: 'H103',
      color: 'bg-yellow-100',
    },
    'Sunday-9:00 - 10:00': {
      course: 'COMP405',
      instructor: 'Moaz Ebrahim',
      room: 'H202',
      color: 'bg-yellow-100',
    },
    'Sunday-15:00 - 16:00': {
      course: 'COMP434',
      instructor: 'David Nady',
      room: 'H103',
      color: 'bg-yellow-100',
    },
    'Sunday-16:00 - 17:00': {
      course: 'COMP404',
      instructor: 'Girgis Samy',
      room: 'Lap3',
      color: 'bg-blue-100',
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [editForm, setEditForm] = useState({
    course: '',
    instructor: '',
    room: '',
    type: 'theory',
    time: ''
  });

  const history = useRef([]);
  const historyIndex = useRef(-1);

  const [courses, setCourses] = useState([
    'COMP401', 'COMP405', 'COMP434', 'COMP404',
    'COMP402', 'COMP403', 'COMP406', 'COMP407'
  ]);
  const [professors, setProfessors] = useState([
    'Mohamed Ahmed', 'Moaz Ebrahim', 'David Nady', 'Girgis Samy',
    'Ahmed Hassan', 'Mostafa Mohamed', 'Youssef Ali'
  ]);
  const [excludedCourses, setExcludedCourses] = useState([]);
  const [excludedProfessors, setExcludedProfessors] = useState([]);

  const saveToHistory = (newData) => {
    // Remove any redo states if we're not at the end of history
    if (historyIndex.current < history.current.length - 1) {
      history.current = history.current.slice(0, historyIndex.current + 1);
    }
    
    history.current.push(JSON.stringify(newData));
    historyIndex.current = history.current.length - 1;
  };

  const handleUndo = () => {
    if (historyIndex.current > 0) {
      historyIndex.current--;
      const previousState = JSON.parse(history.current[historyIndex.current]);
      setTimetableData(previousState);
    }
  };

  const handleRedo = () => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current++;
      const nextState = JSON.parse(history.current[historyIndex.current]);
      setTimetableData(nextState);
    }
  };

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
      // Create a simple table structure for PDF
      const doc = new jsPDF('l', 'mm', 'a4');
      
      // Add title
      doc.setFontSize(20);
      doc.text('Timetable', 20, 20);

      // Set up table parameters
      const startY = 30;
      const lineHeight = 7;
      const colWidth = 40;
      const headers = ['Day', 'Time', 'Course', 'Room', 'Instructor'];
      let currentY = startY;

      // Add headers
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      headers.forEach((header, i) => {
        doc.text(header, 20 + (i * colWidth), currentY);
      });

      // Add data rows
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
        
        // Check if we need a new page
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }

        // Add row data
        row.forEach((cell, i) => {
          doc.text(cell, 20 + (i * colWidth), currentY);
        });

        currentY += lineHeight;
      });

      // Save the PDF
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
      type: cellData?.type || 'theory',
      time: time
    });
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (!selectedCell) return;

    const { day, time } = selectedCell;
    const key = `${day}-${time}`;
    
    const newData = { ...timetableData };
    delete newData[key];
    
    setTimetableData(newData);
    saveToHistory(newData);
    setIsEditing(false);
    setSelectedCell(null);
  };

  const handleEditSubmit = () => {
    if (!selectedCell) return;

    const { day } = selectedCell;
    const oldKey = `${day}-${selectedCell.time}`;
    const newKey = `${day}-${editForm.time}`;
    
    const newData = { ...timetableData };
    
    // If time changed, remove old entry
    if (oldKey !== newKey) {
      delete newData[oldKey];
    }
    
    newData[newKey] = {
      ...editForm,
      color: editForm.type === 'theory' ? 'bg-yellow-100' : 'bg-blue-100'
    };
    
    setTimetableData(newData);
    saveToHistory(newData);
    setIsEditing(false);
    setSelectedCell(null);
  };

  const handleAddCourse = (newCourse) => {
    setCourses(prev => [...prev, newCourse]);
  };

  const handleAddProfessor = (newProfessor) => {
    setProfessors(prev => [...prev, newProfessor]);
  };

  const handleExcludeCourse = (course) => {
    setExcludedCourses(prev => [...prev, course]);
  };

  const handleIncludeCourse = (course) => {
    setExcludedCourses(prev => prev.filter(c => c !== course));
  };

  const handleExcludeProfessor = (professor) => {
    setExcludedProfessors(prev => [...prev, professor]);
  };

  const handleIncludeProfessor = (professor) => {
    setExcludedProfessors(prev => prev.filter(p => p !== professor));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Timetables</h1>
            <p className="text-gray-600 mt-1">Generate and manage class schedules</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleUndo}
              disabled={historyIndex.current <= 0}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                historyIndex.current <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiArrowLeft className="h-5 w-5" />
              <span>Undo</span>
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex.current >= history.current.length - 1}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                historyIndex.current >= history.current.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>Redo</span>
              <FiArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleGenerateTimetable}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiRefreshCw className="h-5 w-5" />
              Auto Generate
            </button>
            <button
              onClick={handleSaveTimetable}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiSave className="h-5 w-5" />
              Save Changes
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload className="h-5 w-5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Year Selection */}
        <div className="flex gap-2 mt-6">
          {['First', 'Second', 'Third', 'Fourth'].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedYear === year
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Panel */}
      <ConfigurationPanel
        courses={courses}
        professors={professors}
        excludedCourses={excludedCourses}
        excludedProfessors={excludedProfessors}
        onAddCourse={handleAddCourse}
        onAddProfessor={handleAddProfessor}
        onExcludeCourse={handleExcludeCourse}
        onIncludeCourse={handleIncludeCourse}
        onExcludeProfessor={handleExcludeProfessor}
        onIncludeProfessor={handleIncludeProfessor}
      />

      {/* Timetable Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
        <table className="min-w-full border-collapse timetable-table">
          <thead>
            <tr>
              <th className="border p-3 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                Day / Time
              </th>
              {timeSlots.map(slot => (
                <th
                  key={slot}
                  className="border p-3 bg-gray-50 text-left text-sm font-semibold text-gray-600 min-w-[150px]"
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="border p-3 font-medium text-gray-900">{day}</td>
                {timeSlots.map(slot => {
                  const cellData = timetableData[`${day}-${slot}`];
                  return (
                    <td
                      key={`${day}-${slot}`}
                      onClick={() => handleCellClick(day, slot)}
                      className={`border p-3 ${cellData?.color || ''} transition-colors hover:bg-gray-50 cursor-pointer`}
                    >
                      {cellData ? (
                        <div>
                          <div className="font-medium text-gray-900">{cellData.course}</div>
                          <div className="text-sm text-gray-600">{cellData.instructor}</div>
                          <div className="text-sm text-gray-500">{cellData.room}</div>
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

      {/* Edit Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Edit Class Schedule</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <select
                value={editForm.time}
                onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <input
                type="text"
                value={editForm.course}
                onChange={(e) => setEditForm(prev => ({ ...prev, course: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instructor</label>
              <input
                type="text"
                value={editForm.instructor}
                onChange={(e) => setEditForm(prev => ({ ...prev, instructor: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Room</label>
              <input
                type="text"
                value={editForm.room}
                onChange={(e) => setEditForm(prev => ({ ...prev, room: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={editForm.type}
                onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="theory">Theory</option>
                <option value="lab">Lab</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              Delete
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Legend Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Legend</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 rounded"></div>
            <span className="text-sm text-gray-600">Theory Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="text-sm text-gray-600">Lab Sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
