import api from './api/service.js';

export const fetchModels = async () => {
  try {
    console.log('Fetching models...');
    const response = await api.get('/logic/models');
    console.log('Models fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const queryLogic = async ({ query, libraries, html, css, js }) => {
  try {
    console.log('Response Starting...');
    const response = await api.post('/logic/query', {
      query: query,
      libraries: [],
      html,
      css,
      js,
    });
    return response.data;
  } catch (error) {
    console.error('Error in queryLogic:', error);
    throw error;
  }
};
