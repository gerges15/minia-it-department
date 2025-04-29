import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import StaffTable from '../components/staff/StaffTable';
import StaffForm from '../components/staff/StaffForm';
import StaffFilter from '../components/staff/StaffFilter';
import { mockStaff } from '../types/staff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse';

// TODO: Replace mock data with real API calls
// API endpoints to implement:
// GET /api/Users?role=1 - Fetch all staff members
// POST /api/Users - Create new staff member
// PUT /api/Users/:fullId - Update staff member
// DELETE /api/Users - Bulk delete staff members
// POST /api/Users/bulk - Bulk upload staff from CSV

const ManageTeachingStaff = () => {
  // State management
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStaffId, setEditStaffId] = useState(null);

  // Fetch staff on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // TODO: Replace with real API call
        // const response = await fetch('/api/Users?role=1');
        // const data = await response.json();
        // setStaff(data);
        setStaff(mockStaff);
      } catch (err) {
        setError('Failed to fetch staff members. Please try again later.');
        console.error('Error fetching staff:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Modal handlers
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setEditStaffId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditStaffId(null);
  };

  // Staff CRUD operations
  const handleSubmitStaff = async formData => {
    try {
      if (isEditing && editStaffId) {
        // TODO: Replace with real API call
        // await fetch(`/api/Users/${editStaffId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        const updatedStaff = {
          ...formData,
          id: editStaffId,
          role: 1, // Always set role to 1 for staff
        };
        setStaff(prev =>
          prev.map(member =>
            member.id === editStaffId ? updatedStaff : member
          )
        );
        toast.success('Staff member updated successfully');
      } else {
        // TODO: Replace with real API call
        // const response = await fetch('/api/Users', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        // const newStaff = await response.json();
        const newStaff = {
          ...formData,
          id: String(staff.length + 1),
          fullId: `STAFF${String(staff.length + 1).padStart(3, '0')}`,
          role: 1, // Always set role to 1 for staff
          userName: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`,
        };
        setStaff(prev => [...prev, newStaff]);
        toast.success('Staff member created successfully');
      }
      handleCloseModal();
    } catch (err) {
      setError(
        `Failed to ${isEditing ? 'update' : 'create'} staff member. Please try again later.`
      );
      console.error('Error saving staff member:', err);
    }
  };

  const handleEditStaff = member => {
    setEditStaffId(member.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteStaff = async member => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        // TODO: Replace with real API call
        // await fetch(`/api/Users/${member.id}`, { method: 'DELETE' });
        setStaff(prev => prev.filter(s => s.id !== member.id));
        toast.success('Staff member deleted successfully');
      } catch (err) {
        setError('Failed to delete staff member. Please try again later.');
        console.error('Error deleting staff member:', err);
      }
    }
  };

  const handleFileUpload = event => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async results => {
        try {
          // TODO: Replace with real API call
          // await fetch('/api/Users/bulk', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(results.data),
          // });
          const newStaff = results.data.map((member, index) => ({
            id: String(staff.length + index + 1),
            fullId: `STAFF${String(staff.length + index + 1).padStart(3, '0')}`,
            firstName: member.firstName,
            lastName: member.lastName,
            gender: parseInt(member.gender),
            role: 1, // Always set role to 1 for staff
            level: parseInt(member.level),
            dateOfBirth: member.dateOfBirth,
            userName: `${member.firstName.toLowerCase()}.${member.lastName.toLowerCase()}`,
          }));

          setStaff(prev => [...prev, ...newStaff]);
          toast.success('Staff members uploaded successfully');
        } catch (err) {
          setError('Failed to upload staff members. Please try again later.');
          console.error('Error uploading staff members:', err);
        }
      },
      error: err => {
        setError(
          'Error parsing CSV file. Please check the format and try again.'
        );
        console.error('Error parsing CSV:', err);
      },
    });
  };

  // Filter staff based on search and filters
  const filteredStaff = staff.filter(member => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.fullId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === '' || member.level === parseInt(selectedLevel);
    const matchesGender =
      selectedGender === '' || member.gender === parseInt(selectedGender);
    return matchesSearch && matchesLevel && matchesGender;
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
              Manage Teaching Staff
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all teaching staff in the department
            </p>
          </div>
          <div className="flex space-x-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
              <FiPlus className="h-5 w-5" />
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiPlus className="h-5 w-5" />
              Add New Staff
            </button>
          </div>
        </div>

        <StaffFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          selectedGender={selectedGender}
          onGenderChange={setSelectedGender}
        />
      </div>

      {filteredStaff.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
          No staff members found matching your criteria.
        </div>
      ) : (
        <StaffTable
          staff={filteredStaff}
          onEdit={handleEditStaff}
          onDelete={handleDeleteStaff}
        />
      )}

      <StaffForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitStaff}
        initialData={
          isEditing && editStaffId
            ? staff.find(s => s.id === editStaffId)
            : undefined
        }
        isEditing={isEditing}
      />
    </div>
  );
};

export default ManageTeachingStaff;
