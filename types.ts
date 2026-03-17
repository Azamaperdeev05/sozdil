export type LetterStatus = 'correct' | 'present' | 'absent' | 'default';

export type GameStatus = 'PLAYING' | 'WON' | 'LOST';

export type Difficulty = "easy" | "medium" | "hard";

export interface StatsData {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  // FIX: Added optional properties to track the last game played to avoid updating stats multiple times a day.
  lastGameDate?: string;
  lastGameWordLength?: number;
}

// History data for the calendar
export type HistoryData = {
  [wordLength: string]: {
    [date: string]: 'WON' | 'LOST';
  }
}