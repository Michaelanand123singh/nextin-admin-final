export const PROJECT_STATUSES = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold'
};

export const PROJECT_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const STATUS_COLORS = {
  [PROJECT_STATUSES.UPCOMING]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUSES.ONGOING]: 'bg-yellow-100 text-yellow-800',
  [PROJECT_STATUSES.COMPLETED]: 'bg-green-100 text-green-800',
  [PROJECT_STATUSES.ON_HOLD]: 'bg-red-100 text-red-800'
};

export const PRIORITY_COLORS = {
  [PROJECT_PRIORITIES.LOW]: 'bg-gray-100 text-gray-800',
  [PROJECT_PRIORITIES.MEDIUM]: 'bg-blue-100 text-blue-800',
  [PROJECT_PRIORITIES.HIGH]: 'bg-orange-100 text-orange-800',
  [PROJECT_PRIORITIES.CRITICAL]: 'bg-red-100 text-red-800'
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateProgress = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (now < start) return 0;
  if (now > end) return 100;
  
  const total = end - start;
  const elapsed = now - start;
  
  return Math.round((elapsed / total) * 100);
};

export const getStatusIcon = (status) => {
  switch (status) {
    case PROJECT_STATUSES.UPCOMING:
      return '🔜';
    case PROJECT_STATUSES.ONGOING:
      return '🔄';
    case PROJECT_STATUSES.COMPLETED:
      return '✅';
    case PROJECT_STATUSES.ON_HOLD:
      return '⏸️';
    default:
      return '📋';
  }
};