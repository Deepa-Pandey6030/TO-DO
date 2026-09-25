import api from "../lib/axios";

/**
 * Task API service — all task-related HTTP calls live here.
 * Components import these functions rather than calling api directly.
 */

// GET /api/tasks with optional filters
export const fetchTasks = (params = {}) =>
  api.get("/tasks", { params }).then((r) => r.data.tasks);

// GET /api/tasks/stats
export const fetchTaskStats = () =>
  api.get("/tasks/stats").then((r) => r.data);

// GET /api/tasks/:id
export const fetchTaskById = (id) =>
  api.get(`/tasks/${id}`).then((r) => r.data.task);

// POST /api/tasks
export const createTask = (data) =>
  api.post("/tasks", data).then((r) => r.data.task);

// PUT /api/tasks/:id
export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data).then((r) => r.data.task);

// PATCH /api/tasks/:id/status
export const updateTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status }).then((r) => r.data.task);

// DELETE /api/tasks/:id
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
