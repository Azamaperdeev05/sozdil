import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAzDleT3NyhfytFBXYL0z-q6iOrnWnBKjE',
  authDomain: 'sozdilkz.firebaseapp.com',
  projectId: 'sozdilkz',
  storageBucket: 'sozdilkz.firebasestorage.app',
  messagingSenderId: '209550891168',
  appId: '1:209550891168:web:83eb0d92a985afde0691c5',
  measurementId: 'G-CCQMLW3C7L',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
