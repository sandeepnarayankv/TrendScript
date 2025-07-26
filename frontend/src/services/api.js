import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Service class
class ApiService {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Get trending topics
  async getTrendingTopics(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.category && params.category !== 'all') {
        queryParams.append('category', params.category);
      }
      if (params.platform && params.platform !== 'all') {
        queryParams.append('platform', params.platform);
      }
      if (params.search) {
        queryParams.append('search', params.search);
      }
      if (params.limit) {
        queryParams.append('limit', params.limit);
      }
      if (params.page) {
        queryParams.append('page', params.page);
      }

      const url = queryParams.toString() ? `/trends?${queryParams.toString()}` : '/trends';
      const response = await api.get(url);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch trends');
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
      throw error;
    }
  }

  // Get specific trend by ID
  async getTrendById(trendId) {
    try {
      const response = await api.get(`/trends/${trendId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch trend');
      }
    } catch (error) {
      console.error('Error fetching trend:', error);
      throw error;
    }
  }

  // Generate content script
  async generateContent(requestData) {
    try {
      const response = await api.post('/generate-content', requestData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  // Get content templates
  async getContentTemplates() {
    try {
      const response = await api.get('/content-templates');
      
      if (response.data.success) {
        return response.data.data.templates;
      } else {
        throw new Error(response.data.message || 'Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  // Get tone options
  async getToneOptions() {
    try {
      const response = await api.get('/tone-options');
      
      if (response.data.success) {
        return response.data.data.tones;
      } else {
        throw new Error(response.data.message || 'Failed to fetch tone options');
      }
    } catch (error) {
      console.error('Error fetching tone options:', error);
      throw error;
    }
  }

  // Get platform statistics
  async getPlatformStats() {
    try {
      const response = await api.get('/stats');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // Get user content history
  async getUserContentHistory(limit = 20) {
    try {
      const response = await api.get(`/user/content-history?limit=${limit}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch content history');
      }
    } catch (error) {
      console.error('Error fetching content history:', error);
      throw error;
    }
  }
}

// Create and export single instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  healthCheck,
  getTrendingTopics,
  getTrendById,
  generateContent,
  getContentTemplates,
  getToneOptions,
  getPlatformStats,
  getUserContentHistory
} = apiService;