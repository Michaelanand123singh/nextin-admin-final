import React from 'react';
import { Edit2, Trash2, Eye, Calendar, Users, DollarSign } from 'lucide-react';
import ProjectStatusBadge from './ProjectStatusBadge';
import { formatDate } from '../utils/projectUtils';

const ProjectCard = ({ project, onEdit, onDelete, onView }) => {
  const progressPercentage = project.progress || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
          <ProjectStatusBadge status={project.status} priority={project.priority} />
        </div>
        <div className="flex space-x-2 ml-4">
          {onView && (
            <button
              onClick={() => onView(project)}
              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(project)}
              className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
              title="Edit Project"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(project._id)}
              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
              title="Delete Project"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Start: {formatDate(project.startDate)}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>End: {formatDate(project.endDate)}</span>
        </div>
        {project.client && (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Client: {project.client}</span>
          </div>
        )}
        {project.budget && (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>Budget: ${project.budget.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;