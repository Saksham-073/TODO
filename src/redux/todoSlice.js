import { createSlice } from '@reduxjs/toolkit';
import { fetchWeather } from '../api/weatherService';

const initialState = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  loading: false,
  weatherData: {},
  error: null
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    setWeatherData: (state, action) => {
      state.weatherData = { ...state.weatherData, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    toggleTaskComplete: (state, action) => {
        const task = state.tasks.find(task => task.id === action.payload);
        if (task) {
          task.completed = !task.completed;
          localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
      },
  }
});

export const { addTask, deleteTask, setWeatherData, setLoading, setError } = todoSlice.actions;

export const fetchWeatherForTask = (location) => async (dispatch) => {
  if (!location) return;
  
  dispatch(setLoading(true));
  try {
    const weather = await fetchWeather(location);
    dispatch(setWeatherData({ [location]: weather }));
    dispatch(setError(null));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const selectTodos = (state) => state.todos;
export const { toggleTaskComplete } = todoSlice.actions;
export default todoSlice.reducer;