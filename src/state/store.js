import { configureStore } from '@reduxjs/toolkit';
import errorMsgReducer from './errorMsgSlice';

export const loginStore = configureStore({
  reducer: {
    errorMsg: errorMsgReducer,
  },
});
