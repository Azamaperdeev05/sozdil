import React, { useEffect, useState } from 'react';
import { usePWAInstall } from '../lib/usePWAInstall';

const InstallBanner: React.FC = () => {
  const { canPrompt, promptInstall, installed, isIOS } = usePWAInstall();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (dismissed || installed) return;
    const alreadyDismissed = sessionStorage.getItem('sozdil-install-dismissed');
    if (alreadyDismissed) return;

    if (canPrompt || isIOS) {
      const t = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(t);
    }
  }, [canPrompt, isIOS, dismissed, installed]);

  const handleInstall = async () => {
    if (canPrompt) {
      await promptInstall();
      handleDismiss();
    } else if (isIOS) {
      setShowIosGuide(prev => !prev);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('sozdil-install-dismissed', '1');
  };

  if (!visible || installed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-[#141B2D] border border-border/90 rounded-2xl p-4 shadow-2xl shadow-black/80 flex flex-col gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* App icon */}
          <img
            src="/logo.jpg"
            alt="Сөзділ"
            className="w-12 h-12 rounded-xl flex-shrink-0 object-cover shadow"
          />

          {/* App info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text text-sm leading-tight flex items-center gap-1.5">
              <span>Сөзділ</span>
              <span className="text-[10px] bg-accent/20 text-accent font-semibold px-1.5 py-0.5 rounded">PWA</span>
            </p>
            <p className="text-muted text-xs mt-0.5 leading-tight">
              {isIOS
                ? 'Қолданбаны басты экранға қосу'
                : 'Күн сайын ойнау үшін қолданбаны орнатыңыз'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Баннерді жабу"
              className="px-2.5 py-1.5 text-xs font-medium text-muted rounded-lg hover:text-text hover:bg-surface transition-colors"
            >
              Жабу
            </button>
            <button
              type="button"
              onClick={handleInstall}
              aria-label={isIOS ? 'Нұсқаулықты ашу' : 'Қолданбаны орнату'}
              className="px-3.5 py-1.5 text-xs font-bold bg-accent text-white rounded-lg hover:bg-accent/90 active:scale-95 transition-all shadow-md"
            >
              {isIOS ? 'Қалай?' : 'Орнату'}
            </button>
          </div>
        </div>

        {/* iOS step-by-step tooltip */}
        {isIOS && showIosGuide && (
          <div className="pt-2 border-t border-border text-xs text-text space-y-1.5 animate-fadeIn">
            <p className="font-semibold text-accent">iPhone / iPad үшін:</p>
            <div className="flex items-center gap-2 text-muted">
              <span className="w-5 h-5 rounded-full bg-surface text-center font-bold text-text flex items-center justify-center text-[10px]">1</span>
              <span>Төмендегі <b>Бөлісу</b> (Share <span className="text-base">⎋</span>) батырмасын басыңыз</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <span className="w-5 h-5 rounded-full bg-surface text-center font-bold text-text flex items-center justify-center text-[10px]">2</span>
              <span><b>«На экран Домой»</b> / <b>«Басты экранға»</b> таңдаңыз</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallBanner;
