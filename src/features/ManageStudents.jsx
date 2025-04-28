import React, { useState, useEffect } from 'react';
import StudentTable from '../components/students/StudentTable';
import StudentForm from '../components/students/StudentForm';
import StudentFilter from '../components/students/StudentFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse';

// todo: replace mock data with real API calls
// API endpoints to implement:
// GET /api/students - Fetch all students
// POST /api/students - Create new student
// PUT /api/students/:id - Update student
// DELETE /api/students/:id - Delete student
// POST /api/students/bulk - Bulk upload students from CSV

// Mock data for testing
const mockStudents = [
  {
    id: '1',
    fullId: '2023001',
    firstName: 'David',
    lastName: 'Nady',
    gender: 0,
    role: 2,
    level: 1,
    dateOfBirth: '2003-09-22',
    userName: 'david.nady'
  },
  {
    id: '2',
    fullId: '2023002',
    firstName: 'Fatima',
    lastName: 'Ahmed',
    gender: 1,
    role: 2,
    level: 2,
    dateOfBirth: '2003-02-15',
    userName: 'fatima.ahmed'
  },
  {
    id: '3',
    fullId: '2023003',
    firstName: 'Mohamed',
    lastName: 'Ahmed',
    gender: 0,
    role: 2,
    level: 3,
    dateOfBirth: '2003-05-20',
    userName: 'mohamed.ahmed'
  },
  {
    id: '4',
    fullId: '2023004',
    firstName: 'Girgis',
    lastName: 'Sami',
    gender: 2,
    role: 2,
    level: 4,
    dateOfBirth: '2004-03-09',
    userName: 'girgis.sami'
  }
];

const ManageStudents = () => {
  const [students, setStudents] = useState(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  // todo: Replace with real API call
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStudents(mockStudents);
    } catch (error) {
      toast.error('Error fetching students');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term, level, and gender
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fullId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === '' || student.level === parseInt(selectedLevel);
    const matchesGender = selectedGender === '' || student.gender === parseInt(selectedGender);
    
    return matchesSearch && matchesLevel && matchesGender;
  });

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (student) => {
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

  const handleViewSchedule = (student) => {
    // TODO: Implement schedule viewing logic
    console.log('View schedule for:', student);
  };

  const handleSubmit = async (formData) => {
    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isEditing) {
        const updatedStudent = {
          ...selectedStudent,
          ...formData,
          fullId: selectedStudent.fullId,
          userName: selectedStudent.userName
        };
        setStudents(students.map(s => 
          s.id === updatedStudent.id ? updatedStudent : s
        ));
      } else {
        const newStudent = {
          id: String(students.length + 1),
          fullId: `2023${String(students.length + 1).padStart(3, '0')}`,
          ...formData,
          userName: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`
        };
        setStudents([...students, newStudent]);
      }

      setIsFormOpen(false);
      setSelectedStudent(null);
      setIsEditing(false);
      toast.success(`Student ${isEditing ? 'updated' : 'created'} successfully`);
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

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          // TODO: Replace with real API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newStudents = results.data.map((student, index) => ({
            id: String(students.length + index + 1),
            fullId: `2023${String(students.length + index + 1).padStart(3, '0')}`,
            firstName: student.firstName,
            lastName: student.lastName,
            gender: parseInt(student.gender),
            role: 2,
            level: parseInt(student.level),
            dateOfBirth: student.dateOfBirth,
            userName: `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}`
          }));

          setStudents([...students, ...newStudents]);
          toast.success('Students uploaded successfully');
        } catch (error) {
          toast.error('Error uploading students');
          console.error('Error:', error);
        }
      },
      error: (error) => {
        toast.error('Error parsing CSV file');
        console.error('Error:', error);
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Students</h1>
        <div className="flex space-x-4">
          <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
            Upload CSV
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
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Student
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

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewSchedule={handleViewSchedule}
        />
      )}

      {isFormOpen && (
        <StudentForm
          initialData={selectedStudent ? {
            firstName: selectedStudent.firstName,
            lastName: selectedStudent.lastName,
            gender: selectedStudent.gender,
            role: selectedStudent.role,
            level: selectedStudent.level,
            dateOfBirth: selectedStudent.dateOfBirth,
            password: '', // Password is not stored in the student object
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default ManageStudents;
