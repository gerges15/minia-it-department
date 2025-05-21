import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HubConnectionBuilder, HttpTransportType, LogLevel, HubConnectionState } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import TimetableView from './TimetableView'; // Import the timetable component
import { 
  Button, 
  Select, 
  MenuItem, 
  TextField, 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Divider, 
  Stack, 
  Alert, 
  Snackbar, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  FormHelperText,
  IconButton,
  Tooltip as MuiTooltip,
  Badge,
  useMediaQuery,
  useTheme
} from '@mui/material';
import './TimetableStyles.css';
import Cookies from 'js-cookie';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { styled } from '@mui/material/styles';

// Styled components for better UI
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: 'var(--shadow-lg)',
  borderRadius: 'var(--border-radius-md)',
  height: '100%',
  width: '100%',
  transition: 'all var(--transition-normal)',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid var(--gray-200)',
  '&:hover': {
    boxShadow: 'var(--shadow-xl)',
    transform: 'translateY(-3px)'
  }
}));

const ControlButton = styled(Button)(({ theme, fullWidth }) => ({
  borderRadius: 'var(--border-radius-full)',
  textTransform: 'none',
  fontWeight: 'bold',
  padding: '0.5rem 1.25rem',
  transition: 'all var(--transition-normal)',
  boxShadow: 'var(--shadow-sm)',
  width: fullWidth ? '100%' : 'auto',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-md)'
  },
  '&:disabled': {
    backgroundColor: 'var(--gray-300)',
    color: 'var(--gray-600)'
  }
}));

const ConnectionStatusBox = styled(Box)(({ theme, connected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: 'var(--border-radius)',
  backgroundColor: connected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
  color: connected ? 'var(--success)' : 'var(--danger)',
  borderLeft: `4px solid ${connected ? 'var(--success)' : 'var(--danger)'}`,
  marginBottom: theme.spacing(2),
  transition: 'all var(--transition-normal)'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 'var(--border-radius)',
    transition: 'all var(--transition-normal)',
    '&:hover': {
      boxShadow: 'var(--shadow-sm)'
    },
    '&.Mui-focused': {
      boxShadow: 'var(--shadow-md)'
    }
  }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: 'var(--border-radius)',
  '& .MuiOutlinedInput-notchedOutline': {
    transition: 'all var(--transition-normal)'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--primary)'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--primary)',
    borderWidth: '2px',
    boxShadow: 'var(--shadow-sm)'
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 'var(--border-radius)',
  transition: 'all var(--transition-normal)',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-sm)'
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme, color = 'primary' }) => ({
  backgroundColor: `var(--${color})`,
  color: 'white',
  fontWeight: 'bold',
  padding: theme.spacing(2),
  borderBottom: '1px solid var(--gray-200)'
}));

const ControlStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  '& .MuiFormControl-root': {
    width: '100%'
  },
  '& .MuiButton-root': {
    width: '100%'
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-root': {
    width: '100%'
  }
}));

const TimetablePage = () => {
  // Constants
  const tableStorageKey = "tableStorageKey";
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MAX_RECONNECT_ATTEMPTS = 5;
  
  // State variables
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [intervalPopupOpen, setIntervalPopupOpen] = useState(false);
  const [timeTables, setTimeTables] = useState([]);
  const [selectedTimeTable, setSelectedTimeTable] = useState('');
  const [fileName, setFileName] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [requiredHours, setRequiredHours] = useState('');
  const [day, setDay] = useState(0);
  const [startFrom, setStartFrom] = useState('');
  const [endTo, setEndTo] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseType, setCourseType] = useState(0);
  const [teachingPlace, setTeachingPlace] = useState('');
  const [teachingAssistant, setTeachingAssistant] = useState('');
  const [courses, setCourses] = useState([]);
  const [teachingPlaces, setTeachingPlaces] = useState([]);
  const [teachingStaff, setTeachingStaff] = useState([]);
  const [movePayload, setMovePayload] = useState(null);
  const [timetableData, setTimetableData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Refs for tracking reconnection attempts
  const reconnectAttempts = useRef(0);
  const initialConnectionEstablished = useRef(false);

  // Configuration
  const isProduction = import.meta.env.PROD;
  const accessToken = Cookies.get('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const BASE_URL = isProduction ? '/api/proxy' : `${apiUrl}/api`;

  // Add theme and mediaQuery hook for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Helper function for displaying notifications
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Get table context data with error handling
  const getTableContextData = useCallback(() => {
    try {
      if (localStorage.getItem(tableStorageKey) === null) return null;
      return JSON.parse(localStorage.getItem(tableStorageKey));
    } catch (error) {
      console.error('Error parsing table data:', error);
      showNotification('Failed to load saved timetable data', 'error');
      return null;
    }
  }, []);
  
  // Initialize SignalR connection with retries and better error handling
  const initializeSignalR = useCallback(async () => {
    if (connection) return; // Prevent multiple connection attempts

    try {
      if (!accessToken) {
        throw new Error('Authentication token is missing');
      }

      setConnectionError(null);
      setIsLoading(true);

      // Create connection with improved settings
        const newConnection = new HubConnectionBuilder()
          .withUrl(`${BASE_URL}/TimeTableHub`, {
            headers: {
              'x-api-key': apiKey,
              Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true,
          // Force Long Polling since WebSockets appear to be unstable in this environment
          transport: HttpTransportType.LongPolling,
          // Disable skip negotiation to ensure protocol compatibility
          skipNegotiation: false
        })
        .configureLogging(LogLevel.Debug) // Upgrade to Debug level for more detailed logs
        // Improve reconnection strategy with more frequent attempts
        .withAutomaticReconnect([0, 1000, 2000, 5000, 10000, 15000, 30000])
        // Add server timeout options for better stability
        .withServerTimeout(120000) // 120 seconds server timeout (increase for long polling)
        .withKeepAliveInterval(10000) // 10 seconds keep-alive
          .build();

      // Ping mechanism optimized for Long Polling
      let pingInterval;
      const startPingInterval = () => {
        // Clear any existing interval first
        if (pingInterval) clearInterval(pingInterval);
        
        // Send a ping every 20 seconds (longer interval for Long Polling)
        pingInterval = setInterval(async () => {
          try {
            if (newConnection && (newConnection.state === signalR.HubConnectionState.Connected)) {
              console.debug(`Sending ping at ${new Date().toISOString()}`);
              
              // Try multiple ping methods in case server doesn't support one
              try {
                // For debugging, check connection state before ping
                console.debug(`Connection state before ping: ${newConnection.state}`);
                
                // Simple ping method
                await newConnection.invoke("Ping").catch(() => {
                  // Try a simple invocation that's likely supported
                  return newConnection.invoke("Heartbeat").catch(() => {
                    // If that fails too, just make a simple call to keep connection alive
                    return newConnection.invoke("getTimeTablesContext");
                  });
                });
                
                // Check connection state after successful ping
                console.debug(`Connection state after ping: ${newConnection.state}`);
              } catch (error) {
                // If all invokes fail, try a simpler approach: just send a message
                console.warn(`All ping methods failed, using basic message: ${error}`);
                try {
                  await newConnection.send("ClientPing");
                } catch (sendError) {
                  console.error(`Even basic messaging failed: ${sendError}`);
                }
              }
            } else {
              // Log connection state for debugging
              console.warn(`Cannot ping - connection state: ${newConnection?.state || 'No connection'}`);
              
              // If connection is in a Disconnected state, try to reconnect
              if (newConnection && newConnection.state === signalR.HubConnectionState.Disconnected) {
                console.log("Connection appears disconnected during ping. Attempting reconnect...");
                try {
                  await newConnection.start();
                  console.log("Reconnected successfully during ping cycle");
                  showNotification("Connection restored", "success");
                } catch (startError) {
                  console.error(`Failed to reconnect during ping cycle: ${startError}`);
                }
              }
            }
          } catch (error) {
            console.warn(`Ping failed: ${error}`);
          }
        }, 20000); // Increased from 10s to 20s for Long Polling
      };

      // State management with improved logging
      newConnection.onreconnecting((error) => {
        console.warn('SignalR reconnecting:', error);
        setIsConnected(false);
        showNotification('Connection lost. Attempting to reconnect...', 'warning');
      });

      newConnection.onreconnected((connectionId) => {
        console.log('SignalR reconnected with ID:', connectionId);
        setIsConnected(true);
        showNotification('Connection restored', 'success');
        // Restart ping mechanism
        startPingInterval();
        // Refresh data after reconnection
        reloadTimeTable();
      });

      newConnection.onclose((error) => {
        console.error('SignalR connection closed:', error);
        setIsConnected(false);
        showNotification('Connection closed. Please refresh the page.', 'error');
        
        // Clear ping interval when connection is closed
        if (pingInterval) {
          clearInterval(pingInterval);
          pingInterval = undefined;
        }
        
        // Attempt to reconnect manually if automatic reconnection fails
        setTimeout(() => {
          if (!isConnected && initialConnectionEstablished.current) {
            console.log("Attempting manual reconnection after connection close");
            initializeSignalR();
          }
        }, 5000);
      });

      // Set up event handlers with improved error handling
        newConnection.on('generateTimeTableContextResult', (result) => {
        try {
          storeTimeTable(result);
          reloadTimeTable();
          showNotification('Timetable generated successfully', 'success');
        } catch (error) {
          console.error('Error processing generated timetable:', error);
          showNotification('Failed to process generated timetable', 'error');
        }
        });
        
        newConnection.on('getTimeTablesContextResult', (names) => {
        try {
          setTimeTables(names || []);
          if (names && names.length > 0) {
            showNotification(`${names.length} timetables loaded`, 'success');
          } else {
            showNotification('No timetables found', 'info');
          }
        } catch (error) {
          console.error('Error processing timetable list:', error);
          showNotification('Failed to load timetable list', 'error');
        }
        });
        
        newConnection.on('findValidStaffResult', (result) => {
        try {
          setSearchResults(result || {});
          showNotification('Staff search completed', 'success');
        } catch (error) {
          console.error('Error processing staff search results:', error);
          showNotification('Failed to process staff search results', 'error');
        }
        });
        
        newConnection.on('findValidPlacesResult', (result) => {
        try {
          setSearchResults(result || {});
          showNotification('Places search completed', 'success');
        } catch (error) {
          console.error('Error processing places search results:', error);
          showNotification('Failed to process places search results', 'error');
        }
        });
        
        newConnection.on('loadTimeTableContextResult', (result) => {
        try {
          storeTimeTable(result);
          reloadTimeTable();
          showNotification('Timetable loaded successfully', 'success');
        } catch (error) {
          console.error('Error loading timetable:', error);
          showNotification('Failed to load timetable', 'error');
        }
        });
        
        newConnection.on('deleteTimeTableContextResult', (result) => {
        try {
          if (result.isSuccess) {
            localStorage.removeItem(tableStorageKey);
            reloadTimeTable();
            showNotification('Timetable deleted successfully', 'success');
          } else {
            showNotification(`Failed to delete timetable: ${result.error}`, 'error');
          }
        } catch (error) {
          console.error('Error processing delete result:', error);
          showNotification('Failed to process delete operation', 'error');
          }
        });
        
        newConnection.on('setActiveTimeTableContextResult', (result) => {
        try {
          if (result.isSuccess) {
            showNotification('Timetable set as active successfully', 'success');
          } else {
            showNotification(`Failed to set active timetable: ${result.error}`, 'error');
          }
        } catch (error) {
          console.error('Error setting active timetable:', error);
          showNotification('Failed to set active timetable', 'error');
        }
        });
        
        newConnection.on('undoResult', (result) => {
        try {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
            showNotification('Undo operation successful', 'success');
          } else {
            showNotification(`Undo failed: ${result.error}`, 'error');
          }
        } catch (error) {
          console.error('Error processing undo result:', error);
          showNotification('Failed to process undo operation', 'error');
          }
        });
        
        newConnection.on('redoResult', (result) => {
        try {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
            showNotification('Redo operation successful', 'success');
          } else {
            showNotification(`Redo failed: ${result.error}`, 'error');
          }
        } catch (error) {
          console.error('Error processing redo result:', error);
          showNotification('Failed to process redo operation', 'error');
          }
        });
        
        newConnection.on('loadActiveTimeTableContextResult', (result) => {
        try {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
            showNotification('Active timetable loaded successfully', 'success');
          } else {
            showNotification(`Failed to load active timetable: ${result.error}`, 'error');
          }
        } catch (error) {
          console.error('Error loading active timetable:', error);
          showNotification('Failed to load active timetable', 'error');
          }
        });
        
        newConnection.on('addIntervalResult', (result) => {
        try {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
            showNotification('Interval added successfully', 'success');
          } else {
            showNotification(`Failed to add interval: ${result.error}`, 'error');
          }
        } catch (error) {
          console.error('Error adding interval:', error);
          showNotification('Failed to process add interval operation', 'error');
          }
        });
        
        newConnection.on('removeIntervalResult', (result) => {
        try {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
            showNotification('Interval removed successfully', 'success');
          } else {
            showNotification(`Failed to remove interval: ${result.error}`, 'error');
          }
        } catch (error) {
          console.error('Error removing interval:', error);
          showNotification('Failed to process remove interval operation', 'error');
          }
        });
        
        newConnection.on('moveIntervalResult', (result) => {
        try {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
            showNotification('Interval moved successfully', 'success');
          } else {
            showNotification(`Failed to move interval: ${result.error}`, 'error');
          }
        } catch (error) {
          console.error('Error moving interval:', error);
          showNotification('Failed to process move interval operation', 'error');
        }
      });

      // Start the connection with improved retry logic for Long Polling
      const startConnection = async () => {
        try {
          // Check if we're offline first
          if (!navigator.onLine) {
            console.error("Browser reports offline status - cannot connect");
            showNotification("You appear to be offline. Please check your internet connection.", "error");
            // Set a listener to try reconnecting when online
            window.addEventListener('online', () => {
              console.log("Browser reports online - attempting to reconnect");
              showNotification("You're back online. Reconnecting...", "info");
              initializeSignalR();
            }, { once: true });
            return;
          }
          
          // Add delay to avoid simultaneous connection attempts
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Start connection with enhanced logging
          console.log(`Starting SignalR connection (${new Date().toISOString()})...`);
          
          // Monitor connection attempt duration for debug purposes
          const startTime = Date.now();
        await newConnection.start();
          const connectionTime = Date.now() - startTime;
          
          console.log(`SignalR connected successfully in ${connectionTime}ms with state: ${newConnection.state}`);
        setIsConnected(true);
          reconnectAttempts.current = 0;
          initialConnectionEstablished.current = true;
          
          // Start the ping mechanism to keep connection alive
          startPingInterval();
          
          showNotification('Connected to server', 'success');
          setConnection(newConnection);
          
          // Connection health check
          try {
            // Use a safe method that should exist
            const healthCheckStartTime = Date.now();
            await newConnection.invoke("getTimeTablesContext").catch(() => {
              console.log("Could not invoke getTimeTablesContext, but connection is established");
              // Silently ignore - we're testing connection only
            });
            console.log(`Health check completed in ${Date.now() - healthCheckStartTime}ms`);
      } catch (error) {
            console.warn(`Connection health check failed, but connection appears established: ${error}`);
          }
          
          // Return connection for cleanup purposes
          return newConnection;
          
        } catch (error) {
          console.error(`Error starting SignalR connection: ${error.message}`);
          // Log detail about transport
          if (error.transport) {
            console.error(`Failed transport: ${error.transport}`);
          }
          reconnectAttempts.current++;
          
          // Detailed error handling based on error type
          const errorMessage = error.toString().toLowerCase();
          
          // Handle specific error types
          if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
            // Token expired or invalid
            setConnectionError('Authentication failed. Your session may have expired.');
            showNotification('Authentication failed. Please refresh the page to login again.', 'error');
            return; // Don't retry on auth errors
          }
          
          if (errorMessage.includes('cors') || errorMessage.includes('cross-origin')) {
            setConnectionError('Cross-origin request blocked. This might be a server configuration issue.');
            showNotification('Connection blocked by CORS policy. Please contact support.', 'error');
            return; // Don't retry on CORS errors
          }
          
          if (errorMessage.includes('aborted') || errorMessage.includes('timeout')) {
            showNotification('Connection timed out. The server might be under heavy load.', 'warning');
            // Will retry below
          }
          
          // Generic error cases - retry with backoff
          if (reconnectAttempts.current <= MAX_RECONNECT_ATTEMPTS) {
            const retryDelay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            console.log(`Retrying connection in ${retryDelay}ms (attempt ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`);
            showNotification(`Connection failed. Retrying in ${retryDelay/1000} seconds...`, 'warning');
            
            setTimeout(startConnection, retryDelay);
          } else {
            setConnectionError('Failed to connect after multiple attempts. Please refresh the page.');
            showNotification('Connection failed. Please try refreshing the page.', 'error');
          }
        }
      };

      await startConnection();
    } catch (error) {
      console.error('Error initializing SignalR:', error);
      setConnectionError(error.message || 'Failed to initialize connection');
      showNotification('Connection initialization failed: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, apiKey, BASE_URL, connection]);

  // Store timetable data with improved error handling
  const storeTimeTable = useCallback((result) => {
    try {
      if (!result) {
        throw new Error('No data received');
      }
      
    if (result.isSuccess) {
      setFileName(result.data.name);
      localStorage.setItem(tableStorageKey, JSON.stringify(result.data));
      setTimetableData(result.data);
      
      if (Array.isArray(result.data.teachingStaffName)) {
        setTeachingStaff(result.data.teachingStaffName);
      }
      
      if (Array.isArray(result.data.teachingPlacesName)) {
        setTeachingPlaces(result.data.teachingPlacesName);
      }
      
      if (Array.isArray(result.data.inMatchedCourses)) {
        setCourses(result.data.inMatchedCourses);
      }
    } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error storing timetable data:', error);
      showNotification('Failed to store timetable data: ' + error.message, 'error');
    }
  }, []);

  // Reload timetable with error handling
  const reloadTimeTable = useCallback(() => {
    try {
    const data = getTableContextData();
      if (!data) {
        showNotification('No timetable data available', 'info');
        return;
      }
    
    setTimetableData(data);
    
    if (Array.isArray(data.teachingStaffName)) {
      setTeachingStaff(data.teachingStaffName);
    }
    
    if (Array.isArray(data.teachingPlacesName)) {
      setTeachingPlaces(data.teachingPlacesName);
    }
      
      if (Array.isArray(data.inMatchedCourses)) {
        setCourses(data.inMatchedCourses);
      }
    } catch (error) {
      console.error('Error reloading timetable:', error);
      showNotification('Failed to reload timetable: ' + error.message, 'error');
    }
  }, [getTableContextData]);

  // Initialize connection and load data
  useEffect(() => {
    initializeSignalR();
    
    return () => {
      // Clean up connection on component unmount
      if (connection) {
        connection.stop()
          .catch(err => console.error('Error stopping connection:', err));
      }
    };
  }, [initializeSignalR]);

  // Load initial timetable data if available
  useEffect(() => {
    if (isConnected) {
      const savedData = getTableContextData();
      if (savedData) {
        reloadTimeTable();
      }
    }
  }, [isConnected, getTableContextData, reloadTimeTable]);

  // Generic API call handler with retry logic
  const makeSignalRCall = async (methodName, ...args) => {
    if (!connection || !isConnected) {
      showNotification('Not connected to server. Attempting to reconnect...', 'warning');
      await initializeSignalR();
      if (!isConnected) {
        throw new Error('Failed to connect to server');
      }
    }

    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      try {
        setIsFetching(true);
        return await connection.invoke(methodName, ...args);
      } catch (error) {
        console.error(`Error calling ${methodName}:`, error);
        retries++;
        
        if (retries >= maxRetries) {
          throw new Error(`Failed to ${methodName.replace(/([A-Z])/g, ' $1').toLowerCase()} after ${maxRetries} attempts`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      } finally {
        setIsFetching(false);
      }
    }
  };

  // Generate timetable with enhanced error handling
  const handleGenerateTimetable = async () => {
    try {
      setIsLoading(true);
      const excludeModel = {
        PlacesId: [],
        CoursesId: [],
        StaffUserName: []
      };
      
      await makeSignalRCall("generateTimeTableContext", excludeModel, 1);
      showNotification('Generating timetable...', 'info');
    } catch (error) {
      console.error('Error generating timetable:', error);
      showNotification(`Failed to generate timetable: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load timetables with enhanced error handling
  const handleLoadTimetables = async () => {
    try {
      await makeSignalRCall("getTimeTablesContext");
      showNotification('Loading timetables...', 'info');
    } catch (error) {
      console.error('Error loading timetables:', error);
      showNotification(`Failed to load timetables: ${error.message}`, 'error');
    }
  };

  // Select a timetable with enhanced error handling
  const handleSelectTimetable = async (name) => {
    try {
      if (!name) {
        showNotification('Please select a timetable', 'warning');
        return;
      }
      
      setSelectedTimeTable(name);
      await makeSignalRCall("loadTimeTableContext", name);
      showNotification(`Loading timetable: ${name}`, 'info');
    } catch (error) {
      console.error('Error loading timetable:', error);
      showNotification(`Failed to load timetable: ${error.message}`, 'error');
    }
  };

  // Handle saving changes with enhanced error handling
  const handleSaveChanges = async () => {
    try {
      if (!fileName) {
        showNotification('Please enter a name for the timetable', 'warning');
        return;
      }
      
      await makeSignalRCall("setTimeTableNameContext", fileName);
      showNotification(`Timetable saved as: ${fileName}`, 'success');
    } catch (error) {
      console.error('Error saving timetable:', error);
      showNotification(`Failed to save timetable: ${error.message}`, 'error');
    }
  };

  // Handle deleting timetable with enhanced error handling
  const handleDeleteTimetable = async () => {
    try {
      if (!selectedTimeTable) {
        showNotification('Please select a timetable to delete', 'warning');
        return;
      }
      
      const confirmed = window.confirm(`Are you sure you want to delete "${selectedTimeTable}"?`);
      if (!confirmed) return;
      
      await makeSignalRCall("deleteTimeTableContext", selectedTimeTable);
      showNotification(`Deleting timetable: ${selectedTimeTable}`, 'info');
      
      // Reset selection
      setSelectedTimeTable('');
      } catch (error) {
        console.error('Error deleting timetable:', error);
      showNotification(`Failed to delete timetable: ${error.message}`, 'error');
    }
  };

  // Handle setting active timetable with enhanced error handling
  const handleSetActive = async () => {
    try {
      if (!selectedTimeTable) {
        showNotification('Please select a timetable to set as active', 'warning');
        return;
      }
      
      await makeSignalRCall("setActiveTimeTableContext", selectedTimeTable);
      showNotification(`Setting "${selectedTimeTable}" as active timetable`, 'info');
      } catch (error) {
        console.error('Error setting active timetable:', error);
      showNotification(`Failed to set active timetable: ${error.message}`, 'error');
    }
  };

  // Handle loading active timetable with enhanced error handling
  const handleLoadActive = async () => {
    try {
      await makeSignalRCall("loadActiveTimeTableContext");
      showNotification('Loading active timetable', 'info');
    } catch (error) {
      console.error('Error loading active timetable:', error);
      showNotification(`Failed to load active timetable: ${error.message}`, 'error');
    }
  };

  // Handle undo operation with enhanced error handling
  const handleUndo = async () => {
    try {
      await makeSignalRCall("undo");
      showNotification('Undoing last operation', 'info');
    } catch (error) {
      console.error('Error undoing operation:', error);
      showNotification(`Failed to undo: ${error.message}`, 'error');
    }
  };

  // Handle redo operation with enhanced error handling
  const handleRedo = async () => {
    try {
      await makeSignalRCall("redo");
      showNotification('Redoing operation', 'info');
    } catch (error) {
      console.error('Error redoing operation:', error);
      showNotification(`Failed to redo: ${error.message}`, 'error');
    }
  };

  // Handle interval popup
  const handleOpenIntervalPopup = () => {
    // Reset form fields
    setDay(0);
    setStartFrom('');
    setEndTo('');
    setCourseCode('');
    setCourseType(0);
    setTeachingPlace('');
    setTeachingAssistant('');
    
    // Open popup
    setIntervalPopupOpen(true);
  };

  // Handle submitting interval with enhanced error handling
  const handleSubmitInterval = async () => {
    try {
      // Validate inputs
      if (!startFrom || !endTo || !courseCode || !teachingPlace || !teachingAssistant) {
        showNotification('Please fill in all required fields', 'warning');
        return;
      }
      
      const start = parseInt(startFrom);
      const end = parseInt(endTo);
      
      if (isNaN(start) || isNaN(end) || start >= end) {
        showNotification('Invalid time range', 'error');
        return;
      }
      
      const addIntervalModel = {
        Day: day,
        StartFrom: start,
        EndTo: end,
        CourseCode: courseCode,
        CourseType: courseType,
        TeachingPlace: teachingPlace,
        TeachingAssistant: teachingAssistant
      };
      
      await makeSignalRCall("addInterval", addIntervalModel);
      showNotification('Adding interval to timetable', 'info');
      
      // Close popup
      setIntervalPopupOpen(false);
    } catch (error) {
      console.error('Error adding interval:', error);
      showNotification(`Failed to add interval: ${error.message}`, 'error');
    }
  };

  // Handle move course
  const handleMoveCourse = (payload) => {
    if (!payload) {
      showNotification('Invalid move operation', 'error');
      return;
    }
    
    setMovePayload(payload);
  };

  // Handle move payload submitted with enhanced error handling
  const handleMovePayloadSubmitted = async (payload) => {
    try {
      await makeSignalRCall("moveInterval", payload);
      showNotification('Moving interval', 'info');
      setMovePayload(null);
    } catch (error) {
      console.error('Error moving interval:', error);
      showNotification(`Failed to move interval: ${error.message}`, 'error');
      setMovePayload(null);
    }
  };

  // Handle delete course with enhanced error handling
  const handleDeleteCourse = async (payload) => {
    try {
      if (!payload) {
        showNotification('Invalid delete operation', 'error');
        return;
      }
      
      const confirmed = window.confirm('Are you sure you want to delete this course from the timetable?');
      if (!confirmed) return;
      
      const removeIntervalModel = {
        Day: payload.day,
        StartFrom: payload.startFrom,
        EndTo: payload.endTo
      };
      
      await makeSignalRCall("removeInterval", removeIntervalModel);
      showNotification('Removing interval from timetable', 'info');
    } catch (error) {
      console.error('Error deleting course:', error);
      showNotification(`Failed to delete course: ${error.message}`, 'error');
    }
  };

  // Handle search by staff with enhanced error handling
  const handleSearchByStaff = async () => {
    try {
      if (!selectedStaff) {
        showNotification('Please select a staff member', 'warning');
        return;
      }
      
      if (!requiredHours) {
        showNotification('Please enter required hours', 'warning');
        return;
      }
      
    const hours = parseInt(requiredHours);
      if (isNaN(hours) || hours <= 0) {
        showNotification('Invalid hours value', 'error');
        return;
      }
    
      await makeSignalRCall("findValidStaff", selectedStaff, hours);
      showNotification(`Searching available slots for ${selectedStaff}`, 'info');
      } catch (error) {
        console.error('Error searching by staff:', error);
      showNotification(`Failed to search by staff: ${error.message}`, 'error');
    }
  };

  // Handle search by place with enhanced error handling
  const handleSearchByPlace = async () => {
    try {
      if (!selectedPlace) {
        showNotification('Please select a teaching place', 'warning');
        return;
      }
      
      if (!requiredHours) {
        showNotification('Please enter required hours', 'warning');
        return;
      }
      
    const hours = parseInt(requiredHours);
      if (isNaN(hours) || hours <= 0) {
        showNotification('Invalid hours value', 'error');
        return;
      }
    
      await makeSignalRCall("findValidPlaces", selectedPlace, hours);
      showNotification(`Searching available slots for ${selectedPlace}`, 'info');
      } catch (error) {
        console.error('Error searching by place:', error);
      showNotification(`Failed to search by place: ${error.message}`, 'error');
    }
  };

  // Render search results in a user-friendly format
  const renderSearchResults = () => {
    if (!searchResults || Object.keys(searchResults).length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
          No search results available
        </Typography>
      );
    }
      
      return (
      <Grid container spacing={2}>
        {Object.entries(searchResults).map(([day, slots]) => (
          <Grid item xs={12} md={6} key={day}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {day}
              </Typography>
              {slots && slots.length > 0 ? (
                <Stack spacing={1}>
                  {slots.map((slot, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Time:</strong> {slot.startFrom}:00 - {slot.endTo}:00
                      </Typography>
                      {slot.courseCode && (
                        <Typography variant="body2">
                          <strong>Course:</strong> {slot.courseCode}
                        </Typography>
                      )}
                      {slot.teachingPlace && (
                        <Typography variant="body2">
                          <strong>Place:</strong> {slot.teachingPlace}
                        </Typography>
                      )}
                      {slot.teachingAssistant && (
                        <Typography variant="body2">
                          <strong>Staff:</strong> {slot.teachingAssistant}
                        </Typography>
                      )}
              </Box>
            ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No available slots
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Include a Snackbar for notifications
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Enhanced render function for the connection error
  const renderConnectionError = () => {
    if (connectionError) {
  return (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            boxShadow: 2,
            borderRadius: 2
          }}
          action={
            <ControlButton 
              color="inherit" 
              size="small"
              onClick={initializeSignalR}
            >
              Retry
            </ControlButton>
          }
        >
          {connectionError}
        </Alert>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="xl" sx={{ width: '100%' }}>
      {/* Connection status indicator */}
      {renderConnectionError()}
      
      <Box sx={{ my: 4, width: '100%' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <ListAltIcon fontSize="large" />
          Timetable Management
        </Typography>
        
        <Grid container spacing={3} sx={{ width: '100%' }}>
          {/* Control panel - now fills full width on small screens */}
          <Grid item xs={12} md={4} sx={{ width: '100%' }}>
            <StyledPaper sx={{ width: '100%' }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  mb: 3, 
                  fontWeight: 'bold',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 1
                }}
              >
                Controls
              </Typography>
              
              {/* Connection status with improved styling */}
              <ConnectionStatusBox connected={isConnected} sx={{ width: '100%' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: isConnected ? 'success.main' : 'error.main',
                    boxShadow: '0 0 8px',
                    color: isConnected ? 'success.main' : 'error.main'
                  }}
                />
                <Typography variant="body2" fontWeight="medium" sx={{ flex: 1 }}>
                  {isConnected ? 'Connected to server' : 'Disconnected'}
                </Typography>
                
                {!isConnected && (
                  <ControlButton 
                    size="small"
                    variant="outlined"
                    color="inherit"
                    onClick={initializeSignalR}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={16} /> : <RefreshIcon fontSize="small" />}
                  >
                    Reconnect
                  </ControlButton>
                )}
              </ConnectionStatusBox>
              
              <ControlStack spacing={2.5}>
                <ControlButton
                variant="contained"
                color="primary"
                onClick={handleGenerateTimetable}
                disabled={!isConnected || isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                  fullWidth
                >
                  Generate New Timetable
                </ControlButton>
                
                <Divider sx={{ my: 1, width: '100%' }} />
                
                <Box sx={{ width: '100%' }}>
                  <Typography 
                    variant="subtitle2" 
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: 'text.secondary', width: '100%' }}
                  >
                    Manage Saved Timetables
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ width: '100%' }}>
                    <Grid item xs={6}>
                      <ControlButton
                        variant="outlined"
                onClick={handleLoadTimetables}
                        disabled={!isConnected || isFetching}
                        startIcon={<CloudDownloadIcon />}
                        fullWidth
                        size="small"
                      >
                        Load
                      </ControlButton>
                    </Grid>
                    <Grid item xs={6}>
                      <ControlButton
                        variant="outlined"
                        onClick={handleLoadActive}
                        disabled={!isConnected}
                        startIcon={<StarIcon />}
                        fullWidth
                        size="small"
                      >
                        Load Active
                      </ControlButton>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ width: '100%' }}>
                  <Typography 
                    variant="body2" 
                    gutterBottom
                    sx={{ fontWeight: 'medium', width: '100%' }}
                  >
                    Select Timetable
                  </Typography>
                  <StyledFormControl variant="outlined" size="small">
                    <StyledSelect
                value={selectedTimeTable}
                onChange={(e) => handleSelectTimetable(e.target.value)}
                      disabled={!isConnected || timeTables.length === 0}
                displayEmpty
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value="" disabled>
                        <Typography variant="body2" color="text.secondary">
                          {timeTables.length === 0 ? 'No timetables available' : 'Select a timetable'}
                        </Typography>
                      </MenuItem>
                      {timeTables.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </StyledFormControl>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <MuiTooltip title="Delete selected timetable">
                      <span>
                        <IconButton
                          color="error"
                          onClick={handleDeleteTimetable}
                          disabled={!isConnected || !selectedTimeTable}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </MuiTooltip>
                    
                    <MuiTooltip title="Set as active timetable">
                      <span>
                        <IconButton
                          color="success"
                          onClick={handleSetActive}
                          disabled={!isConnected || !selectedTimeTable}
                          size="small"
                        >
                          <StarIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </MuiTooltip>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1, width: '100%' }} />
                
                <Box sx={{ width: '100%' }}>
                  <Typography 
                    variant="body2" 
                    gutterBottom
                    sx={{ fontWeight: 'medium', width: '100%' }}
                  >
                    Save Current Timetable
                  </Typography>
                  <StyledTextField
                    fullWidth 
                    size="small" 
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter timetable name"
                    disabled={!isConnected}
                    variant="outlined"
                    sx={{ width: '100%' }}
                    InputProps={{
                      endAdornment: (
                        <StyledIconButton
                          color="primary"
                onClick={handleSaveChanges}
                          disabled={!isConnected || !fileName}
                          size="small"
                        >
                          <SaveIcon fontSize="small" />
                        </StyledIconButton>
                      ),
                      sx: { width: '100%' }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                  <ControlButton
                    variant="outlined"
                onClick={handleUndo}
                    disabled={!isConnected}
                    startIcon={<UndoIcon />}
                    sx={{ flex: 1, width: '50%' }}
              >
                Undo
                  </ControlButton>
              
                  <ControlButton
                    variant="outlined"
                onClick={handleRedo}
                    disabled={!isConnected}
                    startIcon={<RedoIcon />}
                    sx={{ flex: 1, width: '50%' }}
              >
                Redo
                  </ControlButton>
                </Box>
                
                <ControlButton
                variant="contained"
                color="secondary"
                onClick={handleOpenIntervalPopup}
                  disabled={!isConnected || !timetableData}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Interval
                </ControlButton>
              </ControlStack>
            </StyledPaper>
          </Grid>
          
          {/* Timetable View - Enhanced with better styling */}
          <Grid item xs={12} md={8} sx={{ width: '100%' }}>
            <StyledPaper sx={{ 
              position: 'relative',
              overflow: 'hidden',
              p: 2,
              width: '100%'
            }}>
              {isLoading && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 5,
                    backdropFilter: 'blur(3px)'
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="text.secondary">
                      {isFetching ? 'Fetching data...' : 'Generating timetable...'}
                    </Typography>
      </Paper>
                </Box>
              )}
              
              {timetableData ? (
            <TimetableView 
                  data={timetableData}
              onMoveCourse={handleMoveCourse}
              onDeleteCourse={handleDeleteCourse}
            />
              ) : (
                <Box sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: '400px'
                }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {isConnected ? 'No timetable data available' : 'Connect to server to view timetable'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {isConnected 
                      ? 'Generate a new timetable or load an existing one' 
                      : 'Waiting for connection to be established...'}
                  </Typography>
                  
                  {isConnected && !isLoading && (
                    <ControlButton
                      variant="outlined"
                      color="primary"
                      onClick={handleGenerateTimetable}
                      startIcon={<RefreshIcon />}
                      sx={{ mt: 2 }}
                    >
                      Generate Timetable
                    </ControlButton>
                  )}
                </Box>
              )}
            </StyledPaper>
        </Grid>
        
          {/* Search Options with enhanced UI */}
          <Grid item xs={12} sx={{ width: '100%' }}>
            <StyledPaper sx={{ p: 3, width: '100%' }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  mb: 3, 
                  fontWeight: 'bold',
                  borderBottom: '2px solid',
                  borderColor: 'secondary.main',
                  pb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%'
                }}
              >
                <SearchIcon />
                Search Available Slots
              </Typography>
              
              <Grid container spacing={3} sx={{ width: '100%' }}>
                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      width: '100%'
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        color: 'primary.main' 
                      }}
                    >
                      Search by Staff
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      alignItems: 'flex-end',
                      flexWrap: 'wrap'
                    }}>
                      <FormControl sx={{ flexGrow: 1, minWidth: 120 }} size="small">
                        <InputLabel id="staff-select-label">Staff Member</InputLabel>
                        <StyledSelect
                          labelId="staff-select-label"
                          label="Staff Member"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                          disabled={!isConnected || teachingStaff.length === 0}
                        >
                          {teachingStaff.map((staff) => (
                            <MenuItem key={staff} value={staff}>
                              {staff}
                            </MenuItem>
                          ))}
                        </StyledSelect>
                      </FormControl>
                      
                      <StyledTextField
                        label="Hours"
                        size="small"
                        type="number"
                        value={requiredHours}
                        onChange={(e) => setRequiredHours(e.target.value)}
                        sx={{ width: 80 }}
                        InputProps={{ inputProps: { min: 1, max: 10 } }}
                      />
                      
                      <ControlButton
                variant="contained"
                        color="primary"
                onClick={handleSearchByStaff}
                        disabled={!isConnected || !selectedStaff || !requiredHours}
                        size="small"
                        startIcon={<SearchIcon />}
                      >
                        Search
                      </ControlButton>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      width: '100%'
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        color: 'secondary.main' 
                      }}
                    >
                      Search by Place
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      alignItems: 'flex-end',
                      flexWrap: 'wrap'
                    }}>
                      <FormControl sx={{ flexGrow: 1, minWidth: 120 }} size="small">
                        <InputLabel id="place-select-label">Teaching Place</InputLabel>
                        <StyledSelect
                          labelId="place-select-label"
                          label="Teaching Place"
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                          disabled={!isConnected || teachingPlaces.length === 0}
                        >
                          {teachingPlaces.map((place) => (
                            <MenuItem key={place} value={place}>
                              {place}
                            </MenuItem>
                          ))}
                        </StyledSelect>
                      </FormControl>
                      
                      <StyledTextField
                        label="Hours"
                        size="small"
                type="number"
                value={requiredHours}
                onChange={(e) => setRequiredHours(e.target.value)}
                        sx={{ width: 80 }}
                        InputProps={{ inputProps: { min: 1, max: 10 } }}
                      />
                      
                      <ControlButton
                        variant="contained"
                        color="secondary"
                        onClick={handleSearchByPlace}
                        disabled={!isConnected || !selectedPlace || !requiredHours}
                        size="small"
                        startIcon={<SearchIcon />}
                      >
                        Search
                      </ControlButton>
            </Box>
          </Paper>
                </Grid>
              </Grid>
              
              {/* Search Results with enhanced styling */}
              {Object.keys(searchResults).length > 0 && (
                <Box sx={{ mt: 3, width: '100%' }}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: 'background.default',
                      width: '100%'
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <CheckCircleIcon color="success" fontSize="small" />
                      Search Results
                    </Typography>
                    
                    <Box className="search-results" sx={{ mt: 2 }}>
            {renderSearchResults()}
                    </Box>
          </Paper>
                </Box>
              )}
            </StyledPaper>
        </Grid>
      </Grid>
      </Box>
      
      {/* Dialog styling remains the same, but we can enhance them if needed */}
      
      {/* Interval Popup Dialog */}
      <Dialog 
        open={intervalPopupOpen} 
        onClose={() => setIntervalPopupOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 10
          }
        }}
      >
        <StyledDialogTitle color="primary">
          Add New Interval
        </StyledDialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="day-select-label">Day</InputLabel>
              <StyledSelect
                labelId="day-select-label"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              label="Day"
              >
                {days.map((dayName, index) => (
                  <MenuItem key={dayName} value={index}>
                    {dayName}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <StyledTextField
                label="Start Time"
              type="number"
                fullWidth
              value={startFrom}
              onChange={(e) => setStartFrom(e.target.value)}
              inputProps={{ min: 8, max: 17 }}
                helperText="Hour (8-17)"
              />
              
              <StyledTextField
                label="End Time"
                type="number"
              fullWidth
                value={endTo}
                onChange={(e) => setEndTo(e.target.value)}
                inputProps={{ min: 9, max: 18 }}
                helperText="Hour (9-18)"
            />
            </Box>
            
            <FormControl fullWidth>
              <InputLabel id="course-select-label">Course</InputLabel>
              <StyledSelect
                labelId="course-select-label"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
                label="Course"
              >
                {courses.map((course) => (
                  <MenuItem key={course.code} value={course.code}>
                    {course.code} - {course.name}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="course-type-label">Course Type</InputLabel>
              <StyledSelect
                labelId="course-type-label"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              label="Course Type"
              >
                <MenuItem value={0}>Theory</MenuItem>
                <MenuItem value={1}>Lab</MenuItem>
              </StyledSelect>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="place-select-label">Teaching Place</InputLabel>
              <StyledSelect
                labelId="place-select-label"
              value={teachingPlace}
              onChange={(e) => setTeachingPlace(e.target.value)}
              label="Teaching Place"
              >
                {teachingPlaces.map((place) => (
                  <MenuItem key={place} value={place}>
                    {place}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="staff-select-label">Teaching Assistant</InputLabel>
              <StyledSelect
                labelId="staff-select-label"
              value={teachingAssistant}
              onChange={(e) => setTeachingAssistant(e.target.value)}
              label="Teaching Assistant"
              >
                {teachingStaff.map((staff) => (
                  <MenuItem key={staff} value={staff}>
                    {staff}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
                      <ControlButton 
                onClick={() => setIntervalPopupOpen(false)}
              variant="outlined"
              >
                Cancel
            </ControlButton>
          <ControlButton 
            onClick={handleSubmitInterval} 
                variant="contained"
                color="primary"
            startIcon={<AddIcon />}
          >
            Add Interval
          </ControlButton>
        </DialogActions>
      </Dialog>
      
      {/* Move Course Dialog */}
      {movePayload && (
        <Dialog 
          open={!!movePayload} 
          onClose={() => setMovePayload(null)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: 10
            }
          }}
        >
          <StyledDialogTitle color="secondary">
            Move Course
          </StyledDialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ 
              p: 1.5, 
              mb: 2, 
              borderRadius: 1, 
              bgcolor: 'info.light', 
              color: 'info.dark',
              fontWeight: 'medium'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {movePayload?.interval?.info?.courseCode}
              </Typography>
              <Typography variant="body2">
                Moving from {movePayload?.day}, {movePayload?.interval?.startFrom}:00 - {movePayload?.interval?.endTo}:00
              </Typography>
            </Box>
            
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="move-day-label">Day</InputLabel>
                <StyledSelect
                  labelId="move-day-label"
                  value={movePayload.requiredDay || days.indexOf(movePayload.day)}
                  onChange={(e) => setMovePayload({
                  ...movePayload,
                    requiredDay: e.target.value
                  })}
              label="Day"
                >
                  {days.map((dayName, index) => (
                    <MenuItem key={dayName} value={index}>
                      {dayName}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
              
              <StyledTextField
                label="Start Time"
              type="number"
                fullWidth
                value={movePayload.requiredInterval?.startFrom || ''}
                onChange={(e) => setMovePayload({
                  ...movePayload,
                  requiredInterval: {
                    ...movePayload.requiredInterval,
                    startFrom: parseInt(e.target.value)
                  }
                })}
                inputProps={{ min: 8, max: 17 }}
                helperText="Hour (8-17)"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <ControlButton 
                onClick={() => setMovePayload(null)}
              variant="outlined"
              >
                Cancel
            </ControlButton>
            <ControlButton 
              onClick={() => handleMovePayloadSubmitted(movePayload)} 
                variant="contained"
              color="secondary"
            >
              Move
            </ControlButton>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Snackbar for notifications with improved styling */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: 6,
            borderRadius: 2
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TimetablePage; 