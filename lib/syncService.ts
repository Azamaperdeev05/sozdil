/**
 * Sync Service — localStorage ↔ Firestore синхрондау
 *
 * Flutter-дағы smart merge логикасын қайталайды:
 * - Stats merge: max(local, remote) per field; streak from latest date
 * - History merge: union; "won" always beats "lost" for same key
 * - Game state: loads local first, Firestore in background
 * - Guard: never overwrites completed game with old state
 */
import { MAX_GUESSES } from '../constants';
import type { StatsData, HistoryData } from '../types';
import type { User } from './authService';
import {
  loadStats,
  saveStats,
  loadHistoryRaw,
  firestoreHistoryToWeb,
  webHistoryToFirestore,
  saveProfile,
  loadGameState,
  saveGameState,
  saveHistoryDate,
} from './firestoreService';

// ── localStorage helpers (existing key format) ──────────────────────────

const DEFAULT_STATS = (): StatsData => ({
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: Array(MAX_GUESSES).fill(0),
});

const safeParseJson = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const loadLocalStats = (len: number): StatsData => {
  const stats = safeParseJson<Partial<StatsData>>(
    localStorage.getItem(`sozdil-stats-${len}`),
    DEFAULT_STATS(),
  );
  return {
    ...DEFAULT_STATS(),
    ...stats,
    guessDistribution: Array.isArray(stats.guessDistribution)
      ? stats.guessDistribution.slice(0, MAX_GUESSES)
      : Array(MAX_GUESSES).fill(0),
  };
};

const loadLocalHistory = (): HistoryData =>
  safeParseJson<HistoryData>(localStorage.getItem('sozdil-history'), {});

// ── Stats Merge ─────────────────────────────────────────────────────────

/**
 * Smart merge for stats — Flutter логикасын қайталайды:
 * max(local, remote) per field
 */
const mergeStats = (local: StatsData, remote: StatsData): StatsData => {
  const gamesPlayed = Math.max(local.gamesPlayed, remote.gamesPlayed);
  const wins = Math.max(local.wins, remote.wins);
  const maxStreak = Math.max(local.maxStreak, remote.maxStreak);

  // currentStreak: ең соңғы ойнаған жақтан алу
  const localDate = local.lastGameDate ?? '';
  const remoteDate = remote.lastGameDate ?? '';
  const currentStreak =
    localDate >= remoteDate ? local.currentStreak : remote.currentStreak;

  // guessDistribution: элементтерден max
  const guessDistribution = Array(MAX_GUESSES)
    .fill(0)
    .map((_, i) => {
      const l = local.guessDistribution?.[i] ?? 0;
      const r = remote.guessDistribution?.[i] ?? 0;
      return Math.max(l, r);
    });

  const lastGameDate = localDate >= remoteDate ? localDate : remoteDate;
  const lastGameWordLength =
    localDate >= remoteDate
      ? local.lastGameWordLength
      : remote.lastGameWordLength;

  return {
    gamesPlayed,
    wins,
    currentStreak,
    maxStreak,
    guessDistribution,
    lastGameDate: lastGameDate || undefined,
    lastGameWordLength,
  };
};

// ── History Merge ───────────────────────────────────────────────────────

/**
 * History merge — union; "WON" beats "LOST"
 */
const mergeHistory = (
  local: HistoryData,
  remote: HistoryData,
): HistoryData => {
  const merged: HistoryData = {};

  // Барлық key жинау
  const allLengths = new Set([
    ...Object.keys(local),
    ...Object.keys(remote),
  ]);

  for (const len of allLengths) {
    merged[len] = {};
    const localDates = local[len] ?? {};
    const remoteDates = remote[len] ?? {};
    const allDates = new Set([
      ...Object.keys(localDates),
      ...Object.keys(remoteDates),
    ]);

    for (const date of allDates) {
      const l = localDates[date];
      const r = remoteDates[date];

      if (l && r) {
        // "WON" always beats "LOST"
        merged[len][date] = l === 'WON' || r === 'WON' ? 'WON' : 'LOST';
      } else {
        merged[len][date] = (l || r) as 'WON' | 'LOST';
      }
    }
  }

  return merged;
};

// ── Main Sync ───────────────────────────────────────────────────────────

/**
 * Кіру кезінде толық синхрондау:
 * 1. Profile сақтау
 * 2. Stats merge (4, 5, 6)
 * 3. History merge
 */
export const syncOnSignIn = async (
  user: User,
): Promise<{
  mergedStats: Record<number, StatsData>;
  mergedHistory: HistoryData;
}> => {
  // 1. Profile
  await saveProfile(user.uid, user.displayName ?? 'Ойыншы', user.photoURL);

  // 2. Stats merge — барлық ұзындықтар
  const mergedStats: Record<number, StatsData> = {};
  for (const len of [4, 5, 6]) {
    const local = loadLocalStats(len);
    const remote = await loadStats(user.uid, len);
    const merged = remote ? mergeStats(local, remote) : local;
    mergedStats[len] = merged;

    // localStorage жаңарту
    localStorage.setItem(`sozdil-stats-${len}`, JSON.stringify(merged));

    // Firestore жаңарту (merged деректер remote-тан ерекшеленгенде)
    if (!remote || JSON.stringify(merged) !== JSON.stringify(remote)) {
      await saveStats(user.uid, len, merged);
    }
  }

  // 3. History merge
  const localHistory = loadLocalHistory();
  const remoteHistoryRaw = await loadHistoryRaw(user.uid);
  const remoteHistory = firestoreHistoryToWeb(remoteHistoryRaw);
  const mergedHistory = mergeHistory(localHistory, remoteHistory);

  // localStorage жаңарту
  localStorage.setItem('sozdil-history', JSON.stringify(mergedHistory));

  // Firestore-ға жіберу (жаңа деректер болса)
  const mergedFirestore = webHistoryToFirestore(mergedHistory);
  for (const [date, lenMap] of Object.entries(mergedFirestore)) {
    const existing = remoteHistoryRaw[date];
    if (!existing || JSON.stringify(lenMap) !== JSON.stringify(existing)) {
      for (const [len, status] of Object.entries(lenMap)) {
        await saveHistoryDate(user.uid, date, parseInt(len), status);
      }
    }
  }

  return { mergedStats, mergedHistory };
};

// ── Game State Sync ─────────────────────────────────────────────────────

/**
 * Ойын күйін Firestore-дан жүктеп, local-мен салыстыру.
 * Guard: аяқталған ойынды (won/lost) ескі деректермен қайта жазбайды.
 */
export const syncGameState = async (
  uid: string,
  date: string,
  len: number,
): Promise<{
  guesses: string[];
  gameStatus: string;
  guessStatuses: string[][];
} | null> => {
  const localKey = `sozdil-gameState-${date}-${len}`;
  const localData = safeParseJson<{
    guesses?: string[];
    gameStatus?: string;
    guessStatuses?: string[][];
  } | null>(localStorage.getItem(localKey), null);

  const remoteData = await loadGameState(uid, date, len);

  // Деректер жоқ болса
  if (!localData && !remoteData) return null;

  // Тек local бар
  if (localData && !remoteData) {
    // Firestore-ға жүктеу
    await saveGameState(uid, date, len, localData as Record<string, unknown>);
    return localData as {
      guesses: string[];
      gameStatus: string;
      guessStatuses: string[][];
    };
  }

  // Тек remote бар
  if (!localData && remoteData) {
    localStorage.setItem(localKey, JSON.stringify(remoteData));
    return remoteData as {
      guesses: string[];
      gameStatus: string;
      guessStatuses: string[][];
    };
  }

  // Екеуі де бар — guard logic
  const localStatus = localData!.gameStatus;
  const remoteStatus = (remoteData as Record<string, unknown>).gameStatus;
  const localGuesses = localData!.guesses ?? [];
  const remoteGuesses = ((remoteData as Record<string, unknown>).guesses ?? []) as string[];

  // Аяқталған ойынды ескімен жазбау
  if (
    (remoteStatus === 'WON' || remoteStatus === 'LOST' ||
     remoteStatus === 'won' || remoteStatus === 'lost') &&
    (localStatus === 'PLAYING' || localStatus === 'playing')
  ) {
    // Remote аяқталған, local ойнап жатыр — remote-ты алу
    localStorage.setItem(localKey, JSON.stringify(remoteData));
    return remoteData as {
      guesses: string[];
      gameStatus: string;
      guessStatuses: string[][];
    };
  }

  if (
    (localStatus === 'WON' || localStatus === 'LOST' ||
     localStatus === 'won' || localStatus === 'lost') &&
    (remoteStatus === 'PLAYING' || remoteStatus === 'playing')
  ) {
    // Local аяқталған, remote ойнап жатыр — local-ды алу
    await saveGameState(uid, date, len, localData as Record<string, unknown>);
    return localData as {
      guesses: string[];
      gameStatus: string;
      guessStatuses: string[][];
    };
  }

  // Екеуі де playing — көбірек guess бар жақты алу
  if (localGuesses.length >= remoteGuesses.length) {
    await saveGameState(uid, date, len, localData as Record<string, unknown>);
    return localData as {
      guesses: string[];
      gameStatus: string;
      guessStatuses: string[][];
    };
  } else {
    localStorage.setItem(localKey, JSON.stringify(remoteData));
    return remoteData as {
      guesses: string[];
      gameStatus: string;
      guessStatuses: string[][];
    };
  }
};

// ── Save helpers (ойын барысында шақыру) ────────────────────────────────

/**
 * Stats-ты localStorage + Firestore-ға бір уақытта сақтау
 */
export const persistStats = (
  uid: string | null,
  len: number,
  stats: StatsData,
) => {
  localStorage.setItem(`sozdil-stats-${len}`, JSON.stringify(stats));
  if (uid) {
    saveStats(uid, len, stats).catch((e) =>
      console.error('[Sync] persistStats failed:', e),
    );
  }
};

/**
 * History-ді localStorage + Firestore-ға сақтау
 */
export const persistHistory = (
  uid: string | null,
  history: HistoryData,
  date: string,
  len: number,
  result: 'WON' | 'LOST',
) => {
  localStorage.setItem('sozdil-history', JSON.stringify(history));
  if (uid) {
    saveHistoryDate(uid, date, len, result).catch((e) =>
      console.error('[Sync] persistHistory failed:', e),
    );
  }
};

/**
 * Game state-ті localStorage + Firestore-ға сақтау
 */
export const persistGameState = (
  uid: string | null,
  date: string,
  len: number,
  data: Record<string, unknown>,
) => {
  localStorage.setItem(
    `sozdil-gameState-${date}-${len}`,
    JSON.stringify(data),
  );
  if (uid) {
    saveGameState(uid, date, len, data).catch((e) =>
      console.error('[Sync] persistGameState failed:', e),
    );
  }
};
