
import { LetterStatus } from '../types';

export const getGuessStatuses = (guess: string, solution: string): LetterStatus[] => {
  const splitSolution = solution.split('');
  const splitGuess = guess.split('');
  const wordLength = solution.length;

  const solutionCharsTaken = splitSolution.map(() => false);
  const statuses: LetterStatus[] = Array(wordLength).fill('absent');

  // Handle correct letters in the correct position
  splitGuess.forEach((letter, i) => {
    if (splitSolution[i] === letter) {
      statuses[i] = 'correct';
      solutionCharsTaken[i] = true;
    }
  });

  // Handle present letters in the wrong position
  splitGuess.forEach((letter, i) => {
    if (statuses[i] === 'correct') {
      return;
    }

    const indexOfPresentChar = splitSolution.findIndex(
      (char, index) => char === letter && !solutionCharsTaken[index]
    );

    if (indexOfPresentChar > -1) {
      statuses[i] = 'present';
      solutionCharsTaken[indexOfPresentChar] = true;
    }
  });

  return statuses;
};
