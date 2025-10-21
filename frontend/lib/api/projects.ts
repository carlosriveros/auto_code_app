import { apiClient } from './client';
import { Project } from '../types';

export interface CreateProjectData {
  name: string;
  description?: string;
  techStack?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  techStack?: string[];
  status?: 'active' | 'archived' | 'deleted';
}

export const projectsApi = {
  async getAll(): Promise<{ projects: Project[] }> {
    return apiClient.get('/api/projects');
  },

  async getById(id: string): Promise<{ project: Project }> {
    return apiClient.get(`/api/projects/${id}`);
  },

  async create(data: CreateProjectData): Promise<{ project: Project }> {
    return apiClient.post('/api/projects', data);
  },

  async update(id: string, data: UpdateProjectData): Promise<{ project: Project }> {
    return apiClient.put(`/api/projects/${id}`, data);
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiClient.delete(`/api/projects/${id}`);
  },
};
