import React from 'react';
import { 
  Edit, Trash2, Eye, MapPin, Clock, DollarSign,
  Briefcase, Users, Star
} from 'lucide-react';

export const careerColumns = [
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
      career.featured && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </span>
      )
    )
  }
];

export const careerActions = (handleView, handleEdit, handleDelete) => [
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