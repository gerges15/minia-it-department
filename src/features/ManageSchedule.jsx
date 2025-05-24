import React, { useState, useEffect, useCallback } from 'react';
import { FiCalendar, FiClock, FiUser, FiMapPin, FiPlus, FiLoader } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScheduleCalendar from '../components/schedule/ScheduleCalendar';
import ScheduleForm from '../components/schedule/ScheduleForm';
import ScheduleFilter from '../components/schedule/ScheduleFilter';
import ScheduleList from '../components/schedule/ScheduleList';
import { 
  getUsers, 
  getTeachingPlaces, 
  getUserSchedules, 
  getTeachingPlaceSchedules,
  addUserSchedules,
  addTeachingPlaceSchedules,
  removeUserSchedules,
  removeTeachingPlaceSchedules
} from '../../api/endpoints';

const ManageSchedule = () => {
  const [viewMode, setViewMode] = useState('staff');
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTimeSlotForm, setIsTimeSlotForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [entities, setEntities] = useState([]);
  const [filter, setFilter] = useState({
    day: '',  // Show all days initially
    entityId: '',
    timeRange: {
      start: 8,
      end: 18
    }
  });

  // Helper function to get full display name for staff
  const getStaffDisplayName = (entity) => {
    if (entity.firstName && entity.lastName) {
      return `${entity.firstName} ${entity.lastName}`;
    } else if (entity.name) {
      return entity.name;
    } else if (entity.userName) {
      // Convert username to a more readable format
      const username = entity.userName;
      if (username.includes('.')) {
        // Convert format like "john.doe" to "John Doe"
        return username
          .split('.')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
      return username;
    }
    return 'Unknown Staff';
  };

  // Debug filter changes
  useEffect(() => {
    console.log('Filter updated:', filter);
  }, [filter]);

  // Fetch entities (staff members or teaching places)
  const fetchEntities = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log(`Fetching ${viewMode === 'staff' ? 'staff members' : 'teaching places'}...`);
      let response;
      
      if (viewMode === 'staff') {
        response = await getUsers(0, 1); // Get staff members (role 1)
        if (response && response.results) {
          setEntities(response.results);
          console.log(`Loaded ${response.results.length} staff members`);
        } else {
          console.error('Unexpected response format from getUsers:', response);
          setEntities([]);
        }
      } else {
        response = await getTeachingPlaces();
        if (response && response.results) {
          setEntities(response.results);
          console.log(`Loaded ${response.results.length} teaching places`);
        } else {
          console.error('Unexpected response format from getTeachingPlaces:', response);
          setEntities([]);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${viewMode === 'staff' ? 'staff members' : 'teaching places'}:`, error);
      toast.error(`Failed to fetch ${viewMode === 'staff' ? 'staff members' : 'rooms'}. Please try again.`);
      setEntities([]);
    } finally {
      setIsLoading(false);
    }
  }, [viewMode]);

  // Fetch schedules for all entities
  const fetchSchedules = useCallback(async () => {
    if (entities.length === 0) return;
    
    setIsLoadingSchedules(true);
    try {
      console.log(`Fetching schedules for ${viewMode === 'staff' ? 'staff members' : 'teaching places'}...`);
      const entitiesWithSchedules = await Promise.all(
        entities.map(async (entity) => {
          try {
            let scheduleData = [];
            if (viewMode === 'staff') {
              const response = await getUserSchedules(entity.userName);
              scheduleData = Array.isArray(response) ? response : [];
              console.log(`Fetched ${scheduleData.length} schedules for staff ${entity.userName}`);
            } else {
              const response = await getTeachingPlaceSchedules(entity.id);
              scheduleData = Array.isArray(response) ? response : [];
              console.log(`Fetched ${scheduleData.length} schedules for room ${entity.name || entity.id}`);
            }
            
            // Process schedule data to ensure all fields are in the correct format
            const normalizedSchedules = scheduleData.map(s => ({
              ...s,
              id: s.id || `schedule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              day: typeof s.day === 'number' ? s.day : parseInt(s.day, 10) || 0,
              startFrom: typeof s.startFrom === 'number' ? s.startFrom : parseInt(s.startFrom, 10) || 8,
              endTo: typeof s.endTo === 'number' ? s.endTo : parseInt(s.endTo, 10) || 10
            }));
            
            return {
              id: viewMode === 'staff' ? entity.userName : entity.id,
              name: viewMode === 'staff' 
                ? getStaffDisplayName(entity)
                : entity.name || '',
              firstName: entity.firstName || '',
              lastName: entity.lastName || '',
              userName: entity.userName || '',
              placeId: entity.id || '',
              schedules: normalizedSchedules,
              // Store the complete entity data for reference
              entityData: entity
            };
          } catch (error) {
            console.error(`Error fetching schedules for ${entity.userName || entity.name || entity.id}:`, error);
            return {
              id: viewMode === 'staff' ? entity.userName : entity.id,
              name: viewMode === 'staff' 
                ? getStaffDisplayName(entity)
                : entity.name || '',
              firstName: entity.firstName || '',
              lastName: entity.lastName || '',
              userName: entity.userName || '',
              placeId: entity.id || '',
              schedules: [],
              entityData: entity
            };
          }
        })
      );
      
      // Debug schedules data
      console.log('Schedules loaded successfully, raw data:', entitiesWithSchedules);
      
      // Filter out entities with no ID and sort by name
      const validSchedules = entitiesWithSchedules
        .filter(e => e.id)
        .sort((a, b) => {
          if (viewMode === 'staff') {
            return a.name.localeCompare(b.name);
          } else {
            return (a.name || a.placeId || '').localeCompare(b.name || b.placeId || '');
          }
        });
      
      setSchedules(validSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to fetch schedules. Please try again.');
    } finally {
      setIsLoadingSchedules(false);
    }
  }, [entities, viewMode]);

  // Fetch initial data
  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  // Fetch schedules whenever entities change
  useEffect(() => {
    if (entities.length > 0) {
      fetchSchedules();
    }
  }, [entities, fetchSchedules]);

  const handleAddEntity = async (formData) => {
    setIsSaving(true);
    try {
      console.log(`Adding new ${viewMode} with identifier:`, formData.identifier);
      
      // Check if entity already exists
      const existingEntity = entities.find(e => 
        viewMode === 'staff' ? e.userName === formData.identifier : e.id === formData.identifier
      );
      
      if (existingEntity) {
        toast.info(`${viewMode === 'staff' ? 'Staff member' : 'Room'} already exists`);
      } else {
        // In a real implementation, you would call an API to create the entity
        // For now, we'll just add it to the local state
        const newEntity = {
          id: formData.identifier,
          [viewMode === 'staff' ? 'userName' : 'id']: formData.identifier,
          name: formData.name || formData.identifier,
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          schedules: []
        };
        
        setEntities(prev => [...prev, newEntity]);
        setSchedules(prev => [...prev, {
          ...newEntity,
          schedules: []
        }]);
        
        toast.success(`${viewMode === 'staff' ? 'Staff member' : 'Room'} added successfully`);
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error(`Error adding ${viewMode}:`, error);
      toast.error(`Failed to add ${viewMode === 'staff' ? 'staff member' : 'room'}: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTimeSlot = async (entityId, formData) => {
    setIsSaving(true);
    try {
      if (!entityId) {
        toast.error('No entity selected');
        setIsSaving(false);
        return;
      }
      
      console.log(`Adding time slot for ${viewMode} with ID ${entityId}:`, formData);
      
      const entity = schedules.find(e => e.id === entityId);
      
      if (!entity) {
        toast.error(`${viewMode === 'staff' ? 'Staff member' : 'Room'} not found`);
        setIsSaving(false);
        return;
      }
      
      // Validate time slots
      const startTime = parseInt(formData.startFrom, 10);
      const endTime = parseInt(formData.endTo, 10);
      const day = parseInt(formData.day, 10);
      
      if (startTime >= endTime) {
        toast.error('End time must be after start time');
        setIsSaving(false);
        return;
      }
      
      // Check for time slot conflicts
      const conflictingSlot = entity.schedules.find(s => 
        s.day === day && 
        ((s.startFrom < endTime && s.endTo > startTime) || 
         (s.startFrom === startTime && s.endTo === endTime)) &&
        (formData.id ? s.id !== formData.id : true)
      );
      
      if (conflictingSlot) {
        toast.error('This time slot conflicts with an existing schedule');
        setIsSaving(false);
        return;
      }
      
      const newTimeSlot = {
        id: formData.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        day: day,
        startFrom: startTime,
        endTo: endTime,
        notes: formData.notes || '',
        courseCode: formData.courseCode || '',
        location: formData.location || '',
        teachingAssistant: formData.teachingAssistant || ''
      };
      
      console.log('New time slot data:', newTimeSlot);
      
      // Call the API to add the time slot
      let response;
      if (viewMode === 'staff') {
        console.log(`Adding schedule for staff ${entity.userName}:`, newTimeSlot);
        if (formData.id) {
          // For existing slots, delete first then add (since there's no update endpoint)
          await removeUserSchedules(entity.userName, [formData.id]);
        }
        response = await addUserSchedules(entity.userName, [newTimeSlot]);
      } else {
        console.log(`Adding schedule for room ${entity.placeId}:`, newTimeSlot);
        if (formData.id) {
          // For existing slots, delete first then add
          await removeTeachingPlaceSchedules(entity.placeId, [formData.id]);
        }
        response = await addTeachingPlaceSchedules(entity.placeId, [newTimeSlot]);
      }
      
      console.log('API response:', response);
      
      // Update the local state immediately for better UX
      setSchedules(prevSchedules => {
        return prevSchedules.map(e => {
          if (e.id === entityId) {
            const updatedSchedules = [...e.schedules.filter(s => s.id !== formData.id), newTimeSlot];
            return { ...e, schedules: updatedSchedules };
          }
          return e;
        });
      });
      
      // Also refresh the schedule data from the server to ensure it's up to date
      fetchSchedules();
      
      toast.success(`Time slot ${formData.id ? 'updated' : 'added'} successfully`);
      setIsFormOpen(false);
      
    } catch (error) {
      console.error('Error adding time slot:', error);
      toast.error(`Failed to ${formData.id ? 'update' : 'add'} time slot: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTimeSlot = async (entityId, timeSlot) => {
    console.log('Editing time slot:', timeSlot, 'for entity:', entityId);
    setSelectedSchedule({ id: entityId, ...timeSlot });
    setIsTimeSlotForm(true);
    setIsFormOpen(true);
  };

  const handleDeleteTimeSlot = async (entityId, timeSlotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      setIsSaving(true);
      try {
        const entity = schedules.find(e => e.id === entityId);
        
        if (!entity) {
          toast.error(`${viewMode === 'staff' ? 'Staff member' : 'Room'} not found`);
          setIsSaving(false);
          return;
        }
        
        console.log(`Deleting time slot ${timeSlotId} for ${viewMode} ${entity.userName || entity.placeId}`);
        
        // Call the API to delete the time slot
        let response;
        if (viewMode === 'staff') {
          response = await removeUserSchedules(entity.userName, [timeSlotId]);
        } else {
          response = await removeTeachingPlaceSchedules(entity.placeId, [timeSlotId]);
        }
        
        console.log('API response:', response);
        
        // Update the local state immediately
        setSchedules(prev => prev.map(e => 
          e.id === entityId
            ? { ...e, schedules: e.schedules.filter(s => s.id !== timeSlotId) }
            : e
        ));
        
        toast.success('Time slot deleted successfully');
      } catch (error) {
        console.error('Error deleting time slot:', error);
        toast.error(`Failed to delete time slot: ${error.message || 'Unknown error'}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    if (mode !== viewMode) {
      setViewMode(mode);
      // Reset filters when switching views
      setFilter({
        day: '',
        entityId: '',
        timeRange: {
          start: 8,
          end: 18
        }
      });
      setSchedules([]); // Clear schedules when changing view modes
      // Entities and schedules will be fetched via useEffect when viewMode changes
    }
  };

  // When entity is selected in the filter, update the day filter to show relevant days
  useEffect(() => {
    if (filter.entityId) {
      const selectedEntity = schedules.find(entity => entity.id === filter.entityId);
      if (selectedEntity && selectedEntity.schedules.length > 0) {
        // If we have an entity with schedules, but no day is selected, select the first available day
        if (filter.day === '' && selectedEntity.schedules.length > 0) {
          const availableDays = [...new Set(selectedEntity.schedules.map(s => s.day))].sort();
          if (availableDays.length > 0) {
            setFilter(prev => ({
              ...prev,
              day: availableDays[0]
            }));
          }
        }
      }
    }
  }, [filter.entityId, schedules]);

  // Filter schedules based on selected criteria
  const filteredSchedules = schedules.filter(schedule => {
    // If no entity matches, exclude it
    if (filter.entityId && schedule.id !== filter.entityId) return false;
    
    // Keep the entity if it passes the entity filter
    return true;
  });

  // Calculate all days that have schedules for the selected entity
  const getAvailableDays = () => {
    if (filter.entityId) {
      const entity = schedules.find(e => e.id === filter.entityId);
      if (entity && entity.schedules.length > 0) {
        return [...new Set(entity.schedules.map(s => s.day))].sort();
      }
    }
    
    // If no specific entity is selected, consider all days available
    return [...Array(7).keys()]; // Returns [0,1,2,3,4,5,6] for all days
  };
  
  const availableDays = getAvailableDays();

  // Handle filter changes
  const handleFilterChange = (newFilter) => {
    console.log('Filter change requested:', newFilter);
    
    // Convert day to a number if it's a string
    if (newFilter.day !== undefined && newFilter.day !== '' && typeof newFilter.day === 'string') {
      newFilter.day = parseInt(newFilter.day, 10);
    }
    
    setFilter(prev => ({
      ...prev,
      ...newFilter
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    console.log('Resetting filters');
    setFilter({
      day: '',
      entityId: '',
      timeRange: {
        start: 8,
        end: 18
      }
    });
  };

  // Get schedule data ready for display in the calendar
  const getDisplaySchedules = () => {
    if (filter.entityId) {
      return filteredSchedules;
    }
    
    // If no entity is selected, return all schedules
    return schedules;
  };

  const displaySchedules = getDisplaySchedules();

  // Get selected entity details
  const getSelectedEntityDetails = () => {
    if (!filter.entityId) return null;
    
    const entity = schedules.find(e => e.id === filter.entityId);
    if (!entity) return null;
    
    return {
      name: entity.name,
      userName: entity.userName,
      placeId: entity.placeId,
      firstName: entity.firstName,
      lastName: entity.lastName,
      // Count schedules by day
      scheduleCounts: DAYS.map((day, index) => {
        return {
          day: index,
          dayName: day,
          count: entity.schedules.filter(s => s.day === index).length
        };
      }).filter(d => d.count > 0)
    };
  };

  const selectedEntityDetails = getSelectedEntityDetails();

  // Check if any operations are in progress
  const isDataLoading = isLoading || isLoadingSchedules;

  // List of days for display
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-0">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Manage Schedules
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              View and manage schedules for staff and teaching places
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <button
              onClick={() => {
                setSelectedSchedule(null);
                setIsTimeSlotForm(true);
                setIsFormOpen(true);
              }}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isDataLoading}
            >
              <FiPlus className="h-5 w-5" />
              <span>Add Schedule</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-1 items-center gap-3 mb-4 sm:mb-0">
            <button
              onClick={() => handleViewModeChange('staff')}
              className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'staff' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isDataLoading}
            >
              <FiUser className="mr-2" />
              Staff Schedules
            </button>
            <button
              onClick={() => handleViewModeChange('room')}
              className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'room' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isDataLoading}
            >
              <FiMapPin className="mr-2" />
              Room Schedules
            </button>
          </div>

          {/* Filter Section */}
          <div className="flex-1">
            <ScheduleFilter
              filter={filter}
              setFilter={handleFilterChange}
              viewMode={viewMode}
              entities={schedules}
              onReset={handleResetFilters}
              isDisabled={isDataLoading}
              availableDays={availableDays}
            />
          </div>
        </div>
      </div>

      {/* Selected entity details */}
      {selectedEntityDetails && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {viewMode === 'staff' ? 'Staff Details' : 'Room Details'}
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">
                  {viewMode === 'staff' ? 'Staff Member' : 'Room'} Information
                </h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {selectedEntityDetails.name}
                  </p>
                  {viewMode === 'staff' && (
                    <p className="text-sm">
                      <span className="font-medium">Username:</span> {selectedEntityDetails.userName}
                    </p>
                  )}
                  {viewMode === 'room' && (
                    <p className="text-sm">
                      <span className="font-medium">Room ID:</span> {selectedEntityDetails.placeId}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Schedule Summary</h3>
                <div className="space-y-1">
                  {selectedEntityDetails.scheduleCounts.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedEntityDetails.scheduleCounts.map(dayInfo => (
                        <span 
                          key={dayInfo.day}
                          className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          onClick={() => handleFilterChange({ day: dayInfo.day })}
                          style={{ cursor: 'pointer' }}
                        >
                          {dayInfo.dayName}: {dayInfo.count} slot{dayInfo.count !== 1 ? 's' : ''}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No schedules found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-48 sm:h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 text-sm">Loading {viewMode === 'staff' ? 'staff members' : 'rooms'}...</p>
          </div>
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 h-48 sm:h-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm sm:text-base">No {viewMode === 'staff' ? 'staff members' : 'rooms'} found.</p>
            <button
              onClick={() => {
                setSelectedSchedule(null);
                setIsTimeSlotForm(false);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <FiPlus className="inline mr-1" />
              Add {viewMode === 'staff' ? 'Staff Member' : 'Room'}
            </button>
          </div>
        </div>
      ) : isLoadingSchedules ? (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-48 sm:h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 text-sm">Loading schedules...</p>
          </div>
        </div>
      ) : displaySchedules.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 h-48 sm:h-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm sm:text-base">No schedules found matching your criteria.</p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Calendar View */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center text-gray-800">
                <FiCalendar className="mr-2 text-blue-600" />
                Calendar View
              </h2>
              {filter.entityId && (
                <span className="text-sm text-blue-600">
                  Showing schedule for: {
                    displaySchedules.find(e => e.id === filter.entityId)?.name || 
                    (viewMode === 'staff' ? 'Selected staff' : 'Selected room')
                  }
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <ScheduleCalendar
                schedules={displaySchedules}
                filter={filter}
                onScheduleClick={(schedule) => {
                  if (schedule && schedule.id) {
                    // For calendar clicks, we need to look up the entity using the schedule
                    const entityWithSchedule = schedules.find(e => 
                      e.schedules.some(s => s.id === schedule.id)
                    );
                    
                    if (entityWithSchedule) {
                      const scheduleDetails = entityWithSchedule.schedules.find(s => s.id === schedule.id);
                      setSelectedSchedule({
                        id: entityWithSchedule.id,
                        ...scheduleDetails
                      });
                      setIsTimeSlotForm(true);
                      setIsFormOpen(true);
                    }
                  } else {
                    setSelectedSchedule(schedule);
                    setIsTimeSlotForm(true);
                    setIsFormOpen(true);
                  }
                }}
                viewMode={viewMode}
              />
            </div>
          </div>

          {/* List View */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center text-gray-800">
                <FiClock className="mr-2 text-blue-600" />
                Schedule List
              </h2>
              <span className="text-sm text-gray-500">
                {displaySchedules.length} {viewMode === 'staff' ? 'staff' : 'rooms'} found
              </span>
            </div>
            <div className="overflow-x-auto">
              <ScheduleList
                schedules={displaySchedules}
                viewMode={viewMode}
                onAdd={() => {
                  setSelectedSchedule(null);
                  setIsTimeSlotForm(false);
                  setIsFormOpen(true);
                }}
                onAddTimeSlot={(entityId) => {
                  setSelectedSchedule({ id: entityId });
                  setIsTimeSlotForm(true);
                  setIsFormOpen(true);
                }}
                onEditTimeSlot={handleEditTimeSlot}
                onDeleteTimeSlot={handleDeleteTimeSlot}
              />
            </div>
          </div>
        </>
      )}

      {/* Form Modal */}
      <ScheduleForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSchedule(null);
          setIsTimeSlotForm(false);
        }}
        onSubmit={isTimeSlotForm ? handleAddTimeSlot : handleAddEntity}
        isTimeSlotForm={isTimeSlotForm}
        initialData={selectedSchedule}
        viewMode={viewMode}
        isSaving={isSaving}
        existingEntities={schedules}
        availableDays={availableDays}
      />
    </div>
  );
};

export default ManageSchedule;
