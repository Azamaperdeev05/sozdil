import React, { useState } from 'react';
import { Download, CloseCircle } from 'reicon-react';
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
        className={`p-1.5 sm:p-2 min-w-[36px] sm:min-w-[40px] min-h-[36px] sm:min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface text-muted hover:text-text transition-colors ${className}`}
        title={label}
        aria-label={label}
      >
        <Download size={20} weight="Outline" />
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
                <CloseCircle size={18} weight="Outline" />
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
