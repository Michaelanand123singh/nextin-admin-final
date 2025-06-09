import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, Calendar, Users, DollarSign, AlertCircle } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import ProjectFilters from '../components/ProjectFilters';
import api from '../utils/api';
import { PROJECT_STATUSES } from '../utils/projectUtils';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
    loadStats();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, filters, searchTerm]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await api.getProjects();
      if (response.success) {
        setProjects(response.data || []);
      } else {
        setError('Failed to load projects');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.getProjectStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.client && project.client.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(project => project.priority === filters.priority);
    }

    setFilteredProjects(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await api.deleteProject(projectId);
        if (response.success) {
          setProjects(prev => prev.filter(p => p._id !== projectId));
          loadStats(); // Refresh stats
        } else {
          setError('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      let response;

      if (selectedProject) {
        response = await api.updateProject(selectedProject._id, formData);
      } else {
        response = await api.createProject(formData);
      }

      if (response.success) {
        setShowForm(false);
        loadProjects();
        loadStats();
        setError('');
      } else {
        setError(response.message || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProject(null);
  };

  const getStatsCards = () => {
    const totalProjects = projects.length;
    const ongoingProjects = projects.filter(p => p.status === PROJECT_STATUSES.ONGOING).length;
    const completedProjects = projects.filter(p => p.status === PROJECT_STATUSES.COMPLETED).length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

    return [
      {
        title: 'Total Projects',
        value: totalProjects,
        icon: BarChart3,
        color: 'bg-blue-500'
      },
      {
        title: 'Ongoing Projects',
        value: ongoingProjects,
        icon: Calendar,
        color: 'bg-yellow-500'
      },
      {
        title: 'Completed Projects',
        value: completedProjects,
        icon: Users,
        color: 'bg-green-500'
      },
      {
        title: 'Total Budget',
        value: `$${totalBudget.toLocaleString()}`,
        icon: DollarSign,
        color: 'bg-purple-500'
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600">Manage your projects and track progress</p>
        </div>
        <button
          onClick={handleAddProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsCards().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <ProjectFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.keys(filters).length > 0
              ? 'Try adjusting your search or filters'
              : 'Get started by creating a new project'
            }
          </p>
          {!searchTerm && Object.keys(filters).length === 0 && (
            <div className="mt-6">
              <button
                onClick={handleAddProject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Project</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectForm
        project={selectedProject}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default ProjectManagement;