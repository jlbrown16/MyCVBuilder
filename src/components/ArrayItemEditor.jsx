import React, { memo } from 'react';

const ArrayItemEditor = ({
  section,
  item,
  children,
  index,
  total,
  handleMove,
  handleRemoveSection,
}) => {
  const isMovable = total > 1;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div className="p-4 mb-4 border rounded-lg bg-gray-50 relative border-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-100">
      <div className="absolute top-2 right-2 flex space-x-1 z-10">
        {isMovable && (
          <>
            <button
              onClick={() => handleMove(section, item.id, 'down')}
              disabled={isLast}
              className={`text-gray-500 p-1 rounded-full text-lg leading-none transition duration-150 ${
                isLast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200 hover:text-gray-700'
              }`}
              title={`Move ${section.slice(0, -1)} Down`}
              aria-label={`Move item ${index + 1} down`}
            >
              <i className="fa-solid fa-circle-down text-lg"></i>
            </button>
            <button
              onClick={() => handleMove(section, item.id, 'up')}
              disabled={isFirst}
              className={`text-gray-500 p-1 rounded-full text-lg leading-none transition duration-150 ${
                isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200 hover:text-gray-700'
              }`}
              title={`Move ${section.slice(0, -1)} Up`}
              aria-label={`Move item ${index + 1} up`}
            >
              <i className="fa-solid fa-circle-up text-lg"></i>
            </button>
          </>
        )}
        <button
          onClick={() => handleRemoveSection(section, item.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded-full text-lg leading-none transition duration-150 hover:bg-red-100"
          title={`Remove ${section.slice(0, -1)}`}
          aria-label={`Remove item ${index + 1}`}
        >
          <i className="fa-solid fa-circle-xmark text-lg"></i>
        </button>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
};

export default memo(ArrayItemEditor);
