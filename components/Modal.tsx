import React from 'react';
import { CloseCircle } from 'reicon-react';

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => {
  const titleId = title ? `modal-title-${title.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}` : undefined;

  return (
    <div
      className="fixed inset-0 bg-black/65 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-label={!titleId ? 'Хабарлама терезесі' : undefined}
    >
      <div className="bg-[#111726]/95 border border-white/10 text-text rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_30px_rgba(108,71,255,0.08)] w-full max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-5 relative animate-zoom-in">
        {title && <h2 id={titleId} className="text-xl sm:text-2xl font-bold font-display text-center mb-4">{title}</h2>}
        {onClose !== null && typeof onClose === 'function' && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-muted hover:text-text transition-all border border-white/5 active:scale-90 z-10 cursor-pointer"
            aria-label="Жабу"
          >
            <CloseCircle size={22} weight="Outline" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
