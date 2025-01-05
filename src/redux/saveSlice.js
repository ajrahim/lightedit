import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const initialState = {
  saves: [],
};

const saveSlice = createSlice({
  name: 'saves',
  initialState,
  reducers: {
    saveVersion: (state, action) => {
      const { projectId, html, css, js, timestamp } = action.payload;
      state.saves.push({ projectId, html, css, js, timestamp, notes: '' });
    },
    updateNotes: (state, action) => {
      const { projectId, timestamp, notes } = action.payload;
      const save = state.saves.find(
        (s) => s.projectId === projectId && s.timestamp === timestamp,
      );
      if (save) {
        save.notes = notes;
      }
    },
  },
});

export const { saveVersion, updateNotes } = saveSlice.actions;

// Memoized selector to filter versions by project ID
export const selectVersionsByProjectId = (projectId) =>
  createSelector(
    (state) => state.saves.saves,
    (saves) => saves.filter((save) => save.projectId === projectId),
  );

// Memoized selector to get the latest version by project ID
export const selectLatestVersionByProjectId = (projectId) =>
  createSelector(selectVersionsByProjectId(projectId), (projectSaves) => {
    if (projectSaves.length === 0) return null;
    return projectSaves.reduce((latest, current) =>
      new Date(latest.timestamp) > new Date(current.timestamp)
        ? latest
        : current,
    );
  });

export default saveSlice.reducer;
