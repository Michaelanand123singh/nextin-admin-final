import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import api from '../utils/api';

const initialFormData = {
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
};

const Portfolio = () => {
  const [state, setState] = useState({
    portfolios: [],
    loading: true,
    showForm: false,
    editingItem: null,
    imageFile: null,
    imagePreview: '',
    uploadingImage: false,
    formData: initialFormData
  });

  useEffect(() => { fetchPortfolios(); }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await api.getPortfolios();
      const portfolioData = response?.data?.data || response?.data || [];
      setState(s => ({ ...s, portfolios: portfolioData, loading: false }));
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setState(s => ({ ...s, portfolios: [], loading: false }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) return alert('Please select a valid image file');
    if (file.size > 5 * 1024 * 1024) return alert('Image size should be less than 5MB');
    
    setState(s => ({ ...s, imageFile: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => setState(s => ({ ...s, imagePreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;
    
    setState(s => ({ ...s, uploadingImage: true }));
    try {
      // For now, we'll use the portfolio create/update endpoints which handle image uploads
      // The direct upload endpoint is not implemented yet
      return null; // Let the portfolio endpoints handle the image upload
    } finally {
      setState(s => ({ ...s, uploadingImage: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { formData, imageFile, editingItem } = state;
    
    try {
      if (editingItem) {
        await api.updatePortfolio(editingItem._id, formData, imageFile);
      } else {
        await api.createPortfolio(formData, imageFile);
      }
      
      fetchPortfolios();
      resetForm();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('Error saving portfolio. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setState({
      ...state,
      editingItem: item,
      formData: {
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
      },
      imagePreview: item.image || '',
      showForm: true
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await api.deletePortfolio(id);
        fetchPortfolios();
      } catch (error) {
        console.error('Error deleting portfolio:', error);
        alert('Error deleting portfolio. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setState({
      ...state,
      formData: initialFormData,
      editingItem: null,
      imageFile: null,
      imagePreview: '',
      showForm: false
    });
  };

  const handleArrayInput = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setState(s => ({ ...s, formData: { ...s.formData, [field]: array } }));
  };

  const updateFormData = (field, value) => {
    setState(s => ({ ...s, formData: { ...s.formData, [field]: value } }));
  };

  const updateMetrics = (field, value) => {
    setState(s => ({
      ...s,
      formData: {
        ...s.formData,
        metrics: { ...s.formData.metrics, [field]: value }
      }
    }));
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (_, item) => (
        <div className="flex items-center">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Image</span>
            </div>
          )}
        </div>
      )
    },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'type', label: 'Type' },
    { 
      key: 'featured', 
      label: 'Featured',
      render: value => (
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
          <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
            Edit
          </button>
          <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800">
            Delete
          </button>
        </div>
      )
    }
  ];

  const { portfolios, loading, showForm, formData, imagePreview, uploadingImage, editingItem } = state;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Management</h1>
        <button
          onClick={() => setState(s => ({ ...s, showForm: true }))}
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
                    onChange={(e) => updateFormData('title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => updateFormData('type', e.target.value)}
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
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Image</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={uploadingImage}
                  />
                  
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => setState(s => ({ ...s, imageFile: null, imagePreview: '' }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        disabled={uploadingImage}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  {uploadingImage && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600">Uploading image...</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => updateFormData('url', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
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
                      onChange={(e) => updateFormData('client', e.target.value)}
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
                    onChange={(e) => updateFormData('featured', e.target.checked)}
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
                  disabled={uploadingImage}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Uploading...' : (editingItem ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Table columns={columns} data={portfolios} loading={loading} />
    </div>
  );
};

export default Portfolio;