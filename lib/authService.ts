import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from './firebaseConfig';

export type { User };

export const signInWithGoogle = (): Promise<User | null> =>
  signInWithPopup(auth, googleProvider).then((r) => r.user).catch(() => null);

export const signOut = (): Promise<void> => firebaseSignOut(auth);

export const getCurrentUser = (): User | null => auth.currentUser;

export const onAuthChange = (cb: (user: User | null) => void) =>
  onAuthStateChanged(auth, cb);
