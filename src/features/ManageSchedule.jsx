import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiMapPin } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScheduleCalendar from '../components/schedule/ScheduleCalendar';
import ScheduleForm from '../components/schedule/ScheduleForm';
import ScheduleFilter from '../components/schedule/ScheduleFilter';
import ScheduleList from '../components/schedule/ScheduleList';

// Mock data for testing
const mockStaff = [
  { id: '1', userName: 'david.nady', schedules: [] },
  { id: '2', userName: 'fatima.ahmed', schedules: [] },
  { id: '3', userName: 'mohamed.ahmed', schedules: [] }
];

const mockRooms = [
  { id: '1', placeId: 'room-101', schedules: [] },
  { id: '2', placeId: 'room-102', schedules: [] },
  { id: '3', placeId: 'room-103', schedules: [] }
];

const ManageSchedule = () => {
  const [viewMode, setViewMode] = useState('staff'); // 'staff' or 'room'
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTimeSlotForm, setIsTimeSlotForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    day: new Date().getDay(), // Default to today
    entityId: ''
  });

  // Initialize schedules with mock data
  useEffect(() => {
    setSchedules(viewMode === 'staff' ? mockStaff : mockRooms);
  }, [viewMode]);

  const handleAddEntity = async (formData) => {
    try {
      const newEntity = {
        id: Date.now().toString(),
        [viewMode === 'staff' ? 'userName' : 'placeId']: formData.identifier,
        schedules: []
      };
      
      setSchedules(prevSchedules => {
        const updatedSchedules = [...prevSchedules, newEntity];
        console.log('Adding new entity:', newEntity);
        console.log('Previous schedules:', prevSchedules);
        console.log('Updated schedules:', updatedSchedules);
        return updatedSchedules;
      });
      
      setIsFormOpen(false);
      toast.success(`${viewMode === 'staff' ? 'Staff' : 'Room'} added successfully`);
    } catch (error) {
      toast.error(`Error adding ${viewMode === 'staff' ? 'staff' : 'room'}`);
      console.error('Error:', error);
    }
  };

  const handleAddTimeSlot = async (entityId, formData) => {
    try {
      const newTimeSlot = {
        id: formData.id || `${entityId}-${Date.now()}`,
        ...formData
      };
      
      setSchedules(prevSchedules => {
        const updatedSchedules = prevSchedules.map(entity => {
          if (entity.id === entityId) {
            // Check if this is an update to an existing time slot
            const existingIndex = entity.schedules.findIndex(s => s.id === newTimeSlot.id);
            if (existingIndex !== -1) {
              // Update existing time slot
              const updatedSchedules = [...entity.schedules];
              updatedSchedules[existingIndex] = newTimeSlot;
              return { ...entity, schedules: updatedSchedules };
            } else {
              // Add new time slot
              return { ...entity, schedules: [...entity.schedules, newTimeSlot] };
            }
          }
          return entity;
        });
        console.log('Adding/Updating time slot:', newTimeSlot);
        console.log('Updated schedules:', updatedSchedules);
        return updatedSchedules;
      });
      
      setIsFormOpen(false);
      toast.success('Time slot updated successfully');
    } catch (error) {
      toast.error('Error updating time slot');
      console.error('Error:', error);
    }
  };

  const handleEditTimeSlot = async (entityId, timeSlot) => {
    setSelectedSchedule({ id: entityId, ...timeSlot });
    setIsTimeSlotForm(true);
    setIsFormOpen(true);
  };

  const handleDeleteTimeSlot = async (entityId, timeSlotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        setSchedules(prev => prev.map(entity => 
          entity.id === entityId
            ? { ...entity, schedules: entity.schedules.filter(s => s.id !== timeSlotId) }
            : entity
        ));
        toast.success('Time slot deleted successfully');
      } catch (error) {
        toast.error('Error deleting time slot');
        console.error('Error:', error);
      }
    }
  };

  // Filter schedules based on selected day and entity
  const filteredSchedules = schedules.filter(schedule => {
    const matchesDay = filter.day === '' || 
      schedule.schedules.some(s => s.day === filter.day);
    const matchesEntity = filter.entityId === '' || 
      schedule.id === filter.entityId;
    return matchesDay && matchesEntity;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Schedules</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('staff')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              viewMode === 'staff' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <FiUser className="mr-2" />
            Staff Schedules
          </button>
          <button
            onClick={() => setViewMode('room')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              viewMode === 'room' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <FiMapPin className="mr-2" />
            Room Schedules
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <ScheduleFilter
        filter={filter}
        setFilter={setFilter}
        viewMode={viewMode}
        entities={schedules}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar View */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiCalendar className="mr-2" />
            Calendar View
          </h2>
          <ScheduleCalendar
            schedules={schedules}
            filter={filter}
            onScheduleClick={setSelectedSchedule}
          />
        </div>

        {/* List View */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiClock className="mr-2" />
            Schedule List
          </h2>
          <ScheduleList
            schedules={schedules}
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
        />
      )}
    </div>
  );
};

export default ManageSchedule;
