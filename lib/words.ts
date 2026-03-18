import words4 from '../words_4';
import words5 from '../words_5';
import words6 from '../words_6';
import { getTodayWord } from './getTodayWord';
import { SCHEDULE_B64 } from './stableSchedule';

const allWords = {
    4: words4,
    5: words5,
    6: words6,
};

export const getDailyGameDataInternal = (length: number) => {
  const wordList = allWords[length as keyof typeof allWords];
  if (!wordList) {
    throw new Error(`Invalid word length: ${length}`);
  }

  const banks = { w4: allWords[4], w5: allWords[5], w6: allWords[6] } as {
    w4: string[]; w5: string[]; w6: string[];
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
