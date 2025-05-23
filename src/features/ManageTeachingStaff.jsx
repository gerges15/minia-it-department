import React, { useState, useEffect } from 'react';
import { FiPlus, FiUpload } from 'react-icons/fi';
import StaffTable from '../components/staff/StaffTable';
import StaffForm from '../components/staff/StaffForm';
import StaffFilter from '../components/staff/StaffFilter';
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
  const [selectedLevel, setSelectedLevel] = useState('7'); // Default to teaching lecturers
  const [selectedGender, setSelectedGender] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStaffId, setEditStaffId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

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
      } else if (response && response.results && Array.isArray(response.results)) {
        setStaff(response.results);
      } else if (response && Array.isArray(response.data)) {
        setStaff(response.data);
      } else {
        setStaff([]);
      }
    } catch (err) {
      setError('Failed to fetch staff members. Please try again later.');
      console.error('Error fetching staff:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update when filters change
  useEffect(() => {
    fetchTeachingStaff();
  }, [selectedLevel, selectedGender, searchTerm]);

  // Initial fetch with default settings
  useEffect(() => {
    fetchTeachingStaff();
  }, []);

  // Modal handlers
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setEditStaffId(null);
    setSelectedStaff(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditStaffId(null);
    setSelectedStaff(null);
  };

  // Staff CRUD operations
  const handleSubmitStaff = async formData => {
    try {
      if (isEditing && selectedStaff) {
        const updatedStaff = {
          ...formData,
          role: 1,
          gender: parseInt(formData.gender) || 1,
          level: parseInt(formData.level) || 7,
          dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0],
          // Only include password if provided in the form
          ...(formData.password ? { password: formData.password } : {})
        };

        await updateUser(selectedStaff.userName, updatedStaff);
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
          role: 1, // Always set to 1 for teaching staff
          level: parseInt(formData.level) || 7,
          dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0], 
          password: formData.password,
          userName: formData.userName || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`
        };
        
        await addTeachingStaff(newStaffData);
        toast.success('Staff member created successfully');
      }
      
      // Refresh the staff list
      fetchTeachingStaff();
      handleCloseModal();
      
    } catch (err) {
      const errorMsg = `Failed to ${isEditing ? 'update' : 'create'} staff member. Please try again later.`;
      toast.error(errorMsg);
      console.error('Error saving staff member:', err);
    }
  };

  const handleEditStaff = member => {
    setEditStaffId(member.id);
    setSelectedStaff(member);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteStaff = async member => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteTeachingStaff([member.userName]);
        toast.success('Staff member deleted successfully');
        fetchTeachingStaff();
      } catch (err) {
        toast.error('Failed to delete staff member. Please try again later.');
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

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-0">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Manage Teaching Staff
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              View and manage all teaching staff in the department
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <label className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <FiUpload className="h-5 w-5" />
              <span>Upload CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleOpenModal}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FiPlus className="h-5 w-5" />
              <span>Add Staff</span>
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

      {/* Table area */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : staff.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 h-48 sm:h-64 flex items-center justify-center">
          <p className="text-sm sm:text-base">No staff members found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <StaffTable
              staff={staff}
              onEdit={handleEditStaff}
              onDelete={handleDeleteStaff}
            />
          </div>
        </div>
      )}

      {/* Staff Form Modal */}
      <StaffForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitStaff}
        initialData={selectedStaff}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ManageTeachingStaff;
