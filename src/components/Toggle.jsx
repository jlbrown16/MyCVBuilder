import React from 'react';

const Toggle = ({ label, name, checked, onChange, colorPrefix }) => (
  <div className={`flex items-center justify-between w-full mb-3 p-3 bg-${colorPrefix}-50 rounded-lg`}>
    <label htmlFor={name} className="text-sm font-medium text-gray-700 select-none">
      {label}
    </label>
    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={checked}
        onChange={onChange}
        className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer ${
          checked ? `transform translate-x-full border-${colorPrefix}-600` : 'border-gray-300'
        }`}
        style={{
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
      />
      <label
        htmlFor={name}
        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
          checked ? `bg-${colorPrefix}-600` : 'bg-gray-300'
        }`}
      ></label>
    </div>
  </div>
);

export default Toggle;
