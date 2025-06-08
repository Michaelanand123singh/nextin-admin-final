// src/utils/api.js
const API_BASE_URL = import.meta.env.DEV ? '' : 'https://nextinvision-backend-1.onrender.com';

class Api {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Helper method to get headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
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
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async getProfile() {
    return await this.request('/api/auth/profile');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Portfolio methods
  async getPortfolios(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.request(`/api/portfolio${queryString ? `?${queryString}` : ''}`);
  }

  async getPortfolio(id) {
    return await this.request(`/api/portfolio/${id}`);
  }

  async createPortfolio(data) {
    return await this.request('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePortfolio(id, data) {
    return await this.request(`/api/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePortfolio(id) {
    return await this.request(`/api/portfolio/${id}`, {
      method: 'DELETE',
    });
  }

  // Team methods
  async getTeamMembers() {
    return await this.request('/api/team');
  }

  async getTeamMember(id) {
    return await this.request(`/api/team/${id}`);
  }

  async createTeamMember(data) {
    return await this.request('/api/team', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeamMember(id, data) {
    return await this.request(`/api/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeamMember(id) {
    return await this.request(`/api/team/${id}`, {
      method: 'DELETE',
    });
  }

  // Service methods
  async getServices() {
    return await this.request('/api/service/services');
  }

  async getService(id) {
    return await this.request(`/api/service/services/${id}`);
  }

  async createService(data) {
    return await this.request('/api/service/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id, data) {
    return await this.request(`/api/service/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id) {
    return await this.request(`/api/service/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Category methods
  async getCategories() {
    return await this.request('/api/service/categories');
  }

  async getCategory(id) {
    return await this.request(`/api/service/categories/${id}`);
  }

  async createCategory(data) {
    return await this.request('/api/service/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id, data) {
    return await this.request(`/api/service/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id) {
    return await this.request(`/api/service/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Testimonial methods
  async getTestimonials(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.request(`/api/testimonial${queryString ? `?${queryString}` : ''}`);
  }

  async getTestimonial(id) {
    return await this.request(`/api/testimonial/${id}`);
  }

  async createTestimonial(data) {
    return await this.request('/api/testimonial', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTestimonial(id, data) {
    return await this.request(`/api/testimonial/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTestimonial(id) {
    return await this.request(`/api/testimonial/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact methods
  async getContacts() {
    return await this.request('/api/contact');
  }

  async getContact(id) {
    return await this.request(`/api/contact/${id}`);
  }

  async deleteContact(id) {
    return await this.request(`/api/contact/${id}`, {
      method: 'DELETE',
    });
  }

  // Career methods
  async getCareers(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.request(`/api/career${queryString ? `?${queryString}` : ''}`);
  }

  async getCareer(id) {
    return await this.request(`/api/career/${id}`);
  }

  async createCareer(data) {
    return await this.request('/api/career', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCareer(id, data) {
    return await this.request(`/api/career/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCareer(id) {
    return await this.request(`/api/career/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new Api();