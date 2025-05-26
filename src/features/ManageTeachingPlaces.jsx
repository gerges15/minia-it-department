import React, { useState, useEffect } from 'react';
import { FiPlus, FiUpload, FiCalendar } from 'react-icons/fi';
import TeachingPlaceTable from '../components/TeachingPlaces/TeachingPlaceTable';
import TeachingPlaceForm from '../components/TeachingPlaces/TeachingPlaceForm';
import SearchAndFilter from '../components/TeachingPlaces/SearchAndFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  createTeachingPlace,
  deleteTeachingPlaces,
  getTeachingPlaces,
  getTeachingPlaceSchedules,
  updateTeachingPlace,
} from '../../api/endpoints';
import ScheduleViewModal from '../components/TeachingPlaces/ScheduleViewModal';

const ManageTeachingPlaces = () => {
  // State management
  const [teachingPlaces, setTeachingPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPlaceId, setEditPlaceId] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedPlaceSchedules, setSelectedPlaceSchedules] = useState([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

  const fetchTeachingPlaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching teaching places...");
      const response = await getTeachingPlaces();
      console.log("Teaching places response:", response);
      const teachingPlaces = response.results;
      setTeachingPlaces(teachingPlaces);
      console.log(`Loaded ${teachingPlaces.length} teaching places`);
    } catch (err) {
      const errorMsg = 'Failed to fetch teaching places. Please try again later.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Error fetching teaching places:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachingPlaces();
  }, []);

  // Modal handlers
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setEditPlaceId(null);
    setSelectedPlace(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditPlaceId(null);
    setSelectedPlace(null);
  };

  // Teaching Place CRUD operations
  const handleSubmitPlace = async formData => {
    if (isSaving) return; // Prevent multiple submissions
    
    setIsSaving(true);
    try {
      setError(null);
      if (isEditing && editPlaceId) {
        console.log(`Updating teaching place with ID ${editPlaceId}:`, formData);
        
        // Create clean payload for update
        const updatePayload = {
          name: formData.name,
          capacity: parseInt(formData.capacity),
          type: parseInt(formData.type)
        };
        
        console.log("Update payload:", updatePayload);
        await updateTeachingPlace(editPlaceId, updatePayload);
        
        toast.success('Teaching place updated successfully');
        
        // Close modal and refresh list
        handleCloseModal();
        await fetchTeachingPlaces();
      } else {
        console.log("Creating new teaching place:", formData);
        
        const newPlaceData = {
          name: formData.name,
          capacity: parseInt(formData.capacity),
          type: parseInt(formData.type)
        };
        
        console.log("Create payload:", newPlaceData);
        await createTeachingPlace(newPlaceData);
        
        toast.success('Teaching place created successfully');
        
        // Close modal and refresh list
        handleCloseModal();
        await fetchTeachingPlaces();
      }
    } catch (err) {
      const errorMsg = `Failed to ${isEditing ? 'update' : 'create'} teaching place: ${err.message || 'Unknown error'}`;
      toast.error(errorMsg);
      console.error('Error saving teaching place:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPlace = id => {
    const place = teachingPlaces.find(p => p.id === id);
    if (place) {
      console.log("Editing teaching place:", place);
      setEditPlaceId(id);
      setSelectedPlace(place);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleDeletePlace = async id => {
    if (
      window.confirm('Are you sure you want to delete this teaching place?')
    ) {
      try {
        console.log(`Deleting teaching place with ID ${id}`);
        await deleteTeachingPlaces([id]);
        toast.success('Teaching place deleted successfully');
        await fetchTeachingPlaces(); // Refresh the list to get the latest data
      } catch (err) {
        toast.error(`Failed to delete teaching place: ${err.message || 'Unknown error'}`);
        console.error('Error deleting teaching place:', err);
      }
    }
  };

  const handleViewSchedule = async place => {
    try {
      setIsLoadingSchedules(true);
      setSelectedPlace(place);
      console.log(`Fetching schedules for place: ${place.name} (ID: ${place.id})`);
      const schedules = await getTeachingPlaceSchedules(place.id);
      console.log('Schedules:', schedules);
      setSelectedPlaceSchedules(Array.isArray(schedules) ? schedules : schedules.data?.items || []);
      setIsScheduleModalOpen(true);
    } catch (err) {
      toast.error(`Failed to fetch schedules: ${err.message || 'Unknown error'}`);
      console.error('Error fetching schedules:', err);
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  // Filter teaching places based on search and type
  const filteredPlaces = teachingPlaces.filter(place => {
    const matchesSearch = place.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === 'All' || place.type === parseInt(selectedType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-0">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Manage Teaching Places
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              View and manage all teaching places in the department
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <button
              onClick={handleOpenModal}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              <FiPlus className="h-5 w-5" />
              <span>Add Place</span>
            </button>
          </div>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </div>

      {/* Table area */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 h-48 sm:h-64 flex items-center justify-center">
          <p className="text-sm sm:text-base">No teaching places found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <TeachingPlaceTable
              places={filteredPlaces}
              onEdit={handleEditPlace}
              onDelete={handleDeletePlace}
              onViewSchedule={handleViewSchedule}
            />
          </div>
        </div>
      )}

      <TeachingPlaceForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPlace}
        initialData={selectedPlace}
        isEditing={isEditing}
        isSaving={isSaving}
      />

      <ScheduleViewModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        place={selectedPlace}
        schedules={selectedPlaceSchedules}
        isLoading={isLoadingSchedules}
      />
    </div>
  );
};

export default ManageTeachingPlaces;
