import React, { useState, useEffect } from 'react';
import { FiPlus, FiUpload, FiCalendar } from 'react-icons/fi';
import StaffTable from '../components/staff/StaffTable';
import StaffForm from '../components/staff/StaffForm';
import StaffFilter from '../components/staff/StaffFilter';
import StaffPasswordChangeModal from '../components/staff/StaffPasswordChangeModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse';
import ScheduleViewModal from '../components/staff/StaffViewModal';
import {
  createUser,
  getUsers,
  removeUser,
  updateUser,
  getTeachingStaff,
  addTeachingStaff,
  deleteTeachingStaff,
  getUserSchedules,
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
  const [isSaving, setIsSaving] = useState(false);
  //View Schedule
  const [selectedStaffSchedules, setSelectedStaffSchedules] = useState([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

  // Fetch staff with optional filters
  const fetchTeachingStaff = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(
        `Fetching teaching staff with filters - Level: ${selectedLevel}, Gender: ${selectedGender}, Search: ${searchTerm}`
      );
      const response = await getTeachingStaff(
        0,
        selectedLevel,
        selectedGender,
        searchTerm
      );
      console.log('Teaching staff API response:', response);

      // Handle different response formats
      if (response && Array.isArray(response)) {
        setStaff(response);
        console.log(`Loaded ${response.length} staff members`);
      } else if (
        response &&
        response.results &&
        Array.isArray(response.results)
      ) {
        setStaff(response.results);
        console.log(
          `Loaded ${response.results.length} staff members from results`
        );
      } else if (response && Array.isArray(response.data)) {
        setStaff(response.data);
        console.log(`Loaded ${response.data.length} staff members from data`);
      } else {
        console.log(
          'No staff members found or unexpected response format:',
          response
        );
        setStaff([]);
      }
    } catch (err) {
      const errorMsg = 'Failed to fetch staff members. Please try again later.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Error fetching staff:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update when filters change
  useEffect(() => {
    fetchTeachingStaff();
  }, [selectedLevel, selectedGender, searchTerm]);

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
    if (isSaving) return; // Prevent multiple submissions

    setIsSaving(true);
    try {
      if (isEditing && selectedStaff) {
        // Make sure we have a valid userName to update
        if (!selectedStaff.userName) {
          toast.error('Cannot update staff: Missing username');
          console.error('Missing userName in selectedStaff:', selectedStaff);
          setIsSaving(false);
          return;
        }

        console.log('Updating staff member:', selectedStaff.userName);

        // Create update payload
        const updatePayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: parseInt(formData.gender),
          role: 1, // Always set to 1 for teaching staff
          level: parseInt(formData.level) || 7,
          dateOfBirth:
            formData.dateOfBirth || new Date().toISOString().split('T')[0],
          userName: selectedStaff.userName,
        };

        console.log('Update payload:', updatePayload);

        // Call the API to update the user
        const response = await updateUser(
          selectedStaff.userName,
          updatePayload
        );
        console.log('Update response:', response);

        toast.success('Staff member updated successfully');

        // Close the form and refresh the list
        handleCloseModal();
        await fetchTeachingStaff();
      } else {
        // For new staff members
        if (!formData.password) {
          toast.error('Password is required for new staff members');
          setIsSaving(false);
          return;
        }

        // Generate userName for new staff if not provided
        const userName = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
        console.log('Generated userName for new staff:', userName);

        const newStaffData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: parseInt(formData.gender),
          role: 1, // Always set to 1 for teaching staff
          level: parseInt(formData.level) || 7,
          dateOfBirth:
            formData.dateOfBirth || new Date().toISOString().split('T')[0],
          password: formData.password,
          userName: userName,
        };

        console.log('Creating new staff with data:', newStaffData);
        const response = await addTeachingStaff(newStaffData);
        console.log('Create response:', response);

        toast.success('Staff member created successfully');

        // Close the form and refresh the list
        handleCloseModal();
        await fetchTeachingStaff();
      }
    } catch (err) {
      const errorMsg = `Failed to ${isEditing ? 'update' : 'create'} staff member: ${err.message || 'Unknown error'}`;
      toast.error(errorMsg);
      console.error('Error saving staff member:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditStaff = member => {
    console.log('Editing staff member:', member);
    setEditStaffId(member.id);
    setSelectedStaff(member);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteStaff = async member => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        console.log('Deleting staff member:', member.userName);
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
              dateOfBirth:
                member.dateOfBirth || new Date().toISOString().split('T')[0],
              // Use password from CSV if provided, otherwise use a default
              password: member.password || '123456',
              userName:
                member.userName ||
                `${member.firstName.toLowerCase().trim()}.${member.lastName.toLowerCase().trim()}`,
            }));

          console.log(
            `Processing ${staffMembers.length} staff members from CSV`
          );

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

          toast.success(
            `Added ${successCount} of ${staffMembers.length} staff members`
          );
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
    event.target.value = '';
  };

  const handlePasswordChange = member => {
    setSelectedStaff(member);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async newPassword => {
    try {
      setIsLoading(true);
      const updatePayload = {
        firstName: selectedStaff.firstName,
        lastName: selectedStaff.lastName,
        gender: selectedStaff.gender,
        level: selectedStaff.level,
        dateOfBirth: selectedStaff.dateOfBirth,
        role: 1, // Always set to 1 for teaching staff
        password: newPassword,
      };

      await updateUser(selectedStaff.userName, updatePayload);
      toast.success('Password updated successfully');
      setIsPasswordModalOpen(false);
      setSelectedStaff(null);
    } catch (error) {
      toast.error(
        'Error updating password: ' + (error.message || 'Unknown error')
      );
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSchedule = async (staff) => {
    try {
      console.log('Viewing schedule for staff:', staff);
      setIsLoadingSchedules(true);
      setSelectedStaff(staff);
      console.log(`Fetching schedules for staff: ${staff.firstName} ${staff.lastName} (ID: ${staff.userName})`);
      
      // Get schedules for the staff member
      const response = await getUserSchedules(staff.userName);
      console.log('Schedules response:', response);
      
      // Handle different response formats
      let schedules = [];
      if (Array.isArray(response)) {
        schedules = response;
      } else if (response?.data?.items) {
        schedules = response.data.items;
      } else if (response?.results) {
        schedules = response.results;
      }
      
      setSelectedStaffSchedules(schedules);
      setIsScheduleModalOpen(true);
    } catch (err) {
      const errorMsg = `Failed to fetch schedules: ${err.message || 'Unknown error'}`;
      toast.error(errorMsg);
      console.error('Error fetching schedules:', err);
    } finally {
      setIsLoadingSchedules(false);
    }
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
          <p className="text-sm sm:text-base">
            No teaching staff found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <StaffTable
              staff={staff}
              onEdit={handleEditStaff}
              onDelete={handleDeleteStaff}
              onPasswordChange={handlePasswordChange}
              onViewSchedule={handleViewSchedule}
            />
          </div>
        </div>
      )}

      {/* Staff Form Modal */}
      {isModalOpen && (
        <StaffForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitStaff}
          initialData={selectedStaff}
          isEditing={isEditing}
          isSaving={isSaving}
        />
      )}

      {isPasswordModalOpen && (
        <StaffPasswordChangeModal
          isOpen={isPasswordModalOpen}
          onClose={() => {
            setIsPasswordModalOpen(false);
            setSelectedStaff(null);
          }}
          onSubmit={handlePasswordSubmit}
          staffName={selectedStaff?.userName}
        />
      )}

      <ScheduleViewModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedStaffSchedules([]);
        }}
        place={{
          name: selectedStaff ? `${selectedStaff.firstName} ${selectedStaff.lastName}` : '',
          id: selectedStaff?.userName
        }}
        schedules={selectedStaffSchedules}
        isLoading={isLoadingSchedules}
      />
    </div>
  );
};

export default ManageTeachingStaff;
