import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state, action) {
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
    }
  }
});

export const { loginStart, loginSuccess, loginFailure } = authSlice.actions;

export const login = (username, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(loginSuccess(data.user));
    } else {
      dispatch(loginFailure(data.message));
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('user');
  dispatch(authSlice.actions.logout());
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('user');
  dispatch(logout()); 
};

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;