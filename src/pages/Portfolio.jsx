import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import api from '../utils/api';

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    url: '',
    featured: false,
    type: 'Portfolio',
    technologies: [],
    client: '',
    services: [],
    metrics: {
      users: '',
      transactions: '',
      uptime: '',
      performance: '',
      organicTraffic: '',
      keywordRankings: '',
      conversionRate: '',
      timeframe: ''
    }
  });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
  try {
    console.log('🔍 Starting portfolio fetch...'); // Debug log
    const response = await api.get('/portfolio');
    
    console.log('✅ Response received:', response); // Debug log
    console.log('📊 Response data structure:', response?.data); // Debug log
    
    // Handle different possible response structures safely
    let portfolioData = [];
    
    if (response && response.data) {
      // Check if data is nested (response.data.data) or direct (response.data)
      if (response.data.data && Array.isArray(response.data.data)) {
        portfolioData = response.data.data;
      } else if (Array.isArray(response.data)) {
        portfolioData = response.data;
      } else {
        console.warn('⚠️ Unexpected response structure:', response.data);
        portfolioData = [];
      }
    }
    
    console.log('📋 Final portfolio data:', portfolioData);
    setPortfolios(portfolioData);
    
  } catch (error) {
    console.error('❌ Error fetching portfolios:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Set empty array as fallback
    setPortfolios([]);
    
    // Optional: Show user-friendly error message
    // alert('Failed to load portfolios. Please try again.');
    
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // Clean up data based on type
      if (formData.type === 'TechProject') {
        payload.technologies = formData.technologies.filter(tech => tech.trim());
      } else if (formData.type === 'DigitalMarketingCampaign') {
        payload.services = formData.services.filter(service => service.trim());
      }

      if (editingItem) {
        await api.put(`/portfolio/${editingItem._id}`, payload);
      } else {
        await api.post('/portfolio', payload);
      }
      
      fetchPortfolios();
      resetForm();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('Error saving portfolio. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      technologies: item.technologies || [],
      services: item.services || [],
      metrics: {
        users: item.metrics?.users || '',
        transactions: item.metrics?.transactions || '',
        uptime: item.metrics?.uptime || '',
        performance: item.metrics?.performance || '',
        organicTraffic: item.metrics?.organicTraffic || '',
        keywordRankings: item.metrics?.keywordRankings || '',
        conversionRate: item.metrics?.conversionRate || '',
        timeframe: item.metrics?.timeframe || ''
      }
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await api.delete(`/portfolio/${id}`);
        fetchPortfolios();
      } catch (error) {
        console.error('Error deleting portfolio:', error);
        alert('Error deleting portfolio. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      image: '',
      url: '',
      featured: false,
      type: 'Portfolio',
      technologies: [],
      client: '',
      services: [],
      metrics: {
        users: '',
        transactions: '',
        uptime: '',
        performance: '',
        organicTraffic: '',
        keywordRankings: '',
        conversionRate: '',
        timeframe: ''
      }
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleArrayInput = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: array });
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'type', label: 'Type' },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, item) => (
        <div className="space-x-2">
          <button
            onClick={() => handleEdit(item)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Portfolio Item
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Portfolio">Portfolio</option>
                  <option value="TechProject">Tech Project</option>
                  <option value="DigitalMarketingCampaign">Digital Marketing Campaign</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {formData.type === 'TechProject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.technologies.join(', ')}
                    onChange={(e) => handleArrayInput('technologies', e.target.value)}
                    placeholder="React, Node.js, MongoDB"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              {formData.type === 'DigitalMarketingCampaign' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Services (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.services.join(', ')}
                      onChange={(e) => handleArrayInput('services', e.target.value)}
                      placeholder="SEO, PPC, Content Marketing"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Table
        columns={columns}
        data={portfolios}
        loading={loading}
      />
    </div>
  );
};

export default Portfolio;