export type LetterStatus = 'correct' | 'present' | 'absent' | 'default';

export type GameStatus = 'PLAYING' | 'WON' | 'LOST';

export type Difficulty = "easy" | "medium" | "hard";

export interface StatsData {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  // Track last game played and streak freeze
  lastGameDate?: string;
  lastGameWordLength?: number;
  freezeCount?: number;
  lastFreezeUsedDate?: string;
}

// History data for the calendar
export type HistoryData = {
  [wordLength: string]: {
    [date: string]: 'WON' | 'LOST';
  }
}