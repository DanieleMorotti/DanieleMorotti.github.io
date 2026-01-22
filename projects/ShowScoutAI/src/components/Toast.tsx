import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-green-600/90 border-green-500',
    info: 'bg-brand-600/90 border-brand-500',
    error: 'bg-red-600/90 border-red-500',
  };

  return (
    <div 
      className={`
        fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white text-sm font-medium shadow-xl border backdrop-blur-sm transition-all duration-300 transform
        ${bgColors[type]}
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
    >
      {message}
    </div>
  );
};

export default Toast;