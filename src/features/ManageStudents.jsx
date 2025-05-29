import React, { useState, useEffect } from 'react';
import StudentTable from '../components/students/StudentTable';
import StudentForm from '../components/students/StudentForm';
import StudentFilter from '../components/students/StudentFilter';
import PasswordChangeModal from '../components/students/PasswordChangeModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPlus, FiUpload, FiDownload, FiChevronDown } from 'react-icons/fi';
import * as XLSX from 'xlsx';
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

// Required columns for Excel upload
const REQUIRED_COLUMNS = ['username', 'name', 'gender', 'level', 'dateofbirth'];

const validateExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON, skipping the header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          reject(new Error('File is empty or contains no data rows'));
          return;
        }
        
        // Skip header row and validate data rows
        const dataRows = jsonData.slice(1);
        const invalidRows = [];
        
        dataRows.forEach((row, index) => {
          if (!row || row.length < 5) { // Check minimum required fields
            invalidRows.push(index + 2);
          }
        });
        
        if (invalidRows.length > 0) {
          reject(new Error(
            `Invalid data in rows: ${invalidRows.join(', ')}`
          ));
          return;
        }
        
        resolve(true);
      } catch (error) {
        reject(new Error('Invalid Excel file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

const processExcelData = (rows) => {
  return rows.map(row => {
    // Create a username from the first and last name (if provided)
    const firstName = String(row[0] || '').trim();
    const lastName = String(row[1] || '').trim();
    const userName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/\s+/g, '');

    return {
      userName,
      firstName,
      lastName,
      gender: parseInt(row[2]) || 0, // Default to 0 (Male) if invalid
      level: parseInt(row[3]) || 1,  // Default to 1 if invalid
      dateOfBirth: row[4] || new Date().toISOString().split('T')[0], // Default to current date if invalid
      role: 2, // Student role
      password: row[5] || 'defaultPassword123' // Use provided password or default
    };
  }).filter(student => 
    student.firstName && 
    student.lastName && 
    !isNaN(student.gender) && 
    !isNaN(student.level) &&
    student.dateOfBirth
  );
};

const downloadTemplate = () => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create headers
  const headers = ['Username', 'Name', 'Gender', 'Level', 'DateOfBirth'];
  const exampleData = ['john.doe', 'John Doe', '0', '1', '2000-01-01'];
  
  // Create worksheet with headers and example row
  const ws = XLSX.utils.aoa_to_sheet([headers, exampleData]);
  
  // Add notes about format
  ws['!cols'] = [
    { wch: 15 }, // Username column width
    { wch: 20 }, // Name column width
    { wch: 10 }, // Gender column width
    { wch: 10 }, // Level column width
    { wch: 12 }, // DateOfBirth column width
  ];
  
  // Add the worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  
  // Save the file
  XLSX.writeFile(wb, 'student_upload_template.xlsx');
};

const downloadStudentsByYear = async (year) => {
  try {
    // Fetch students for the specific year
    const response = await getStudents(0, year.toString(), '', '');
    const students = response.results || [];

    if (students.length === 0) {
      toast.warning(`No students found for Year ${year}`);
      return;
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Prepare the data for Excel
    const data = students.map(student => ({
      Username: student.userName,
      'First Name': student.firstName,
      'Last Name': student.lastName,
      Gender: student.gender === 0 ? 'Male' : 'Female',
      Level: student.level,
      'Date of Birth': student.dateOfBirth,
    }));

    // Convert to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Username
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 10 }, // Gender
      { wch: 8 },  // Level
      { wch: 12 }, // Date of Birth
    ];

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, `Year${year}_Students`);

    // Save the file
    XLSX.writeFile(wb, `students_year${year}.xlsx`);
    toast.success(`Downloaded students for Year ${year}`);
  } catch (error) {
    console.error('Error downloading students:', error);
    toast.error('Failed to download students');
  }
};

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

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

    // Check file type
    const fileType = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(fileType)) {
      toast.error('Please upload only Excel files (.xlsx or .xls)');
      return;
    }

    try {
      setIsLoading(true);
      
      // Validate file structure
      await validateExcelFile(file);
      
      // Create FormData
      const formData = new FormData();
      
      // Append the file with the correct field name expected by the server
      formData.append('excelFile', file);
      
      // Upload the file
      await registerFromFile(0, formData);
      
      // Refresh the student list
      await fetchStudents();
      toast.success('Students uploaded successfully');
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast.error(error.message || 'Error uploading students');
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = '';
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Title Section */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Students</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              View and manage all students in the department
            </p>
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              {/* Template Button */}
              <button
                onClick={downloadTemplate}
                className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
              >
                <FiDownload className="h-5 w-5" />
                <span className="whitespace-nowrap">Template</span>
              </button>

              {/* Download Students Dropdown */}
              <div className="relative flex-1 sm:flex-initial">
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <FiDownload className="h-5 w-5" />
                  <span className="whitespace-nowrap">Download Students</span>
                  <FiChevronDown className="h-4 w-4" />
                </button>

                {showDownloadMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {[1, 2, 3, 4].map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            downloadStudentsByYear(year);
                            setShowDownloadMenu(false);
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Year {year} Students
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <FiUpload className="h-5 w-5" />
                <span className="whitespace-nowrap">Upload xlsx</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Add Student Button */}
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedStudent(null);
                  setIsFormOpen(true);
                }}
                className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                <FiPlus className="h-5 w-5" />
                <span className="whitespace-nowrap">Add Student</span>
              </button>
            </div>
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
