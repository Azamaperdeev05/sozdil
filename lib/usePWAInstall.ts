import { useEffect, useMemo, useState } from 'react';

// Minimal event typing for beforeinstallprompt
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in (window as any));
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  // iOS Safari provides navigator.standalone
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iosStandalone = (navigator as any).standalone === true;
  const mediaStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  return iosStandalone || mediaStandalone;
}

export function usePWAInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && (window as any).__deferredPrompt) {
      return (window as any).__deferredPrompt as BeforeInstallPromptEvent;
    }
    return null;
  });
  const [installed, setInstalled] = useState<boolean>(isStandalone());

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      const ev = e as BeforeInstallPromptEvent;
      setDeferred(ev);
      if (typeof window !== 'undefined') {
        (window as any).__deferredPrompt = ev;
      }
    }

    function onPromptReady() {
      if (typeof window !== 'undefined' && (window as any).__deferredPrompt) {
        setDeferred((window as any).__deferredPrompt as BeforeInstallPromptEvent);
      }
    }

    function onAppInstalled() {
      setInstalled(true);
      setDeferred(null);
      if (typeof window !== 'undefined') {
        (window as any).__deferredPrompt = null;
      }
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('pwa-prompt-ready', onPromptReady);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-ready', onPromptReady);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const canPrompt = useMemo(() => !!deferred && !installed, [deferred, installed]);

  async function promptInstall() {
    if (!deferred) return { outcome: 'dismissed' as const };

    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferred(null);
        if (typeof window !== 'undefined') {
          (window as any).__deferredPrompt = null;
        }
      }
      return choice;
    } catch {
      return { outcome: 'dismissed' as const, platform: 'error' } as const;
    }
  }

  return {
    installed,
    canPrompt,
    isIOS: isIOS(),
    promptInstall,
  };
}
