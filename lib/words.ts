import { getTodayWord } from './getTodayWord';
import { SCHEDULE_B64 } from './stableSchedule';

export const loadWordsForLength = async (length: number): Promise<string[]> => {
  if (length === 4) {
    const mod = await import('../words_4');
    return mod.default;
  }
  if (length === 5) {
    const mod = await import('../words_5');
    return mod.default;
  }
  const mod = await import('../words_6');
  return mod.default;
};

export const getDailyGameDataInternal = async (length: number) => {
  const wordList = await loadWordsForLength(length);

  const banks = {
    w4: length === 4 ? wordList : [],
    w5: length === 5 ? wordList : [],
    w6: length === 6 ? wordList : [],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyImportMeta: any = (typeof import.meta !== 'undefined') ? import.meta : {};
  const viteSalt = anyImportMeta?.env?.VITE_WORDLE_SALT || anyImportMeta?.env?.VITE_SALT;
  // eslint-disable-next-line no-undef
  const nodeSalt = (typeof process !== 'undefined' && (process as any).env)
    ? ((process as any).env.SOZDIL_SALT || (process as any).env.WORDLE_SALT)
    : undefined;
  const serverSalt = (viteSalt || nodeSalt) as string | undefined;

  const res = getTodayWord(length as 4 | 5 | 6, banks, {
    stableB64: SCHEDULE_B64,
    recentDays: 120,
    seasonSpanDays: 180,
    serverSalt,
  });

  return {
    solution: res.word.toUpperCase(),
    gameNumber: res.gameDay + 1,
    wordListForValidation: wordList,
  };
};
