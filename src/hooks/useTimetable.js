import { useState, useEffect } from 'react';
import { initialYearData } from '../data/initialTimetableData';
import { YEARS, SEMESTERS } from '../constants/timetable';

export const useTimetable = () => {
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [selectedSemester, setSelectedSemester] = useState(SEMESTERS[0]);
  const [professors, setProfessors] = useState([]);
  const [timetableData, setTimetableData] = useState({});
  const [courses, setCourses] = useState([]);
  const [excludedCourses, setExcludedCourses] = useState([]);
  const [excludedProfessors, setExcludedProfessors] = useState([]);
  const [excludedTimes, setExcludedTimes] = useState([]);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);

  // Load versions from localStorage
  useEffect(() => {
    const savedVersions = localStorage.getItem(`timetableVersions_${selectedYear}_${selectedSemester}`);
    if (savedVersions) {
      try {
        const parsedVersions = JSON.parse(savedVersions);
        setVersions(parsedVersions);
      } catch (error) {
        console.error('Error parsing saved versions:', error);
        localStorage.removeItem(`timetableVersions_${selectedYear}_${selectedSemester}`);
      }
    } else {
      setVersions([]);
    }
  }, [selectedYear, selectedSemester]);

  // Save versions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`timetableVersions_${selectedYear}_${selectedSemester}`, JSON.stringify(versions));
    } catch (error) {
      console.error('Error saving versions:', error);
    }
  }, [versions, selectedYear, selectedSemester]);

  // Update data when year or semester changes
  useEffect(() => {
    const yearInfo = initialYearData[selectedYear][selectedSemester];
    setProfessors(yearInfo.professors);
    setTimetableData(yearInfo.timetableData);
    setCourses(yearInfo.courses);
    setExcludedCourses([]);
    setExcludedProfessors([]);
    setExcludedTimes([]);
  }, [selectedYear, selectedSemester]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedVersion(null);
  };

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    setSelectedVersion(null);
  };

  const handleSaveVersion = (versionName) => {
    const newVersion = {
      id: Date.now(),
      name: versionName,
      timestamp: new Date().toISOString(),
      data: {
        timetableData,
        courses,
        professors,
        excludedCourses,
        excludedProfessors,
        excludedTimes
      }
    };
    setVersions(prev => [...prev, newVersion]);
  };

  const handleRestoreVersion = (versionId) => {
    const versionToRestore = versions.find(v => v.id === versionId);
    if (versionToRestore) {
      const { 
        timetableData: savedTimetableData, 
        courses: savedCourses, 
        professors: savedProfessors, 
        excludedCourses: savedExcludedCourses,
        excludedProfessors: savedExcludedProfessors,
        excludedTimes: savedExcludedTimes
      } = versionToRestore.data;
      
      setTimetableData(savedTimetableData);
      setCourses(savedCourses);
      setProfessors(savedProfessors);
      setExcludedCourses(savedExcludedCourses);
      setExcludedProfessors(savedExcludedProfessors);
      setExcludedTimes(savedExcludedTimes);
      setSelectedVersion(versionId);
    }
  };

  const handleDeleteVersion = (versionId) => {
    setVersions(prev => prev.filter(v => v.id !== versionId));
    if (selectedVersion === versionId) {
      setSelectedVersion(null);
    }
  };

  const handleAddCourse = (newCourse) => {
    setCourses(prev => [...prev, newCourse]);
  };

  const handleAddProfessor = (newProfessor) => {
    setProfessors(prev => [...prev, newProfessor]);
  };

  const handleExcludeCourse = (course) => {
    setExcludedCourses(prev => [...prev, course]);
  };

  const handleIncludeCourse = (course) => {
    setExcludedCourses(prev => prev.filter(c => c !== course));
  };

  const handleExcludeProfessor = (professor) => {
    setExcludedProfessors(prev => [...prev, professor]);
  };

  const handleIncludeProfessor = (professor) => {
    setExcludedProfessors(prev => prev.filter(p => p !== professor));
  };

  const handleExcludeTime = (time) => {
    setExcludedTimes(prev => [...prev, time]);
  };

  const handleIncludeTime = (time) => {
    setExcludedTimes(prev => prev.filter(t => t !== time));
  };

  return {
    selectedYear,
    selectedSemester,
    professors,
    timetableData,
    courses,
    excludedCourses,
    excludedProfessors,
    excludedTimes,
    versions,
    selectedVersion,
    handleYearChange,
    handleSemesterChange,
    handleSaveVersion,
    handleRestoreVersion,
    handleDeleteVersion,
    handleAddCourse,
    handleAddProfessor,
    handleExcludeCourse,
    handleIncludeCourse,
    handleExcludeProfessor,
    handleIncludeProfessor,
    handleExcludeTime,
    handleIncludeTime,
    setTimetableData,
  };
}; 