import axios from 'axios'
import type { AuthResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data: any) => api.post<AuthResponse>('/auth/register', data),
  login: (data: any) => api.post<AuthResponse>('/auth/login', data),
}

export const jobAPI = {
  getJobs: (params?: any) => api.get('/jobs', { params }),
  getJob: (id: string) => api.get(`/jobs/${id}`),
  createJob: (data: any) => api.post('/jobs', data),
  getEmployerJobs: (params?: any) =>
    api.get('/jobs/employer/my-jobs', { params }),
  getJobApplications: (jobId: string) => api.get(`/jobs/${jobId}/applications`),
  updateApplicationStatus: (applicationId: string, status: string) =>
    api.put(`/jobs/applications/${applicationId}/status`, { status }),
}

export const applicationAPI = {
  applyForJob: (jobId: string, data: any) =>
    api.post(`/applications/jobs/${jobId}/apply`, data),
  getMyApplications: () => api.get('/applications/my-applications'),
}

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserStatus: (userId: string, status: string) =>
    api.put(`/admin/users/${userId}/status`, { status }),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data: any) => api.post('/admin/categories', data),
  updateCategory: (categoryId: string, status: string) =>
    api.put(`/admin/categories/${categoryId}`, { status }),
  getReports: (params?: any) => api.get('/admin/reports', { params }),
}

export const uploadAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
