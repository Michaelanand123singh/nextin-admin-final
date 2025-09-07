import React from 'react';

const FormField = ({ field, value, onChange }) => {
  const { name, label, type, required, placeholder, options, rows } = field;
  
  const baseClassName = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      {type === 'select' ? (
        <select
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClassName}
        >
          {options.map(({ value: optValue, label: optLabel }) => (
            <option key={optValue} value={optValue}>{optLabel}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          required={required}
          rows={rows || 3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClassName}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClassName}
        />
      )}
    </div>
  );
};

export default FormField;