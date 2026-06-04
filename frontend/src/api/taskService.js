import client from './client';

// GET /api/tasks?filter=&sort= -> { tasks }
export const fetchTasks = async (params = {}) => {
  const { data } = await client.get('/tasks', { params });
  return data.tasks;
};

// POST /api/tasks -> { task }
export const createTask = async (taskData) => {
  const { data } = await client.post('/tasks', taskData);
  return data.task;
};

// PATCH /api/tasks/:id -> { task }
export const updateTask = async (taskId, updates) => {
  const { data } = await client.patch(`/tasks/${taskId}`, updates);
  return data.task;
};

// DELETE /api/tasks/:id -> { success, id }
export const deleteTask = async (taskId) => {
  const { data } = await client.delete(`/tasks/${taskId}`);
  return data.id;
};
