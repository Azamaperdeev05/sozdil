import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { MAX_GUESSES, KEYBOARD_LAYOUT, UI_MESSAGES } from './constants';
import { LetterStatus, GameStatus, StatsData, HistoryData } from './types';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import Header from './components/Header';
import Toast from './components/Toast';
import InstallBanner from './components/InstallBanner';
import { getDailyGameData } from './lib/api';
import { getGuessStatuses } from './lib/statuses';
import { getGameDateString, getMsUntilNextGame } from './lib/gameTime';

const InfoModal = lazy(() => import('./components/InfoModal'));
const StatsModal = lazy(() => import('./components/StatsModal'));
const EndGameModal = lazy(() => import('./components/EndGameModal'));
const CalendarModal = lazy(() => import('./components/CalendarModal'));

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

const isGameStatus = (value: unknown): value is GameStatus =>
  value === 'PLAYING' || value === 'WON' || value === 'LOST';

const loadWordLengthFromLocalStorage = (): number => {
  const saved = localStorage.getItem('sozdil-wordLength');
  const parsed = saved ? parseInt(saved, 10) : 6;
  return [4, 5, 6].includes(parsed) ? parsed : 6;
};

const loadStatsFromLocalStorage = (wordLength: number): StatsData => {
  const stats = safeParseJson<Partial<StatsData>>(
    localStorage.getItem(`sozdil-stats-${wordLength}`),
    DEFAULT_STATS()
  );
  return {
    ...DEFAULT_STATS(),
    ...stats,
    guessDistribution: Array.isArray(stats.guessDistribution)
      ? stats.guessDistribution.slice(0, MAX_GUESSES)
      : Array(MAX_GUESSES).fill(0),
  };
};

const loadHistoryFromLocalStorage = (): HistoryData =>
  safeParseJson<HistoryData>(localStorage.getItem('sozdil-history'), {});

const App: React.FC = () => {
  const [wordLength, setWordLength] = useState<number>(loadWordLengthFromLocalStorage());
  const [gameNumber, setGameNumber] = useState<number>(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guessStatuses, setGuessStatuses] = useState<LetterStatus[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');
  const [keyStatuses, setKeyStatuses] = useState<{ [key: string]: LetterStatus }>({});
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [stats, setStats] = useState<StatsData>(loadStatsFromLocalStorage(wordLength));
  const [history, setHistory] = useState<HistoryData>(loadHistoryFromLocalStorage());
  const [wordListForValidation, setWordListForValidation] = useState<string[]>([]);
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateString, setCurrentDateString] = useState(() => getGameDateString());

  // Detect day change (midnight in Almaty) and reload the game for the new day
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const scheduleNextCheck = () => {
      const msUntilMidnight = getMsUntilNextGame();
      timer = setTimeout(() => {
        setCurrentDateString(getGameDateString());
        scheduleNextCheck();
      }, msUntilMidnight + 500);
    };
    scheduleNextCheck();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('sozdil-wordLength', String(wordLength));
    setStats(loadStatsFromLocalStorage(wordLength));
  }, [wordLength]);

  useEffect(() => {
    let isCancelled = false;

    const setupGame = async () => {
      setIsLoading(true);
      const todayString = currentDateString;
      setCurrentGuess('');

      const localSolutionKey = `sozdil-solution-${todayString}-${wordLength}`;
      const localGameInfoKey = `sozdil-gameInfo-${todayString}-${wordLength}`;
      const gameStateKey = `sozdil-gameState-${todayString}-${wordLength}`;

      const frozenSolution = localStorage.getItem(localSolutionKey);
      const savedStateJSON = localStorage.getItem(gameStateKey);

      if (frozenSolution) {
        setSolution(frozenSolution);
        const gameInfo = safeParseJson<{ gameNumber?: number; wordListForValidation?: string[] }>(
          localStorage.getItem(localGameInfoKey),
          {}
        );
        setGameNumber(typeof gameInfo.gameNumber === 'number' ? gameInfo.gameNumber : 0);
        if (Array.isArray(gameInfo.wordListForValidation) && gameInfo.wordListForValidation.length > 0) {
          setWordListForValidation(gameInfo.wordListForValidation);
        } else {
          getDailyGameData(wordLength).then(data => {
            if (!isCancelled) setWordListForValidation(data.wordListForValidation);
          });
        }

        if (savedStateJSON) {
          const savedState = safeParseJson<{
            guesses?: string[];
            gameStatus?: GameStatus;
            guessStatuses?: LetterStatus[][];
          } | null>(savedStateJSON, null);
          setGuesses(Array.isArray(savedState?.guesses) ? savedState.guesses : []);
          setGameStatus(isGameStatus(savedState?.gameStatus) ? savedState.gameStatus : 'PLAYING');
          setGuessStatuses(Array.isArray(savedState?.guessStatuses) ? savedState.guessStatuses : []);
        } else {
          setGuesses([]);
          setGuessStatuses([]);
          setGameStatus('PLAYING');
        }
        setIsLoading(false);
      } else {
        try {
          const { solution: newSolution, gameNumber, wordListForValidation } = await getDailyGameData(wordLength);
          if (isCancelled) return;
          setSolution(newSolution);
          setGameNumber(gameNumber);
          setWordListForValidation(wordListForValidation);
          localStorage.setItem(localSolutionKey, newSolution);
          localStorage.setItem(localGameInfoKey, JSON.stringify({ gameNumber, wordListForValidation }));
          setGuesses([]);
          setGuessStatuses([]);
          setGameStatus('PLAYING');
        } catch (e) {
          console.error(e);
        } finally {
          if (!isCancelled) setIsLoading(false);
        }
      }
    };

    setupGame();
    return () => {
      isCancelled = true;
    };
  }, [wordLength, currentDateString]);

  useEffect(() => {
    if (!isLoading) {
      const data = { guesses, gameStatus, guessStatuses };
      localStorage.setItem(
        `sozdil-gameState-${currentDateString}-${wordLength}`,
        JSON.stringify(data)
      );
    }
  }, [guesses, gameStatus, guessStatuses, wordLength, isLoading, currentDateString]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'PLAYING' || isLoading) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordLength) {
        showToast(UI_MESSAGES.NOT_ENOUGH_LETTERS);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
        return;
      }
      if (!wordListForValidation.includes(currentGuess)) {
        showToast(UI_MESSAGES.WORD_NOT_IN_LIST);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
        return;
      }
      const statuses = getGuessStatuses(currentGuess, solution);
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setGuessStatuses(prev => [...prev, statuses]);
      setCurrentGuess('');
      if (statuses.every(s => s === 'correct')) {
        setGameStatus('WON');
      } else if (newGuesses.length === MAX_GUESSES) {
        setGameStatus('LOST');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < wordLength) {
      const allKeys = KEYBOARD_LAYOUT.flat();
      if (allKeys.includes(key.toUpperCase())) {
        setCurrentGuess(prev => prev + key.toUpperCase());
      }
    }
  }, [currentGuess, gameStatus, guesses, wordLength, wordListForValidation, isLoading, solution]);

  const handleLengthChange = (newLength: number) => {
    if (wordLength === newLength || isLoading) return;
    setKeyStatuses({});
    setWordLength(newLength);
  };

  useEffect(() => {
    const newKeyStatuses: { [key: string]: LetterStatus } = {};
    const priority = (s?: LetterStatus) =>
      s === 'correct' ? 3 : s === 'present' ? 2 : s === 'absent' ? 1 : 0;

    guesses.forEach((guess, gi) => {
      const statuses = guessStatuses[gi];
      if (!statuses) return;
      guess.split('').forEach((letter, i) => {
        if (priority(statuses[i]) > priority(newKeyStatuses[letter])) {
          newKeyStatuses[letter] = statuses[i];
        }
      });
    });
    setKeyStatuses(newKeyStatuses);
  }, [guesses, guessStatuses]);

  useEffect(() => {
    if (gameStatus === 'WON' || gameStatus === 'LOST') {
      const id = setTimeout(() => {
        setIsEndGameModalOpen(true);
        const todayString = currentDateString;

        setStats(prev => {
          const alreadyPlayed = prev.lastGameDate === todayString && prev.lastGameWordLength === wordLength;
          if (alreadyPlayed) return prev;

          const currentHistory = loadHistoryFromLocalStorage();
          if (!currentHistory[String(wordLength)]) currentHistory[String(wordLength)] = {};
          currentHistory[String(wordLength)][todayString] = gameStatus;
          setHistory(currentHistory);
          localStorage.setItem('sozdil-history', JSON.stringify(currentHistory));

          const newStats: StatsData = {
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
            lastGameDate: todayString,
            lastGameWordLength: wordLength,
          };

          if (gameStatus === 'WON') {
            newStats.wins += 1;
            newStats.currentStreak += 1;
            newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
            const gc = guesses.length;
            if (gc > 0 && gc <= MAX_GUESSES) {
              const dist = [...newStats.guessDistribution];
              dist[gc - 1]++;
              newStats.guessDistribution = dist;
            }
          } else {
            newStats.currentStreak = 0;
          }

          localStorage.setItem(`sozdil-stats-${wordLength}`, JSON.stringify(newStats));
          return newStats;
        });
      }, 500 + wordLength * 80);
      return () => clearTimeout(id);
    }
  }, [gameStatus, guesses.length, wordLength, currentDateString]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || isEndGameModalOpen || isInfoModalOpen || isStatsModalOpen || isCalendarModalOpen) return;
      if (e.code === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.code === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else {
        const key = e.key.toUpperCase();
        if (key.length === 1 && 'АӘБВГҒДЕЁЖЗИЙКҚЛМНҢОӨПРСТУҰҮФХҺЦЧШЩЪЫІЬЭЮЯ'.includes(key)) {
          handleKeyPress(key);
        }
      }
    };
    window.addEventListener('keyup', listener);
    return () => window.removeEventListener('keyup', listener);
  }, [handleKeyPress, isEndGameModalOpen, isInfoModalOpen, isStatsModalOpen, isCalendarModalOpen]);

  const modeClass = `mode-${wordLength}`;

  return (
    <div className={`flex flex-col min-h-[100dvh] w-full ${modeClass}`}>
      <div className="flex flex-col max-w-7xl mx-auto w-full min-h-[100dvh] px-3 sm:px-6 md:px-8">
        <Header
          onInfo={() => setIsInfoModalOpen(true)}
          onStats={() => setIsStatsModalOpen(true)}
          onCalendar={() => setIsCalendarModalOpen(true)}
          currentLength={wordLength}
          onLengthChange={handleLengthChange}
        />

        {toastMessage && <Toast message={toastMessage} />}

        <main className="flex-grow flex flex-col justify-center py-4">
          <Grid
            guesses={guesses}
            guessStatuses={guessStatuses}
            currentGuess={currentGuess}
            isShaking={isShaking}
            wordLength={wordLength}
            gameStatus={gameStatus}
          />
        </main>

        <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />

        <InstallBanner />

        <Suspense fallback={null}>
          {isInfoModalOpen && <InfoModal onClose={() => setIsInfoModalOpen(false)} wordLength={wordLength} />}
          {isStatsModalOpen && <StatsModal stats={stats} onClose={() => setIsStatsModalOpen(false)} />}
          {isCalendarModalOpen && (
            <CalendarModal
              onClose={() => setIsCalendarModalOpen(false)}
              history={history[String(wordLength)] || {}}
            />
          )}
          {gameStatus !== 'PLAYING' && isEndGameModalOpen && (
            <EndGameModal
              status={gameStatus}
              solution={solution}
              guesses={guesses}
              guessStatuses={guessStatuses}
              gameNumber={gameNumber}
              stats={stats}
              onShare={() => showToast(UI_MESSAGES.RESULT_COPIED)}
              onClose={() => setIsEndGameModalOpen(false)}
            />
          )}
        </Suspense>

        <footer className="text-center text-sm text-muted py-4">
          Бағдарламаны жасаған:{' '}
          <a href="https://telegram.me/code_improper" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Азамат Пердеев
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
