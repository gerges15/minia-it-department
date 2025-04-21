import { createSlice } from '@reduxjs/toolkit';

const errorMsgSlice = createSlice({
  name: 'errorMsg',

  initialState: {
    value: ''
  },
  reducers: {
    setErrorMsg: (state, action) => {
      state.value = action.payload; 
    },
    clearErrorMsg: state => {
      state.value = '';
    },
  },
});

export const { setErrorMsg, clearErrorMsg } = errorMsgSlice.actions;

export default errorMsgSlice.reducer;
