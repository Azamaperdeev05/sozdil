import React from 'react';
import { Xmark } from 'reicon-react';

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => {
  const titleId = title ? `modal-title-${title.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}` : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--scrim)] sm:p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-label={!titleId ? 'Хабарлама терезесі' : undefined}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full sm:max-w-md max-h-[92svh] overflow-y-auto bg-bg text-text border border-border rounded-t-3xl sm:rounded-3xl shadow-[0_24px_64px_-16px_rgba(0,0,0,0.35)] px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] animate-zoom-in">
        <div className="sm:hidden mx-auto -mt-2 mb-3 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
        {title && (
          <h2 id={titleId} className="text-lg font-bold text-center mb-4 px-8">
            {title}
          </h2>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center rounded-full text-muted hover:text-text hover:bg-surface active:scale-95 transition"
          aria-label="Жабу"
        >
          <Xmark size={20} weight="Outline" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
