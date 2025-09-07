import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { PROJECT_STATUSES, PROJECT_PRIORITIES } from '../utils/projectUtils';

const ProjectFilters = ({ filters, onFilterChange, onSearch }) => {
  const hasActiveFilters = filters.status || filters.priority;

  const FilterSelect = ({ value, onChange, options, placeholder, label }) => (
    <div className="min-w-0">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={onChange}
        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const clearFilters = () => {
    onFilterChange('status', '');
    onFilterChange('priority', '');
    onSearch('');
  };

  const statusOptions = Object.values(PROJECT_STATUSES).map(status => ({
    value: status,
    label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const priorityOptions = Object.values(PROJECT_PRIORITIES).map(priority => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1)
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title, description, or client..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-end gap-3">
          <div className="hidden sm:flex items-center text-gray-500 mr-1">
            <Filter className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Filter by:</span>
          </div>

          <FilterSelect
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            options={statusOptions}
            placeholder="All Status"
            label="Status"
          />

          <FilterSelect
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            options={priorityOptions}
            placeholder="All Priority"
            label="Priority"
          />

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
              title="Clear all filters"
            >
              <X className="h-4 w-4 mr-1 group-hover:text-red-600" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Active filters:</span>
          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
              Status: {filters.status.replace('_', ' ')}
            </span>
          )}
          {filters.priority && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md">
              Priority: {filters.priority}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;