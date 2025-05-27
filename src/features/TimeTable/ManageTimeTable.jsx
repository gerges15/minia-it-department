import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import {
  FiCalendar,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiSave,
  FiDownload,
  FiFilter,
  FiInfo,
  FiAlertCircle,
  FiRotateCcw,
  FiRotateCw,
  FiWifi,
  FiWifiOff,
  FiMoreVertical,
  FiX,
  FiClock,
  FiSearch,
  FiChevronDown,
  FiCheck
} from 'react-icons/fi';
import { getCourses, getTeachingStaff, getTeachingPlaces, getTimetable, addTeachingPlaceSchedules, addUserSchedules } from '../../../api/endpoints';

// Time options for select
const TIME_OPTIONS = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 8; // Start from 8 AM
  return {
    value: hour,
    label: `${hour}:00`
  };
});

// Year to level mapping
const yearToLevel = {
  'First': 1,
  'Second': 2,
  'Third': 3,
  'Fourth': 4
};

// Enhanced EditModal Component
const EditModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    teachingAssistant: '',
    teachingPlace: '',
    startFrom: 8,
    endTo: 9,
    ...data
  });

  const [courses, setCourses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [error, setError] = useState(null);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [placeSearchTerm, setPlaceSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch courses and staff data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Parse filters appropriately
        const level = parseInt(selectedLevel);
        const semester = selectedSemester !== 'All' ? parseInt(selectedSemester) : null;

        const [coursesRes, staffRes, placesRes] = await Promise.all([
          getCourses(0, level, semester),
          getTeachingStaff(0, '7', null, ''),
          getTeachingPlaces()
        ]);
        
        // Transform course data
        const transformedCourses = coursesRes.results?.map(course => ({
          ...course,
          displayName: `${course.code} - ${course.name}`,
          description: `${course.creditHours} Credit Hours${course.type === 2 ? ' (Lab)' : ''}`
        })) || [];
        
        setCourses(transformedCourses);
        setStaff(staffRes.results || []);
        setPlaces(placesRes.results || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, selectedLevel, selectedSemester]);

  useEffect(() => {
    setFormData({ ...formData, ...data });
  }, [data]);

  // Filter staff and places based on search terms
  const filteredStaff = staff.filter(person =>
    `${person.firstName} ${person.lastName}`.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
    person.userName.toLowerCase().includes(staffSearchTerm.toLowerCase())
  );

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(placeSearchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.courseCode) {
      toast.error('Please select a course');
      return;
    }

    if (!formData.teachingAssistant) {
      toast.error('Please select a teaching assistant');
      return;
    }

    if (!formData.teachingPlace) {
      toast.error('Please select a teaching place');
      return;
    }

    // Validate time range
    if (formData.startFrom >= formData.endTo) {
      toast.error('End time must be after start time');
      return;
    }

    if (formData.endTo > 18) {
      toast.error('End time cannot be after 18:00');
      return;
    }

    if (formData.startFrom < 8) {
      toast.error('Start time cannot be before 8:00');
      return;
    }

    setIsSaving(true);
    try {
      // Save to backend
      const scheduleData = {
        day: data.day,
        startFrom: formData.startFrom,
        endTo: formData.endTo,
        courseCode: formData.courseCode,
        teachingAssistant: formData.teachingAssistant
      };

      // Add schedule to teaching place
      await addTeachingPlaceSchedules(formData.teachingPlace, [scheduleData]);
      
      // Add schedule to teaching assistant
      await addUserSchedules(formData.teachingAssistant, [scheduleData]);

      // Save to SignalR hub
      await onSave(formData);
      
      toast.success('Changes saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error(`Failed to save changes: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {data ? 'Edit Course Schedule' : 'Add New Course Schedule'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              {/* Year Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Year Level</label>
                <div className="flex flex-wrap gap-2">
                  {['1', '2', '3', '4'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedLevel(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLevel === level
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Year {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semester Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <div className="flex flex-wrap gap-2">
                  {['All', '1', '2'].map((semester) => (
                    <button
                      key={semester}
                      type="button"
                      onClick={() => setSelectedSemester(semester)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSemester === semester
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {semester === 'All' ? 'All Semesters' : `Semester ${semester}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Available Courses</label>
              {error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : courses.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No courses available for the selected filters
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, courseCode: course.code })}
                      className={`p-3 text-sm rounded-lg border transition-colors text-left ${
                        formData.courseCode === course.code
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      <div className="font-medium truncate">{course.displayName}</div>
                      <div className="flex gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                          {course.description}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                          Semester {course.semester}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Teaching Staff Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Teaching Assistant</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={staffSearchTerm}
                  onChange={(e) => setStaffSearchTerm(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {filteredStaff.map((person) => (
                  <button
                    key={person.userName}
                    type="button"
                    onClick={() => setFormData({ ...formData, teachingAssistant: person.userName })}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      formData.teachingAssistant === person.userName
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    <div className="font-medium truncate">{`${person.firstName} ${person.lastName}`}</div>
                    <div className="text-xs text-gray-500 truncate">{person.userName}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Teaching Place Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Teaching Place</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search places..."
                  value={placeSearchTerm}
                  onChange={(e) => setPlaceSearchTerm(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {filteredPlaces.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, teachingPlace: place.name })}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      formData.teachingPlace === place.name
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    <div className="font-medium truncate">{place.name}</div>
                    {place.description && (
                      <div className="text-xs text-gray-500 truncate">{place.description}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FiClock className="inline mr-1" />
                  Start Time
                </label>
                <select
                  value={formData.startFrom}
                  onChange={(e) => setFormData({ ...formData, startFrom: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {TIME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FiClock className="inline mr-1" />
                  End Time
                </label>
                <select
                  value={formData.endTo}
                  onChange={(e) => setFormData({ ...formData, endTo: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {TIME_OPTIONS.filter(option => option.value > formData.startFrom).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const ManageTimeTable = () => {
  const isProduction = import.meta.env.PROD;
  const URL = import.meta.env.VITE_API_URL;
  const KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = isProduction ? '/api/proxy' : `${URL}/api`;

  // Connection refs and state
  const connectionRef = useRef(null);
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const isMounted = useRef(true);
  const keepAliveIntervalRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Timetable state
  const [selectedYear, setSelectedYear] = useState('First');
  const [timetableData, setTimetableData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timetableNames, setTimetableNames] = useState([]);
  const [activeTimeTable, setActiveTimeTable] = useState(null);

  // Modal and cell editing states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCellData, setEditingCellData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [searchHours, setSearchHours] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Time slots and days definitions
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8; // Start from 8 AM
    return `${hour}:00 - ${hour + 1}:00`;
  });

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  // Helper to get time slot string from hours
  const getTimeSlotString = (startHour) => {
    return `${startHour}:00 - ${startHour + 1}:00`;
  };

  // Helper to get cell key
  const getCellKey = (day, startHour) => {
    return `${day}-${getTimeSlotString(startHour)}`;
  };

  // Local storage key for timetable data
  const getTableStorageKey = (level) => `timetable_level_${level}`;

  // Store timetable data in state and localStorage
  const storeTimeTable = useCallback((data) => {
    if (!data) return;
    
    try {
      const transformedData = transformTimetableData(data);
      setTimetableData(transformedData);
      
      // Store in localStorage
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

  // Transform timetable data helper
  const transformTimetableData = useCallback((data) => {
    console.log('Raw timetable data:', data);
    const transformedData = {};
    
    if (!data || !data.table) {
      console.warn('Invalid timetable data received:', data);
      return transformedData;
    }
    
    try {
      Object.entries(data.table).forEach(([day, slots]) => {
        console.log(`Processing day ${day}:`, slots);
        
        if (!Array.isArray(slots)) {
          console.warn(`Invalid slots for day ${day}:`, slots);
          return;
        }

        slots.forEach(slot => {
          if (!slot) return;

          // Validate required fields
          if (typeof slot.startFrom === 'undefined' || typeof slot.endTo === 'undefined') {
            console.warn('Invalid slot data:', slot);
            return;
          }

          // Create time slot key
          const timeKey = getCellKey(day, slot.startFrom);
          console.log('Processing slot:', timeKey, slot);

          // Determine course type and color
          const isLab = slot.courseCode?.toLowerCase().includes('lab');
          const courseType = isLab ? 'Lab' : 'Lecture';
          const baseColor = isLab ? 'bg-blue-100' : 'bg-yellow-100';
          const hoverColor = isLab ? 'hover:bg-blue-200' : 'hover:bg-yellow-200';

          transformedData[timeKey] = {
            course: slot.courseCode || 'Unknown',
            instructor: slot.teachingAssistant || 'TBD',
            room: slot.teachingPlace || 'TBD',
            type: courseType,
            color: `${baseColor} ${hoverColor}`,
            startFrom: slot.startFrom,
            endTo: slot.endTo,
            raw: slot // Keep raw data for debugging
          };
        });
      });

      console.log('Transformed timetable data:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error transforming timetable data:', error);
      return {};
    }
  }, []);

  // Initialize SignalR connection
  const initializeSignalR = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      // Close existing connection
      if (connectionRef.current) {
        try {
          await connectionRef.current.stop();
        } catch (err) {
          console.warn('Error stopping existing connection:', err);
        }
        connectionRef.current = null;
      }

      const newConnection = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/TimeTableHub`, {
          headers: {
            'x-api-key': KEY,
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
          skipNegotiation: false,
          transport: HttpTransportType.LongPolling,
          serverTimeoutInMilliseconds: 100000,
        })
        .withHubProtocol(new signalR.JsonHubProtocol())
        .withAutomaticReconnect([0, 2000, 5000, 10000, null]) // Retry at 0ms, 2s, 5s, 10s, then stop
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      newConnection.on('generateTimeTableContextResult', (result) => {
        if (!isMounted.current) return;
        console.log('Received generate result:', result);
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          storeTimeTable(result);
          toast.success('Timetable generated successfully');
        } else {
          toast.error(`Failed to generate timetable: ${mappedResult.error || 'Unknown error'}`);
        }
      });

      newConnection.on('getTimeTablesContextResult', (names) => {
        if (!isMounted.current) return;
        if (Array.isArray(names)) {
          setTimetableNames(names);
        }
      });

      newConnection.on('loadTimeTableContextResult', (result) => {
        if (!isMounted.current) return;
        console.log('Received load result:', result);
        
        const mappedResult = mapResultObject(result);
        if (mappedResult.success) {
          storeTimeTable(result);
          toast.success('Timetable loaded successfully');
        } else {
          toast.error(`Failed to load timetable: ${mappedResult.error || 'Unknown error'}`);
        }
      });

      // Add connection status handlers
      newConnection.onreconnecting(() => {
        if (isMounted.current) {
          setIsConnected(false);
          setConnectionError('Reconnecting...');
          toast.warning('Connection lost. Attempting to reconnect...', {
            autoClose: false,
            toastId: 'reconnecting'
          });
        }
      });

      newConnection.onreconnected(() => {
        if (isMounted.current) {
          setIsConnected(true);
          setConnectionError(null);
          toast.dismiss('reconnecting');
          toast.success('Connection reestablished');
          
          // Reload current timetable data
          const level = yearToLevel[selectedYear];
          newConnection.invoke('loadTimeTableContext', level.toString())
            .catch(err => {
              console.error('Error reloading data after reconnection:', err);
              toast.error('Failed to reload data after reconnection');
            });
        }
      });

      newConnection.onclose((error) => {
        if (isMounted.current) {
          setIsConnected(false);
          setConnectionError(error ? `Connection closed: ${error.message}` : 'Connection closed');
          toast.error('Connection lost');
        }
      });

      // Start the connection
      try {
        await newConnection.start();
        connectionRef.current = newConnection;
        setConnection(newConnection);
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;

        // Initial data load
        const level = yearToLevel[selectedYear];
        await newConnection.invoke('loadTimeTableContext', level.toString());
        await newConnection.invoke('getTimeTablesContext');

        toast.success('Connected successfully');
      } catch (startError) {
        console.error('Error starting connection:', startError);
        throw new Error(`Failed to start connection: ${startError.message}`);
      }

    } catch (error) {
      console.error('SignalR Connection Error:', error);
      if (isMounted.current) {
        setIsConnected(false);
        setConnectionError(`Connection failed: ${error.message}`);
        toast.error('Failed to connect', {
          autoClose: false,
          toastId: 'connection-error'
        });
      }
    }
  }, [BASE_URL, KEY, selectedYear, storeTimeTable]);

  // Add retry connection handler with debounce
  const handleRetryConnection = useCallback(async () => {
    if (!isMounted.current) return;

    toast.dismiss('connection-error');
    toast.info('Retrying connection...');
    
    try {
      await initializeSignalR();
    } catch (error) {
      console.error('Retry failed:', error);
      toast.error('Retry failed. Please try again.');
    }
  }, [initializeSignalR]);

  // Connection status indicator component
  const ConnectionStatus = () => (
    <div className={`fixed bottom-4 right-4 z-50 rounded-lg p-4 shadow-lg transition-all duration-300 ${
      isConnected ? 'bg-green-100' : 'bg-red-100'
    }`}>
      <div className="flex items-center gap-3">
        {isConnected ? (
          <>
            <FiWifi className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Connected</span>
          </>
        ) : (
          <>
            <FiWifiOff className="h-5 w-5 text-red-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-red-700">
                {connectionError || 'Disconnected'}
              </span>
              <button
                onClick={handleRetryConnection}
                className="mt-2 px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Handle year change
  const handleYearChange = async (year) => {
    try {
      setIsLoading(true);
      setSelectedYear(year);
      
      if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
        throw new Error('Not connected to server');
      }

      const level = yearToLevel[year];
      await connectionRef.current.invoke('loadTimeTableContext', level.toString());
      
      // Clear any existing timetable data
      setTimetableData({});
      
      // Try to load from local storage first while waiting for server response
      const storedData = localStorage.getItem(getTableStorageKey(level));
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        storeTimeTable(parsedData);
      }

    } catch (error) {
      console.error('Error loading timetable:', error);
      toast.error(`Failed to load timetable: ${error.message}`);
      
      // Try to load from local storage as fallback
      const level = yearToLevel[year];
      const storedData = localStorage.getItem(getTableStorageKey(level));
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        storeTimeTable(parsedData);
        toast.info('Loaded timetable from local storage');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle generate timetable
  const handleGenerateTimetable = async () => {
    if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      toast.error('Not connected to server');
      return;
    }

    setIsLoading(true);
    try {
      const level = yearToLevel[selectedYear];
      const excludeModel = {
        PlacesId: [],
        CoursesId: [],
        StaffUserName: []
      };
      
      await connectionRef.current.invoke('generateTimeTableContext', excludeModel, level);
      toast.info('Generating timetable...');
    } catch (error) {
      console.error('Error generating timetable:', error);
      toast.error(`Failed to generate timetable: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save timetable
  const handleSaveTimetable = async () => {
    if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      toast.error('Not connected to server');
      return;
    }

    setIsSaving(true);
    try {
      const level = yearToLevel[selectedYear];
      await connectionRef.current.invoke('saveCurrentTimeTableContext', `Level${level}_${new Date().toISOString()}`);
      toast.success('Timetable saved successfully');
      
      // Refresh timetable list
      await connectionRef.current.invoke('getTimeTablesContext');
    } catch (error) {
      console.error('Error saving timetable:', error);
      toast.error(`Failed to save timetable: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle undo
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

  // Handle redo
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

  // Add cell interaction handlers
  const handleCellClick = (day, slot, cellData) => {
    if (!isConnected) {
      toast.warning('Please connect to the server first');
      return;
    }

    const startHour = parseInt(slot.split(' - ')[0]);
    const endHour = parseInt(slot.split(' - ')[1]);

    const payload = {
      day,
      interval: {
        startFrom: startHour,
        endTo: endHour,
        info: cellData ? {
          courseCode: cellData.course,
          courseType: cellData.type || 1,
          courseLevel: yearToLevel[selectedYear],
          teachingPlace: cellData.room,
          teachingAssistant: cellData.instructor
        } : null
      }
    };

    setSelectedCell({ day, slot, cellData });
    const event = new CustomEvent('moveCourseFromCell', { detail: payload });
    window.dispatchEvent(event);
  };

  const handleCellDelete = (day, slot, cellData) => {
    if (!isConnected || !cellData) return;

    if (window.confirm('Are you sure you want to delete this course?')) {
      const startHour = parseInt(slot.split(' - ')[0]);
      const endHour = parseInt(slot.split(' - ')[1]);

      const payload = {
        day,
        interval: {
          startFrom: startHour,
          endTo: endHour,
          info: {
            courseCode: cellData.course,
            courseType: cellData.type || 1,
            courseLevel: yearToLevel[selectedYear],
            teachingPlace: cellData.room,
            teachingAssistant: cellData.instructor
          }
        }
      };

      const event = new CustomEvent('deleteCourseFromTable', { detail: payload });
      window.dispatchEvent(event);
    }
  };

  // Handle cell edit
  const handleCellEdit = (day, slot, cellData) => {
    setEditingCellData({
      day,
      slot,
      ...cellData,
      courseCode: cellData?.course,
      teachingAssistant: cellData?.instructor,
      teachingPlace: cellData?.room
    });
    setIsEditModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = (formData) => {
    if (!connectionRef.current || !editingCellData) return;

    const payload = {
      level: yearToLevel[selectedYear],
      day: editingCellData.day,
      interval: {
        startFrom: parseInt(formData.startFrom),
        endTo: parseInt(formData.endTo),
        info: {
          courseCode: formData.courseCode,
          courseType: formData.type || 1,
          courseLevel: yearToLevel[selectedYear],
          teachingPlace: formData.teachingPlace,
          teachingAssistant: formData.teachingAssistant
        }
      }
    };

    try {
      if (editingCellData.course) {
        // If editing existing cell, first remove it
        const removeEvent = new CustomEvent('deleteCourseFromTable', {
          detail: {
            day: editingCellData.day,
            interval: {
              startFrom: editingCellData.startFrom,
              endTo: editingCellData.endTo,
              info: {
                courseCode: editingCellData.course,
                courseType: editingCellData.type || 1,
                courseLevel: yearToLevel[selectedYear],
                teachingPlace: editingCellData.room,
                teachingAssistant: editingCellData.instructor
              }
            }
          }
        });
        window.dispatchEvent(removeEvent);
      }

      // Add new interval
      connectionRef.current.invoke('addInterval', payload);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving cell:', error);
      toast.error(`Failed to save changes: ${error.message}`);
    }
  };

  // Search handlers
  const handleStaffSearch = async () => {
    if (!connectionRef.current || !searchHours) return;

    try {
      const result = await connectionRef.current.invoke('findAvailableStaff', parseInt(searchHours));
      setSearchResults(result);
    } catch (error) {
      console.error('Error searching staff:', error);
      toast.error(`Failed to search staff: ${error.message}`);
    }
  };

  const handlePlaceSearch = async () => {
    if (!connectionRef.current || !searchHours) return;

    try {
      const result = await connectionRef.current.invoke('findAvailablePlaces', parseInt(searchHours));
      setSearchResults(result);
    } catch (error) {
      console.error('Error searching places:', error);
      toast.error(`Failed to search places: ${error.message}`);
    }
  };

  // Cell component with context menu
  const TableCell = ({ day, slot, cellData }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Handle click outside menu
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setShowMenu(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCellClick = () => {
      if (!cellData) {
        handleCellEdit(day, slot, null);
      }
    };

    return (
      <td className="relative p-0 border border-gray-200">
        <div
          onClick={handleCellClick}
          className={`min-h-[80px] p-3 transition-all duration-200 ${
            cellData 
              ? `${cellData.color} hover:brightness-95` 
              : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
          } relative group`}
        >
          {cellData ? (
            <>
              <div className="space-y-1">
                <div className="font-medium text-gray-900">{cellData.course}</div>
                <div className="text-sm text-gray-600">{cellData.instructor}</div>
                <div className="text-sm text-gray-600">{cellData.room}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5"
              >
                <FiMoreVertical className="h-4 w-4 text-gray-600" />
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Click to add
            </div>
          )}

          {showMenu && cellData && (
            <div 
              ref={menuRef}
              className="absolute right-2 top-8 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 py-1 divide-y divide-gray-100"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  handleCellEdit(day, slot, cellData);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiEdit2 className="mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  handleCellDelete(day, slot, cellData);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    );
  };

  // Update the table rendering to use the new TableCell component
  const renderTimetableGrid = () => {
    console.log('Rendering timetable grid with data:', timetableData);
    
    return (
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Time / Day
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Array.from({ length: 11 }, (_, i) => {
                  const startHour = i + 8; // Start from 8 AM
                  const timeSlot = getTimeSlotString(startHour);
                  
                  return (
                    <tr key={timeSlot} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {timeSlot}
                      </td>
                      {days.map((day) => {
                        const key = getCellKey(day, startHour);
                        const cellData = timetableData[key];
                        console.log(`Cell ${key}:`, cellData);
                        
                        return (
                          <TableCell
                            key={key}
                            day={day}
                            slot={timeSlot}
                            cellData={cellData}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Add search functionality components
  const SearchSection = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Search Available Slots</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hours Required
          </label>
          <input
            type="number"
            value={searchHours}
            onChange={(e) => setSearchHours(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter hours"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => handleStaffSearch()}
            disabled={!isConnected || !searchHours}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            Search Staff
          </button>
          <button
            onClick={() => handlePlaceSearch()}
            disabled={!isConnected || !searchHours}
            className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
          >
            Search Places
          </button>
        </div>
      </div>
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Search Results</h4>
          <div className="max-h-60 overflow-y-auto">
            {/* Render search results here */}
          </div>
        </div>
      )}
    </div>
  );

  // Initialize connection on mount
  useEffect(() => {
    initializeSignalR();

    return () => {
      isMounted.current = false;
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
    };
  }, [initializeSignalR]);

  // Add this function near the top of the file, after the imports
  const handleSetActiveTimeTable = async (connection, tableName) => {
    if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
      toast.error('Not connected to server');
      return;
    }

    try {
      await connection.invoke('setActiveTimeTableContext', tableName);
      toast.success('Timetable set as active successfully');
    } catch (error) {
      console.error('Error setting active timetable:', error);
      toast.error(`Failed to set active timetable: ${error.message}`);
    }
  };

  // Add this function in the ManageTimeTable component
  const handleDeleteTimetable = async (tableName) => {
    if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      toast.error('Not connected to server');
      return;
    }

    if (window.confirm(`Are you sure you want to delete timetable "${tableName}"?`)) {
      try {
        await connectionRef.current.invoke('deleteTimeTableContext', tableName);
        toast.success('Timetable deleted successfully');
        // Refresh timetable list
        await connectionRef.current.invoke('getTimeTablesContext');
      } catch (error) {
        console.error('Error deleting timetable:', error);
        toast.error(`Failed to delete timetable: ${error.message}`);
      }
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <ConnectionStatus />
      
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Timetable
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage class schedules efficiently
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleGenerateTimetable}
              disabled={!isConnected || isLoading}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Auto Generate
            </button>
            <button
              onClick={handleSaveTimetable}
              disabled={!isConnected || isSaving}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
              Save Changes
            </button>
          </div>
        </div>

        {/* Year Selection and Timetable Controls */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Select Year:</h3>
              <div className="flex flex-wrap gap-2">
                {['First', 'Second', 'Third', 'Fourth'].map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year)}
                    disabled={!isConnected}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedYear === year
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={!isConnected}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiRotateCcw className="mr-2 h-4 w-4" />
                Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={!isConnected}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiRotateCw className="mr-2 h-4 w-4" />
                Redo
              </button>
            </div>
          </div>

          {/* Saved Timetables */}
          {timetableNames.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="text-sm text-gray-600 min-w-[120px]">
                  Saved timetables:
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <div className="relative inline-block w-full sm:w-64">
                    <select
                      className="block w-full p-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white pr-10"
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
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <FiChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleLoadActiveTimeTable}
                      disabled={!isConnected || isLoading}
                      className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <FiDownload className="h-4 w-4" />
                      <span>Load Active</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        const select = document.querySelector('select');
                        const selectedName = select.value;
                        if (selectedName) {
                          handleSetActiveTimeTable(connectionRef.current, selectedName);
                        } else {
                          toast.warning('Please select a timetable first');
                        }
                      }}
                      disabled={!isConnected || isLoading}
                      className="px-3 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <FiCheck className="h-4 w-4" />
                      <span>Set as Active</span>
                    </button>

                    <button
                      onClick={() => {
                        const select = document.querySelector('select');
                        const selectedName = select.value;
                        if (selectedName) {
                          handleDeleteTimetable(selectedName);
                        } else {
                          toast.warning('Please select a timetable first');
                        }
                      }}
                      disabled={!isConnected || isLoading}
                      className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <FiTrash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {selectedYear} Year Timetable
            </h2>
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
          {renderTimetableGrid()}
        </div>
      </div>

      {/* Legend Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Legend</h3>
            <div className="flex flex-wrap gap-4">
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
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="grid grid-cols-1 gap-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Total Classes</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {Object.keys(timetableData).length}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Theory Sessions</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {Object.values(timetableData).filter(d => !d.course?.includes('Lab')).length}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Lab Sessions</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {Object.values(timetableData).filter(d => d.course?.includes('Lab')).length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={editingCellData}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

// Helper function to map result object
const mapResultObject = (result) => {
  return {
    success: result.isSuccess,
    error: result.errorMessage,
    exception: result.exception,
    data: result.data
  };
};

export default ManageTimeTable;