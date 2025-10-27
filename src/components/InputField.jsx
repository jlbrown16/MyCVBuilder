import React from 'react';

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  colorPrefix,
  isInvalid = false,
  validationMessage = '',
}) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border rounded-lg transition duration-150 ease-in-out ${
        isInvalid
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
          : `border-gray-300 focus:ring-${colorPrefix}-500 focus:border-${colorPrefix}-500`
      }`}
    />
    {isInvalid && validationMessage && (
      <p className="mt-1 text-xs text-red-500 font-medium">{validationMessage}</p>
    )}
  </div>
);

export default InputField;
