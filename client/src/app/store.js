import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import taskReducer from '../features/taskSlice';
import uiReducer from '../features/uiSlice'; // Import kiya

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    ui: uiReducer, // Add kiya
  },
});