import React, { useState, useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); 
    const timer = setTimeout(() => {
      setVisible(false); 
      setTimeout(onClose, 500); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
        visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-4 opacity-0 scale-75'
      } ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      } text-white max-w-sm`}
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center space-x-2">
        <span className="flex-1">{message}</span>
        <button 
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
