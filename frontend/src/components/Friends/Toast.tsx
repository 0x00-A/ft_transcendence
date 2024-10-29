import React, { useEffect, useState } from 'react';

const Toast = ({ 
  message, 
  type = 'success', 
  show, 
  onClose,
  duration = 3000 
}) => {
  const [progress, setProgress] = useState(100);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (show) {
      setProgress(100);
      setIsLeaving(false);
      
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.max(prev - 1, 0));
      }, duration / 100);

      // Start exit animation
      const exitTimer = setTimeout(() => {
        setIsLeaving(true);
      }, duration - 300);

      // Close toast
      const closeTimer = setTimeout(() => {
        onClose();
        setProgress(100);
        setIsLeaving(false);
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(exitTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`
      fixed top-6 right-6 z-50 min-w-[300px]
      transition-all duration-300 ease-in-out
      ${isLeaving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
    `}>
      <div className={`
        relative overflow-hidden
        rounded-lg shadow-lg bg-white
        ${type === 'success' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}
      `}>
        {/* Progress bar */}
        <div 
          className={`
            absolute bottom-0 left-0 h-1
            transition-all duration-100 ease-linear
            ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
          `}
          style={{ width: `${progress}%` }}
        />

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className={`
              rounded-full p-1
              ${type === 'success' ? 'text-green-500' : 'text-red-500'}
            `}>
              {type === 'success' ? '✓' : '✕'}
            </div>
            <p className="flex-1 text-gray-700 font-medium">{message}</p>
            <button 
              onClick={() => setIsLeaving(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;