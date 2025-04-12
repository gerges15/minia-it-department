import api from "./axiosInstance";


export const addTeachingPlace = async (newPlaceData) => await api.post('/TeachingPlaces', newPlaceData);