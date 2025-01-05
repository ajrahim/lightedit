import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  current: null, // Current Model
  models: [], // Array of Models for AI
  temperature: 0.5, // Default temperature (0 for conservative and 1 for creative)
};

const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    setModels: (state, action) => {
      state.models = action.payload;
    },
    setCurrentModel: (state, action) => {
      const modelId = action.payload;
      const modelExists = state.models.find((model) => model.id === modelId);
      if (modelExists) {
        state.current = modelId;
      } else {
        state.current = null;
      }
    },
    setTemperature: (state, action) => {
      state.temperature = action.payload;
    },
  },
});

// Selectors
export const selectAllModels = (state) => state.models.models;
export const selectCurrentModel = (state) =>
  state.models.models.find((model) => model.id === state.models.current) ||
  null;

// Export actions and reduce
export const { setModels, setCurrentModel, setTemperature } =
  modelsSlice.actions;

export default modelsSlice.reducer;
