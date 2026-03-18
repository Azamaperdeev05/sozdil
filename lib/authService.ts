import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from './firebaseConfig';

export type { User };

/**
 * Google Sign-In — popup жұмыс істемесе redirect-ке ауысады.
 * Mobile browser-лерде popup көбінесе блокталады.
 */
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    // Popup блокталғанда немесе жабылғанда → redirect-ке ауысу
    if (
      err?.code === 'auth/popup-blocked' ||
      err?.code === 'auth/popup-closed-by-user' ||
      err?.code === 'auth/cancelled-popup-request'
    ) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null; // redirect-тен кейін page reload болады
      } catch {
        return null;
      }
    }
    console.error('Google Sign-In error:', err?.code, err?.message);
    return null;
  }
};

/**
 * Redirect-тен қайтқанда нәтижені тексеру.
 * App жүктелгенде бір рет шақыру керек.
 */
export const checkRedirectResult = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch {
    return null;
  }
};

export const signOut = (): Promise<void> => firebaseSignOut(auth);

export const getCurrentUser = (): User | null => auth.currentUser;

export const onAuthChange = (cb: (user: User | null) => void) =>
  onAuthStateChanged(auth, cb);
