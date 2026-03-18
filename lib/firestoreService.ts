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
  } catch (e) {
    console.error('[Firestore] saveProfile failed:', e);
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
    const raw = snap.data();
    // Firestore metadata-ны тазалау — тек StatsData fields
    return {
      gamesPlayed: raw.gamesPlayed ?? 0,
      wins: raw.wins ?? 0,
      currentStreak: raw.currentStreak ?? 0,
      maxStreak: raw.maxStreak ?? 0,
      guessDistribution: Array.isArray(raw.guessDistribution)
        ? raw.guessDistribution
        : Array(6).fill(0),
      lastGameDate: raw.lastGameDate,
      lastGameWordLength: raw.lastGameWordLength,
    };
  } catch (e) {
    console.error(`[Firestore] loadStats(${len}) failed:`, e);
    return null;
  }
};

export const saveStats = async (
  uid: string,
  len: number,
  stats: StatsData,
) => {
  try {
    await setDoc(doc(db, 'users', uid, 'stats', String(len)), {
      ...stats,
      updatedAt: serverTimestamp(),
    });
    console.log(`[Firestore] saveStats(${len}) OK:`, stats.gamesPlayed, 'games');
  } catch (e) {
    console.error(`[Firestore] saveStats(${len}) failed:`, e);
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
      // updatedAt сияқты metadata-ны алып тастау
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(data)) {
        if (['4', '5', '6'].includes(k)) clean[k] = v;
      }
      if (Object.keys(clean).length > 0) {
        result[d.id] = clean;
      }
    });
    return result;
  } catch (e) {
    console.error('[Firestore] loadHistoryRaw failed:', e);
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
      { [String(len)]: result.toLowerCase(), updatedAt: serverTimestamp() },
      { merge: true },
    );
    console.log(`[Firestore] saveHistory(${date}, ${len}): ${result}`);
  } catch (e) {
    console.error(`[Firestore] saveHistory(${date}, ${len}) failed:`, e);
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
  } catch (e) {
    console.error(`[Firestore] loadGameState(${date}-${len}) failed:`, e);
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
    await setDoc(
      doc(db, 'users', uid, 'gameState', `${date}-${len}`),
      { ...data, updatedAt: serverTimestamp() },
    );
  } catch (e) {
    console.error(`[Firestore] saveGameState(${date}-${len}) failed:`, e);
  }
};
