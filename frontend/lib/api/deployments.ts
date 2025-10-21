import { apiClient } from './client';
import { Deployment } from '@/lib/types';

export const deploymentsApi = {
  /**
   * Deploy project to Vercel
   */
  deploy: async (projectId: string): Promise<{
    message: string;
    deployUrl: string;
    projectId: string;
  }> => {
    return apiClient.post(`/api/projects/${projectId}/deploy`);
  },

  /**
   * Get deployment history for a project
   */
  getDeployments: async (projectId: string): Promise<{
    deployments: Deployment[];
  }> => {
    return apiClient.get(`/api/projects/${projectId}/deployments`);
  },

  /**
   * Get latest deployment for a project
   */
  getLatestDeployment: async (projectId: string): Promise<{
    deployment: Deployment | null;
  }> => {
    return apiClient.get(`/api/projects/${projectId}/deployment/latest`);
  },
};
