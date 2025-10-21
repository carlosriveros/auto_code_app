import { apiClient } from './client';
import { Message, FileOperation } from '../types';

export interface SendPromptData {
  message: string;
  conversationHistory?: Message[];
}

export interface PromptResponse {
  response: string;
  fileOperations: FileOperation[];
  tokensUsed: number;
  conversationId: string;
}

export const promptsApi = {
  async sendPrompt(
    projectId: string,
    data: SendPromptData
  ): Promise<PromptResponse> {
    return apiClient.post(`/api/projects/${projectId}/prompt`, data);
  },

  async getConversation(projectId: string): Promise<{
    conversation: {
      id: string;
      project_id: string;
      messages: Message[];
      total_tokens: number;
      created_at: string;
      updated_at: string;
    } | null;
  }> {
    return apiClient.get(`/api/projects/${projectId}/conversation`);
  },
};
