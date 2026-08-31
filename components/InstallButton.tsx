import React, { useState } from 'react';
import { usePWAInstall } from '../lib/usePWAInstall';

const InstallButton: React.FC<{ className?: string; label?: string }> = ({ className = '', label = 'Орнату' }) => {
  const { canPrompt, promptInstall, installed, isIOS } = usePWAInstall();
  const [showHelp, setShowHelp] = useState(false);

  if (installed) return null;

  const handleClick = async () => {
    if (canPrompt) {
      await promptInstall();
      return;
    }
    // Show quick help if prompt is not available
    setShowHelp(true);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className={`p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface transition-colors ${className}`}
        title={label}
        aria-label={label}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12" />
          <path d="m8 11 4 4 4-4" />
          <path d="M20 21H4" />
        </svg>
      </button>

      {showHelp && (
        <div className="absolute right-0 mt-2 w-72 z-50">
          <div className="bg-[#121827]/95 border border-border rounded-xl p-3 text-sm text-text shadow-xl">
            <div className="flex justify-between items-center mb-1">
              <div className="font-semibold">Қолмен орнату</div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                aria-label="Жабу"
                className="text-muted hover:text-text p-1 min-w-[28px] min-h-[28px] flex items-center justify-center"
              >
                ×
              </button>
            </div>
            {isIOS ? (
              <p>
                iPhone/iPad: Браузердегі Share (бөлісу) батырмасын басып, «Add to Home Screen» таңдаңыз.
              </p>
            ) : (
              <p>
                ДК/Android: Браузер мәзірінен «Install app/Қолданбаны орнату» не «Save site as app» таңдаңыз.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallButton;
