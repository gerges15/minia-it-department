import React, { useState, useEffect } from 'react';
import StudentTable from '../components/students/StudentTable';
import StudentForm from '../components/students/StudentForm';
import StudentFilter from '../components/students/StudentFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse';
import { FiPlus, FiUpload } from 'react-icons/fi';
import {
  addNewUser,
  getStudents,
  getUserById,
  updateUser,
} from '../../api/endpoints';

// todo: replace mock data with real API calls
// API endpoints to implement:
// GET /api/students - Fetch all students
// POST /api/students - Create new student
// PUT /api/students/:id - Update student
// DELETE /api/students/:id - Delete student
// POST /api/students/bulk - Bulk upload students from CSV

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [selectedGender, setSelectedGender] = useState('');

  // todo: Replace with real API call
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
        // todo: Replace with real API call
        await new Promise(resolve => setTimeout(resolve, 500));

        setStudents(students.filter(s => s.id !== student.id));

        toast.success('Student deleted successfully');
      } catch (error) {
        toast.error('Error deleting student');
        console.error('Error:', error);
      }
    }
  };

  const handleViewSchedule = student => {
    // TODO: Implement schedule viewing logic
    console.log('View schedule for:', student);
  };

  const handleSubmit = async formData => {
    try {
      // TODO: Replace with real API call

      formData.level = parseInt(formData.level);
      formData.gender = parseInt(formData.gender);
      await addNewUser(formData);

      await new Promise(resolve => setTimeout(resolve, 500));

      if (isEditing) {
        const updatedStudent = {
          ...selectedStudent,
          ...formData,
          fullId: selectedStudent.fullId,
          userName: selectedStudent.userName,
        };
        setStudents(
          students.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
        );
        console.log(updatedStudent);
        await updateUser(updatedStudent.userName, updatedStudent);
      } else {
        const newStudent = {
          id: String(students.length + 1),
          fullId: `2023${String(students.length + 1).padStart(3, '0')}`,
          ...formData,
          userName: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`,
        };
        setStudents([...students, newStudent]);
      }

      setIsFormOpen(false);
      setSelectedStudent(null);
      setIsEditing(false);
      toast.success(
        `Student ${isEditing ? 'updated' : 'created'} successfully`
      );
    } catch (error) {
      toast.error(`Error ${isEditing ? 'updating' : 'creating'} student`);
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedStudent(null);
    setIsEditing(false);
  };

  const handleFileUpload = event => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async results => {
        try {
          // TODO: Replace with real API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          const newStudents = results.data.map((student, index) => ({
            id: String(students.length + index + 1),
            fullId: `2023${String(students.length + index + 1).padStart(3, '0')}`,
            firstName: student.firstName,
            lastName: student.lastName,
            gender: parseInt(student.gender),
            role: 1,
            level: parseInt(student.level),
            dateOfBirth: student.dateOfBirth,
            userName: `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}`,
          }));

          setStudents([...students, ...newStudents]);
          toast.success('Students uploaded successfully');
        } catch (error) {
          toast.error('Error uploading students');
          console.error('Error:', error);
        }
      },
      error: error => {
        toast.error('Error parsing CSV file');
        console.error('Error:', error);
      },
    });
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
              <span>Upload CSV</span>
              <input
                type="file"
                accept=".csv"
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
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FiPlus className="h-5 w-5" />
              <span>Add Student</span>
            </button>
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
      </div>

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
              onViewSchedule={handleViewSchedule}
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
                  password: '', // Password is not stored in the student object
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default ManageStudents;
