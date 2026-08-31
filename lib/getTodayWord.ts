// Utilities for daily word selection with timezone-safe day alignment.
// Includes optional stable schedule (Base64 JSON) and deterministic fallback.

import { getGameDateString, getGameDayIndex as getGameDayIndexFromDate } from './gameTime';

export function getGameDayIndex(nowMs = Date.now()): number {
  return getGameDayIndexFromDate(new Date(nowMs));
}

export function getIsoDateAlmaty(nowMs = Date.now()): string {
  return getGameDateString(new Date(nowMs));
}

type StableScheduleRow = {
  w4?: string;
  w5?: string;
  w6?: string;
  4?: string;
  5?: string;
  6?: string;
};

export type StableSchedule = Record<string, StableScheduleRow>;

function normalizeScheduleRow(row: StableScheduleRow): { w4?: string; w5?: string; w6?: string } {
  return {
    w4: row.w4 ?? row[4],
    w5: row.w5 ?? row[5],
    w6: row.w6 ?? row[6],
  };
}

export function decodeStableSchedule(b64: string): StableSchedule {
  if (!b64 || !b64.trim()) return {};
  const normalizedBase64 = b64.replace(/\s+/g, '');
  try {
    const g: any = (typeof globalThis !== 'undefined') ? (globalThis as any) : {};
    let json = '';

    if (typeof g.atob === 'function') {
      const binaryString = g.atob(normalizedBase64);
      const bytes = Uint8Array.from(binaryString, (char: string) => char.charCodeAt(0));
      json = new TextDecoder().decode(bytes);
    } else if (g.Buffer && typeof g.Buffer.from === 'function') {
      json = g.Buffer.from(normalizedBase64, 'base64').toString('utf-8');
    }

    if (!json) {
      return {};
    }

    const parsed = JSON.parse(json) as StableSchedule;

    return Object.fromEntries(
      Object.entries(parsed).map(([dateISO, row]) => [dateISO, normalizeScheduleRow(row)])
    );
  } catch {
    return {};
  }
}

// ---- Kazakh language filters ----
const KZ_WHITELIST = new Set(
  Array.from('АӘБВГҒДЕЁЖЗИЙКҚЛМНҢОӨПРСТУҰҮФХҺЦЧШЩЪЫІЬЭЮЯ' +
             'аәбвгғдеёжзийкқлмнңоөпрстуұүфхһцчшщъыіьэюя' +
             'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
);

const FORBIDDEN = /[фцяёъьэю]/i;

const BACK = new Set(['а','о','ұ','ы','қ','ғ','һ']);
const FRONT = new Set(['ә','ө','ү','і','е','и','й']);

function isHarmonious(word: string): boolean {
  let hasBack = false, hasFront = false;
  for (const ch of word.toLowerCase()) {
    if (BACK.has(ch)) hasBack = true;
    if (FRONT.has(ch)) hasFront = true;
    if (hasBack && hasFront) return false;
  }
  return true;
}

export function filterKazakhWords(words: string[]): string[] {
  return words
    .map(w => w.normalize('NFC'))
    .filter(w => w.length >= 2)
    .filter(w => !FORBIDDEN.test(w))
    .filter(w => Array.from(w).every(ch => KZ_WHITELIST.has(ch)))
    .filter(isHarmonious);
}

// ---- Deterministic fallback index ----
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 0x100000000;
}

function seedFrom(day: number, len: number, salt = 131): number {
  return ((day + 1) * 10007) ^ (len * 97) ^ salt;
}

export function deterministicPick(length: number, day: number, len: number): number {
  if (length <= 0) return 0;
  const rnd = lcg(seedFrom(day, len))();
  return Math.floor(rnd * length) % length;
}

type WordBanks = { w4: string[]; w5: string[]; w6: string[] };

export type TodayWordResult = {
  source: 'schedule' | 'fallback';
  dateISO: string;
  gameDay: number;
  word: string;
  length: 4 | 5 | 6;
};

// --- Season + fairness tuning ---
const DEFAULT_SEASON_SPAN_DAYS = 180; // 6 months
const DEFAULT_RECENT_WINDOW = 120;    // do not repeat within last N days in same season

function fnv1a32(str: string): number {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function saltedPermutation<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  const rnd = lcg(seed >>> 0);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    if (j !== i) { const t = a[i]; a[i] = a[j]; a[j] = t; }
  }
  return a;
}

function pickNoRecent<T>(perm: T[], start: number, windowSize: number): T {
  const n = perm.length;
  if (n === 0) throw new Error('Empty permutation');
  if (n === 1) return perm[0];
  const recent = new Set<number>();
  const win = Math.min(windowSize, Math.max(0, n - 1));
  for (let k = 1; k <= win; k++) recent.add((start - k + n) % n);
  for (let shift = 0; shift < n; shift++) {
    const idx = (start + shift) % n;
    if (!recent.has(idx)) return perm[idx];
  }
  return perm[start % n];
}

export function getTodayWord(
  len: 4 | 5 | 6,
  banks: WordBanks,
  opts?: { stableB64?: string; nowMs?: number; recentDays?: number; seasonSpanDays?: number; serverSalt?: string }
): TodayWordResult {
  const nowMs = opts?.nowMs ?? Date.now();
  const dateISO = getIsoDateAlmaty(nowMs);
  const gameDay = getGameDayIndex(nowMs);

  // 1) Try schedule first
  if (opts?.stableB64) {
    const schedule = decodeStableSchedule(opts.stableB64);
    const row = schedule[dateISO];
    if (row) {
      const pick = len === 4 ? row.w4 : len === 5 ? row.w5 : row.w6;
      if (pick && pick.length === len) {
        return { source: 'schedule', dateISO, gameDay, word: pick, length: len };
      }
    }
  }

  // 2) Fallback deterministic pick
  const base = len === 4 ? banks.w4 : len === 5 ? banks.w5 : banks.w6;
  const clean = filterKazakhWords(base).filter(w => w.length === len);
  if (clean.length === 0) {
    throw new Error(`Empty or over-filtered list (len=${len}).`);
  }

  const seasonSpan = Math.max(30, opts?.seasonSpanDays ?? DEFAULT_SEASON_SPAN_DAYS);
  const seasonIndex = Math.floor(gameDay / seasonSpan);
  const seedStr = `season:${seasonIndex}|len:${len}|salt:${opts?.serverSalt ?? 'local'}`;
  const seed = fnv1a32(seedStr);
  const perm = saltedPermutation(clean, seed);
  const start = perm.length ? (gameDay % perm.length) : 0;
  const noRepeatWindow = opts?.recentDays ?? DEFAULT_RECENT_WINDOW;
  const word = pickNoRecent(perm, start, noRepeatWindow);

  return { source: 'fallback', dateISO, gameDay, word, length: len };
}
