import axios from 'axios';

const API = axios.create({ baseURL: 'https://backend-jr6tc228k-bashas-projects.vercel.app/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers['x-auth-token'] = token;
  return req;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  verify: () => API.get('/auth/verify'),
};

export const userAPI = {
  getUsers: () => API.get('/users'),
  getMe: () => API.get('/users/me'),
  deleteUser: (id) => API.delete(`/users/${id}`),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  enrollInCourse: (courseId) => API.post(`/users/enroll/${courseId}`),
};

export const courseAPI = {
  getCourses: () => API.get('/courses'),
  createCourse: (data) => API.post('/courses', data),
  updateCourse: (id, data) => API.put(`/courses/${id}`, data),
  deleteCourse: (id) => API.delete(`/courses/${id}`),
};

export const progressAPI = {
  getProgress: (courseId) => API.get(`/progress/${courseId}`),
  updateProgress: (courseId, data) => API.post(`/progress/${courseId}`, data),
  markLessonCompleted: (courseId, lessonId) => API.post(`/progress/${courseId}/lesson/${lessonId}`),
};


export default API;