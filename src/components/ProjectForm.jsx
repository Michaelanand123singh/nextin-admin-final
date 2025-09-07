import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { PROJECT_STATUSES, PROJECT_PRIORITIES } from '../utils/projectUtils';

const ProjectForm = ({ project, isOpen, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', status: PROJECT_STATUSES.UPCOMING,
    priority: PROJECT_PRIORITIES.MEDIUM, startDate: '', endDate: '',
    estimatedEndDate: '', client: '', teamMembers: '', budget: '',
    progress: 0, tags: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        status: project.status || PROJECT_STATUSES.UPCOMING,
        priority: project.priority || PROJECT_PRIORITIES.MEDIUM,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        estimatedEndDate: project.estimatedEndDate ? new Date(project.estimatedEndDate).toISOString().split('T')[0] : '',
        client: project.client || '',
        teamMembers: Array.isArray(project.teamMembers) ? project.teamMembers.join(', ') : project.teamMembers || '',
        budget: project.budget || '',
        progress: project.progress || 0,
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || ''
      });
    } else {
      setFormData({
        title: '', description: '', status: PROJECT_STATUSES.UPCOMING,
        priority: PROJECT_PRIORITIES.MEDIUM, startDate: '', endDate: '',
        estimatedEndDate: '', client: '', teamMembers: '', budget: '',
        progress: 0, tags: ''
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (formData.budget && isNaN(Number(formData.budget))) newErrors.budget = 'Budget must be a valid number';
    if (formData.progress < 0 || formData.progress > 100) newErrors.progress = 'Progress must be between 0 and 100';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      teamMembers: formData.teamMembers ? formData.teamMembers.split(',').map(m => m.trim()) : [],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      budget: formData.budget ? Number(formData.budget) : null,
      progress: Number(formData.progress)
    };
    onSubmit(submitData);
  };

  const InputField = ({ label, name, type = "text", required = false, placeholder, className = "", ...props }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
        disabled={loading}
        {...props}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  const SelectField = ({ label, name, options, className = "" }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
        disabled={loading}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  if (!isOpen) return null;

  const statusOptions = Object.values(PROJECT_STATUSES).map(status => ({
    value: status,
    label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const priorityOptions = Object.values(PROJECT_PRIORITIES).map(priority => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1)
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <InputField label="Project Title" name="title" required placeholder="Enter project title" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your project..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none disabled:bg-gray-50"
                  disabled={loading}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Status" name="status" options={statusOptions} />
              <SelectField label="Priority" name="priority" options={priorityOptions} />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Start Date" name="startDate" type="date" />
              <InputField label="End Date" name="endDate" type="date" />
              <InputField label="Estimated End Date" name="estimatedEndDate" type="date" />
            </div>

            {/* Client & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Client" name="client" placeholder="Client name" />
              <InputField label="Budget" name="budget" type="number" placeholder="0" min="0" />
            </div>

            {/* Team & Tags */}
            <div className="space-y-4">
              <InputField 
                label="Team Members" 
                name="teamMembers" 
                placeholder="Separate members with commas" 
              />
              <InputField 
                label="Tags" 
                name="tags" 
                placeholder="Separate tags with commas" 
              />
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress ({formData.progress}%)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={loading}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {project ? 'Update Project' : 'Create Project'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;