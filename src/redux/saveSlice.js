import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  saves: [], // Array of saves
};

const saveSlice = createSlice({
  name: 'saves',
  initialState,
  reducers: {
    saveVersion: (state, action) => {
      const { projectId, html, css, js, timestamp } = action.payload;
      state.saves.push({ projectId, html, css, js, timestamp });
    },
  },
});

export const { saveVersion } = saveSlice.actions;

export const selectVersionsByProjectId = (projectId) => (state) => {
  return state.saves.saves.filter((save) => save.projectId === projectId);
};

export const selectLatestVersionByProjectId = (projectId) => (state) => {
  const projectSaves = state.saves.saves.filter((save) => save.projectId === projectId);
  if (projectSaves.length === 0) return null;
  projectSaves.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return projectSaves[0];
};

export default saveSlice.reducer;
