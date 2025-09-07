import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import CareerFilters from '../components/career/CareerFilters';
import CareerModal from '../components/career/CareerModal';
import CareerViewModal from '../components/career/CareerViewModal';
import { careerColumns, careerActions } from '../components/career/CareerTableConfig';
import { Plus } from 'lucide-react';

const initialFormData = {
  id: '', title: '', department: '', location: '', type: 'Full-Time',
  experience: '', salary: '', posted: '', description: '',
  requirements: [], skills: [], benefits: [], applyLink: '', featured: false
};

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Add submitting state
  const [showModal, setShowModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [viewingCareer, setViewingCareer] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [filters, setFilters] = useState({
    department: '', type: '', location: '', featured: ''
  });
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    fetchCareers();
  }, [filters]);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      
      const response = await api.getCareers(filters);
      setCareers(response.data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
      setError('Failed to load careers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (careerData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Basic validation
      if (!careerData.title?.trim() || !careerData.department?.trim()) {
        throw new Error('Title and Department are required');
      }

      const processedData = {
        ...careerData,
        id: careerData.id ? parseInt(careerData.id) : undefined,
        requirements: careerData.requirements.filter(req => req.trim()),
        skills: careerData.skills.filter(skill => skill.trim()),
        benefits: careerData.benefits.filter(benefit => benefit.trim())
      };

      if (editingCareer) {
        await api.updateCareer(processedData.id, processedData);
      } else {
        // Remove id for new careers
        const { id, ...newCareerData } = processedData;
        await api.createCareer(newCareerData);
      }
      
      await fetchCareers();
      resetForm();
    } catch (error) {
      console.error('Error saving career:', error);
      setError(error.message || 'Error saving career. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (careerId) => {
    if (window.confirm('Are you sure you want to delete this career?')) {
      try {
        setError(null);
        await api.deleteCareer(careerId);
        await fetchCareers();
      } catch (error) {
        console.error('Error deleting career:', error);
        setError('Error deleting career. Please try again.');
      }
    }
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
      setError(null);
      const response = await api.getCareer(careerId);
      setViewingCareer(response.data);
    } catch (error) {
      console.error('Error fetching career details:', error);
      setError('Error loading career details. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingCareer(null);
    setShowModal(false);
    setError(null); // Clear errors when closing modal
  };

  const actions = careerActions(handleView, handleEdit, handleDelete);

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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Career
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <CareerFilters filters={filters} setFilters={setFilters} />

      {/* Table */}
      <Table
        data={careers}
        columns={careerColumns}
        actions={actions}
        loading={loading}
      />

      {/* Modals */}
      {showModal && (
        <CareerModal
          formData={formData}
          setFormData={setFormData}
          editingCareer={editingCareer}
          onSubmit={handleSubmit}
          onClose={resetForm}
          submitting={submitting}
          error={error}
        />
      )}

      {viewingCareer && (
        <CareerViewModal
          career={viewingCareer}
          onClose={() => setViewingCareer(null)}
        />
      )}
    </div>
  );
};

export default Careers;