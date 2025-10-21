export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  tech_stack: Record<string, any>;
  deploy_url?: string;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  project_id: string;
  messages: Message[];
  total_tokens: number;
  created_at: string;
  updated_at: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileNode[];
}

export interface FileOperation {
  type: 'create' | 'update' | 'delete';
  path: string;
  content?: string;
}

export interface Deployment {
  id: string;
  project_id: string;
  deploy_url: string;
  status: 'pending' | 'building' | 'success' | 'failed';
  logs?: string;
  deployed_at: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
