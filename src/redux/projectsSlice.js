import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [], // Array of projects
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      const { id, name } = action.payload;
      if (!state.projects.find((project) => project.id === id)) {
        state.projects.push({ id, name });
      }
    },
  },
});

export const { addProject } = projectsSlice.actions;

export default projectsSlice.reducer;
