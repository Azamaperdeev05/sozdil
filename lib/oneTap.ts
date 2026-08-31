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

/**
 * Google One Tap prompt-ын іске қосу.
 * Тек бір рет көрсетеді (session ішінде).
 * Пайдаланушы кірген болса — көрсетпейді.
 */
export function initOneTap() {
  // Әлдеқашан кірген болса — One Tap қажет емес
  if (auth.currentUser) return;
  if (oneTapShown) return;

  // GIS script жүктелгенше күту
  const tryInit = () => {
    if (!window.google?.accounts?.id) {
      // Script жүктелмеген — тағы тексеру
      setTimeout(tryInit, 500);
      return;
    }

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

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          // silent in production
        } else if (notification.isSkippedMoment()) {
          // silent
        } else if (notification.isDismissedMoment()) {
          // silent
        }
      });
    } catch {
      // silent catch for environments where GIS / FedCM is not supported
    }
  };

  // Аз кідіріс — page load-тан кейін
  setTimeout(tryInit, 1000);
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
