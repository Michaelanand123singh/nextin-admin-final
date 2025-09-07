import React from 'react';
import { X } from 'lucide-react';
import FormField from './FormField';
import ArrayField from './ArrayField';

const CareerForm = ({ formData, setFormData }) => {
  const basicFields = [
    { name: 'id', label: 'Job ID', type: 'number', required: true },
    { name: 'title', label: 'Job Title', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'text', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
    {
      name: 'type',
      label: 'Job Type',
      type: 'select',
      required: true,
      options: [
        { value: 'Full-Time', label: 'Full-Time' },
        { value: 'Part-Time', label: 'Part-Time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Remote', label: 'Remote' }
      ]
    },
    { name: 'experience', label: 'Experience Required', type: 'text', required: true, placeholder: 'e.g., 2-4 years' },
    { name: 'salary', label: 'Salary', type: 'text', required: true, placeholder: 'e.g., $50,000 - $70,000' },
    { name: 'posted', label: 'Posted', type: 'text', required: true, placeholder: 'e.g., 2 days ago' }
  ];

  return (
    <>
      {/* Basic Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {basicFields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={(value) => setFormData({ ...formData, [field.name]: value })}
          />
        ))}
      </div>

      {/* Description */}
      <FormField
        field={{
          name: 'description',
          label: 'Job Description',
          type: 'textarea',
          required: true,
          rows: 4
        }}
        value={formData.description}
        onChange={(value) => setFormData({ ...formData, description: value })}
      />

      {/* Apply Link */}
      <FormField
        field={{
          name: 'applyLink',
          label: 'Apply Link',
          type: 'url',
          required: true,
          placeholder: 'https://...'
        }}
        value={formData.applyLink}
        onChange={(value) => setFormData({ ...formData, applyLink: value })}
      />

      {/* Array Fields */}
      {['requirements', 'skills', 'benefits'].map((fieldName) => (
        <ArrayField
          key={fieldName}
          label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
          placeholder={`Enter ${fieldName.slice(0, -1)}`}
          items={formData[fieldName]}
          onChange={(items) => setFormData({ ...formData, [fieldName]: items })}
        />
      ))}

      {/* Featured Checkbox */}
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
    </>
  );
};

export default CareerForm;