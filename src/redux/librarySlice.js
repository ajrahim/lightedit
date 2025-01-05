import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  downloaded: [],
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
      const name = action.payload;
      state.downloaded = state.downloaded.filter(
        (library) => library.name !== name,
      );
    },
  },
});

export const { saveLibrary, removeLibrary } = librarySlice.actions;
export const selectLibraries = (state) => state.libraries.downloaded;
export const selectLibrary = (name) => (state) =>
  state.libraries.downloaded.find((library) => library.name === name);

export default librarySlice.reducer;
