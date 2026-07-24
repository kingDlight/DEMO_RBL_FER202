import React from 'react';
import { useToast, type ToastType } from '../context/ToastContext';

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'check_circle';
    case 'error':
      return 'error';
    case 'info':
    default:
      return 'info';
  }
};

const getColorClass = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'error':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'info':
    default:
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  }
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-24 right-container-margin-mobile z-[100] flex flex-col gap-sm md:right-container-margin-desktop md:bottom-28">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-sm rounded-xl border p-md shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-right-8 fade-in ${getColorClass(
            toast.type
          )}`}
          role="alert"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {getIcon(toast.type)}
          </span>
          <span className="font-label-md text-on-surface">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-md rounded-full p-xs hover:bg-on-surface/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
