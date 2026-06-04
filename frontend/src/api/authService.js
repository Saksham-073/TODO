import client from './client';

// POST /api/auth/register -> { token, user }
export const registerUser = async (credentials) => {
  const { data } = await client.post('/auth/register', credentials);
  return data;
};

// POST /api/auth/login -> { token, user }
export const loginUser = async (credentials) => {
  const { data } = await client.post('/auth/login', credentials);
  return data;
};

// POST /api/auth/logout
export const logoutUser = async () => {
  const { data } = await client.post('/auth/logout');
  return data;
};

// GET /api/auth/me -> { user }
export const fetchCurrentUser = async () => {
  const { data } = await client.get('/auth/me');
  return data;
};
