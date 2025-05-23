import React, { useState, useEffect } from 'react';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import StaffTable from '../components/staff/StaffTable';
import StaffForm from '../components/staff/StaffForm';
import StaffFilter from '../components/staff/StaffFilter';
import { mockStaff } from '../types/staff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse';
import {
  createUser,
  getUsers,
  removeUser,
  updateUser,
  getTeachingStaff,
  addTeachingStaff,
  deleteTeachingStaff
} from '../../api/endpoints';

// TODO: Replace mock data with real API calls
// API endpoints to implement:
// GET /api/Users?role=1 - Fetch all staff members
// POST /api/Users - Create new staff member
// PUT /api/Users/:userName - Update staff member
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

  // Fetch staff with optional filters
  const fetchTeachingStaff = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Fetching teaching staff with filters - Level: ${selectedLevel}, Gender: ${selectedGender}, Search: ${searchTerm}`);
      const response = await getTeachingStaff(0, selectedLevel, selectedGender, searchTerm);
      console.log('Teaching staff API response:', response);
      
      // Handle different response formats
      if (response && Array.isArray(response)) {
        setStaff(response);
        console.log(`Found ${response.length} staff members`);
      } else if (response && response.results && Array.isArray(response.results)) {
        setStaff(response.results);
        console.log(`Found ${response.results.length} staff members`);
      } else if (response && Array.isArray(response.data)) {
        setStaff(response.data);
        console.log(`Found ${response.data.length} staff members`);
      } else {
        console.log('No staff members found or unexpected response format');
        setStaff([]);
      }
    } catch (err) {
      setError('Failed to fetch staff members. Please try again later.');
      console.error('Error fetching staff:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search term changes
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    fetchTeachingStaff();
  };

  // Handle level filter changes
  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    // fetchTeachingStaff will be triggered by the useEffect
  };
  
  // Handle gender filter changes
  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    // fetchTeachingStaff will be triggered by the useEffect
  };
  
  // Update when filters change
  useEffect(() => {
    fetchTeachingStaff();
  }, [selectedLevel, selectedGender]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchTeachingStaff();
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
        const updatedStaff = {
          ...formData,
          role: 1,
          gender: parseInt(formData.gender) || 1,
          dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0],
          // Only include password if provided in the form
          ...(formData.password ? { password: formData.password } : {})
        };

        await updateUser(editStaffId, updatedStaff);
        setStaff(prev =>
          prev.map(member =>
            member.id === editStaffId ? updatedStaff : member
          )
        );
        toast.success('Staff member updated successfully');
      } else {
        // For new staff members
        if (!formData.password) {
          toast.error('Password is required for new staff members');
          return;
        }

        const newStaffData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: parseInt(formData.gender) || 1,
          role: 1,
          level: parseInt(formData.level) || 7,
          dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0], 
          password: formData.password, // Use password from form
          userName: formData.userName || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`
        };
        
        console.log('Submitting staff data to API:', newStaffData);
        
        try {
          // Use the specific endpoint for adding teaching staff
          const response = await addTeachingStaff(newStaffData);
          console.log('API response:', response);
          
          toast.success('Staff member created successfully');
          
          // Refresh the staff list to show the new member
          fetchTeachingStaff();
        } catch (error) {
          console.error('Failed to add staff member:', error);
          toast.error('Failed to create staff member');
        }
      }
      handleCloseModal();
    } catch (err) {
      const errorMsg = `Failed to ${isEditing ? 'update' : 'create'} staff member. Please try again later.`;
      toast.error(errorMsg);
      setError(errorMsg);
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
        // For deleting staff members, we need to use their userName
        // The API expects an array of usernames
        await deleteTeachingStaff([member.userName]);
        
        // Update the local state by removing the deleted staff member
        setStaff(prev => prev.filter(s => s.userName !== member.userName));
        
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

    toast.info('Processing file...');
    
    Papa.parse(file, {
      header: true,
      complete: async results => {
        try {
          // Process CSV data and ensure role is set to 1 for teaching staff
          const staffMembers = results.data
            .filter(member => member.firstName && member.lastName) // Filter out empty rows
            .map(member => ({
              firstName: member.firstName.trim(),
              lastName: member.lastName.trim(),
              gender: parseInt(member.gender) || 1,
              role: 1, // Always set role to 1 for staff
              level: parseInt(member.level) || 7,
              dateOfBirth: member.dateOfBirth || new Date().toISOString().split('T')[0],
              // Use password from CSV if provided, otherwise use a default
              password: member.password || "123456", 
              userName: member.userName || `${member.firstName.toLowerCase().trim()}.${member.lastName.toLowerCase().trim()}`
            }));

          console.log(`Processing ${staffMembers.length} staff members from CSV`);
          
          // Counter for successful additions
          let successCount = 0;
          
          // For each staff member, call the add function
          for (let i = 0; i < staffMembers.length; i++) {
            try {
              await addTeachingStaff(staffMembers[i]);
              successCount++;
            } catch (error) {
              console.error(`Error adding staff member ${i + 1}:`, error);
            }
          }
          
          toast.success(`Added ${successCount} of ${staffMembers.length} staff members`);
          
          // Refresh the list to show the new members
          fetchTeachingStaff();
          
        } catch (err) {
          toast.error('Failed to process file');
          console.error('Error processing file:', err);
        }
      },
      error: err => {
        toast.error('Error reading CSV file');
        console.error('Error parsing CSV:', err);
      },
    });
    
    // Clear the file input
    event.target.value = "";
  };

  // Filter staff based on search and filters
  const filteredStaff = staff.filter(member => {
    // Safely handle potentially missing fields
    const firstName = member.firstName || '';
    const lastName = member.lastName || '';
    const fullId = member.fullId || member.userName || '';
    const userName = member.userName || '';
    const level = member.level !== undefined ? member.level : '';
    const gender = member.gender !== undefined ? member.gender : '';

    const matchesSearch =
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLevel =
      selectedLevel === '' || level === parseInt(selectedLevel);
    const matchesGender =
      selectedGender === '' || gender === parseInt(selectedGender);
      
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
            <button
              onClick={fetchTeachingStaff}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Refresh staff list"
            >
              <FiRefreshCw className="h-5 w-5" />
              Refresh
            </button>
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
          onSearchChange={handleSearchChange}
          selectedLevel={selectedLevel}
          onLevelChange={handleLevelChange}
          selectedGender={selectedGender}
          onGenderChange={handleGenderChange}
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
