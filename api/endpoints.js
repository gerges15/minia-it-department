import api from './apiClint';

export const addTeachingPlace = async newPlaceData =>
  await api.post('/TeachingPlaces', newPlaceData);
export const getTeachingPlaces = async () =>
  await api.get('/TeachingPlaces?page=0&size=100');
export const updateTeachingPlace = async (placeId, updatedData) =>
  await api.put(`/TeachingPlaces/${placeId}`, updatedData);
export const deleteTeachingPlace = async id =>
  await api.delete('/TeachingPlaces', { data: [id] });
