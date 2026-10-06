import { StatsData } from '../types';

export type LeagueTierId = 'bronze' | 'silver' | 'gold' | 'diamond' | 'master';

export interface LeagueTier {
  id: LeagueTierId;
  nameKz: string;
  minStreak: number;
  maxStreak: number;
  icon: string;
  color: string;
  bgBadge: string;
  borderColor: string;
  description: string;
}

export const LEAGUE_TIERS: LeagueTier[] = [
  {
    id: 'bronze',
    nameKz: 'Қола лига',
    minStreak: 1,
    maxStreak: 7,
    icon: '🥉',
    color: '#D97706',
    bgBadge: 'bg-amber-600/15 text-amber-500 border-amber-600/30',
    borderColor: 'border-amber-600/30',
    description: '1–7 күн үзбей сөз тапқандар',
  },
  {
    id: 'silver',
    nameKz: 'Күміс лига',
    minStreak: 8,
    maxStreak: 14,
    icon: '🥈',
    color: '#94A3B8',
    bgBadge: 'bg-slate-400/15 text-slate-300 border-slate-400/30',
    borderColor: 'border-slate-400/30',
    description: '8–14 күн үзбей сөз тапқандар',
  },
  {
    id: 'gold',
    nameKz: 'Алтын лига',
    minStreak: 15,
    maxStreak: 30,
    icon: '🥇',
    color: '#EAB308',
    bgBadge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    borderColor: 'border-yellow-500/30',
    description: '15–30 күн үзбей сөз тапқандар',
  },
  {
    id: 'diamond',
    nameKz: 'Алмаз лига',
    minStreak: 31,
    maxStreak: 60,
    icon: '💎',
    color: '#06B6D4',
    bgBadge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    borderColor: 'border-cyan-500/30',
    description: '31–60 күн үзбей сөз тапқандар',
  },
  {
    id: 'master',
    nameKz: 'Сөз Зергері',
    minStreak: 61,
    maxStreak: Infinity,
    icon: '👑',
    color: '#C084FC',
    bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderColor: 'border-purple-500/40',
    description: '60+ күн үзбей тапқан аңыздар',
  },
];

// Smart Scoring System
export const GUESS_POINTS: Record<number, number> = {
  1: 30,  // Suspicious or pure luck
  2: 70,  // Excellent
  3: 100, // Golden guess (peak skill)
  4: 80,  // Solid game
  5: 60,  // Persistent
  6: 40,  // Clutch save
};

export const MAX_REASONABLE_STREAK = 120; // Maximum realistic days since game launch
export const MIN_SOLVE_TIME_SECONDS = 4;  // Reading & entering Kazakh word <4s is superhuman

export interface PlayerProfile {
  visitorId: string;
  nickname: string | null;
  currentStreak: number;
  maxStreak: number;
  totalScore: number;
  gamesWon: number;
  tier: LeagueTier;
  isFlagged: boolean;
}

export interface LeaderboardEntry {
  visitorId: string;
  nickname: string;
  streak: number;
  score: number;
  tierId: LeagueTierId;
  rank: number;
  isCurrentPlayer?: boolean;
}

const SUPABASE_URL = 'https://xbkvmfqefbarpcsfsrav.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia3ZtZnFlZmJhcnBjc2ZzcmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTQ1NTYsImV4cCI6MjEwNjA5MDU1Nn0.dDw3QXook7KMJQ2nf6vubQYcvzXqtuBjyRh49RcCwEc';

export function getLeagueTier(streak: number): LeagueTier {
  const safeStreak = Math.max(0, streak);
  if (safeStreak >= 61) return LEAGUE_TIERS[4]; // Master
  if (safeStreak >= 31) return LEAGUE_TIERS[3]; // Diamond
  if (safeStreak >= 15) return LEAGUE_TIERS[2]; // Gold
  if (safeStreak >= 8)  return LEAGUE_TIERS[1]; // Silver
  return LEAGUE_TIERS[0]; // Bronze
}

export function getNextLeagueTier(streak: number): { nextTier: LeagueTier | null; daysRemaining: number } {
  const currentTier = getLeagueTier(streak);
  const currentIndex = LEAGUE_TIERS.findIndex((t) => t.id === currentTier.id);

  if (currentIndex === LEAGUE_TIERS.length - 1) {
    return { nextTier: null, daysRemaining: 0 };
  }

  const nextTier = LEAGUE_TIERS[currentIndex + 1];
  const daysRemaining = Math.max(0, nextTier.minStreak - streak);
  return { nextTier, daysRemaining };
}

export function calculatePoints(guessCount: number): number {
  return GUESS_POINTS[guessCount] ?? 0;
}

// Calculate retroactive historical score from user's guess distribution
export function calculateHistoricalScore(): number {
  let score = 0;
  for (const len of [4, 5, 6]) {
    try {
      const raw = localStorage.getItem(`sozdil-stats-${len}`);
      if (raw) {
        const parsed = JSON.parse(raw) as StatsData;
        if (Array.isArray(parsed.guessDistribution)) {
          parsed.guessDistribution.forEach((count, idx) => {
            const guessNum = idx + 1;
            const pts = GUESS_POINTS[guessNum] || 40;
            score += count * pts;
          });
        }
      }
    } catch {}
  }
  return score;
}

export function getVisitorId(): string {
  try {
    let vid = localStorage.getItem('sozdil_vid');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('sozdil_vid', vid);
    }
    return vid;
  } catch {
    return 'v_anon';
  }
}

export function assessPlayerAntiCheat(
  streak: number,
  guessCount: number,
  durationSeconds?: number
): { isFlagged: boolean; cleanStreak: number } {
  // 1. Extreme streak tampering e.g. 500 days
  if (streak > MAX_REASONABLE_STREAK) {
    try {
      localStorage.setItem('sozdil_flagged', 'true');
    } catch {}
    return { isFlagged: true, cleanStreak: 1 };
  }

  // 2. Instant solve with 1 guess (<4s)
  if (guessCount === 1 && durationSeconds !== undefined && durationSeconds < MIN_SOLVE_TIME_SECONDS) {
    try {
      localStorage.setItem('sozdil_flagged', 'true');
    } catch {}
    return { isFlagged: true, cleanStreak: streak };
  }

  const locallyFlagged = localStorage.getItem('sozdil_flagged') === 'true';
  return { isFlagged: locallyFlagged, cleanStreak: streak };
}

export function getPlayerProfile(): PlayerProfile {
  let nickname: string | null = null;
  let isFlagged = false;

  try {
    nickname = localStorage.getItem('sozdil_nickname');
    isFlagged = localStorage.getItem('sozdil_flagged') === 'true';
  } catch {}

  // Calculate current streak across modes
  let currentStreak = 0;
  let maxStreak = 0;
  let gamesWon = 0;

  for (const len of [4, 5, 6]) {
    try {
      const raw = localStorage.getItem(`sozdil-stats-${len}`);
      if (raw) {
        const stats = JSON.parse(raw) as StatsData;
        currentStreak = Math.max(currentStreak, stats.currentStreak || 0);
        maxStreak = Math.max(maxStreak, stats.maxStreak || 0);
        gamesWon += stats.wins || 0;
      }
    } catch {}
  }

  // Anti-cheat verification
  if (currentStreak > MAX_REASONABLE_STREAK) {
    currentStreak = 1;
    isFlagged = true;
  }

  // Retrieve total score (or calculate retroactive score)
  let totalScore = 0;
  try {
    const savedScore = localStorage.getItem('sozdil_total_score');
    if (savedScore) {
      totalScore = parseInt(savedScore, 10) || 0;
    } else {
      totalScore = calculateHistoricalScore();
      if (totalScore > 0) {
        localStorage.setItem('sozdil_total_score', String(totalScore));
      }
    }
  } catch {}

  const tier = getLeagueTier(currentStreak);

  return {
    visitorId: getVisitorId(),
    nickname,
    currentStreak,
    maxStreak,
    totalScore,
    gamesWon,
    tier,
    isFlagged,
  };
}

export function savePlayerNickname(nickname: string): PlayerProfile {
  const cleanNick = nickname.trim().slice(0, 16);
  try {
    localStorage.setItem('sozdil_nickname', cleanNick);
  } catch {}

  const profile = getPlayerProfile();
  syncProfileToSupabase(profile).catch(() => {});
  return profile;
}

export function recordScoreForGame(guessCount: number, durationSeconds?: number): number {
  const pts = calculatePoints(guessCount);
  const profile = getPlayerProfile();

  assessPlayerAntiCheat(profile.currentStreak, guessCount, durationSeconds);

  const newScore = profile.totalScore + pts;
  try {
    localStorage.setItem('sozdil_total_score', String(newScore));
  } catch {}

  const updatedProfile = { ...profile, totalScore: newScore };
  if (profile.nickname) {
    syncProfileToSupabase(updatedProfile).catch(() => {});
  }

  return pts;
}

// Built-in benchmark Kazakh individual players across tiers for offline & initial competition
export const BENCHMARK_LEADERBOARD: Omit<LeaderboardEntry, 'rank'>[] = [
  { visitorId: 'b_1', nickname: 'Айсұлу', streak: 64, score: 5920, tierId: 'master' },
  { visitorId: 'b_2', nickname: 'Батырхан', streak: 52, score: 4780, tierId: 'diamond' },
  { visitorId: 'b_3', nickname: 'Ерасыл_А', streak: 43, score: 3860, tierId: 'diamond' },
  { visitorId: 'b_4', nickname: 'Динара', streak: 28, score: 2640, tierId: 'gold' },
  { visitorId: 'b_5', nickname: 'Нұрлан', streak: 22, score: 2100, tierId: 'gold' },
  { visitorId: 'b_6', nickname: 'Мөлдір_99', streak: 16, score: 1580, tierId: 'gold' },
  { visitorId: 'b_7', nickname: 'Мақсат', streak: 12, score: 1120, tierId: 'silver' },
  { visitorId: 'b_8', nickname: 'Әсем', streak: 9, score: 860, tierId: 'silver' },
  { visitorId: 'b_9', nickname: 'Қайрат', streak: 6, score: 540, tierId: 'bronze' },
  { visitorId: 'b_10', nickname: 'Жанерке', streak: 4, score: 380, tierId: 'bronze' },
];

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const profile = getPlayerProfile();
  let entries: Omit<LeaderboardEntry, 'rank'>[] = [];

  // Try fetching from Supabase table if configured
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard?is_flagged=eq.false&order=total_score.desc,streak.desc&limit=50`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        entries = data.map((d: any) => ({
          visitorId: d.visitor_id,
          nickname: d.nickname,
          streak: Number(d.streak) || 0,
          score: Number(d.total_score) || 0,
          tierId: getLeagueTier(Number(d.streak) || 0).id,
        }));
      }
    }
  } catch (err) {
    console.warn('Supabase leaderboard fetch fallback', err);
  }

  // Fallback to benchmarks if remote table is empty or offline
  if (entries.length === 0) {
    entries = [...BENCHMARK_LEADERBOARD];
  }

  // Add or update the current player in the leaderboard
  if (profile.nickname) {
    const existingIndex = entries.findIndex((e) => e.visitorId === profile.visitorId);
    const playerEntry = {
      visitorId: profile.visitorId,
      nickname: profile.nickname,
      streak: profile.currentStreak,
      score: profile.totalScore,
      tierId: profile.tier.id,
      isCurrentPlayer: true,
    };

    if (existingIndex >= 0) {
      entries[existingIndex] = playerEntry;
    } else {
      entries.push(playerEntry);
    }
  }

  // Sort by score (descending), then streak (descending)
  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.streak - a.streak;
  });

  // Assign ranks
  return entries.map((e, idx) => ({
    ...e,
    rank: idx + 1,
    isCurrentPlayer: profile.nickname ? e.visitorId === profile.visitorId : false,
  }));
}

export async function syncProfileToSupabase(profile: PlayerProfile): Promise<boolean> {
  if (!profile.nickname) return false;

  const payload = {
    visitor_id: profile.visitorId,
    nickname: profile.nickname,
    streak: Math.min(profile.currentStreak, MAX_REASONABLE_STREAK),
    total_score: profile.totalScore,
    is_flagged: profile.isFlagged,
    updated_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
