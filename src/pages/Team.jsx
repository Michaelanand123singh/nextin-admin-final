import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    bio: '',
    email: '',
    linkedin: '',
    twitter: ''
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await api.getTeamMembers();
      if (response.success) {
        setTeamMembers(response.data);
      }
    } catch (err) {
      setError('Failed to fetch team members');
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Start with required fields only
      const cleanData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
      };
      
      // Add optional fields only if they have valid values
      if (formData.image && formData.image.trim()) {
        cleanData.image = formData.image.trim();
      }
      
      if (formData.bio && formData.bio.trim()) {
        cleanData.bio = formData.bio.trim();
      }
      
      if (formData.email && formData.email.trim()) {
        cleanData.email = formData.email.trim();
      }
      
      if (formData.linkedin && formData.linkedin.trim()) {
        cleanData.linkedin = formData.linkedin.trim();
      }
      
      if (formData.twitter && formData.twitter.trim()) {
        cleanData.twitter = formData.twitter.trim();
      }
      
      console.log('🔍 Form data before cleaning:', formData);
      console.log('✨ Clean data being sent:', cleanData);
      
      if (editingMember) {
        const response = await api.updateTeamMember(editingMember._id, cleanData);
        if (response.success) {
          setTeamMembers(teamMembers.map(member => 
            member._id === editingMember._id ? response.data : member
          ));
        }
      } else {
        const response = await api.createTeamMember(cleanData);
        if (response.success) {
          setTeamMembers([response.data, ...teamMembers]);
        }
      }
      
      handleCloseModal();
    } catch (err) {
      setError(editingMember ? 'Failed to update team member' : 'Failed to create team member');
      console.error('Error saving team member:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      image: member.image || '',
      bio: member.bio || '',
      email: member.email || '',
      linkedin: member.linkedin || '',
      twitter: member.twitter || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      setLoading(true);
      const response = await api.deleteTeamMember(id);
      if (response.success) {
        setTeamMembers(teamMembers.filter(member => member._id !== id));
      }
    } catch (err) {
      setError('Failed to delete team member');
      console.error('Error deleting team member:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      image: '',
      bio: '',
      email: '',
      linkedin: '',
      twitter: ''
    });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const columns = [
    {
      key: 'image',
      label: 'Photo',
      render: (member) => (
        <div className="flex items-center">
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-semibold">
                {member.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )
    },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    {
      key: 'bio',
      label: 'Bio',
      render: (member) => (
        <div className="max-w-xs truncate" title={member.bio}>
          {member.bio || 'N/A'}
        </div>
      )
    },
    {
      key: 'social',
      label: 'Social Links',
      render: (member) => (
        <div className="flex space-x-2">
          {member.linkedin && (
            <a 
              href={member.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              LinkedIn
            </a>
          )}
          {member.twitter && (
            <a 
              href={member.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600"
            >
              Twitter
            </a>
          )}
        </div>
      )
    }
  ];

  if (loading && teamMembers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage your team members</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Team Member
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Table
        data={teamMembers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/username (optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty if not applicable</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://twitter.com/username (optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty if not applicable</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingMember ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;