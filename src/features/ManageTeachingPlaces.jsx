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

  const fetchTeachingPlaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getTeachingPlaces();
      const teachingPlaces = response.results;
      setTeachingPlaces(teachingPlaces);
    } catch (err) {
      setError('Failed to fetch teaching places. Please try again later.');
      console.error('Error fetching teaching places:', err);
      toast.error('Failed to fetch teaching places');
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
    try {
      setError(null);
      if (isEditing && editPlaceId) {
        const updatedPlace = await updateTeachingPlace(editPlaceId, formData);
        setTeachingPlaces(prev =>
          prev.map(place => (place.id === editPlaceId ? updatedPlace : place))
        );
        toast.success('Teaching place updated successfully');
      } else {
        const newPlace = await createTeachingPlace(formData);
        setTeachingPlaces(prev => [...prev, newPlace]);
        toast.success('Teaching place created successfully');
      }
      handleCloseModal();
      fetchTeachingPlaces(); // Refresh the list to get the latest data
    } catch (err) {
      toast.error('Failed to save teaching place');
      console.error('Error saving teaching place:', err);
    }
  };

  const handleEditPlace = id => {
    const place = teachingPlaces.find(p => p.id === id);
    if (place) {
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
        await deleteTeachingPlaces([id]);
        toast.success('Teaching place deleted successfully');
        fetchTeachingPlaces(); // Refresh the list to get the latest data
      } catch (err) {
        toast.error('Failed to delete teaching place');
        console.error('Error deleting teaching place:', err);
      }
    }
  };

  const handleViewSchedule = async place => {
    try {
      const schedules = await getTeachingPlaceSchedules(place.id);
      console.log('Schedules:', schedules);
      // Here you could navigate to a schedule view or open a modal with schedules
      toast.info(`Viewing schedules for ${place.name}`);
    } catch (err) {
      toast.error('Failed to fetch schedules');
      console.error('Error fetching schedules:', err);
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
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
      />
    </div>
  );
};

export default ManageTeachingPlaces;
