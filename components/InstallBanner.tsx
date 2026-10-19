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
      const t = setTimeout(() => setVisible(true), 1200);
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
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm animate-slide-up">
      <div className="bg-bg border border-border rounded-2xl p-3 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <img src="/icon-192.png" alt="" className="w-11 h-11 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text leading-tight">Сөзділді басты экранға қос</p>
            <p className="text-xs text-muted leading-tight mt-0.5">Ертең жаңа сөзді бір түртумен аш</p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Баннерді жабу"
            className="h-9 px-3 rounded-full text-xs font-semibold text-muted hover:text-text transition"
          >
            Жабу
          </button>
          <button
            type="button"
            onClick={handleInstall}
            aria-label={isIOS ? 'Нұсқаулықты ашу' : 'Қолданбаны орнату'}
            className="h-9 px-4 rounded-full bg-ink text-on-ink text-xs font-semibold active:scale-95 transition"
          >
            {isIOS ? 'Қалай?' : 'Қосу'}
          </button>
        </div>

        {isIOS && showIosGuide && (
          <ol className="mt-3 pt-3 border-t border-border text-xs text-muted space-y-1.5 list-decimal list-inside">
            <li>Safari-дегі <b className="text-text">Бөлісу</b> батырмасын бас</li>
            <li><b className="text-text">Басты экранға қосу</b> таңда</li>
          </ol>
        )}
      </div>
    </div>
  );
};

export default InstallBanner;
