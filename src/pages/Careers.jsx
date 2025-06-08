import React, { useState, useEffect } from 'react';
import api  from '../utils/api';
import Table from '../components/Table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Clock, 
  DollarSign,
  Briefcase,
  Users,
  Star,
  X,
  Save
} from 'lucide-react';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [viewingCareer, setViewingCareer] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    department: '',
    location: '',
    type: 'Full-Time',
    experience: '',
    salary: '',
    posted: '',
    description: '',
    requirements: [],
    skills: [],
    benefits: [],
    applyLink: '',
    featured: false
  });
  const [filters, setFilters] = useState({
    department: '',
    type: '',
    location: '',
    featured: ''
  });

  useEffect(() => {
    fetchCareers();
  }, [filters]);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      
      const response = await api.get(`/careers?${params.toString()}`);
      setCareers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const careerData = {
        ...formData,
        id: parseInt(formData.id),
        requirements: formData.requirements.filter(req => req.trim()),
        skills: formData.skills.filter(skill => skill.trim()),
        benefits: formData.benefits.filter(benefit => benefit.trim())
      };

      if (editingCareer) {
        await api.put(`/careers/${careerData.id}`, careerData);
      } else {
        await api.post('/careers', careerData);
      }
      
      fetchCareers();
      resetForm();
    } catch (error) {
      console.error('Error saving career:', error);
      alert('Error saving career');
    }
  };

  const handleDelete = async (careerId) => {
    if (window.confirm('Are you sure you want to delete this career?')) {
      try {
        await api.delete(`/careers/${careerId}`);
        fetchCareers();
      } catch (error) {
        console.error('Error deleting career:', error);
        alert('Error deleting career');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      department: '',
      location: '',
      type: 'Full-Time',
      experience: '',
      salary: '',
      posted: '',
      description: '',
      requirements: [],
      skills: [],
      benefits: [],
      applyLink: '',
      featured: false
    });
    setEditingCareer(null);
    setShowModal(false);
  };

  const handleEdit = (career) => {
    setFormData({
      ...career,
      requirements: career.requirements || [],
      skills: career.skills || [],
      benefits: career.benefits || []
    });
    setEditingCareer(career);
    setShowModal(true);
  };

  const handleView = async (careerId) => {
    try {
      const response = await api.get(`/careers/${careerId}`);
      setViewingCareer(response.data.data);
    } catch (error) {
      console.error('Error fetching career details:', error);
    }
  };

  const handleArrayInput = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (career) => (
        <span className="font-medium text-gray-900">#{career.id}</span>
      )
    },
    {
      key: 'title',
      label: 'Job Title',
      render: (career) => (
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 text-blue-500 mr-2" />
          <div>
            <div className="font-medium text-gray-900">{career.title}</div>
            <div className="text-sm text-gray-500">{career.department}</div>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location & Type',
      render: (career) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-3 h-3 mr-1" />
            {career.location}
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            career.type === 'Full-Time' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {career.type}
          </span>
        </div>
      )
    },
    {
      key: 'details',
      label: 'Details',
      render: (career) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-3 h-3 mr-1" />
            {career.experience}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-3 h-3 mr-1" />
            {career.salary}
          </div>
        </div>
      )
    },
    {
      key: 'posted',
      label: 'Posted',
      render: (career) => (
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-3 h-3 mr-1" />
          {career.posted}
        </div>
      )
    },
    {
      key: 'featured',
      label: 'Status',
      render: (career) => (
        <div className="space-y-1">
          {career.featured && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
        </div>
      )
    }
  ];

  const actions = [
    {
      icon: Eye,
      label: 'View',
      onClick: (career) => handleView(career.id),
      className: 'text-blue-600 hover:text-blue-900'
    },
    {
      icon: Edit,
      label: 'Edit',
      onClick: handleEdit,
      className: 'text-indigo-600 hover:text-indigo-900'
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: (career) => handleDelete(career.id),
      className: 'text-red-600 hover:text-red-900'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Career Management</h1>
          <p className="text-gray-600">Manage job postings and career opportunities</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Career
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              placeholder="Filter by department"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="Filter by location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
            <select
              value={filters.featured}
              onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Jobs</option>
              <option value="true">Featured Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        data={careers}
        columns={columns}
        actions={actions}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCareer ? 'Edit Career' : 'Add New Career'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job ID *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Required *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 2-4 years"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., $50,000 - $70,000"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posted *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 2 days ago"
                      value={formData.posted}
                      onChange={(e) => setFormData({ ...formData, posted: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apply Link *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.applyLink}
                    onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleArrayInput('requirements', index, e.target.value)}
                        placeholder="Enter requirement"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Requirement
                  </button>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleArrayInput('skills', index, e.target.value)}
                        placeholder="Enter skill"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skills', index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('skills')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Skill
                  </button>
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits
                  </label>
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayInput('benefits', index, e.target.value)}
                        placeholder="Enter benefit"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('benefits', index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('benefits')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Benefit
                  </button>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Featured Job
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingCareer ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingCareer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Career Details</h2>
                <button
                  onClick={() => setViewingCareer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {viewingCareer.title}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <strong>Department:</strong> {viewingCareer.department}
                      </p>
                      <p className="text-gray-600">
                        <strong>Location:</strong> {viewingCareer.location}
                      </p>
                      <p className="text-gray-600">
                        <strong>Type:</strong> {viewingCareer.type}
                      </p>
                      <p className="text-gray-600">
                        <strong>Experience:</strong> {viewingCareer.experience}
                      </p>
                      <p className="text-gray-600">
                        <strong>Salary:</strong> {viewingCareer.salary}
                      </p>
                      <p className="text-gray-600">
                        <strong>Posted:</strong> {viewingCareer.posted}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <strong>Job ID:</strong> #{viewingCareer.id}
                      </p>
                      <p className="text-gray-600">
                        <strong>Apply Link:</strong>{' '}
                        <a 
                          href={viewingCareer.applyLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Application
                        </a>
                      </p>
                      {viewingCareer.featured && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Featured Job
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{viewingCareer.description}</p>
                </div>

                {viewingCareer.requirements && viewingCareer.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {viewingCareer.requirements.map((req, index) => (
                        <li key={index} className="text-gray-700">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {viewingCareer.skills && viewingCareer.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingCareer.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewingCareer.benefits && viewingCareer.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {viewingCareer.benefits.map((benefit, index) => (
                        <li key={index} className="text-gray-700">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;