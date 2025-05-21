import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import TimetableView from './TimetableView';
import { Button, Select, MenuItem, TextField, Box, Typography, Container, Grid, Paper, Divider, Stack } from '@mui/material';
import './TimetableStyles.css';

const TimetablePage = () => {
  // Constants
  const tableStorageKey = "tableStorageKey";
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // State variables
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Configuration
  const isProduction = import.meta.env.PROD;
  const apiUrl = isProduction ? '/api/proxy' : 'https://localhost:7262/api';
  const apiKey = 'hiL56ugahSWEoYuaQT3Bg_1R-Ggz7rrxlfRxch5O9tQ';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwMTk1QjNFQkRGN0U3OTA2QUE5Njg5MkQ0QUQ4QzEyQiIsImdpdmVuX25hbWUiOiJhZG1pbiBhZG1pbiIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTc0NTQyOTUwOCwiZXhwIjoxNzQ2NjI5NTA4LCJpYXQiOjE3NDU0Mjk1MDgsImlzcyI6IkdyYWR1YXRpb24gVGVhbSIsImF1ZCI6IklUIERlcGFydG1lbnQifQ.OZ4jdpLEGu0gfi6sGiu5GmoAalzf8_MKsobdRpjk1Rc';
  
  // Get table context data
  const getTableContextData = () => {
    try {
      if (localStorage.getItem(tableStorageKey) === null) return null;
      return JSON.parse(localStorage.getItem(tableStorageKey));
    } catch (error) {
      console.error('Error parsing table data:', error);
      return null;
    }
  };
  
  // Initialize SignalR connection
  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        const newConnection = new HubConnectionBuilder()
          .withUrl(`${apiUrl}/TimeTableHub`, {
            headers: {
              'x-api-key': apiKey,
              Authorization: `Bearer ${token}`
            },
            withCredentials: true,
            transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling
          })
          .withAutomaticReconnect()
          .build();

        // Set up event handlers
        newConnection.on('generateTimeTableContextResult', (result) => {
          storeTimeTable(result);
          reloadTimeTable();
        });
        
        newConnection.on('getTimeTablesContextResult', (names) => {
          setTimeTables(names);
        });
        
        newConnection.on('findValidStaffResult', (result) => {
          setSearchResults(result);
        });
        
        newConnection.on('findValidPlacesResult', (result) => {
          setSearchResults(result);
        });
        
        newConnection.on('loadTimeTableContextResult', (result) => {
          storeTimeTable(result);
          reloadTimeTable();
        });
        
        newConnection.on('deleteTimeTableContextResult', (result) => {
          if (result.isSuccess) {
            localStorage.removeItem(tableStorageKey);
            reloadTimeTable();
          }
        });
        
        newConnection.on('setActiveTimeTableContextResult', (result) => {
          alert(result.isSuccess ? 'Success' : result.error);
        });
        
        newConnection.on('undoResult', (result) => {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
          } else {
            alert(result.error);
          }
        });
        
        newConnection.on('redoResult', (result) => {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
          } else {
            alert(result.error);
          }
        });
        
        newConnection.on('loadActiveTimeTableContextResult', (result) => {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
          } else {
            alert(result.error);
          }
        });
        
        newConnection.on('addIntervalResult', (result) => {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
          } else {
            alert(result.error);
          }
        });
        
        newConnection.on('removeIntervalResult', (result) => {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
          } else {
            alert(result.error);
          }
        });
        
        newConnection.on('moveIntervalResult', (result) => {
          if (result.isSuccess) {
            storeTimeTable(result);
            reloadTimeTable();
          } else {
            alert(result.error);
          }
        });

        await newConnection.start();
        setConnection(newConnection);
        setIsConnected(true);
        console.log('SignalR connected!');
      } catch (error) {
        console.error('Error initializing SignalR:', error);
      }
    };

    initializeSignalR();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  // Store timetable data
  const storeTimeTable = (result) => {
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
      alert(result.error);
    }
  };

  // Reload timetable
  const reloadTimeTable = () => {
    const data = getTableContextData();
    if (!data) return;
    
    setTimetableData(data);
    
    if (Array.isArray(data.teachingStaffName)) {
      setTeachingStaff(data.teachingStaffName);
    }
    
    if (Array.isArray(data.teachingPlacesName)) {
      setTeachingPlaces(data.teachingPlacesName);
    }
  };

  // Generate timetable
  const handleGenerateTimetable = async () => {
    try {
      setIsLoading(true);
      const excludeModel = {
        PlacesId: [],
        CoursesId: [],
        StaffUserName: []
      };
      await connection.invoke("generateTimeTableContext", excludeModel, 1);
    } catch (error) {
      console.error('Error generating timetable:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load timetables
  const handleLoadTimetables = async () => {
    try {
      await connection.invoke("getTimeTablesContext");
    } catch (error) {
      console.error('Error loading timetables:', error);
    }
  };

  // Select a timetable
  const handleSelectTimetable = async (name) => {
    try {
      setSelectedTimeTable(name);
      await connection.invoke("loadTimeTableContext", name);
    } catch (error) {
      console.error('Error loading timetable:', error);
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      const name = fileName.trim();
      await connection.invoke("saveCurrentTimeTableContext", name);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  // Delete timetable
  const handleDeleteTimetable = async () => {
    if (selectedTimeTable && window.confirm(`Are you sure you want to delete timetable: ${selectedTimeTable}?`)) {
      try {
        await connection.invoke("deleteTimeTableContext", selectedTimeTable);
        alert(`Timetable "${selectedTimeTable}" deleted successfully.`);
        localStorage.removeItem(tableStorageKey);
        await connection.invoke("getTimeTablesContext");
        reloadTimeTable();
      } catch (error) {
        console.error('Error deleting timetable:', error);
      }
    } else {
      alert("Please select a timetable to delete.");
    }
  };

  // Set active timetable
  const handleSetActive = async () => {
    if (selectedTimeTable) {
      try {
        await connection.invoke("setActiveTimeTableContext", selectedTimeTable);
      } catch (error) {
        console.error('Error setting active timetable:', error);
      }
    } else {
      alert("Please select a timetable.");
    }
  };

  // Load active timetable
  const handleLoadActive = async () => {
    try {
      await connection.invoke("loadActiveTimeTableContext");
    } catch (error) {
      console.error('Error loading active timetable:', error);
    }
  };

  // Undo
  const handleUndo = async () => {
    try {
      await connection.invoke("undo");
    } catch (error) {
      console.error('Error undoing:', error);
    }
  };

  // Redo
  const handleRedo = async () => {
    try {
      await connection.invoke("redo");
    } catch (error) {
      console.error('Error redoing:', error);
    }
  };

  // Open interval popup
  const handleOpenIntervalPopup = () => {
    const data = getTableContextData();
    if (!data) return;
    
    // Reset form values
    setDay(0);
    setStartFrom('');
    setEndTo('');
    setCourseCode('');
    setCourseType(0);
    setTeachingPlace('');
    setTeachingAssistant('');
    
    setIntervalPopupOpen(true);
  };

  // Handle interval form submission
  const handleSubmitInterval = async () => {
    try {
      const data = getTableContextData();
      if (!data) return;
      
      const selectedCourse = data.inMatchedCourses.find(course => course.code === courseCode);
      
      const model = {
        level: selectedCourse ? selectedCourse.level : 1,
        day: parseInt(day),
        interval: {
          startFrom: parseInt(startFrom),
          endTo: parseInt(endTo),
          info: {
            courseCode,
            courseType: parseInt(courseType),
            courseLevel: selectedCourse ? selectedCourse.level : 1,
            teachingPlace,
            teachingAssistant
          }
        }
      };
      
      await connection.invoke("addInterval", model);
      setIntervalPopupOpen(false);
    } catch (error) {
      console.error('Error submitting interval:', error);
    }
  };

  // Handle course move
  const handleMoveCourse = (payload) => {
    setMovePayload(payload);
  };

  // Update endTo when course or start time changes
  useEffect(() => {
    if (courseCode && courses.length > 0 && startFrom) {
      const selectedCourse = courses.find(c => c.code === courseCode && c.type == courseType);
      if (selectedCourse) {
        setEndTo(parseInt(startFrom) + parseInt(selectedCourse.lectureHours));
      }
    }
  }, [courseCode, courseType, startFrom, courses]);

  // Handle move payload submission
  const handleMovePayloadSubmitted = async (payload) => {
    try {
      await connection.invoke('moveInterval', payload.interval, payload.day, payload.requiredInterval);
    } catch (error) {
      console.error('Error moving interval:', error);
    }
  };

  // Handle delete course
  const handleDeleteCourse = async (payload) => {
    try {
      const commandModel = {
        level: parseInt(payload.interval.info.courseLevel),
        day: days.indexOf(payload.day),
        interval: {
          startFrom: parseInt(payload.interval.startFrom),
          endTo: parseInt(payload.interval.endTo),
          info: {
            courseCode: payload.interval.info.courseCode,
            courseType: parseInt(payload.interval.info.courseType),
            courseLevel: parseInt(payload.interval.info.courseLevel),
            teachingPlace: payload.interval.info.teachingPlace,
            teachingAssistant: payload.interval.info.teachingAssistant
          }
        }
      };
      
      await connection.invoke('removeInterval', commandModel);
    } catch (error) {
      console.error('Error deleting interval:', error);
    }
  };

  // Search by staff
  const handleSearchByStaff = async () => {
    const staffUsername = selectedStaff.trim();
    const hours = parseInt(requiredHours);
    
    if (staffUsername && !isNaN(hours)) {
      try {
        await connection.invoke("findValidPlaces", staffUsername, hours);
      } catch (error) {
        console.error('Error searching by staff:', error);
      }
    } else {
      alert("Please enter a valid staff username and hours.");
    }
  };

  // Search by place
  const handleSearchByPlace = async () => {
    const placeName = selectedPlace.trim();
    const hours = parseInt(requiredHours);
    
    if (placeName && !isNaN(hours)) {
      try {
        await connection.invoke("findValidStaff", placeName, hours);
      } catch (error) {
        console.error('Error searching by place:', error);
      }
    } else {
      alert("Please enter a valid place name and hours.");
    }
  };

  // Display search results
  const renderSearchResults = () => {
    if (!searchResults || Object.keys(searchResults).length === 0) {
      return <Typography>No schedule results available.</Typography>;
    }

    return Object.entries(searchResults).map(([day, items]) => {
      if (!items || items.length === 0) return null;
      
      return (
        <Box key={day} mb={2}>
          <Button 
            fullWidth
            sx={{ bgcolor: '#3498db', color: 'white', mb: 1 }}
            onClick={(e) => {
              const nextSibling = e.currentTarget.nextSibling;
              if (nextSibling) {
                nextSibling.style.display = nextSibling.style.display === 'none' ? 'block' : 'none';
              }
            }}
          >
            {day}
          </Button>
          <Box sx={{ display: 'none', ml: 2 }}>
            {items.map(item => (
              <Box key={item.userName || item.name} mb={1}>
                <Button
                  fullWidth
                  sx={{ bgcolor: '#2ecc71', color: 'white' }}
                  onClick={(e) => {
                    const nextSibling = e.currentTarget.nextSibling;
                    if (nextSibling) {
                      nextSibling.style.display = nextSibling.style.display === 'none' ? 'block' : 'none';
                    }
                  }}
                >
                  {item.fullName || item.name} {item.userName ? `(${item.userName})` : `(Capacity: ${item.capacity})`}
                </Button>
                <Box sx={{ display: 'none', ml: 2 }}>
                  {item.freeHours?.length > 0 ? (
                    item.freeHours.map(interval => (
                      <Typography key={`${interval.startFrom}-${interval.endTo}`} variant="body2">
                        {interval.startFrom}:00 - {interval.endTo}:00
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2">No free hours</Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      );
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Controls Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Main Controls */}
          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateTimetable}
                disabled={!isConnected || isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Timetable'}
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoadTimetables}
                disabled={isLoading}
              >
                Load Timetables
              </Button>
              
              <Select
                value={selectedTimeTable}
                onChange={(e) => handleSelectTimetable(e.target.value)}
                displayEmpty
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="" disabled>Select a Timetable</MenuItem>
                {timeTables.map(name => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
              
              <TextField
                placeholder="Enter file name..."
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              
              <Button
                variant="contained"
                color="warning"
                onClick={handleSaveChanges}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </Stack>
          </Grid>
          
          {/* Action Buttons */}
          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                color="error"
                onClick={handleUndo}
                disabled={isLoading}
              >
                Undo
              </Button>
              
              <Button
                variant="contained"
                color="success"
                onClick={handleRedo}
                disabled={isLoading}
              >
                Redo
              </Button>
              
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteTimetable}
                disabled={isLoading}
              >
                Delete Timetable
              </Button>
              
              <Button
                variant="contained"
                color="success"
                onClick={handleSetActive}
                disabled={isLoading}
              >
                Set Active
              </Button>
              
              <Button
                variant="contained"
                color="success"
                onClick={handleLoadActive}
                disabled={isLoading}
              >
                Load Active
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenIntervalPopup}
                disabled={isLoading}
              >
                Insert Interval
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Timetable */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <TimetableView 
              timetableData={timetableData} 
              onMoveCourse={handleMoveCourse}
              onMoveSubmit={handleMovePayloadSubmitted}
              onDeleteCourse={handleDeleteCourse}
            />
          </Paper>
        </Grid>
        
        {/* Search and Results */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Search Options</Typography>
            
            <Box mt={2}>
              <Select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                displayEmpty
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>Select Staff Username</MenuItem>
                {teachingStaff.map(name => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
              
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSearchByStaff}
                fullWidth
                sx={{ mb: 2 }}
              >
                Search Staff
              </Button>
              
              <Select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                displayEmpty
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>Select Place Name</MenuItem>
                {teachingPlaces.map(name => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
              
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSearchByPlace}
                fullWidth
                sx={{ mb: 2 }}
              >
                Search Place
              </Button>
              
              <TextField
                type="number"
                label="Hours Required"
                value={requiredHours}
                onChange={(e) => setRequiredHours(e.target.value)}
                fullWidth
              />
            </Box>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3, maxHeight: 500, overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>Search Results</Typography>
            {renderSearchResults()}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Interval Popup */}
      {intervalPopupOpen && (
        <div className="modal-overlay">
          <Paper className="modal-content" elevation={5} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Insert Interval</Typography>
            
            <Select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              fullWidth
              label="Day"
              sx={{ mb: 2 }}
            >
              {days.map((d, i) => (
                <MenuItem key={i} value={i}>{d}</MenuItem>
              ))}
            </Select>
            
            <TextField
              label="Start From (hour)"
              type="number"
              value={startFrom}
              onChange={(e) => setStartFrom(e.target.value)}
              fullWidth
              inputProps={{ min: 8, max: 17 }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="End To (hour)"
              value={endTo}
              readOnly
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <Select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              fullWidth
              label="Course Code"
              sx={{ mb: 2 }}
            >
              <MenuItem value="" disabled>Select Course Code</MenuItem>
              {courses.map(course => (
                <MenuItem key={course.code} value={course.code}>{course.code}</MenuItem>
              ))}
            </Select>
            
            <Select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              fullWidth
              label="Course Type"
              sx={{ mb: 2 }}
            >
              <MenuItem value={0}>Lecture</MenuItem>
              <MenuItem value={1}>Practical</MenuItem>
            </Select>
            
            <Select
              value={teachingPlace}
              onChange={(e) => setTeachingPlace(e.target.value)}
              fullWidth
              label="Teaching Place"
              sx={{ mb: 2 }}
            >
              <MenuItem value="" disabled>Select Teaching Place</MenuItem>
              {teachingPlaces.map(name => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
            
            <Select
              value={teachingAssistant}
              onChange={(e) => setTeachingAssistant(e.target.value)}
              fullWidth
              label="Teaching Assistant"
              sx={{ mb: 2 }}
            >
              <MenuItem value="" disabled>Select Teaching Assistant</MenuItem>
              {teachingStaff.map(name => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
            
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
                variant="outlined"
                onClick={() => setIntervalPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitInterval}
              >
                Submit
              </Button>
            </Box>
          </Paper>
        </div>
      )}
      
      {/* Move Course Popup */}
      {movePayload && (
        <div className="modal-overlay">
          <Paper className="modal-content" elevation={5} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Edit Course Interval</Typography>
            
            <Select
              value={movePayload ? days.indexOf(movePayload.day) : 0}
              onChange={(e) => {
                setMovePayload({
                  ...movePayload,
                  day: days[e.target.value]
                });
              }}
              fullWidth
              label="Day"
              sx={{ mb: 2 }}
            >
              {days.map((d, i) => (
                <MenuItem key={i} value={i}>{d}</MenuItem>
              ))}
            </Select>
            
            <TextField
              label="Start From"
              type="number"
              value={movePayload?.interval?.startFrom || ''}
              onChange={(e) => {
                const start = parseInt(e.target.value);
                const lectureHours = movePayload.interval.endTo - movePayload.interval.startFrom;
                setMovePayload({
                  ...movePayload,
                  interval: {
                    ...movePayload.interval,
                    startFrom: start,
                    endTo: start + lectureHours
                  }
                });
              }}
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="End To"
              value={movePayload?.interval?.endTo || ''}
              readOnly
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
                variant="outlined"
                onClick={() => setMovePayload(null)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  const payload = {
                    interval: {
                      level: parseInt(movePayload.interval.info.courseLevel),
                      day: days.indexOf(movePayload.day),
                      interval: movePayload.interval
                    },
                    day: days.indexOf(movePayload.day),
                    requiredInterval: {
                      startFrom: parseInt(movePayload.interval.startFrom),
                      endTo: parseInt(movePayload.interval.endTo)
                    }
                  };
                  handleMovePayloadSubmitted(payload);
                  setMovePayload(null);
                }}
              >
                Save
              </Button>
            </Box>
          </Paper>
        </div>
      )}
    </Container>
  );
};

export default TimetablePage; 