/**
 * Firestore Service for Сөзділ Web
 *
 * Schema (Flutter-мен бірдей):
 *   users/{uid}/              → { displayName, photoUrl, updatedAt }
 *   users/{uid}/stats/{len}   → StatsData
 *   users/{uid}/history/{date}→ { "4": "won"|"lost", "5": ... }
 *   users/{uid}/gameState/{date}-{len} → { guesses, gameStatus, guessStatuses }
 */
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { StatsData, HistoryData } from '../types';

// ── Helpers ─────────────────────────────────────────────────────────────

const userDoc = (uid: string) => doc(db, 'users', uid);

// ── Profile ─────────────────────────────────────────────────────────────

export const saveProfile = async (
  uid: string,
  displayName: string,
  photoUrl: string | null,
) => {
  try {
    await setDoc(
      userDoc(uid),
      { displayName, photoUrl, updatedAt: serverTimestamp() },
      { merge: true },
    );
  } catch {
    /* silent */
  }
};

// ── Stats ───────────────────────────────────────────────────────────────

export const loadStats = async (
  uid: string,
  len: number,
): Promise<StatsData | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'stats', String(len)));
    if (!snap.exists()) return null;
    return snap.data() as StatsData;
  } catch {
    return null;
  }
};

export const saveStats = async (
  uid: string,
  len: number,
  stats: StatsData,
) => {
  try {
    await setDoc(doc(db, 'users', uid, 'stats', String(len)), stats);
  } catch {
    /* silent */
  }
};

// ── History ─────────────────────────────────────────────────────────────

/**
 * Firestore-дан барлық history жүктеу.
 * Формат Firestore-да: history/{date} → { "4": "won", "5": "lost" }
 * Веб-де (localStorage): { [wordLength]: { [date]: "WON" } }
 *
 * Бұл функция Firestore форматында қайтарады:
 * { [date]: { [len]: "won" } }
 */
export const loadHistoryRaw = async (
  uid: string,
): Promise<Record<string, Record<string, string>>> => {
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'history'));
    const result: Record<string, Record<string, string>> = {};
    snap.forEach((d) => {
      const data = d.data() as Record<string, string>;
      result[d.id] = data;
    });
    return result;
  } catch {
    return {};
  }
};

/**
 * Firestore history → веб HistoryData форматына айналдыру
 * Firestore: { "2024-01-15": { "4": "won" } }
 * Web:       { "4": { "2024-01-15": "WON" } }
 */
export const firestoreHistoryToWeb = (
  raw: Record<string, Record<string, string>>,
): HistoryData => {
  const result: HistoryData = {};
  for (const [date, lenMap] of Object.entries(raw)) {
    for (const [len, status] of Object.entries(lenMap)) {
      if (!result[len]) result[len] = {};
      result[len][date] = status.toUpperCase() as 'WON' | 'LOST';
    }
  }
  return result;
};

/**
 * Веб HistoryData → Firestore формат
 * Web:       { "4": { "2024-01-15": "WON" } }
 * Firestore: { "2024-01-15": { "4": "won" } }
 */
export const webHistoryToFirestore = (
  webHistory: HistoryData,
): Record<string, Record<string, string>> => {
  const result: Record<string, Record<string, string>> = {};
  for (const [len, dateMap] of Object.entries(webHistory)) {
    for (const [date, status] of Object.entries(dateMap)) {
      if (!result[date]) result[date] = {};
      result[date][len] = status.toLowerCase();
    }
  }
  return result;
};

export const saveHistoryDate = async (
  uid: string,
  date: string,
  len: number,
  result: string,
) => {
  try {
    await setDoc(
      doc(db, 'users', uid, 'history', date),
      { [String(len)]: result.toLowerCase() },
      { merge: true },
    );
  } catch {
    /* silent */
  }
};

// ── Game State ──────────────────────────────────────────────────────────

export const loadGameState = async (
  uid: string,
  date: string,
  len: number,
): Promise<Record<string, unknown> | null> => {
  try {
    const snap = await getDoc(
      doc(db, 'users', uid, 'gameState', `${date}-${len}`),
    );
    if (!snap.exists()) return null;
    return snap.data() as Record<string, unknown>;
  } catch {
    return null;
  }
};

export const saveGameState = async (
  uid: string,
  date: string,
  len: number,
  data: Record<string, unknown>,
) => {
  try {
    await setDoc(doc(db, 'users', uid, 'gameState', `${date}-${len}`), data);
  } catch {
    /* silent */
  }
};
