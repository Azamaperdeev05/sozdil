import React, { useEffect, useState } from 'react';
import { usePWAInstall } from '../lib/usePWAInstall';

const InstallBanner: React.FC = () => {
  const { canPrompt, promptInstall, installed, isIOS } = usePWAInstall();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show banner 2s after page load, once per session
  useEffect(() => {
    if (dismissed || installed) return;
    const alreadyDismissed = sessionStorage.getItem('sozdil-install-dismissed');
    if (alreadyDismissed) return;

    if (canPrompt || isIOS) {
      const t = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(t);
    }
  }, [canPrompt, isIOS, dismissed, installed]);

  const handleInstall = async () => {
    if (canPrompt) {
      await promptInstall();
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('sozdil-install-dismissed', '1');
  };

  if (!visible || installed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm animate-slide-up">
      <div className="bg-[#141B2D] border border-border rounded-2xl p-4 shadow-2xl shadow-black/60 flex items-center gap-3">
        {/* App icon */}
        <img
          src="/logo.jpg"
          alt="Сөзділ"
          className="w-12 h-12 rounded-xl flex-shrink-0 object-cover"
        />

        {/* App info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text text-sm leading-tight">Сөзділ</p>
          <p className="text-muted text-xs mt-0.5 leading-tight">
            {isIOS
              ? 'Share → «Add to Home Screen»'
              : 'Қолданбаны телефонға орнат'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Баннерді жабу"
            className="px-3 py-1.5 text-xs font-medium text-muted rounded-lg hover:text-text hover:bg-surface transition-colors"
          >
            Артқа
          </button>
          {!isIOS && (
            <button
              type="button"
              onClick={handleInstall}
              aria-label="Қолданбаны орнату"
              className="px-4 py-1.5 text-xs font-semibold bg-accent text-white rounded-lg hover:bg-accent/90 active:scale-95 transition-all"
            >
              Орнату
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
