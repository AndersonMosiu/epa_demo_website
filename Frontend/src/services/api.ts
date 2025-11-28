import type { NewsItem, EventItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Enhanced API call function with better error handling and auth
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('adminToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (response.status === 403) {
      throw new Error('Access denied. Insufficient permissions.');
    }

    if (response.status === 423) {
      throw new Error('Account temporarily locked. Please try again later.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred. Please check your connection.');
  }
}

// Enhanced Auth API
export const authAPI = {
  login: (username: string, password: string) => 
    apiCall<{ token: string; admin: any; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  logout: () => 
    apiCall<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),
  
  verify: () => 
    apiCall<{ valid: boolean; admin?: any }>('/auth/verify'),
};

// News API
export const newsAPI = {
  getAll: () => apiCall<{ news: NewsItem[] }>('/news'),
  getFeatured: () => apiCall<NewsItem[]>('/news/featured'),
  getById: (id: string) => apiCall<NewsItem>(`/news/${id}`),
  create: (newsData: Partial<NewsItem>) => 
    apiCall<NewsItem>('/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    }),
  update: (id: string, newsData: Partial<NewsItem>) => 
    apiCall<NewsItem>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    }),
  delete: (id: string) => 
    apiCall<{ message: string }>(`/news/${id}`, {
      method: 'DELETE',
    }),
};

// Events API
export const eventsAPI = {
  getAll: () => apiCall<EventItem[]>('/events'),
  getUpcoming: () => apiCall<EventItem[]>('/events/upcoming'),
  getById: (id: string) => apiCall<EventItem>(`/events/${id}`),
  getByType: (type: string) => apiCall<EventItem[]>(`/events/type/${type}`),
  getByAudience: (audience: string) => apiCall<EventItem[]>(`/events/audience/${audience}`),
  create: (eventData: Partial<EventItem>) => 
    apiCall<EventItem>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
  update: (id: string, eventData: Partial<EventItem>) => 
    apiCall<EventItem>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),
  delete: (id: string) => 
    apiCall<{ message: string }>(`/events/${id}`, {
      method: 'DELETE',
    }),
};