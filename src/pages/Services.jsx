import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import Table from '../components/Table';
import api from '../utils/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('services');
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    headline: '',
    description: '',
    features: [],
    gradient: '',
    glowColor: '',
    bgGradient: '',
    borderGradient: ''
  });
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    color: '',
    gradient: ''
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services/services');
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/services/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        ...formData,
        features: formData.features.filter(feature => feature.icon && feature.text)
      };

      if (editingService) {
        await api.put(`/services/services/${editingService._id}`, serviceData);
      } else {
        await api.post('/services/services', serviceData);
      }
      
      fetchServices();
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/services/categories/${editingCategory.id}`, categoryFormData);
      } else {
        await api.post('/services/categories', categoryFormData);
      }
      
      fetchCategories();
      resetCategoryForm();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      icon: service.icon || '',
      title: service.title || '',
      headline: service.headline || '',
      description: service.description || '',
      features: service.features || [],
      gradient: service.gradient || '',
      glowColor: service.glowColor || '',
      bgGradient: service.bgGradient || '',
      borderGradient: service.borderGradient || ''
    });
    setShowModal(true);
  };

  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      id: category.id || '',
      name: category.name || '',
      color: category.color || '',
      gradient: category.gradient || ''
    });
    setShowCategoryModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/services/${id}`);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Error deleting service: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleCategoryDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/services/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      icon: '',
      title: '',
      headline: '',
      description: '',
      features: [],
      gradient: '',
      glowColor: '',
      bgGradient: '',
      borderGradient: ''
    });
    setEditingService(null);
    setShowModal(false);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      id: '',
      name: '',
      color: '',
      gradient: ''
    });
    setEditingCategory(null);
    setShowCategoryModal(false);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { icon: '', text: '' }]
    });
  };

  const updateFeature = (index, field, value) => {
    const updatedFeatures = formData.features.map((feature, i) =>
      i === index ? { ...feature, [field]: value } : feature
    );
    setFormData({ ...formData, features: updatedFeatures });
  };

  const removeFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const serviceColumns = [
    { key: 'icon', label: 'Icon' },
    { key: 'title', label: 'Title' },
    { key: 'headline', label: 'Headline' },
    { 
      key: 'description', 
      label: 'Description',
      render: (value) => value?.substring(0, 100) + (value?.length > 100 ? '...' : '')
    },
    {
      key: 'features',
      label: 'Features',
      render: (value) => value?.length || 0
    }
  ];

  const categoryColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'color', label: 'Color' },
    {
      key: 'services',
      label: 'Services Count',
      render: (value) => value?.length || 0
    }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'services'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'categories'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Categories
        </button>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Add Service
            </button>
          </div>

          <Table
            data={services}
            columns={serviceColumns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>

          <Table
            data={categories}
            columns={categoryColumns}
            onEdit={handleCategoryEdit}
            onDelete={handleCategoryDelete}
          />
        </>
      )}

      {/* Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gradient</label>
                  <input
                    type="text"
                    value={formData.gradient}
                    onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., from-blue-400 to-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Glow Color</label>
                  <input
                    type="text"
                    value={formData.glowColor}
                    onChange={(e) => setFormData({ ...formData, glowColor: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., blue-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Background Gradient</label>
                  <input
                    type="text"
                    value={formData.bgGradient}
                    onChange={(e) => setFormData({ ...formData, bgGradient: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., from-blue-50 to-purple-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Border Gradient</label>
                  <input
                    type="text"
                    value={formData.borderGradient}
                    onChange={(e) => setFormData({ ...formData, borderGradient: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., from-blue-200 to-purple-200"
                    required
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Features</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Feature
                  </button>
                </div>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Icon name"
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                      className="flex-1 border rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Feature text"
                      value={feature.text}
                      onChange={(e) => updateFeature(index, 'text', e.target.value)}
                      className="flex-2 border rounded-lg px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {editingService ? 'Update' : 'Create'} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ID</label>
                <input
                  type="text"
                  value={categoryFormData.id}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, id: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                  disabled={editingCategory}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  type="text"
                  value={categoryFormData.color}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gradient</label>
                <input
                  type="text"
                  value={categoryFormData.gradient}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, gradient: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., from-blue-400 to-purple-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;