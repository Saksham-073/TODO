import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchTasks = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/tasks`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create task');
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete task');
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update task');
  }
};