import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/check-auth`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Not authenticated');
  }
};