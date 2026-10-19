import React from 'react';

const Toast: React.FC<{ message: string }> = ({ message }) => (
  <div
    role="status"
    className="fixed top-[4.5rem] left-1/2 z-[100] w-max max-w-[min(22rem,calc(100vw-2rem))] px-4 py-2.5 rounded-2xl bg-ink text-on-ink text-sm font-semibold shadow-lg animate-fade-in-out text-center"
  >
    {message}
  </div>
);

export default Toast;
