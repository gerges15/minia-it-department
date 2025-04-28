import React, { useState } from 'react';
import { FiRefreshCw, FiSave, FiDownload, FiCalendar, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
                      className={`border p-3 ${cellData?.color || ''} transition-colors hover:bg-gray-50`}
                    >
                      {cellData ? (
                        <div>
                          <div className="font-medium text-gray-900">{cellData.course}</div>
                          <div className="text-sm text-gray-600">{cellData.instructor}</div>
                          <div className="text-sm text-gray-500">{cellData.room}</div>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
