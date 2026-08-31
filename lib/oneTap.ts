/**
 * Google One Tap Sign-In Service
 *
 * Сайтқа кірген бойда Google One Tap prompt шығады.
 * Пайдаланушы аккаунтын таңдаса — Firebase Auth-ке signIn жасайды.
 */
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseConfig';

const GOOGLE_CLIENT_ID =
  '209550891168-53fsr80ooigdg6clcl2j2vfo1654r3t1.apps.googleusercontent.com';

// One Tap уже көрсетілді ме
let oneTapShown = false;

/**
 * Google Identity Services типтері
 */
interface CredentialResponse {
  credential: string;
  select_by: string;
  client_id: string;
}

interface GoogleAccounts {
  id: {
    initialize: (config: {
      client_id: string;
      callback: (response: CredentialResponse) => void;
      auto_select?: boolean;
      cancel_on_tap_outside?: boolean;
      context?: string;
      itp_support?: boolean;
      use_fedcm_for_prompt?: boolean;
    }) => void;
    prompt: (callback?: (notification: {
      isNotDisplayed: () => boolean;
      isSkippedMoment: () => boolean;
      isDismissedMoment: () => boolean;
      getNotDisplayedReason: () => string;
      getSkippedReason: () => string;
      getDismissedReason: () => string;
    }) => void) => void;
    cancel: () => void;
  };
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

/**
 * One Tap credential-ды Firebase Auth-ке айналдыру
 */
async function handleOneTapCredential(response: CredentialResponse) {
  try {
    const credential = GoogleAuthProvider.credential(response.credential);
    const userCredential = await signInWithCredential(auth, credential);
    console.log('[OneTap] Sign-in OK:', userCredential.user.displayName);
  } catch (e) {
    console.error('[OneTap] Sign-in failed:', e);
  }
}

function loadGsiScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve) => {
    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
}

/**
 * Google One Tap prompt-ын іске қосу.
 * Тек бір рет көрсетеді (session ішінде).
 * Пайдаланушы кірген болса — көрсетпейді.
 */
export function initOneTap() {
  // Әлдеқашан кірген болса — One Tap қажет емес
  if (auth.currentUser) return;
  if (oneTapShown) return;

  const scheduleInit = () => {
    loadGsiScript().then(() => {
      if (!window.google?.accounts?.id || auth.currentUser || oneTapShown) return;
      oneTapShown = true;

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleOneTapCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signin',
          itp_support: true,
          use_fedcm_for_prompt: false,
        });

        window.google.accounts.id.prompt();
      } catch {
        // silent catch
      }
    });
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(scheduleInit, { timeout: 3500 });
  } else {
    setTimeout(scheduleInit, 2500);
  }
}

/**
 * One Tap prompt-ын болдырмау (кірген кезде)
 */
export function cancelOneTap() {
  try {
    window.google?.accounts?.id?.cancel();
  } catch {
    // silent
  }
}
