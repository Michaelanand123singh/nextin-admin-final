import React from 'react';
import { STATUS_COLORS, PRIORITY_COLORS, getStatusIcon } from '../utils/projectUtils';

const ProjectStatusBadge = ({ status, priority, showIcon = true }) => {
  const statusColor = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  const priorityColor = PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-800';

  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
        {showIcon && <span className="mr-1">{getStatusIcon(status)}</span>}
        {status?.replace('_', ' ').toUpperCase()}
      </span>
      {priority && (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor}`}>
          {priority.toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default ProjectStatusBadge;