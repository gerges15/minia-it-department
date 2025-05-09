import React, { useState, useEffect } from 'react';
import { FiPlus, FiCalendar } from 'react-icons/fi';
import TeachingPlaceTable from '../components/TeachingPlaces/TeachingPlaceTable';
import TeachingPlaceForm from '../components/TeachingPlaces/TeachingPlaceForm';
import SearchAndFilter from '../components/TeachingPlaces/SearchAndFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock data for testing
const mockTeachingPlaces = [
  {
    id: '1',
    name: 'H105',
    capacity: 150,
    type: 0, // 0=Hall, 1=Lab, 2=Stadium
    schedules: []
  },
  {
    id: '2',
    name: 'L201',
    capacity: 30,
    type: 1,
    schedules: []
  },
  {
    id: '3',
    name: 'S101',
    capacity: 500,
    type: 1,
    schedules: []
  },
  {
    id: '4',
    name: 'H203',
    capacity: 100,
    type: 0,
    schedules: []
  }
];

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

  // Fetch teaching places on component mount
  useEffect(() => {
    const fetchTeachingPlaces = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // TODO: Replace with real API call
        // const response = await fetch('/api/TeachingPlaces');
        // const data = await response.json();
        // setTeachingPlaces(data);
        setTeachingPlaces(mockTeachingPlaces);
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
  const handleSubmitPlace = async (formData) => {
    try {
      setError(null);
      if (isEditing && editPlaceId) {
        // TODO: Replace with real API call
        // await fetch(`/api/TeachingPlaces`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        const updatedPlace = {
          ...formData,
          id: editPlaceId
        };
        setTeachingPlaces((prev) => prev.map((place) => (place.id === editPlaceId ? updatedPlace : place)));
        toast.success('Teaching place updated successfully');
      } else {
        // TODO: Replace with real API call
        // const response = await fetch('/api/TeachingPlaces', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        // const newPlace = await response.json();
        const newPlace = {
          ...formData,
          id: String(teachingPlaces.length + 1),
          schedules: []
        };
        setTeachingPlaces((prev) => [...prev, newPlace]);
        toast.success('Teaching place created successfully');
      }
      handleCloseModal();
    } catch (err) {
      setError('Failed to save teaching place. Please try again later.');
      console.error('Error saving teaching place:', err);
      toast.error('Failed to save teaching place');
    }
  };

  const handleEditPlace = (id) => {
    const place = teachingPlaces.find((p) => p.id === id);
    if (place) {
      setEditPlaceId(id);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleDeletePlace = async (id) => {
    if (window.confirm('Are you sure you want to delete this teaching place?')) {
      try {
        // TODO: Replace with real API call
        // await fetch(`/api/TeachingPlaces`, {
        //   method: 'DELETE',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ ids: [id] }),
        // });
        setTeachingPlaces((prev) => prev.filter((place) => place.id !== id));
        toast.success('Teaching place deleted successfully');
      } catch (err) {
        setError('Failed to delete teaching place. Please try again later.');
        console.error('Error deleting teaching place:', err);
        toast.error('Failed to delete teaching place');
      }
    }
  };

  const handleViewSchedule = (place) => {
    // TODO: Implement schedule viewing logic
    console.log('View schedule for:', place);
  };

  // Filter teaching places based on search and type
  const filteredPlaces = teachingPlaces.filter((place) => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || place.type === parseInt(selectedType);
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button
          onClick={() => setError(null)}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
            <h1 className="text-2xl font-bold text-gray-800">Manage Teaching Places</h1>
            <p className="text-gray-600 mt-1">View and manage all teaching places in the department</p>
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
        initialData={isEditing && editPlaceId ? teachingPlaces.find((p) => p.id === editPlaceId) : undefined}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ManageTeachingPlaces;
