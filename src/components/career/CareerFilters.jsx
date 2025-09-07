import React from 'react';

const CareerFilters = ({ filters, setFilters }) => {
  const filterOptions = [
    {
      label: 'Department',
      key: 'department',
      type: 'input',
      placeholder: 'Filter by department'
    },
    {
      label: 'Type',
      key: 'type',
      type: 'select',
      options: [
        { value: '', label: 'All Types' },
        { value: 'Full-Time', label: 'Full-Time' },
        { value: 'Part-Time', label: 'Part-Time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Remote', label: 'Remote' }
      ]
    },
    {
      label: 'Location',
      key: 'location',
      type: 'input',
      placeholder: 'Filter by location'
    },
    {
      label: 'Featured',
      key: 'featured',
      type: 'select',
      options: [
        { value: '', label: 'All Jobs' },
        { value: 'true', label: 'Featured Only' }
      ]
    }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filterOptions.map(({ label, key, type, placeholder, options }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            {type === 'input' ? (
              <input
                type="text"
                placeholder={placeholder}
                value={filters[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <select
                value={filters[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {options.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerFilters;