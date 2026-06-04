import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from '../api/taskService';
import { fetchWeather } from '../api/weatherService';

const initialState = {
  tasks: [],
  weatherData: {},
  loading: false,
  error: null,
};


export const fetchTasks = createAsyncThunk(
  'todos/fetchTasks',
  async (params, { dispatch }) => {
    const tasks = await taskService.fetchTasks(params);
    const locations = [...new Set(tasks.filter((t) => t.location).map((t) => t.location))];
    locations.forEach((loc) => dispatch(fetchWeatherForTask(loc)));
    return tasks;
  }
);

export const addTask = createAsyncThunk(
  'todos/addTask',
  async (taskData, { dispatch }) => {
    const task = await taskService.createTask(taskData);
    if (task.location) dispatch(fetchWeatherForTask(task.location));
    return task;
  }
);

export const deleteTask = createAsyncThunk('todos/deleteTask', async (taskId) => {
  await taskService.deleteTask(taskId);
  return taskId;
});

export const toggleTaskComplete = createAsyncThunk(
  'todos/toggleTaskComplete',
  async (taskId, { getState }) => {
    const task = getState().todos.tasks.find((t) => t.id === taskId);
    return taskService.updateTask(taskId, { completed: !task.completed });
  }
);

export const fetchWeatherForTask = createAsyncThunk(
  'todos/fetchWeather',
  async (location) => {
    const weather = await fetchWeather(location);
    return { location, weather };
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearTodosError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // add
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // toggle
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(toggleTaskComplete.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // weather
      .addCase(fetchWeatherForTask.fulfilled, (state, action) => {
        state.weatherData[action.payload.location] = action.payload.weather;
      })
      // clear everything on logout
      .addCase('auth/logout', (state) => {
        state.tasks = [];
        state.weatherData = {};
        state.error = null;
        state.loading = false;
      });
  },
});

export const { clearTodosError } = todoSlice.actions;
export const selectTodos = (state) => state.todos;
export default todoSlice.reducer;
