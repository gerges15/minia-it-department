import React, { useState } from 'react';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';

import { Token } from '../utils/token';
import {
  FiRefreshCw,
  FiSave,
  FiDownload,
  FiCalendar,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import Cookies from 'js-cookie';
import html2canvas from 'html2canvas';
import { getInventory } from '../store/usInventoryStore';
import { toast } from 'react-toastify'; // For user feedback (install react-toastify)

export default function ManageTimetable() {
  const URL = import.meta.env.VITE_API_URL;
  const KEY = import.meta.env.VITE_API_KEY;
  const [connectionId, setConnectionId] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('First');
  const [zTimetableData, zSetTimetableData] = useState({});

  // Map year to Levels enum (0:None, 1:First, 2:Second, 3:Third, 4:Fourth)
  const yearToLevel = {
    First: 1,
    Second: 2,
    Third: 3,
    Fourth: 4,
  };

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

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

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
    setIsLoading(true);
    let newConnection = null;
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const excludeModel = {
        PlacesId: [],
        CoursesId: [],
        StaffUserName: [],
      };

      // Create SignalR connection
      newConnection = new HubConnectionBuilder()
        .withUrl(`${URL}/api/TimeTableHub`, {
          headers: {
            'x-api-key': KEY,
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
          transport:
            HttpTransportType.WebSockets | HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect()
        .build();

      newConnection.onclose(error => {
        console.error('SignalR connection closed:', error);
        toast.error('SignalR connection lost');
      });

      newConnection.on('generateResult', result => {
        console.log('Received timetable result:', result);
        // Transform result to timetableData format
        const transformedData = {};
        Object.entries(result.table || {}).forEach(([day, slots]) => {
          slots.forEach(slot => {
            const key = `${day}-${slot.startFrom}:00 - ${slot.endTo}:00`;
            transformedData[key] = {
              course: slot.courseCode,
              instructor: slot.teachingAssistant,
              room: slot.teachingPlace,
              color: slot.courseCode.includes('Lab')
                ? 'bg-blue-100'
                : 'bg-yellow-100',
            };
          });
        });
        setTimetableData(transformedData);
        saveJsonToFile(result, 'TimeTableData.json');
        toast.success('Timetable generated successfully');
      });

      console.log('Attempting to connect to SignalR hub...');
      await newConnection.start().catch(error => {
        console.error('SignalR handshake error:', error);
        throw error;
      });
      console.log('SignalR connected successfully!');
      setConnection(newConnection);

      const level = yearToLevel[selectedYear];
      console.log(
        'Invoking generateTimeTableContext with:',
        excludeModel,
        level
      );
      await newConnection.invoke(
        'generateTimeTableContext',
        excludeModel,
        level
      );
    } catch (error) {
      console.error('Error generating timetable:', error);
      toast.error('Failed to generate timetable');
    } finally {
      setIsLoading(false);
      // Keep connection open for further messages
    }
  };
  // Save JSON to file (unchanged)
  function saveJsonToFile(jsonObject, filename = 'TimeTableData.json') {
    const blob = new Blob([JSON.stringify(jsonObject, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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
        doc.text(header, 20 + i * colWidth, currentY);
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
          value.instructor || '',
        ];

        // Check if we need a new page
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }

        // Add row data
        row.forEach((cell, i) => {
          doc.text(cell, 20 + i * colWidth, currentY);
        });

        currentY += lineHeight;
      });

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
            <h1 className="text-2xl font-bold text-gray-800">
              Manage Timetables
            </h1>
            <p className="text-gray-600 mt-1">
              Generate and manage class schedules
            </p>
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
      <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
        <div
          className="timetable-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `150px repeat(${timeSlots.length}, minmax(150px, 1fr))`,
            minWidth: '1000px',
          }}
          role="grid"
        >
          {/* Header Row */}
          <div
            className="sticky top-0 z-10 bg-slate-100 border-b border-slate-300 p-4 font-semibold text-sm text-slate-700 flex items-center"
            role="columnheader"
          >
            Day / Time
          </div>
          {timeSlots.map(slot => (
            <div
              key={slot}
              className="sticky top-0 z-10 bg-slate-100 border-b border-slate-300 p-4 font-semibold text-sm text-slate-700 text-center flex items-center justify-center"
              role="columnheader"
            >
              {slot}
            </div>
          ))}

          {/* Body Rows */}
          {days.map((day, rowIndex) => (
            <React.Fragment key={day}>
              <div
                className={`p-4 font-semibold text-slate-800 border-b border-r border-slate-200 ${
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                } flex items-center`}
                role="rowheader"
              >
                {day}
              </div>
              {timeSlots.map(slot => {
                const key = `${day}-${slot}`;
                const cellData = timetableData[key];
                return (
                  <div
                    key={key}
                    className={`p-4 border-b border-r border-slate-200 ${
                      rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    } transition-all hover:bg-indigo-50 ${
                      cellData ? 'shadow-sm rounded-md' : ''
                    }`}
                    role="cell"
                    title={
                      cellData
                        ? `${cellData.course} - ${cellData.room}`
                        : 'Free slot'
                    }
                  >
                    {cellData ? (
                      <div className="space-y-1.5">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-900 bg-indigo-100 rounded-full">
                          {cellData.course}
                        </span>
                        <div className="text-sm text-slate-700">
                          {cellData.instructor}
                        </div>
                        <div className="text-xs text-slate-500">
                          {cellData.room}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">Free</div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
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
