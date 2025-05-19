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
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState({
    day: new Date().getDay(),
    entityId: '',
    timeRange: {
      start: 8,
      end: 18
    }
  });

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (viewMode === 'staff') {
        response = await getUsers(0, 1); // Get staff members (role 1)
        response = response.results; // Extract the results array
      } else {
        response = await getTeachingPlaces();
        response = response.results; // Extract the results array
      }
      
      if (response && Array.isArray(response)) {
        const entitiesWithSchedules = await Promise.all(
          response.map(async (entity) => {
            try {
              const schedulesResponse = viewMode === 'staff'
                ? await getUserSchedules(entity.userName)
                : await getTeachingPlaceSchedules(entity.id);
              
              return {
                id: entity.id,
                [viewMode === 'staff' ? 'userName' : 'placeId']: viewMode === 'staff' ? entity.userName : entity.placeId,
                schedules: schedulesResponse || []
              };
            } catch (error) {
              console.error(`Error fetching schedules for ${entity.userName || entity.placeId}:`, error);
              return {
                id: entity.id,
                [viewMode === 'staff' ? 'userName' : 'placeId']: viewMode === 'staff' ? entity.userName : entity.placeId,
                schedules: []
              };
            }
          })
        );
        
        setSchedules(entitiesWithSchedules);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [viewMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddEntity = async (formData) => {
    setIsSaving(true);
    try {
      const newEntity = {
        id: Date.now().toString(),
        [viewMode === 'staff' ? 'userName' : 'placeId']: formData.identifier,
        schedules: []
      };
      
      setSchedules(prevSchedules => [...prevSchedules, newEntity]);
      setIsFormOpen(false);
      toast.success(`${viewMode === 'staff' ? 'Staff' : 'Room'} added successfully`);
    } catch (error) {
      toast.error(`Error adding ${viewMode === 'staff' ? 'staff' : 'room'}`);
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTimeSlot = async (entityId, formData) => {
    setIsSaving(true);
    try {
      const newTimeSlot = {
        id: formData.id || `${entityId}-${Date.now()}`,
        ...formData
      };

      // Update local state
      setSchedules(prevSchedules => {
        return prevSchedules.map(entity => {
          if (entity.id === entityId) {
            const existingIndex = entity.schedules.findIndex(s => s.id === newTimeSlot.id);
            if (existingIndex !== -1) {
              const updatedSchedules = [...entity.schedules];
              updatedSchedules[existingIndex] = newTimeSlot;
              return { ...entity, schedules: updatedSchedules };
            } else {
              return { ...entity, schedules: [...entity.schedules, newTimeSlot] };
            }
          }
          return entity;
        });
      });

      // Update backend
      const entity = schedules.find(e => e.id === entityId);
      if (entity) {
        if (viewMode === 'staff') {
          await addUserSchedules(entity.userName, [newTimeSlot]);
        } else {
          await addTeachingPlaceSchedules(entity.id, [newTimeSlot]);
        }
      }
      
      setIsFormOpen(false);
      toast.success('Time slot updated successfully');
    } catch (error) {
      toast.error('Error updating time slot');
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTimeSlot = async (entityId, timeSlot) => {
    setSelectedSchedule({ id: entityId, ...timeSlot });
    setIsTimeSlotForm(true);
    setIsFormOpen(true);
  };

  const handleDeleteTimeSlot = async (entityId, timeSlotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      setIsSaving(true);
      try {
        // Update local state
        setSchedules(prev => prev.map(entity => 
          entity.id === entityId
            ? { ...entity, schedules: entity.schedules.filter(s => s.id !== timeSlotId) }
            : entity
        ));

        // Update backend
        const entity = schedules.find(e => e.id === entityId);
        if (entity) {
          if (viewMode === 'staff') {
            await removeUserSchedules(entity.userName, [timeSlotId]);
          } else {
            await removeTeachingPlaceSchedules(entity.id, [timeSlotId]);
          }
        }

        toast.success('Time slot deleted successfully');
      } catch (error) {
        toast.error('Error deleting time slot');
        console.error('Error:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Filter schedules based on selected day, entity, and time range
  const filteredSchedules = schedules.filter(schedule => {
    // Filter by entity (staff/room)
    const matchesEntity = !filter.entityId || schedule.id === filter.entityId;
    
    // Filter by day
    const matchesDay = filter.day === '' || 
      schedule.schedules.some(s => s.day === filter.day);
    
    // Filter by time range
    const matchesTimeRange = schedule.schedules.some(s => 
      (s.startFrom >= filter.timeRange.start && s.startFrom < filter.timeRange.end) ||
      (s.endTo > filter.timeRange.start && s.endTo <= filter.timeRange.end)
    );

    return matchesEntity && matchesDay && matchesTimeRange;
  });

  // Handle filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(prev => ({
      ...prev,
      ...newFilter
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilter({
      day: new Date().getDay(),
      entityId: '',
      timeRange: {
        start: 8,
        end: 18
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading schedule data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Schedules</h1>
          <p className="text-gray-600 mt-1">View and manage staff and room schedules</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setViewMode('staff');
              handleResetFilters();
            }}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'staff' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiUser className="mr-2" />
            Staff Schedules
          </button>
          <button
            onClick={() => {
              setViewMode('room');
              handleResetFilters();
            }}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'room' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiMapPin className="mr-2" />
            Room Schedules
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
        <ScheduleFilter
          filter={filter}
          setFilter={handleFilterChange}
          viewMode={viewMode}
          entities={schedules}
          onReset={handleResetFilters}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FiCalendar className="mr-2" />
              Calendar View
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Reset Filters
              </button>
              <button
                onClick={() => {
                  setSelectedSchedule(null);
                  setIsTimeSlotForm(false);
                  setIsFormOpen(true);
                }}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FiPlus className="mr-1" />
                Add New
              </button>
            </div>
          </div>
          <ScheduleCalendar
            schedules={filteredSchedules}
            filter={filter}
            onScheduleClick={setSelectedSchedule}
            viewMode={viewMode}
          />
        </div>

        {/* List View */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FiClock className="mr-2" />
              Schedule List
            </h2>
            <span className="text-sm text-gray-500">
              {filteredSchedules.length} {viewMode === 'staff' ? 'staff' : 'rooms'} found
            </span>
          </div>
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

      {/* Form Modal */}
      {isFormOpen && (
        <ScheduleForm
          viewMode={viewMode}
          onSubmit={isTimeSlotForm ? handleAddTimeSlot : handleAddEntity}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedSchedule(null);
            setIsTimeSlotForm(false);
          }}
          isTimeSlotForm={isTimeSlotForm}
          initialData={selectedSchedule}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default ManageSchedule;
