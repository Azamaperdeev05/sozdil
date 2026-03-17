import { getDailyGameDataInternal } from './words';
import { LetterStatus } from '../types';


// "API" endpoint to get all necessary data for the day's game
export const getDailyGameData = async (wordLength: number): Promise<{ 
    solution: string;
    gameNumber: number; 
    wordListForValidation: string[];
    season: string;
}> => {
    if (![4, 5, 6].includes(wordLength)) {
        throw new Error('Invalid word length');
    }

    const { solution, gameNumber, wordListForValidation, season } = getDailyGameDataInternal(wordLength);
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 50)); 
    
    return { 
        solution,
        gameNumber, 
        wordListForValidation,
        season,
    };
};
