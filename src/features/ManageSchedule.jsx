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
    day: new Date().getDay(),
    entityId: '',
    timeRange: {
      start: 8,
      end: 18
    }
  });

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
            
            return {
              id: entity.id,
              name: entity.name || entity.firstName + ' ' + entity.lastName || '',
              userName: entity.userName || '',
              placeId: entity.id || '',
              schedules: scheduleData.map(s => ({
                ...s,
                day: typeof s.day === 'number' ? s.day : parseInt(s.day, 10) || 0,
                startFrom: typeof s.startFrom === 'number' ? s.startFrom : parseInt(s.startFrom, 10) || 8,
                endTo: typeof s.endTo === 'number' ? s.endTo : parseInt(s.endTo, 10) || 10
              }))
            };
          } catch (error) {
            console.error(`Error fetching schedules for ${entity.userName || entity.name || entity.id}:`, error);
            return {
              id: entity.id,
              name: entity.name || entity.firstName + ' ' + entity.lastName || '',
              userName: entity.userName || '',
              placeId: entity.id || '',
              schedules: []
            };
          }
        })
      );
      
      setSchedules(entitiesWithSchedules);
      console.log('Schedules loaded successfully:', entitiesWithSchedules);
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
      
      // In a real implementation, you would add the entity through an API
      // For now, we'll just add it to the local state if it's not already there
      const existingEntity = entities.find(e => 
        viewMode === 'staff' ? e.userName === formData.identifier : e.id === formData.identifier
      );
      
      if (existingEntity) {
        toast.info(`${viewMode === 'staff' ? 'Staff member' : 'Room'} already exists`);
      } else {
        // This is a simplified approach - in a real app, you would call an API to create the entity
        const newEntity = {
          id: formData.identifier,
          [viewMode === 'staff' ? 'userName' : 'id']: formData.identifier,
          name: formData.identifier,
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
      toast.error(`Failed to add ${viewMode === 'staff' ? 'staff member' : 'room'}`);
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
      
      const newTimeSlot = {
        id: formData.id || `${entityId}-${Date.now()}`,
        day: parseInt(formData.day, 10),
        startFrom: parseInt(formData.startFrom, 10),
        endTo: parseInt(formData.endTo, 10)
      };
      
      console.log('New time slot data:', newTimeSlot);
      
      // Call the API to add the time slot
      let response;
      if (viewMode === 'staff') {
        console.log(`Adding schedule for staff ${entity.userName}:`, newTimeSlot);
        response = await addUserSchedules(entity.userName, [newTimeSlot]);
      } else {
        console.log(`Adding schedule for room ${entity.id}:`, newTimeSlot);
        response = await addTeachingPlaceSchedules(entity.id, [newTimeSlot]);
      }
      
      console.log('API response:', response);
      
      // Update the local state
      setSchedules(prevSchedules => {
        return prevSchedules.map(e => {
          if (e.id === entityId) {
            const existingIndex = e.schedules.findIndex(s => s.id === newTimeSlot.id);
            if (existingIndex !== -1) {
              const updatedSchedules = [...e.schedules];
              updatedSchedules[existingIndex] = newTimeSlot;
              return { ...e, schedules: updatedSchedules };
            } else {
              return { ...e, schedules: [...e.schedules, newTimeSlot] };
            }
          }
          return e;
        });
      });
      
      toast.success('Time slot added successfully');
      setIsFormOpen(false);
      
    } catch (error) {
      console.error('Error adding time slot:', error);
      toast.error(`Failed to add time slot: ${error.message || 'Unknown error'}`);
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
        
        console.log(`Deleting time slot ${timeSlotId} for ${viewMode} ${entity.userName || entity.id}`);
        
        // Call the API to delete the time slot
        let response;
        if (viewMode === 'staff') {
          response = await removeUserSchedules(entity.userName, [timeSlotId]);
        } else {
          response = await removeTeachingPlaceSchedules(entity.id, [timeSlotId]);
        }
        
        console.log('API response:', response);
        
        // Update the local state
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
      setFilter({
        day: new Date().getDay(),
        entityId: '',
        timeRange: {
          start: 8,
          end: 18
        }
      });
      // Entities and schedules will be fetched via useEffect when viewMode changes
    }
  };

  // Filter schedules based on selected day, entity, and time range
  const filteredSchedules = schedules.filter(schedule => {
    // Filter by entity (staff/room)
    const matchesEntity = !filter.entityId || schedule.id === filter.entityId;
    
    // If there are no schedules, only apply entity filter
    if (schedule.schedules.length === 0) {
      return matchesEntity;
    }
    
    // Filter by day
    const matchesDay = filter.day === '' || 
      schedule.schedules.some(s => s.day === filter.day);
    
    // Filter by time range
    const matchesTimeRange = schedule.schedules.some(s => 
      (s.startFrom >= filter.timeRange.start && s.startFrom < filter.timeRange.end) ||
      (s.endTo > filter.timeRange.start && s.endTo <= filter.timeRange.end) ||
      (s.startFrom <= filter.timeRange.start && s.endTo >= filter.timeRange.end)
    );

    return matchesEntity && (filter.day === '' || matchesDay) && 
           (matchesTimeRange || filter.timeRange.start === 8 && filter.timeRange.end === 18);
  });

  // Handle filter changes
  const handleFilterChange = (newFilter) => {
    console.log('Filter changed:', newFilter);
    setFilter(prev => ({
      ...prev,
      ...newFilter
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    console.log('Resetting filters');
    setFilter({
      day: new Date().getDay(),
      entityId: '',
      timeRange: {
        start: 8,
        end: 18
      }
    });
  };

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
              disabled={isLoading || isLoadingSchedules}
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
              disabled={isLoading || isLoadingSchedules}
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
              disabled={isLoading || isLoadingSchedules}
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
            />
          </div>
        </div>
      </div>

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
          <p className="text-sm sm:text-base">No {viewMode === 'staff' ? 'staff members' : 'rooms'} found. Add one to get started.</p>
        </div>
      ) : isLoadingSchedules ? (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-48 sm:h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 text-sm">Loading schedules...</p>
          </div>
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 h-48 sm:h-64 flex items-center justify-center">
          <p className="text-sm sm:text-base">No schedules found matching your criteria.</p>
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
            </div>
            <div className="overflow-x-auto">
              <ScheduleCalendar
                schedules={filteredSchedules}
                filter={filter}
                onScheduleClick={setSelectedSchedule}
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
                {filteredSchedules.length} {viewMode === 'staff' ? 'staff' : 'rooms'} found
              </span>
            </div>
            <div className="overflow-x-auto">
              <ScheduleList
                schedules={filteredSchedules}
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
      />
    </div>
  );
};

export default ManageSchedule;
