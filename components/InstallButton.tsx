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
        className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-surface text-muted hover:text-text transition-colors active:scale-95 ${className}`}
        title={label}
        aria-label={label}
      >
        <Download size={22} weight="Outline" />
      </button>

      {showHelp && (
        <div className="absolute right-0 mt-2 w-80 z-50">
          <div className="bg-[#121827]/98 border border-border rounded-2xl p-4 text-sm text-text shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-border/60">
              <div className="font-semibold text-text flex items-center gap-1.5">
                <span>Қолданбаны орнату</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                aria-label="Жабу"
                className="text-muted hover:text-text p-1 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
              >
                <CloseCircle size={18} weight="Outline" />
              </button>
            </div>
            {isIOS ? (
              <p className="text-xs text-muted leading-relaxed">
                <span className="text-text font-medium">iPhone / iPad:</span> Safari браузеріндегі «Бөлісу» (Share) батырмасын басып, «Басты экранға қосу» (Add to Home Screen) таңдаңыз.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted leading-relaxed">
                  <span className="text-text font-medium">Google Chrome / ДК:</span> Браузер мәзірінен (жоғарғы оң жақтағы үш нүкте ⋮ немесе мекенжай жолағындағы ⊕ белгішесінен) <span className="text-accent font-medium">«Қолданбаны орнату»</span> (Install app) таңдаңыз.
                </p>
                <div className="pt-2 border-t border-border/60">
                  <a
                    href="https://github.com/Azamaperdeev05/sozdil/releases/tag/v2.0.0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-surface hover:bg-surface/80 border border-border rounded-xl text-xs font-medium text-text transition-colors"
                  >
                    <span>📱 Android APK жүктеу (v2.0)</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallButton;
