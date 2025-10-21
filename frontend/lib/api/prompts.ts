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
    // Use 90 second timeout for Claude API calls (they can take a while for complex prompts)
    return apiClient.post(`/api/projects/${projectId}/prompt`, data, { timeout: 90000 });
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
