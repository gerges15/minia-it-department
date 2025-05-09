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
import { toast } from 'react-toastify';

export default function ManageTimetable() {
  const URL = import.meta.env.VITE_API_URL;
  const KEY = import.meta.env.VITE_API_KEY;
  const [connectionId, setConnectionId] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('First');
  const [zTimetableData, zSetTimetableData] = useState({});

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
    }
  };

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
        doc.text(header, 20 + i * colWidth, currentY);
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
          value.instructor || '',
        ];
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
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
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Manage Timetables
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Generate and manage class schedules
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerateTimetable}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
            >
              <FiRefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
              Auto Generate
            </button>
            <button
              onClick={handleSaveTimetable}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              <FiSave className="h-4 w-4 sm:h-5 sm:w-5" />
              Save Changes
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <FiDownload className="h-4 w-4 sm:h-5 sm:w-5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Year Selection */}
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
          {['First', 'Second', 'Third', 'Fourth'].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
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
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-20">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
          </div>
        )}
        <div
          className="timetable-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `100px repeat(${timeSlots.length}, minmax(100px, 1fr))`,
            minWidth: '600px',
            maxWidth: '100%',
          }}
          role="grid"
        >
          {/* Header Row */}
          <div
            className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 p-3 sm:p-4 font-semibold text-xs sm:text-sm text-gray-700 flex items-center"
            role="columnheader"
          >
            Day / Time
          </div>
          {timeSlots.map(slot => (
            <div
              key={slot}
              className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 p-3 sm:p-4 font-semibold text-xs sm:text-sm text-gray-700 text-center flex items-center justify-center"
              role="columnheader"
            >
              {slot}
            </div>
          ))}

          {/* Body Rows */}
          {days.map((day, rowIndex) => (
            <React.Fragment key={day}>
              <div
                className={`p-3 sm:p-4 font-semibold text-gray-800 border-b border-r border-gray-200 ${
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } flex items-center text-xs sm:text-sm`}
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
                    className={`p-3 sm:p-4 border-b border-r border-gray-200 ${
                      rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } transition-colors hover:bg-gray-100 ${cellData?.color || ''} text-xs sm:text-sm`}
                    role="cell"
                    title={
                      cellData
                        ? `${cellData.course} - ${cellData.room}`
                        : 'Free slot'
                    }
                  >
                    {cellData ? (
                      <div className="space-y-1">
                        <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                          {cellData.course}
                        </span>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {cellData.instructor}
                        </div>
                        <div className="text-xs text-gray-500">
                          {cellData.room}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">Free</div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend Section */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
          Legend
        </h3>
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-100 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">
              Theory Classes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-100 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">
              Lab Sessions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
