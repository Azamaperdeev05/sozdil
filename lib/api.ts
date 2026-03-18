import { getDailyGameDataInternal } from './words';

export const getDailyGameData = (wordLength: number): {
    solution: string;
    gameNumber: number;
    wordListForValidation: string[];
} => {
    if (![4, 5, 6].includes(wordLength)) {
        throw new Error('Invalid word length');
    }
    return getDailyGameDataInternal(wordLength);
};
