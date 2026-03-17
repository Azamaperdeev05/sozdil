import React from 'react';

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-[#121827]/95 border border-border text-text rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-zoom-in">
        {title && <h2 className="text-2xl font-bold font-display text-center mb-4">{title}</h2>}
        {onClose !== null && typeof onClose === 'function' && (
            <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-surface transition-colors" aria-label="Жабу">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        )}
        {children}
    </div>
    <style>{`
        @keyframes zoom-in {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in { animation: zoom-in 0.2s ease-out; }
    `}</style>
  </div>
);

export default Modal;
