import React from 'react';
import { CloseCircle } from 'reicon-react';

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => {
  const titleId = title ? `modal-title-${title.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}` : undefined;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-label={!titleId ? 'Хабарлама терезесі' : undefined}
    >
      <div className="bg-[#121827]/95 border border-border text-text rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-zoom-in">
        {title && <h2 id={titleId} className="text-2xl font-bold font-display text-center mb-4">{title}</h2>}
        {onClose !== null && typeof onClose === 'function' && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-surface text-muted hover:text-text transition-colors"
            aria-label="Жабу"
          >
            <CloseCircle size={24} weight="Outline" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
