import React from 'react';

const Toast: React.FC<{ message: string }> = ({ message }) => (
  <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-surface text-text px-6 py-3 rounded-2xl shadow-lg border border-border font-semibold animate-fade-in-out z-[100]">
    {message}
  </div>
);

export default Toast;
