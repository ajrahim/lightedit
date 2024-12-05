import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  downloaded: [], // Array of saved libraries
};

const librarySlice = createSlice({
  name: 'libraries',
  initialState,
  reducers: {
    saveLibrary: (state, action) => {
      const library = action.payload;
      state.downloaded.push(library);
    },
    removeLibrary: (state, action) => {
      const libraryId = action.payload;
      state.downloaded = state.downloaded.filter((library) => library.id !== libraryId);
    },
  },
});

export const { saveLibrary, removeLibrary } = librarySlice.actions;
export const selectAllLibraries = (state) => state.libraries.downloaded;
export const selectLibraryById = (libraryId) => (state) =>
  state.libraries.downloaded.find((library) => library.id === libraryId);

export default librarySlice.reducer;
