import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../api/authService';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, clearError } = authSlice.actions;

// Persist session and update store after a successful auth response.
const persistSession = (dispatch, data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  dispatch(loginSuccess(data.user));
};

export const login = (username, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const data = await loginUser({ username, password });
    persistSession(dispatch, data);
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const register = (username, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const data = await registerUser({ username, password });
    persistSession(dispatch, data);
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch(authSlice.actions.logout());
};

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
