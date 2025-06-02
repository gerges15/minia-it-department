import api from './apiClint';
import Cookies from 'js-cookie';
export const addTeachingPlace = async newPlaceData =>
  await api.post('/TeachingPlaces', newPlaceData);
export const deleteTeachingPlace = async id =>
  await api.delete('/TeachingPlaces', { data: [id] });

export const editCourse = async (id, updatedCourseData) =>
  await api.put(`/api/Courses/${id}`, updatedCourseData);

export const addNewCourse = async newCourse =>
  api.post('/api/Courses', newCourse);

// student endpoints

export const addNewUser = async data => api.post('/api/Users/', data);

export const getStudents = async (
  page = 0,
  level = null,
  gender = null,
  name = ''
) => {
  let query = `page=${page}&role=2`; // Always include role=2 to get only students
  if (level !== null && level !== '') query += `&level=${level}`;
  if (gender !== null && gender !== '') query += `&gender=${gender}`;
  if (name) query += `&name=${name}`;

  return await api.get(`/api/Users?${query}`);
};

// Function to delete a student by username

export const deleteStudent = async usernamesList =>
  await api.delete(`/api/Users?role=2`, usernamesList);

// Authentication
export const login = async (userName, password) =>
  await api.zPost('/api/Authentications', { userName, password });
export const refreshUserToken = async (fullId, refreshToken) =>
  await api.get(
    `/api/Users/${fullId}/Authentications?refreshToken=${refreshToken}`
  );
export const logout = async (fullId, refreshToken) =>
  await api.delete(`/api/Users/${fullId}/Authentications`, { refreshToken });

//Timetable
//{{baseUrl}}/api/TimeTables/{{user-name}}
export const getTimetableByUserName = async userName =>
  await api.get(`/api/TimeTables/${userName}`);

//{{baseUrl}}/api/TimeTables/{{user-name}}/{{level}}
export const getTimetableByLevel = async (userName, level) =>
  await api.get(`/api/TimeTables/${level}`);


// Courses

export const getCoursesByLevelAndSemester = async (level, semester, name) =>
  await api.get(
    `/api/Courses?page=0&level=${level}&semester=${semester}&name=${name}`
  );
export const createCourse = async courseData =>
  await api.post('/api/Courses', courseData);
// get courses by level and semester
export const getCourses = async (
  page = 0,
  level = null,
  semester = null,
  name = ''
) => {
  // For "All" selection, use a simple request without specific filters
  if (level === null && semester === null) {
    return await api.get(`/api/Courses?page=${page}`);
  }

  // Otherwise, build query with specific filters
  let query = `page=${page}`;
  if (level !== null) query += `&level=${level}`;
  if (semester !== null) query += `&semester=${semester}`;
  if (name) query += `&name=${name}`;

  return await api.get(`/api/Courses?${query}`);
};
//export const getCourses = async () => await api.get('/api/Courses');
export const updateCourse = async (courseId, courseData) =>
  await api.put(`/api/Courses`, courseData);
export const deleteCourses = async courseIds =>
  await api.delete('/api/Courses', courseIds);
export const addCourseDependencies = async (courseId, coursesId) =>
  await api.post(`/api/Courses/${courseId}/Dependencies`, { coursesId });
export const removeCourseDependencies = async (courseId, coursesId) =>
  await api.delete(`/api/Courses/${courseId}/Dependencies`, { coursesId });
export const getCourseDependencies = async courseId =>
  await api.get(`/api/Courses/${courseId}/Dependencies`);

// Timetable (REST)
export const getTimetable = async level =>
  await api.get(`/api/TimeTables?level=${level}`);

// Teaching Places
export const createTeachingPlace = async placeData =>
  await api.post('/api/TeachingPlaces', placeData);

export const getTeachingPlaces = async () =>
  await api.get('/api/TeachingPlaces?page=0&size=100');
export const updateTeachingPlace = async (placeId, placeData) =>
  await api.put(`/api/TeachingPlaces/${placeId}`, placeData);
export const deleteTeachingPlaces = async placeId =>
  await api.delete('/api/TeachingPlaces', placeId);
export const addTeachingPlaceSchedules = async (placeId, schedules) =>
  await api.post(`/api/TeachingPlaces/${placeId}/Schedules`, schedules);
export const removeTeachingPlaceSchedules = async scheduleIdsList =>
  await api.delete(`/api/Schedules`, [146]);
// {{baseUrl}}/api/TeachingPlaces?page=0&type=0&name=
export const getTeachingPlacesByName = async (page = 0, type = 0, name = '') =>
  await api.get(`/api/TeachingPlaces?page=${page}&type=${type}&name=${name}`);
export const removeSchedules = async placeIds => {
  await api.delete('/api/Shedules', placeIds);
};
export const updateSchedules = async (scheduleId, schedules) =>
  await api.put(`/api/Shedules/${scheduleId}`, schedules);
export const getTeachingPlaceSchedules = async placeId =>
  await api.get(`/api/TeachingPlaces/${placeId}/Schedules`);

// Users
export const createUser = async userData =>
  await api.post('/api/Users', userData);
export const getUsers = async (page = 0, role = null) =>
  await api.get(
    `/api/Users?page=${page}${role !== null ? `&role=${role}` : ''}`
  );
export const removeUser = async userId =>
  await api.delete(
    `/api/Users/${userId}/Authentications`,
    Cookies.get('refreshToken')
  );

export const getUserById = async id => api.get(`/api/Users/${id}`);
export const updateUser = async (userName, userData) =>
  await api.put(`/api/Users/${userName}`, userData);
export const addUserSchedules = async (userName, schedules) =>
  await api.post(`/api/Users/${userName}/Schedules`, schedules);
export const removeUserSchedules = async (userName, scheduleIds) =>
  await api.delete(`/api/Users/${userName}/Schedules`, scheduleIds);
export const getUserSchedules = async userName =>
  await api.get(`/api/Users/${userName}/Schedules`);

// From File Registrations
export const registerFromFile = async (contentType, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await api.post(
    `/api/FromFileRegisterations/${contentType}`,
    formData,
    {
      'Content-Type': 'multipart/form-data',
    }
  );
};
export const getFileRegistrationData = async contentType =>
  await api.get(`/api/FromFileRegisterations/${contentType}`);

// Statistics
export const getStatistics = async () => await api.get('/api/Statistics');

// teaching staff endpoints
export const getTeachingStaff = async (
  page = 0,
  level = null,
  gender = null,
  name = ''
) => {
  // Start with role=1 for teaching staff
  let query = `page=${page}&role=1`;

  // Add level filter if provided
  if (level !== null && level !== '') {
    query += `&level=${level}`;
  }

  // Add optional gender filter
  if (gender !== null && gender !== '') {
    query += `&gender=${gender}`;
  }

  // Add name search if provided
  if (name) {
    query += `&name=${name}`;
  }

  console.log(`Fetching teaching staff with query: ${query}`);
  return await api.get(`/api/Users?${query}`);
};

export const addTeachingStaff = async staffData => {
  // Ensure the role is set to 1 for teaching staff
  const data = {
    firstName: staffData.firstName,
    lastName: staffData.lastName,
    gender: staffData.gender,
    role: 1, // Always set to 1 for teaching staff
    level: staffData.level || 7,
    dateOfBirth: staffData.dateOfBirth,
    password: staffData.password, // Take password directly from the form
    userName:
      staffData.userName ||
      `${staffData.firstName.toLowerCase()}.${staffData.lastName.toLowerCase()}`,
  };
  return await api.post('/api/Users', data);
};

// Delete teaching staff (by role=1)
export const deleteTeachingStaff = async usernamesList => {
  return await api.delete('/api/Users?role=1', usernamesList);
};
// Function to delete a student by username
