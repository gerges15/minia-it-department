import api from './apiClint';
import Cookies from 'js-cookie';
export const addTeachingPlace = async newPlaceData =>
  await api.post('/TeachingPlaces', newPlaceData);
export const deleteTeachingPlace = async id =>
  await api.delete('/TeachingPlaces', { data: [id] });

export const editCourse = async (id, updatedCourseData) =>
  await api.put(`/api/Courses/${id}`, updatedCourseData);

export const deleteCourse = async id => api.delete(`/api/Courses/`, id);
export const addNewCourse = async newCourse =>
  api.post('/api/Courses', newCourse);

// student endpoints

export const addNewUser = async data => api.post('/api/Users/', data);
export const getStudents = async => api.get('/api/Users?page=0&role=1');

// Authentication
export const login = async (userName, password) =>
  await api.zPost('/api/Authentications', { userName, password });
export const refreshUserToken = async (fullId, refreshToken) =>
  await api.get(
    `/api/Users/${fullId}/Authentications?refreshToken=${refreshToken}`
  );
export const logout = async (fullId, refreshToken) =>
  await api.delete(`/api/Users/${fullId}/Authentications`, { refreshToken });

// Courses
export const createCourse = async courseData =>
  await api.post('/api/Courses', courseData);
export const getCourses = async (page = 0, sortByLevelAscending = true) =>
  await api.get(
    `/api/Courses?page=${page}&sortByLevelAscending=${sortByLevelAscending}`
  );
//export const getCourses = async () => await api.get('/api/Courses');
export const updateCourse = async (courseId, courseData) =>
  await api.put(`/api/Courses/${courseId}`, courseData);
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
export const removeTeachingPlaceSchedules = async (placeId, scheduleIds) =>
  await api.delete(`/api/TeachingPlaces/${placeId}/Schedules`, scheduleIds);
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
export const updateUser = async (fullId, userData) =>
  await api.put(`/api/Users/${fullId}`, userData);
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
