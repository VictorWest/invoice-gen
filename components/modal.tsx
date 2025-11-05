import React from 'react';

const Modal = ({ isOpen, onClose, children } : { isOpen: any, onClose: any, children: any }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white flex items-center w-full p-6 rounded-lg shadow-lg relative max-w-md mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;