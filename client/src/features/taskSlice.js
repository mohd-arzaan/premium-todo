import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

const initialState = {
  tasks: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// 1. Fetch Tasks
export const getTasks = createAsyncThunk('tasks/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.get('/tasks', config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 2. Add Task
export const addTask = createAsyncThunk('tasks/add', async (taskData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.post('/tasks', taskData, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 3. Delete Task
export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await api.delete(`/tasks/${id}`, config);
    return id; // Return the deleted ID to filter it out from state
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Tasks
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add Task
      .addCase(addTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.tasks.unshift(action.payload); // Add new task to the top
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      });
  },
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;