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
    const config = { headers: { Authorization: `Bearer ${token}` } };
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
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.post('/tasks', taskData, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 3. Update Task (Naya add kiya hai)
export const updateTask = createAsyncThunk('tasks/update', async (taskData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.put(`/tasks/${taskData.id}`, taskData, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 4. Delete Task
export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await api.delete(`/tasks/${id}`, config);
    return id;
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
      .addCase(getTasks.pending, (state) => { state.isLoading = true; })
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
      .addCase(addTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.tasks.unshift(action.payload);
      })
      // Update Task Case
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      });
  },
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;