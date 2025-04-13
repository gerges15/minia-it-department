import { configureStore } from '@reduxjs/toolkit';
import errorMsgReducer from './errorMsgSlice';
import loadingReducer from './loadingSlice'
export const loginStore = configureStore({
  reducer: {
    errorMsg: errorMsgReducer,
    loading: loadingReducer
  },
});
