import api from './api/service.js';

export const searchLibraries = async (query) => {
  try {
    const response = await api.post('/libraries/search', { query });
    return response.data;
  } catch (error) {
    console.error('Error in searchLibraries:', error);
    throw error;
  }
};

export const getLibrary = async (name) => {
  try {
    const response = await api.get(`/libraries/details/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error in getLibraryDetails:', error);
    throw error;
  }
};
