import React, { useState, useEffect } from 'react';
import StudentTable from '../components/students/StudentTable';
import StudentForm from '../components/students/StudentForm';
import StudentFilter from '../components/students/StudentFilter';
import PasswordChangeModal from '../components/students/PasswordChangeModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPlus, FiUpload } from 'react-icons/fi';
import {
  addNewUser,
  getStudents,
  getUserById,
  updateUser,
  deleteStudent,
  registerFromFile,
} from '../../api/endpoints';

// Expected Excel xlsx format for student upload:
// Required columns:
// - firstName: string (e.g., "John")
// - lastName: string (e.g., "Doe")
// - gender: number (0: Male, 1: Female)
// - level: number (1: First, 2: Second, 3: Third, 4: Fourth)
// - dateOfBirth: string (format: "YYYY-MM-DD")
// - password: string (optional, will use default if not provided)

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [selectedGender, setSelectedGender] = useState('');

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      // Pass filter parameters to the API
      const students = await getStudents(
        0, // page
        selectedLevel,
        selectedGender,
        searchTerm
      );
      setStudents(await students.results);
    } catch (error) {
      toast.error('Error fetching students');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, selectedLevel, selectedGender]);

  // Filter students client-side for any additional filtering not handled by API
  const filteredStudents = students;

  const handleEdit = student => {
    setSelectedStudent(student);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async student => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setIsLoading(true);
        await deleteStudent([student.userName]);
        setStudents(students.filter(s => s.userName !== student.userName));
        toast.success('Student deleted successfully');
      } catch (error) {
        toast.error('Error deleting student');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async formData => {
    try {
      formData.level = parseInt(formData.level);
      formData.gender = parseInt(formData.gender);
      formData.role = 2; // Always ensure role is set to Student (2)

      if (isEditing) {
        const updatedStudent = {
          ...selectedStudent,
          ...formData,
        };
        
        const updatePayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          level: formData.level,
          dateOfBirth: formData.dateOfBirth,
          role: 2
        };

        if (formData.password) {
          updatePayload.password = formData.password;
        }
        
        await updateUser(selectedStudent.userName, updatePayload);
        
        setStudents(
          students.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
        );
        
        toast.success('Student updated successfully');
      } else {
        if (!formData.password) {
          toast.error('Password is required for new students');
          return;
        }

        const newUserData = {
          ...formData,
          userName: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`,
          role: 2,
          password: formData.password
        };
        
        await addNewUser(newUserData);
        
        const newStudent = {
          id: String(Date.now()),
          fullId: `ST-${Date.now()}`,
          userName: newUserData.userName,
          ...formData,
        };
        
        setStudents([...students, newStudent]);
        toast.success('Student created successfully');
      }

      setIsFormOpen(false);
      setSelectedStudent(null);
      setIsEditing(false);
      
      fetchStudents();
    } catch (error) {
      toast.error(`Error ${isEditing ? 'updating' : 'creating'} student: ${error.message || 'Unknown error'}`);
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedStudent(null);
    setIsEditing(false);
  };

  const handleFileUpload = async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected for upload:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      setIsLoading(true);
      
      // Call the API endpoint for bulk registration (0 represents ContentType.Students)
      console.log('Starting file upload process...');
      await registerFromFile(0, file);

      // Refresh the student list to show newly added students
      console.log('File upload successful, refreshing student list...');
      await fetchStudents();
      toast.success('Students uploaded successfully');
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast.error('Error uploading students: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (student) => {
    setSelectedStudent(student);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async (newPassword) => {
    try {
      setIsLoading(true);
      const updatePayload = {
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
        gender: selectedStudent.gender,
        level: selectedStudent.level,
        dateOfBirth: selectedStudent.dateOfBirth,
        role: selectedStudent.role,
        password: newPassword
      };
      
      await updateUser(selectedStudent.userName, updatePayload);
      toast.success('Password updated successfully');
      setIsPasswordModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      toast.error('Error updating password: ' + (error.message || 'Unknown error'));
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-0">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Students</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              View and manage all students in the department
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <label className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <FiUpload className="h-5 w-5" />
              <span>Upload xlsx</span>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedStudent(null);
                setIsFormOpen(true);
              }}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              <FiPlus className="h-5 w-5" />
              <span>Add Student</span>
            </button>
          </div>
        </div>
      </div>

      <StudentFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
      />

      {/* Table area */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 h-48 sm:h-64 flex items-center justify-center">
          <p className="text-sm sm:text-base">No students found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <StudentTable
              students={filteredStudents}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPasswordChange={handlePasswordChange}
            />
          </div>
        </div>
      )}

      {isFormOpen && (
        <StudentForm
          initialData={
            selectedStudent
              ? {
                  firstName: selectedStudent.firstName,
                  lastName: selectedStudent.lastName,
                  gender: selectedStudent.gender,
                  role: selectedStudent.role,
                  level: selectedStudent.level,
                  dateOfBirth: selectedStudent.dateOfBirth,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={isEditing}
        />
      )}

      {isPasswordModalOpen && (
        <PasswordChangeModal
          isOpen={isPasswordModalOpen}
          onClose={() => {
            setIsPasswordModalOpen(false);
            setSelectedStudent(null);
          }}
          onSubmit={handlePasswordSubmit}
          studentName={selectedStudent?.userName}
        />
      )}
    </div>
  );
};

export default ManageStudents;
