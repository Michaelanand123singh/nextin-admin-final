// src/utils/api.js - Updated for Cloudinary file uploads
const API_BASE_URL = 'http://localhost:5000/api';

class Api {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  // Helper method to get headers for JSON requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Helper method to get headers for file uploads (FormData)
  getFileHeaders() {
    const headers = {};
    
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - let browser set it with boundary
    
    return headers;
  }

  // Helper method for API calls
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      console.log('Making request to:', url);
      console.log('Headers:', config.headers);
      
      const response = await fetch(url, config);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: 'No JSON response' };
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('Not authorized')) {
        this.logout();
      }
      
      throw error;
    }
  }

  // Helper method for file upload requests
  async requestWithFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      console.log('Making file upload request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getFileHeaders(),
        body: formData
      });
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: 'No JSON response' };
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('File Upload API Error:', error);
      
      if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('Not authorized')) {
        this.logout();
      }
      
      throw error;
    }
  }

  // Helper method for file update requests
  async requestFileUpdate(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      console.log('Making file update request to:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getFileHeaders(),
        body: formData
      });
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: 'No JSON response' };
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('File Update API Error:', error);
      
      if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('Not authorized')) {
        this.logout();
      }
      
      throw error;
    }
  }

  // Generic GET method for Dashboard and other components
  async get(endpoint) {
    return await this.request(endpoint, {
      method: 'GET',
    });
  }

  // Auth methods
  async login(credentials) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async getProfile() {
    return await this.request('/api/auth/profile');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Dashboard methods
  async getDashboardStats() {
    return await this.request('/api/dashboard/stats');
  }

  async getDashboardData() {
    return await this.request('/api/dashboard');
  }

  // Image upload method for Cloudinary
  async uploadImage(formData) {
    return await this.requestWithFile('/api/upload/image', formData);
  }

  // Portfolio methods - Updated for file uploads
  async getPortfolios(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.request(`/api/portfolio${queryString ? `?${queryString}` : ''}`);
  }

  async getPortfolio(id) {
    return await this.request(`/api/portfolio/${id}`);
  }

  async createPortfolio(data, imageFile = null) {
    if (imageFile) {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Append other data as JSON
      Object.keys(data).forEach(key => {
        if (key !== 'image') {
          if (typeof data[key] === 'object') {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      
      return await this.requestWithFile('/api/portfolio', formData);
    } else {
      // No file upload, use regular JSON request
      return await this.request('/api/portfolio', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  }

  async updatePortfolio(id, data, imageFile = null) {
    if (imageFile) {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Append other data
      Object.keys(data).forEach(key => {
        if (key !== 'image') {
          if (typeof data[key] === 'object') {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      
      return await this.requestFileUpdate(`/api/portfolio/${id}`, formData);
    } else {
      // No file upload, use regular JSON request
      return await this.request(`/api/portfolio/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  }

  async deletePortfolio(id) {
    return await this.request(`/api/portfolio/${id}`, {
      method: 'DELETE',
    });
  }

  // Team methods - Updated for file uploads
  async getTeamMembers() {
    return await this.request('/api/team');
  }

  async getTeamMember(id) {
    return await this.request(`/api/team/${id}`);
  }

  async createTeamMember(data, imageFile = null) {
    if (imageFile) {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Append other data
      Object.keys(data).forEach(key => {
        if (key !== 'image') {
          formData.append(key, data[key]);
        }
      });
      
      return await this.requestWithFile('/api/team', formData);
    } else {
      // No file upload, use regular JSON request
      return await this.request('/api/team', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  }

  async updateTeamMember(id, data, imageFile = null) {
    if (imageFile) {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Append other data
      Object.keys(data).forEach(key => {
        if (key !== 'image') {
          formData.append(key, data[key]);
        }
      });
      
      return await this.requestFileUpdate(`/api/team/${id}`, formData);
    } else {
      // No file upload, use regular JSON request
      return await this.request(`/api/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  }

  async deleteTeamMember(id) {
    return await this.request(`/api/team/${id}`, {
      method: 'DELETE',
    });
  }

  // Service methods
  async getServices() {
    return await this.request('/api/services/services');
  }

  async getService(id) {
    return await this.request(`/api/services/services/${id}`);
  }

  async createService(data) {
    return await this.request('/api/services/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id, data) {
    return await this.request(`/api/services/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id) {
    return await this.request(`/api/services/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Category methods
  async getCategories() {
    return await this.request('/api/services/categories');
  }

  async getCategory(id) {
    return await this.request(`/api/services/categories/${id}`);
  }

  async createCategory(data) {
    return await this.request('/api/services/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id, data) {
    return await this.request(`/api/services/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id) {
    return await this.request(`/api/services/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Testimonial methods
  async getTestimonials(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.request(`/api/testimonials${queryString ? `?${queryString}` : ''}`);
  }

  async getTestimonial(id) {
    return await this.request(`/api/testimonials/${id}`);
  }

  async createTestimonial(data) {
    return await this.request('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTestimonial(id, data) {
    return await this.request(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTestimonial(id) {
    return await this.request(`/api/testimonials/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact methods
  async getContacts() {
    return await this.request('/api/contacts');
  }

  async getContact(id) {
    return await this.request(`/api/contacts/${id}`);
  }

  async deleteContact(id) {
    return await this.request(`/api/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // Career methods
  async getCareers(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.request(`/api/careers${queryString ? `?${queryString}` : ''}`);
  }

  async getCareer(id) {
    return await this.request(`/api/careers/${id}`);
  }

  async createCareer(data) {
    return await this.request('/api/careers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCareer(id, data) {
    return await this.request(`/api/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCareer(id) {
    return await this.request(`/api/careers/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjects(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.request(`/api/projects${queryString ? `?${queryString}` : ''}`);
  }

  async getProject(id) {
    return await this.request(`/api/projects/${id}`);
  }

  async createProject(data) {
    return await this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id, data) {
    return await this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id) {
    return await this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjectStats() {
    return await this.request('/api/projects/stats');
  }

  async updateProjectProgress(id, progress) {
    return await this.request(`/api/projects/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress }),
    });
  }
}

export default new Api();