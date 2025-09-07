import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';

const Table = ({ 
  data = [], 
  columns = [], 
  onEdit, 
  onDelete, 
  onView,
  loading = false,
  emptyMessage = "No data available"
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-14 bg-gray-100"></div>
          {Array(4).fill().map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 border-t border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-gray-300 text-2xl mb-3">📊</div>
        <p className="text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  // Action buttons component
  const ActionButtons = ({ row }) => (
    <div className="flex items-center justify-end gap-1">
      {onView && (
        <button
          onClick={() => onView(row)}
          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          title="View details"
        >
          <Eye size={16} />
        </button>
      )}
      {onEdit && (
        <button
          onClick={() => onEdit(row)}
          className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
          title="Edit record"
        >
          <Edit2 size={16} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(row._id || row.id)}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete record"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {col.label || col.header}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={row._id || row.id || i} className="hover:bg-gray-50/50 transition-colors">
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4 text-sm text-gray-900">
                    {col.render ? col.render(row) : (row[col.key] || '—')}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <ActionButtons row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;