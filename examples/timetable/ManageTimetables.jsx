import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';

import { Token } from '../../src/utils/token';
import {
  FiRefreshCw,
  FiSave,
  FiDownload,
  FiCalendar,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLoader,
  FiWifi,
  FiWifiOff,
  FiFilter,
  FiClock,
  FiAlertCircle,
  FiInfo,
} from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import Cookies from 'js-cookie';
import html2canvas from 'html2canvas';
import { getInventory } from '../../src/store/usInventoryStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/apiClint'; // Assuming this is the ApiClint import
import { getTimetable, getCourses, getTeachingPlaces } from '../../api/endpoints';

export default function ManageTimetable() {
  const isProduction = import.meta.env.PROD;
  const URL = import.meta.env.VITE_API_URL;
  const KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = isProduction ? '/api/proxy' : `${URL}/api`;
  
  const connectionRef = useRef(null);
  const [connection, setConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('First');
  const [timetableData, setTimetableData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [courses, setCourses] = useState([]);
  const [teachingPlaces, setTeachingPlaces] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [timetableNames, setTimetableNames] = useState([]);
  const [activeTimeTable, setActiveTimeTable] = useState(null);
  const [error, setError] = useState(null);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  // Timer for keepalive
  const keepAliveIntervalRef = useRef(null);
  // Reconnection attempt counter
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

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

  // Local storage key for timetable data
  const getTableStorageKey = (level) => `timetable_level_${level}`;

  // Store timetable data in state and localStorage
  const storeTimeTable = useCallback((data) => {
    if (!data) return;
    
    try {
      const transformedData = transformTimetableData(data);
      setTimetableData(transformedData);
      
      // Store in localStorage for persistence
      const level = yearToLevel[selectedYear];
      const key = getTableStorageKey(level);
      localStorage.setItem(key, JSON.stringify(data));
      
      return transformedData;
    } catch (error) {
      console.error('Error storing timetable data:', error);
      toast.error('Failed to process timetable data');
      return null;
    }
  }, [selectedYear]);

  // Map server result object to a standard format
  const mapResultObject = useCallback((result) => {
    // Handle different result formats from server
    if (!result) return { success: false, error: 'No result returned' };
    
    // If result already has success property, return it
    if (result.hasOwnProperty('success')) return result;
    
    // If result has table property, it's likely a successful timetable
    if (result.table) return { success: true, data: result };
    
    // Default failure case
    return { success: false, error: 'Unknown result format' };
  }, []);

  // Transform timetable data helper
  const transformTimetableData = useCallback((data) => {
    const transformedData = {};
    if (!data) return transformedData;
    
    try {
      if (data.table) {
        Object.entries(data.table).forEach(([day, slots]) => {
          if (Array.isArray(slots)) {
            slots.forEach(slot => {
              if (slot && typeof slot.startFrom !== 'undefined' && typeof slot.endTo !== 'undefined') {
                const key = `${day}-${slot.startFrom}:00 - ${slot.endTo}:00`;
                transformedData[key] = {
                  course: slot.courseCode || 'Unknown',
                  instructor: slot.teachingAssistant || 'TBD',
                  room: slot.teachingPlace || 'TBD',
                  color: (slot.courseCode && slot.courseCode.includes('Lab')) ? 'bg-blue-100' : 'bg-yellow-100',
                };
              }
            });
          }
        });
      }
      return transformedData;
    } catch (error) {
      console.error('Error transforming timetable data:', error);
      return {};
    }
  }, []);

  // Reload timetable from localStorage or fetch from server
  const reloadTimeTable = useCallback(async () => {
    const level = yearToLevel[selectedYear];
    const key = getTableStorageKey(level);
    const storedData = localStorage.getItem(key);
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        storeTimeTable(parsedData);
        return;
      } catch (error) {
        console.error('Error parsing stored timetable:', error);
        // Fall through to fetch from server
      }
    }
    
    // If no stored data or parsing failed, fetch from server
    await fetchTimetable();
  }, [selectedYear, storeTimeTable]);

  // Fetch initial data (courses and teaching places)
  const fetchInitialData = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      const [coursesResponse, placesResponse] = await Promise.all([
        getCourses(0, true),
        getTeachingPlaces()
      ]);
      
      if (isMounted.current) {
        setCourses(coursesResponse || []);
        setTeachingPlaces(placesResponse || []);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      if (isMounted.current) {
        toast.error('Failed to fetch courses and teaching places');
      }
    } finally {
      if (isMounted.current) {
        setIsInitialLoading(false);
      }
    }
  }, []);

  // Start keepalive ping to prevent connection timeout
  const startKeepAlive = useCallback(() => {
    // Clear any existing interval
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
    }
    
    // Set up a new interval for sending keepalive pings
    keepAliveIntervalRef.current = setInterval(async () => {
      if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
        try {
          // Send a ping or invoke a lightweight method to keep the connection alive
          console.log('Sending keepalive ping...');
          
          // If you have a ping method on the server, use that
          // await connectionRef.current.invoke('Ping');
          
          // Otherwise, just send a simple signal-r ping
          await connectionRef.current.send('KeepAlive');
          
        } catch (error) {
          console.warn('Keepalive ping failed:', error);
          // Don't reconnect here, let the connection state change handler handle reconnection
        }
      }
    }, 15000); // 15 seconds interval
  }, []);

  // Initialize SignalR connection
  const initializeSignalR = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      // Close any existing connection
      if (connectionRef.current) {
        await connectionRef.current.stop();
        connectionRef.current = null;
      }

      console.log('Initializing SignalR connection...');
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/TimeTableHub`, {
          headers: {
            'x-api-key': KEY,
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
          transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
          skipNegotiation: false,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            // Implement custom retry policy
            if (retryContext.previousRetryCount <= 10) {
              // Exponential backoff with a cap
              const delay = Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
              console.log(`SignalR reconnecting in ${delay}ms`);
              return delay;
            }
            return null; // Stop retrying after 10 attempts
          }
        })
        .configureLogging(LogLevel.Warning)
        .build();
      
      connectionRef.current = newConnection;

      // Set up event handlers
      newConnection.on('TimetableUpdated', (updatedData) => {
        if (!isMounted.current) return;
        
        console.log('Received timetable update via SignalR');
        storeTimeTable(updatedData);
        toast.info('Timetable updated in real-time');
      });

      newConnection.on('GenerationProgress', (progress) => {
        if (!isMounted.current) return;
        toast.info(`Generating timetable: ${progress}%`);
      });

      // Handle timetable generation result
      newConnection.on("generateTimeTableContextResult", (result) => {
        if (!isMounted.current) return;
        console.log('Received generate result', result);
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          storeTimeTable(result);
          toast.success('Timetable generated successfully');
        } else {
          toast.error(`Failed to generate timetable: ${mappedResult.error || 'Unknown error'}`);
        }
      });

      // Handle getting list of saved timetables
      newConnection.on("getTimeTablesContextResult", (names) => {
        if (!isMounted.current) return;
        console.log('Received timetable names:', names);
        
        if (Array.isArray(names)) {
          setTimetableNames(names);
        }
      });
      
      // Handle finding valid staff result
      newConnection.on("findValidStaffResult", (result) => {
        if (!isMounted.current) return;
        console.log('Received valid staff result:', result);
        
        // Update UI with valid staff (could be implemented as needed)
        toast.info(`Found ${result?.length || 0} valid staff members`);
      });
      
      // Handle finding valid places result
      newConnection.on("findValidPlacesResult", (result) => {
        if (!isMounted.current) return;
        console.log('Received valid places result:', result);
        
        // Update UI with valid places (could be implemented as needed)
        toast.info(`Found ${result?.length || 0} valid teaching places`);
      });
      
      // Handle loading a timetable
      newConnection.on("loadTimeTableContextResult", (result) => {
        if (!isMounted.current) return;
        console.log('Received load timetable result:', result);
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          storeTimeTable(result);
          toast.success('Timetable loaded successfully');
        } else {
          toast.error(`Failed to load timetable: ${mappedResult.error || 'Unknown error'}`);
        }
      });

      // Handle deleting a timetable
      newConnection.on("deleteTimeTableContextResult", (result) => {
        if (!isMounted.current) return;
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          const level = yearToLevel[selectedYear];
          const key = getTableStorageKey(level);
          localStorage.removeItem(key);
          setTimetableData({});
          toast.success('Timetable deleted successfully');
        } else {
          toast.error(`Failed to delete timetable: ${mappedResult.error || 'Unknown error'}`);
        }
      });

      // Handle setting active timetable
      newConnection.on("setActiveTimeTableContextResult", (result) => {
        if (!isMounted.current) return;
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          setActiveTimeTable(mappedResult.data);
          toast.success('Active timetable set successfully');
        } else {
          toast.error(`Failed to set active timetable: ${mappedResult.error || 'Unknown error'}`);
        }
      });

      // Handle undo operation
      newConnection.on("undoResult", (result) => {
        if (!isMounted.current) return;
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          storeTimeTable(result);
          toast.success('Undo operation successful');
        } else {
          toast.error(`Undo failed: ${mappedResult.error || 'Nothing to undo'}`);
        }
      });

      // Handle redo operation
      newConnection.on("redoResult", (result) => {
        if (!isMounted.current) return;
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          storeTimeTable(result);
          toast.success('Redo operation successful');
        } else {
          toast.error(`Redo failed: ${mappedResult.error || 'Nothing to redo'}`);
        }
      });

      // Handle loading active timetable
      newConnection.on("loadActiveTimeTableContextResult", (result) => {
        if (!isMounted.current) return;
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          storeTimeTable(result);
          toast.success('Active timetable loaded successfully');
        } else {
          toast.error(`Failed to load active timetable: ${mappedResult.error || 'Unknown error'}`);
        }
      });

      // Handle adding interval to timetable
      newConnection.on("addIntervalResult", (result) => {
        if (!isMounted.current) return;
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          storeTimeTable(result);
          toast.success('Interval added successfully');
        } else {
          toast.error(`Failed to add interval: ${mappedResult.error || 'Unknown error'}`);
        }
      });

      // Handle removing interval from timetable
      newConnection.on("removeIntervalResult", (result) => {
        if (!isMounted.current) return;
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          storeTimeTable(result);
          toast.success('Interval removed successfully');
        } else {
          toast.error(`Failed to remove interval: ${mappedResult.error || 'Unknown error'}`);
        }
      });

      // Handle moving interval in timetable
      newConnection.on("moveIntervalResult", (result) => {
        if (!isMounted.current) return;
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          storeTimeTable(result);
          toast.success('Interval moved successfully');
        } else {
          toast.error(`Failed to move interval: ${mappedResult.error || 'Unknown error'}`);
        }
      });
      
      // Connection state change handlers
      newConnection.onreconnecting(error => {
        console.warn('SignalR reconnecting due to error:', error);
        if (isMounted.current) {
          setIsConnected(false);
          setConnectionError('Connection lost. Attempting to reconnect...');
          toast.warning('Connection lost. Attempting to reconnect...');
        }
      });
      
      newConnection.onreconnected(connectionId => {
        console.log('SignalR reconnected with ID:', connectionId);
        if (isMounted.current) {
          setIsConnected(true);
          setConnectionError(null);
          toast.success('Connection reestablished');
          reconnectAttemptsRef.current = 0; // Reset reconnect counter
          
          // Restart keepalive after reconnection
          startKeepAlive();
        }
      });

      newConnection.onclose(error => {
        console.error('SignalR connection closed:', error);
        if (isMounted.current) {
          setIsConnected(false);
          setConnectionError('Connection closed. Please refresh the page.');
          toast.error('Connection lost. Please refresh the page or try again later.');
          
          // Clear keepalive interval
          if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
          }
          
          // Attempt to reconnect if not explicitly stopped
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptsRef.current++;
            console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})...`);
            
            // Try to reconnect after a delay
            setTimeout(() => {
              if (isMounted.current) {
                initializeSignalR();
              }
            }, 5000); // 5 second delay
          }
        }
      });

      // Start the connection
      console.log('Starting SignalR connection...');
      await newConnection.start();
      console.log('SignalR connection established');
      
      if (isMounted.current) {
        setConnection(newConnection);
        setIsConnected(true);
        setConnectionError(null);
        toast.success('Connected to real-time updates');
        
        // Start keepalive mechanism
        startKeepAlive();
        
        // Get list of timetables
        try {
          await newConnection.invoke('getTimeTablesContext');
        } catch (error) {
          console.error('Error getting timetable list:', error);
        }
      }
    } catch (error) {
      console.error('Error initializing SignalR:', error);
      if (isMounted.current) {
        setIsConnected(false);
        setConnectionError(`Failed to connect: ${error.message || 'Unknown error'}`);
        toast.error('Failed to connect to real-time updates');
      }
    }
  }, [BASE_URL, KEY, startKeepAlive, mapResultObject, storeTimeTable]);

  // Fetch timetable data
  const fetchTimetable = useCallback(async () => {
    if (!isMounted.current) return;
    
    setIsLoading(true);
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const level = yearToLevel[selectedYear];
      console.log(`Fetching timetable for level ${level}`);
      const response = await getTimetable(level);
      
      if (isMounted.current) {
        if (response && response.table) {
          storeTimeTable(response);
          toast.success('Timetable fetched successfully');
        } else {
          setTimetableData({});
          toast.warn('No timetable data found for this level');
        }
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      if (isMounted.current) {
        toast.error(`Failed to fetch timetable: ${error.message || 'Unknown error'}`);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [selectedYear, storeTimeTable]);

  // Initialize and cleanup
  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;

    // Initialize
    fetchInitialData();
    initializeSignalR();
    fetchTimetable();

    // Cleanup
    return () => {
      // Set mounted flag to false to prevent state updates
      isMounted.current = false;
      
      // Clear keepalive interval
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
      
      // Stop SignalR connection
      if (connectionRef.current) {
        console.log('Stopping SignalR connection on unmount...');
        connectionRef.current.stop().catch(err => {
          console.error('Error stopping SignalR connection:', err);
        });
        connectionRef.current = null;
      }
    };
  }, [initializeSignalR, fetchTimetable, fetchInitialData]);

  // Handle timetable generation
  const handleGenerateTimetable = async (e) => {
    // Prevent default form submission behavior if this is a button in a form
    if (e) e.preventDefault();
    
    if (!isMounted.current) return;
    
    setIsLoading(true);
    toast.info('Generating timetable...');
    
    try {
      if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
        // If not connected, try to reconnect first
        await initializeSignalR();
        if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
          throw new Error('Not connected to real-time updates');
        }
      }

      const excludeModel = {
        PlacesId: [],
        CoursesId: [],
        StaffUserName: [],
      };

      const level = yearToLevel[selectedYear];
      console.log(`Generating timetable for level ${level}...`);
      await connectionRef.current.invoke('generateTimeTableContext', excludeModel, level);
    } catch (error) {
      console.error('Error generating timetable:', error);
      if (isMounted.current) {
        toast.error(`Failed to generate timetable: ${error.message || 'Unknown error'}`);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Handle saving timetable
  const handleSaveTimetable = async (e) => {
    // Prevent default form submission behavior if this is a button in a form
    if (e) e.preventDefault();
    
    if (!isMounted.current) return;
    
    setIsSaving(true);
    toast.info('Saving timetable...');
    
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

      console.log('Saving timetable data:', { level, table });
      
      // Save to server
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

      if (isMounted.current) {
        toast.success('Timetable saved successfully');
        
        // Refresh the list of timetables
        if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
          try {
            await connectionRef.current.invoke('getTimeTablesContext');
          } catch (error) {
            console.error('Error refreshing timetable list:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error saving timetable:', error);
      if (isMounted.current) {
        toast.error(`Failed to save timetable: ${error.message || 'Unknown error'}`);
      }
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
    }
  };

  // Handle undo operation
  const handleUndo = async () => {
    if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      toast.error('Not connected to server');
      return;
    }
    
    try {
      await connectionRef.current.invoke('undo');
    } catch (error) {
      console.error('Error performing undo:', error);
      toast.error(`Undo failed: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle redo operation
  const handleRedo = async () => {
    if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      toast.error('Not connected to server');
      return;
    }
    
    try {
      await connectionRef.current.invoke('redo');
    } catch (error) {
      console.error('Error performing redo:', error);
      toast.error(`Redo failed: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle loading active timetable
  const handleLoadActiveTimeTable = async () => {
    if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      toast.error('Not connected to server');
      return;
    }
    
    try {
      await connectionRef.current.invoke('loadActiveTimeTableContext');
    } catch (error) {
      console.error('Error loading active timetable:', error);
      toast.error(`Failed to load active timetable: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle changing selected year
  const handleYearChange = (year) => {
    if (year === selectedYear) return;
    
    setSelectedYear(year);
    // Fetch timetable data for the new year
    fetchTimetable();
  };

  // Handle PDF export
  const handleExportPDF = async (e) => {
    // Prevent default form submission behavior if this is a button in a form
    if (e) e.preventDefault();
    
    if (!isMounted.current) return;
    
    try {
      const doc = new jsPDF('l', 'mm', 'a4');
      doc.setFontSize(20);
      doc.text(`${selectedYear} Year Timetable`, 20, 20);
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
          doc.text(String(cell), 20 + i * colWidth, currentY);
        });
        currentY += lineHeight;
      });
      doc.save(`${selectedYear.toLowerCase()}_year_timetable.pdf`);
      
      if (isMounted.current) {
        toast.success('PDF exported successfully');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (isMounted.current) {
        toast.error(`Failed to generate PDF: ${error.message || 'Unknown error'}`);
      }
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading timetable data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-md w-full">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-red-100 p-3 rounded-full">
              <FiAlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Error Loading Timetable</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchTimetable();
              }}
              className="mt-2 inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiRefreshCw className="h-5 w-5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-0">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Mobile Info Banner - only visible on small screens */}
      <div className="block sm:hidden">
        <button
          onClick={() => setShowMobileInfo(!showMobileInfo)}
          className="w-full p-2 text-sm bg-blue-50 rounded-lg text-blue-700 flex items-center justify-between"
        >
          <span>
            <FiInfo className="inline-block mr-1" />
            Connection & Info
          </span>
          <span>{showMobileInfo ? '▲' : '▼'}</span>
        </button>
        
        {showMobileInfo && (
          <div className="mt-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className={`flex items-center gap-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? <FiWifi /> : <FiWifiOff />} 
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {!isConnected && (
                <button
                  onClick={() => initializeSignalR()}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                >
                  Reconnect
                </button>
              )}
            </div>
            <p className="text-gray-700 text-xs mb-1">
              Year: <span className="font-medium">{selectedYear}</span>
            </p>
            <p className="text-gray-700 text-xs">
              Classes: <span className="font-medium">{Object.keys(timetableData).filter(key => timetableData[key]?.course).length}</span>
            </p>
          </div>
        )}
      </div>
      
      {/* Connection Status Bar - hide on mobile */}
      <div className="hidden sm:flex rounded-lg p-2 items-center justify-between text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <FiWifi className="h-4 w-4" />
              <span>Connected to real-time updates</span>
            </>
          ) : (
            <>
              <FiWifiOff className="h-4 w-4" />
              <span>{connectionError || 'Disconnected from real-time updates'}</span>
            </>
          )}
        </div>
        {!isConnected && (
          <button
            onClick={() => initializeSignalR()}
            className="px-2 py-1 bg-red-200 hover:bg-red-300 rounded text-xs"
            disabled={isLoading}
          >
            Reconnect
          </button>
        )}
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Manage Timetables
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Generate and manage class schedules
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <button
              onClick={handleGenerateTimetable}
              disabled={!isConnected || isLoading}
              className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium ${
                isConnected && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Auto Generate</span>
            </button>
            <button
              onClick={handleSaveTimetable}
              disabled={isSaving || Object.keys(timetableData).length === 0}
              className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium ${
                isSaving || Object.keys(timetableData).length === 0
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <FiSave className={`h-5 w-5 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isLoading || Object.keys(timetableData).length === 0}
              className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium ${
                isLoading || Object.keys(timetableData).length === 0
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <FiDownload className="h-5 w-5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Year and Controls Section */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Select Year:</h3>
              <div className="flex flex-wrap gap-2">
                {['First', 'Second', 'Third', 'Fourth'].map(year => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedYear === year
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
            
            {/* History Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={!isConnected || isLoading}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={!isConnected || isLoading}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Redo
              </button>
            </div>
          </div>
          
          {timetableNames.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label htmlFor="timetableSelect" className="text-sm text-gray-600 min-w-[120px]">
                  Saved timetables:
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <select
                    id="timetableSelect"
                    className="p-1.5 rounded-lg border border-gray-300 text-sm w-full sm:w-auto"
                    disabled={!isConnected || isLoading}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      if (selectedName && connectionRef.current) {
                        connectionRef.current.invoke('loadTimeTableContext', selectedName)
                          .catch(err => {
                            console.error('Error loading timetable:', err);
                            toast.error(`Failed to load timetable: ${err.message || 'Unknown error'}`);
                          });
                      }
                    }}
                  >
                    <option value="">Select a timetable</option>
                    {timetableNames.map((name, idx) => (
                      <option key={idx} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={handleLoadActiveTimeTable}
                    disabled={!isConnected || isLoading}
                    className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    Load Active
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timetable Section */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 text-sm">Generating timetable...</p>
          </div>
        </div>
      ) : Object.keys(timetableData).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 h-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <FiCalendar className="h-10 w-10 text-gray-300" />
            <p className="text-sm sm:text-base">No timetable data available. Click "Auto Generate" to create a timetable.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">
              {selectedYear} Year Timetable
            </h2>
            <div className="text-sm text-gray-500">
              <span className="inline-flex items-center">
                <FiClock className="mr-1 h-4 w-4" />
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto -mx-4 sm:-mx-6">
            <div className="inline-block min-w-full p-4 sm:p-6 align-middle">
              <div
                className="timetable-grid border border-gray-200 rounded-lg"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(140px, 1fr))`,
                  width: '100%',
                  overflowX: 'auto',
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
                          className={`px-3 py-3 sm:px-4 sm:py-4 border-b border-r border-gray-200 ${
                            rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          } transition-colors hover:bg-gray-100 ${cellData?.color || ''} flex flex-col items-center justify-center text-xs sm:text-sm`}
                          role="cell"
                          title={
                            cellData
                              ? `${cellData.course} - ${cellData.room}`
                              : 'Free slot'
                          }
                          onClick={() => {
                            if (connectionRef.current && isConnected && !isLoading) {
                              // Here you could implement a modal or popover for editing this cell
                              toast.info(`Selected ${day} at ${slot}`);
                            }
                          }}
                        >
                          {cellData ? (
                            <div className="space-y-1 text-center w-full">
                              <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                {cellData.course}
                              </span>
                              <div className="text-xs sm:text-sm text-gray-600 font-medium truncate max-w-full">
                                {cellData.instructor}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-full">
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
          </div>
        </div>
      )}

      {/* Legend & Status Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Legend */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              Legend
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                <span className="text-sm text-gray-600">
                  Theory Classes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 rounded"></div>
                <span className="text-sm text-gray-600">
                  Lab Sessions
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              Status
            </h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>Connection: {isConnected ? 'Connected' : 'Disconnected'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCalendar className="h-4 w-4 text-gray-500" />
                  <span>Year: {selectedYear}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Total Classes: {Object.keys(timetableData).filter(key => timetableData[key]?.course).length}</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiClock className="h-4 w-4 text-gray-500" />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
