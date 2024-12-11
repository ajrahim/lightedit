import api from './api/service.js';

export const queryLogic = async ({query, libraries, html, css, js}) => {
  try {
    console.log("Response Starting...");
    const response = await api.post('/logic/query', { query: query, libraries: [], html, css, js });
    return response.data;
  } catch (error) {
    console.error('Error in queryLogic:', error);
    throw error;
  }
};
