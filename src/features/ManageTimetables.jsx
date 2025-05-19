import React, { useState, useEffect, useCallback } from 'react';
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
  FiLoader,
} from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import Cookies from 'js-cookie';
import html2canvas from 'html2canvas';
import { getInventory } from '../store/usInventoryStore';
import { toast } from 'react-toastify';
import api from '../../api/apiClint'; // Assuming this is the ApiClint import
import { getTimetable, getCourses, getTeachingPlaces } from '../../api/endpoints';

export default function ManageTimetable() {
  const isProduction = import.meta.env.PROD;
  const URL = import.meta.env.VITE_API_URL;
  const KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = isProduction ? '/api/proxy' : `${URL}/api`;
  
  const [connection, setConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('First');
  const [timetableData, setTimetableData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [courses, setCourses] = useState([]);
  const [teachingPlaces, setTeachingPlaces] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  // Fetch initial data (courses and teaching places)
  const fetchInitialData = useCallback(async () => {
    try {
      const [coursesResponse, placesResponse] = await Promise.all([
        getCourses(0, true),
        getTeachingPlaces()
      ]);
      
      setCourses(coursesResponse || []);
      setTeachingPlaces(placesResponse || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to fetch courses and teaching places');
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  // Initialize SignalR connection
  const initializeSignalR = useCallback(async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const newConnection = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/TimeTableHub`, {
          headers: {
            'x-api-key': KEY,
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
          transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect()
        .build();

      // Set up event handlers
      newConnection.on('TimetableUpdated', (updatedData) => {
        const transformedData = transformTimetableData(updatedData);
        setTimetableData(transformedData);
        toast.info('Timetable updated in real-time');
      });

      newConnection.on('GenerationProgress', (progress) => {
        toast.info(`Generating timetable: ${progress}%`);
      });

      newConnection.onclose((error) => {
        console.error('SignalR connection closed:', error);
        setIsConnected(false);
        toast.error('Connection lost. Attempting to reconnect...');
      });

      await newConnection.start();
      setConnection(newConnection);
      setIsConnected(true);
      toast.success('Connected to real-time updates');
    } catch (error) {
      console.error('Error initializing SignalR:', error);
      toast.error('Failed to connect to real-time updates');
    }
  }, [BASE_URL, KEY]);

  // Transform timetable data helper
  const transformTimetableData = (data) => {
    const transformedData = {};
    if (data && data.table) {
      Object.entries(data.table).forEach(([day, slots]) => {
        slots.forEach(slot => {
          const key = `${day}-${slot.startFrom}:00 - ${slot.endTo}:00`;
          transformedData[key] = {
            course: slot.courseCode,
            instructor: slot.teachingAssistant,
            room: slot.teachingPlace,
            color: slot.courseCode.includes('Lab') ? 'bg-blue-100' : 'bg-yellow-100',
          };
        });
      });
    }
    return transformedData;
  };

  // Fetch timetable data
  const fetchTimetable = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const level = yearToLevel[selectedYear];
      const response = await getTimetable(level);
      
      if (response && response.table) {
        const transformedData = transformTimetableData(response);
        setTimetableData(transformedData);
        toast.success('Timetable fetched successfully');
      } else {
        toast.warn('No timetable data found for this level');
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      toast.error('Failed to fetch timetable');
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear]);

  // Initialize SignalR and fetch initial data
  useEffect(() => {
    fetchInitialData();
    initializeSignalR();
    fetchTimetable();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [initializeSignalR, fetchTimetable, fetchInitialData]);

  // Handle timetable generation
  const handleGenerateTimetable = async () => {
    setIsLoading(true);
    try {
      if (!connection || !isConnected) {
        throw new Error('Not connected to real-time updates');
      }

      const excludeModel = {
        PlacesId: [],
        CoursesId: [],
        StaffUserName: [],
      };

      const level = yearToLevel[selectedYear];
      await connection.invoke('generateTimeTableContext', excludeModel, level);
      toast.info('Generating timetable...');
    } catch (error) {
      console.error('Error generating timetable:', error);
      toast.error('Failed to generate timetable');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving timetable
  const handleSaveTimetable = async () => {
    setIsSaving(true);
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const level = yearToLevel[selectedYear];
      const table = days.reduce((acc, day) => {
        acc[day] = [];
        timeSlots.forEach(slot => {
          const key = `${day}-${slot}`;
          if (timetableData[key]) {
            const [startFrom, endTo] = slot
              .split(' - ')
              .map(time => parseInt(time.split(':')[0]));
            acc[day].push({
              startFrom,
              endTo,
              courseCode: timetableData[key].course,
              teachingPlace: timetableData[key].room,
              teachingAssistant: timetableData[key].instructor,
            });
          }
        });
        return acc;
      }, {});

      await api.post(
        '/TimeTables',
        { level, table },
        {
          headers: {
            'x-api-key': KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success('Timetable saved successfully');
    } catch (error) {
      console.error('Error saving timetable:', error);
      toast.error('Failed to save timetable');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle PDF export
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
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading timetable data...</p>
        </div>
      </div>
    );
  }

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
              disabled={!isConnected || isLoading}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                isConnected
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              <FiRefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${isLoading ? 'animate-spin' : ''}`} />
              Auto Generate
            </button>
            <button
              onClick={handleSaveTimetable}
              disabled={isSaving}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                isSaving
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <FiSave className={`h-4 w-4 sm:h-5 sm:w-5 ${isSaving ? 'animate-spin' : ''}`} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
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
              disabled={isLoading}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                selectedYear === year
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(100px, 1fr))`,
            minWidth: '600px',
            maxWidth: '100%',
          }}
          role="grid"
        >
          {/* Header Row */}
          <div
            className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-4 py-4 sm:px-5 sm:py-5 font-semibold text-xs text-gray-700 flex items-center justify-center whitespace-nowrap"
            role="columnheader"
          >
            Day / Time
          </div>
          {timeSlots.map(slot => (
            <div
              key={slot}
              className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-3 py-4 sm:px-4 sm:py-5 font-semibold text-xs text-gray-700 flex items-center justify-center whitespace-nowrap"
              role="columnheader"
            >
              {slot}
            </div>
          ))}

          {/* Body Rows */}
          {days.map((day, rowIndex) => (
            <React.Fragment key={day}>
              <div
                className={`px-4 py-4 sm:px-5 sm:py-5 font-semibold text-gray-800 border-b border-r border-gray-200 ${
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } flex items-center justify-start text-xs sm:text-sm whitespace-nowrap`}
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
                    className={`px-3 py-4 sm:px-4 sm:py-5 border-b border-r border-gray-200 ${
                      rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } transition-colors hover:bg-gray-100 ${cellData?.color || ''} flex flex-col items-center justify-center text-xs sm:text-sm`}
                    role="cell"
                    title={
                      cellData
                        ? `${cellData.course} - ${cellData.room}`
                        : 'Free slot'
                    }
                  >
                    {cellData ? (
                      <div className="space-y-1 text-center">
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
