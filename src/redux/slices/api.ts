import { createSlice } from '@reduxjs/toolkit';
import { ApiState } from '../../@types/api';
// ----------------------------------------------------------------------

const initialState: ApiState = {
  fetching: false,
};

const slice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    // START LOADING
    setFetching(state, action) {
      state.fetching = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setFetching } = slice.actions;

// ----------------------------------------------------------------------
