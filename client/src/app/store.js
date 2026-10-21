import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import taskReducer from '../features/taskSlice'; // Import taskReducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer, // Add it here
  },
});