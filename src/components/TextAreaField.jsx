import React from 'react';

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  rows = 3,
  placeholder = '',
  colorPrefix,
}) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-${colorPrefix}-500 focus:border-${colorPrefix}-500 transition duration-150 ease-in-out`}
    />
  </div>
);

export default TextAreaField;
