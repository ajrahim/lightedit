import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [], // Array of projects
  activeProject: null, // Currently active project ID
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      const { id, name } = action.payload;
      if (!state.projects.find((project) => project.id === id)) {
        state.projects.push({ id, name, libraries: [] });
      }
    },
    addLibrary: (state, action) => {
      const { projectId, library } = action.payload;
      const project = state.projects.find((project) => project.id === projectId);
      if (project) {
        // Ensure the libraries key exists
        if (!project.libraries) {
          project.libraries = [];
        }
        const existingLibrary = project.libraries.find((lib) => lib.name === library.name);
        if (existingLibrary) {
          // Update the library if the version doesn't match
          if (existingLibrary.version !== library.version) {
            existingLibrary.version = library.version;
            existingLibrary.code = library.code;
            existingLibrary.repo = library.repo;
          }
        } else {
          // Add the library if it doesn't exist
          project.libraries.push(library);
        }
      }
    },
    removeLibrary: (state, action) => {
      const { projectId, libraryName } = action.payload;
      const project = state.projects.find((project) => project.id === projectId);
      if (project && project.libraries) {
        project.libraries = project.libraries.filter((lib) => lib.name !== libraryName);
      }
    },
    setActiveProject: (state, action) => {
      const { projectId } = action.payload;
      const projectExists = state.projects.find((project) => project.id === projectId);
      if (projectExists) {
        state.activeProject = projectId;
      }
    },
    clearActiveProject: (state) => {
      state.activeProject = null;
    },
  },
});

export const selectProject = (id) => (state) =>
state.projects.find((project) => project.id === id);

export const selectActiveProject = (state) =>
state.projects.projects.find((project) => project.id === state.projects.activeProject);


export const { addProject, addLibrary, removeLibrary, setActiveProject, clearActiveProject } = projectsSlice.actions;
export default projectsSlice.reducer;
