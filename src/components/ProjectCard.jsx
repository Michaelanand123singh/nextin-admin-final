import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import ProjectStatusBadge from './ProjectStatusBadge';
import { formatDate } from '../utils/projectUtils';

const ProjectCard = ({ project, onEdit, onDelete, onView, onProgressUpdate }) => {
  const [progress, setProgress] = useState(project.progress || 0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const handleProgressUpdate = async (newProgress) => {
    if (onProgressUpdate && newProgress !== progress) {
      setIsUpdatingProgress(true);
      try {
        await onProgressUpdate(project._id, newProgress);
        setProgress(newProgress);
      } catch (error) {
        console.error('Failed to update progress:', error);
        // Revert progress on error
        setProgress(project.progress || 0);
      } finally {
        setIsUpdatingProgress(false);
      }
    }
  };

  const ActionButton = ({ onClick, icon: Icon, className, title }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 ${className}`}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center text-sm text-gray-600">
      <Icon className="h-4 w-4 mr-2 text-gray-400" />
      <span className="font-medium mr-1">{label}:</span>
      <span>{value}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
            {project.description}
          </p>
          <ProjectStatusBadge status={project.status} priority={project.priority} />
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {onView && (
            <ActionButton
              onClick={() => onView(project)}
              icon={Eye}
              className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              title="View Details"
            />
          )}
          {onEdit && (
            <ActionButton
              onClick={() => onEdit(project)}
              icon={Edit2}
              className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
              title="Edit Project"
            />
          )}
          {onDelete && (
            <ActionButton
              onClick={() => onDelete(project._id)}
              icon={Trash2}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
              title="Delete Project"
            />
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
            {onProgressUpdate && (
              <button
                onClick={() => {
                  const newProgress = prompt('Enter new progress (0-100):', progress);
                  if (newProgress !== null) {
                    const numProgress = parseInt(newProgress);
                    if (!isNaN(numProgress) && numProgress >= 0 && numProgress <= 100) {
                      handleProgressUpdate(numProgress);
                    } else {
                      alert('Please enter a valid number between 0 and 100');
                    }
                  }
                }}
                disabled={isUpdatingProgress}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                title="Update Progress"
              >
                <TrendingUp className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            className={`bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out ${
              isUpdatingProgress ? 'animate-pulse' : ''
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoItem icon={Calendar} label="Start" value={formatDate(project.startDate)} />
        <InfoItem icon={Calendar} label="End" value={formatDate(project.endDate)} />
        {project.client && (
          <InfoItem icon={Users} label="Client" value={project.client} />
        )}
        {project.budget && (
          <InfoItem icon={DollarSign} label="Budget" value={`$${project.budget.toLocaleString()}`} />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;