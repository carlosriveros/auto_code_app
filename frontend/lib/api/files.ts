import { apiClient } from './client';
import { FileNode } from '../types';

export const filesApi = {
  async getFileTree(projectId: string): Promise<{
    files: FileNode[];
    totalSize: number;
    totalSizeMB: string;
  }> {
    return apiClient.get(`/api/projects/${projectId}/files`);
  },

  async readFile(projectId: string, filePath: string): Promise<{
    path: string;
    content: string;
  }> {
    return apiClient.get(`/api/projects/${projectId}/files/${filePath}`);
  },

  async writeFile(
    projectId: string,
    filePath: string,
    content: string
  ): Promise<{
    message: string;
    path: string;
  }> {
    return apiClient.post(`/api/projects/${projectId}/files`, {
      path: filePath,
      content,
    });
  },

  async deleteFile(projectId: string, filePath: string): Promise<{
    message: string;
    path: string;
  }> {
    return apiClient.delete(`/api/projects/${projectId}/files/${filePath}`);
  },
};
