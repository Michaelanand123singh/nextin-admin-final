import React from 'react';
import { STATUS_COLORS, PRIORITY_COLORS, getStatusIcon } from '../utils/projectUtils';

const ProjectStatusBadge = ({ status, priority, showIcon = true, size = 'md', layout = 'horizontal' }) => {
  const statusColor = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  const priorityColor = PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-700 border-gray-200';
  
  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5', 
    lg: 'w-4 h-4'
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPriority = (priority) => {
    if (!priority) return '';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const StatusBadge = () => (
    <span className={`inline-flex items-center ${sizeClasses[size]} rounded-lg font-medium border transition-colors ${statusColor}`}>
      {showIcon && status && (
        <span className={`mr-1.5 ${iconSizes[size]} flex-shrink-0`}>
          {getStatusIcon(status)}
        </span>
      )}
      <span className="truncate">{formatStatus(status)}</span>
    </span>
  );

  const PriorityBadge = () => (
    priority && (
      <span className={`inline-flex items-center ${sizeClasses[size]} rounded-lg font-medium border transition-colors ${priorityColor}`}>
        <span className="truncate">{formatPriority(priority)}</span>
      </span>
    )
  );

  if (layout === 'vertical') {
    return (
      <div className="flex flex-col space-y-2">
        <StatusBadge />
        <PriorityBadge />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <StatusBadge />
      <PriorityBadge />
    </div>
  );
};

export default ProjectStatusBadge;