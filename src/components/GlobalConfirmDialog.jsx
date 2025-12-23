import React, { useState, useEffect } from 'react';

const GlobalConfirmDialog = () => {
  const [config, setConfig] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleShow = (event) => {
      setConfig(event.detail);
      setVisible(true);
    };

    window.addEventListener('show-confirm-dialog', handleShow);
    return () => window.removeEventListener('show-confirm-dialog', handleShow);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setConfig(null), 300); // Wait for animation
  };

  const handleConfirm = () => {
    if (config?.onConfirm) config.onConfirm();
    handleClose();
  };

  if (!config) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white rounded-xl shadow-2xl p-6 min-w-[320px] max-w-sm transform transition-all duration-300 ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="font-medium text-slate-800 text-lg mb-4 text-center">
          {config.message}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            {config.cancelText || 'Cancel'}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${
              config.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {config.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalConfirmDialog;
