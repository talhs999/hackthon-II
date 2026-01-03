import axios, { AxiosInstance } from 'axios';

// Type definitions
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tool_used?: string;
  action_taken?: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string | null;
}

export interface ChatResponse {
  success: boolean;
  conversation_id: string;
  user_message_id: string;
  assistant_message_id: string;
  response: string;
  tool_used?: string;
  action_taken?: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Base API client for backend requests
// Backend running on port 8000
const BACKEND_URL = 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add JWT token from auth session
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get the session from localStorage
      const session = localStorage.getItem('auth-session');
      if (session) {
        const authSession = JSON.parse(session);
        const token = authSession.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error getting auth session:', error);
    }

    console.log('[API Request]', config.method?.toUpperCase(), config.url, {
      baseURL: config.baseURL,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API Error]', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });

    if (error.response?.status === 401) {
      // Handle unauthorized access - clear session
      localStorage.removeItem('auth-session');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Return more detailed error message
    if (error.response?.data?.detail) {
      return Promise.reject(new Error(error.response.data.detail));
    }

    return Promise.reject(error);
  }
);

// API methods for tasks
export const tasksAPI = {
  // Get all tasks for a user
  getTasks: async (userId: string, statusFilter: string = 'all') => {
    const response = await apiClient.get<Task[]>(
      `/api/${userId}/tasks?status_filter=${statusFilter}`
    );
    return response.data;
  },

  // Get a specific task
  getTask: async (userId: string, taskId: number) => {
    const response = await apiClient.get<Task>(`/api/${userId}/tasks/${taskId}`);
    return response.data;
  },

  // Create a new task
  createTask: async (userId: string, task: TaskCreate) => {
    const response = await apiClient.post<Task>(`/api/${userId}/tasks`, task);
    return response.data;
  },

  // Update a task
  updateTask: async (userId: string, taskId: number, updates: TaskUpdate) => {
    const response = await apiClient.put<Task>(
      `/api/${userId}/tasks/${taskId}`,
      updates
    );
    return response.data;
  },

  // Delete a task
  deleteTask: async (userId: string, taskId: number) => {
    const response = await apiClient.delete(`/api/${userId}/tasks/${taskId}`);
    return response.data;
  },

  // Toggle task completion
  toggleCompletion: async (userId: string, taskId: number) => {
    const response = await apiClient.patch<Task>(
      `/api/${userId}/tasks/${taskId}/complete`
    );
    return response.data;
  },
};

// Chat API methods
export const chatAPI = {
  // Send a chat message
  sendMessage: async (userId: string, message: string, conversationId?: string | null) => {
    const request: ChatRequest = {
      message,
      conversation_id: conversationId || undefined,
    };

    const response = await apiClient.post<ChatResponse>(
      `/api/${userId}/chat`,
      request
    );
    return response.data;
  },

  // Get all conversations for a user
  getConversations: async (userId: string) => {
    const response = await apiClient.get<{ conversations: Conversation[] }>(
      `/api/${userId}/chat/conversations`
    );
    return response.data.conversations;
  },

  // Get messages in a conversation
  getConversationMessages: async (userId: string, conversationId: string) => {
    const response = await apiClient.get<{ conversation_id: string; messages: ChatMessage[] }>(
      `/api/${userId}/chat/conversations/${conversationId}`
    );
    return response.data.messages;
  },
};

export default apiClient;