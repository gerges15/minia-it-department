import api from './apiClint';

export const addTeachingPlace = async newPlaceData =>
  await api.post('/TeachingPlaces', newPlaceData);
export const getTeachingPlaces = async () =>
  await api.get('/TeachingPlaces?page=0&size=100');
export const updateTeachingPlace = async (placeId, updatedData) =>
  await api.put(`/TeachingPlaces/${placeId}`, updatedData);
export const deleteTeachingPlace = async id =>
  await api.delete('/TeachingPlaces', { data: [id] });

// HomePage endpoints

export const getStatistics = async () => await api.get('/api/Statistics');

// Courses endpoints

export const getCourses = async () => await api.get('/api/Courses');
export const editCourse = async (id, updatedCourseData) =>
  await api.put(`/api/Courses/${id}`, updatedCourseData);

export const deleteCourse = async id => api.delete(`/api/Courses/`, id);
export const addNewCourse = async newCourse =>
  api.post('/api/Courses', newCourse);
