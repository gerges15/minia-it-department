import React, { useState, useEffect } from 'react';
import { FiPlus, FiCalendar } from 'react-icons/fi';
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

  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachingPlaces();
  }, []);

  // Modal handlers
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setEditPlaceId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditPlaceId(null);
  };

  // Teaching Place CRUD operations
  const handleSubmitPlace = async formData => {
    try {
      setError(null);
      if (isEditing && editPlaceId) {
        // TODO: Replace with real API call
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
    } catch (err) {
      setError('Failed to save teaching place. Please try again later.');
      console.error('Error saving teaching place:', err);
      toast.error('Failed to save teaching place');
    }
  };

  const handleEditPlace = id => {
    const place = teachingPlaces.find(p => p.id === id);
    if (place) {
      setEditPlaceId(id);
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

        setTeachingPlaces(prev => prev.filter(place => place.id !== id));
        toast.success('Teaching place deleted successfully');
      } catch (err) {
        setError('Failed to delete teaching place. Please try again later.');
        console.error('Error deleting teaching place:', err);
        toast.error('Failed to delete teaching place');
      }
    }
  };

  const handleViewSchedule = async place => {
    // TODO: Implement schedule viewing logic

    console.log(await getTeachingPlaceSchedules(place.id));
    console.log('View schedule for:', place);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button
          onClick={() => setError(null)}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="sr-only">Dismiss</span>
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Manage Teaching Places
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all teaching places in the department
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiPlus className="h-5 w-5" />
            Add New Place
          </button>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </div>

      {filteredPlaces.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
          No teaching places found matching your criteria.
        </div>
      ) : (
        <TeachingPlaceTable
          places={filteredPlaces}
          onEdit={handleEditPlace}
          onDelete={handleDeletePlace}
          onViewSchedule={handleViewSchedule}
        />
      )}

      <TeachingPlaceForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPlace}
        initialData={
          isEditing && editPlaceId
            ? teachingPlaces.find(p => p.id === editPlaceId)
            : undefined
        }
        isEditing={isEditing}
      />
    </div>
  );
};

export default ManageTeachingPlaces;
