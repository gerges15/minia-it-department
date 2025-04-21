import { configureStore } from '@reduxjs/toolkit';
import errorMsgReducer from './errorMsgSlice';
import loadingReducer from './loadingSlice';
import userReducer from './userSlice';

export const loginStore = configureStore({
  reducer: {
    errorMsg: errorMsgReducer,
    loading: loadingReducer,
    user: userReducer,
  },
});
