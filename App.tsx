// FIX: Corrected the import statement for React and its hooks.
import React, { useState, useEffect, useCallback } from 'react';
import { MAX_GUESSES, KEYBOARD_LAYOUT, UI_MESSAGES, APP_URL } from './constants';
import { LetterStatus, GameStatus, StatsData, HistoryData } from './types';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { getDailyGameData } from './lib/api';
import { getGuessStatuses } from './lib/statuses';
import InstallButton from './components/InstallButton';
import Modal from './components/Modal';
import ExampleRow from './components/ExampleRow';
import TutorialModal from './components/TutorialModal';
import { getGameDateString, getMsUntilNextGame } from './lib/gameTime';

const DEFAULT_STATS = (): StatsData => ({
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: Array(MAX_GUESSES).fill(0),
});

const safeParseJson = <T,>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Failed to parse stored JSON value', error);
    return fallback;
  }
};

const isGameStatus = (value: unknown): value is GameStatus =>
  value === 'PLAYING' || value === 'WON' || value === 'LOST';

// Helper to load word length from localStorage
const loadWordLengthFromLocalStorage = (): number => {
    const savedLength = localStorage.getItem('sozdil-wordLength');
    const parsedLength = savedLength ? parseInt(savedLength, 10) : 6;
    if ([4, 5, 6].includes(parsedLength)) {
        return parsedLength;
    }
    return 6;
};

// Helper to load stats from localStorage
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

// Helper to load history from localStorage
const loadHistoryFromLocalStorage = (): HistoryData => {
  return safeParseJson<HistoryData>(localStorage.getItem('sozdil-history'), {});
};


// Main App Component
const App: React.FC = () => {
  const [wordLength, setWordLength] = useState<number>(loadWordLengthFromLocalStorage());
  const [gameNumber, setGameNumber] = useState<number>(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guessStatuses, setGuessStatuses] = useState<LetterStatus[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');
  const [keyStatuses, setKeyStatuses] = useState<{ [key: string]: LetterStatus }>({});
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState<boolean>(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [stats, setStats] = useState<StatsData>(loadStatsFromLocalStorage(wordLength));
  const [history, setHistory] = useState<HistoryData>(loadHistoryFromLocalStorage());
  const [wordListForValidation, setWordListForValidation] = useState<string[]>([]);
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Show tutorial for first-time users
  useEffect(() => {
    const tutorialSeen = localStorage.getItem('sozdil-tutorial-seen');
    if (tutorialSeen !== 'true') {
      setIsTutorialOpen(true);
    }
  }, []);
  
  // Save word length to localStorage
  useEffect(() => {
      localStorage.setItem('sozdil-wordLength', String(wordLength));
      setStats(loadStatsFromLocalStorage(wordLength));
  }, [wordLength]);

  // Game setup effect on load and when wordLength changes
  useEffect(() => {
    const setupGame = async () => {
        setIsLoading(true);
        const todayString = getGameDateString();

        // Reset current guess state on new game setup
        setCurrentGuess('');

        const localSolutionKey = `sozdil-solution-${todayString}-${wordLength}`;
        const localGameInfoKey = `sozdil-gameInfo-${todayString}-${wordLength}`;
        const gameStateKey = `sozdil-gameState-${todayString}-${wordLength}`;

        const frozenSolution = localStorage.getItem(localSolutionKey);
        const savedStateJSON = localStorage.getItem(gameStateKey);

        if (frozenSolution) {
            // "Local Freeze" - Load from localStorage
            setSolution(frozenSolution);
            const gameInfo = safeParseJson<{ gameNumber?: number; wordListForValidation?: string[] }>(
              localStorage.getItem(localGameInfoKey),
              {}
            );
            setGameNumber(typeof gameInfo.gameNumber === 'number' ? gameInfo.gameNumber : 0);
            setWordListForValidation(Array.isArray(gameInfo.wordListForValidation) ? gameInfo.wordListForValidation : []);
            
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
        } else {
            // No frozen solution, fetch new game data from "API"
            const { solution: newSolution, gameNumber, wordListForValidation } = await getDailyGameData(wordLength);
            setSolution(newSolution);
            setGameNumber(gameNumber);
            setWordListForValidation(wordListForValidation);

            // Freeze the new solution and info in localStorage for stability
            localStorage.setItem(localSolutionKey, newSolution);
            localStorage.setItem(localGameInfoKey, JSON.stringify({ gameNumber, wordListForValidation }));

            // New day, new game: reset state
            setGuesses([]);
            setGuessStatuses([]);
            setGameStatus('PLAYING');
        }
        
        setIsLoading(false);
    };
    
    setupGame();
  }, [wordLength]);


  // Save game state to localStorage
  useEffect(() => {
      if (!isLoading) { // Only save state if the game has loaded
        const todayString = getGameDateString();
        const stateToSave = { guesses, gameStatus, guessStatuses };
        localStorage.setItem(`sozdil-gameState-${todayString}-${wordLength}`, JSON.stringify(stateToSave));
      }
  }, [guesses, gameStatus, guessStatuses, wordLength, isLoading]);


  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
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

      // Client-side validation using the "frozen" solution
      const statuses = getGuessStatuses(currentGuess, solution);

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setGuessStatuses([...guessStatuses, statuses]);
      setCurrentGuess('');

      if (statuses.every((s) => s === 'correct')) {
        setGameStatus('WON');
      } else if (newGuesses.length === MAX_GUESSES) {
        setGameStatus('LOST');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < wordLength) {
      const allKeys = KEYBOARD_LAYOUT.flat();
      if (allKeys.includes(key.toUpperCase())) {
        setCurrentGuess((prev) => prev + key.toUpperCase());
      }
    }
  }, [currentGuess, gameStatus, guesses, wordLength, wordListForValidation, isLoading, guessStatuses, solution]);

  const handleLengthChange = (newLength: number) => {
    if (wordLength === newLength || isLoading) return;

    setWordLength(newLength);
    // State resets will be handled by the main useEffect
  };

  useEffect(() => {
    const newKeyStatuses: { [key: string]: LetterStatus } = {};
    const getStatusPriority = (status?: LetterStatus): number => {
      if (status === 'correct') return 3;
      if (status === 'present') return 2;
      if (status === 'absent') return 1;
      return 0;
    }

    guesses.forEach((guess, guessIndex) => {
      const statuses = guessStatuses[guessIndex];
      if (!statuses) return;

      guess.split('').forEach((letter, i) => {
        const currentPriority = getStatusPriority(newKeyStatuses[letter]);
        const newPriority = getStatusPriority(statuses[i]);
        if (newPriority > currentPriority) {
          newKeyStatuses[letter] = statuses[i];
        }
      });
    });
    setKeyStatuses(newKeyStatuses);
  }, [guesses, guessStatuses]);

  useEffect(() => {
    if (gameStatus === 'WON' || gameStatus === 'LOST') {
      const timeoutId = setTimeout(() => {
        setIsEndGameModalOpen(true);
        const todayString = getGameDateString();

        setStats((prevStats) => {
            const gameAlreadyPlayedToday = prevStats.lastGameDate === todayString && prevStats.lastGameWordLength === wordLength;
            if (gameAlreadyPlayedToday) {
                return prevStats;
            }
            
            const currentHistory = loadHistoryFromLocalStorage();
            if (!currentHistory[String(wordLength)]) {
              currentHistory[String(wordLength)] = {};
            }
            currentHistory[String(wordLength)][todayString] = gameStatus;
            localStorage.setItem('sozdil-history', JSON.stringify(currentHistory));
            setHistory(currentHistory); 

            const newStats: StatsData = { 
                ...prevStats, 
                gamesPlayed: prevStats.gamesPlayed + 1,
                lastGameDate: todayString,
                lastGameWordLength: wordLength
            };

            if (gameStatus === 'WON') {
                newStats.wins += 1;
                newStats.currentStreak += 1;
                newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
                
                const guessCount = guesses.length;
                if (guessCount > 0 && guessCount <= MAX_GUESSES) {
                    const newDistribution = [...newStats.guessDistribution];
                    newDistribution[guessCount - 1]++;
                    newStats.guessDistribution = newDistribution;
                }
            } else { // LOST
                newStats.currentStreak = 0;
            }

            localStorage.setItem(`sozdil-stats-${wordLength}`, JSON.stringify(newStats));
            return newStats;
        });
      }, 500 + wordLength * 80); // Wait for flip animation
      return () => clearTimeout(timeoutId);
    }
  }, [gameStatus, guesses.length, wordLength]);


  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || isEndGameModalOpen || isInfoModalOpen || isStatsModalOpen || isCalendarModalOpen || isTutorialOpen) {
          return;
      }
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
    return () => {
      window.removeEventListener('keyup', listener);
    };
  }, [handleKeyPress, isEndGameModalOpen, isInfoModalOpen, isStatsModalOpen, isCalendarModalOpen, isTutorialOpen]);

  const handleCloseTutorial = () => {
    localStorage.setItem('sozdil-tutorial-seen', 'true');
    setIsTutorialOpen(false);
  };

  const modeClass = `mode-${wordLength}`;

  return (
    <div className={`flex flex-col min-h-screen w-full ${modeClass}`}>
      <div className="flex flex-col max-w-7xl mx-auto w-full min-h-screen px-6 sm:px-8">
        <Header 
          onInfo={() => setIsInfoModalOpen(true)} 
          onStats={() => setIsStatsModalOpen(true)}
          onCalendar={() => setIsCalendarModalOpen(true)}
          currentLength={wordLength}
          onLengthChange={(newLength) => handleLengthChange(newLength)}
        />
        
        {toastMessage && <Toast message={toastMessage} />}
        
        <main className="flex-grow flex flex-col justify-center py-4">
          <Grid guesses={guesses} guessStatuses={guessStatuses} currentGuess={currentGuess} isShaking={isShaking} wordLength={wordLength} gameStatus={gameStatus} />
        </main>
        
        <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />

        {isTutorialOpen && <TutorialModal onClose={handleCloseTutorial} />}
        {isInfoModalOpen && <InfoModal onClose={() => setIsInfoModalOpen(false)} wordLength={wordLength} />}
        {isStatsModalOpen && <StatsModal stats={stats} onClose={() => setIsStatsModalOpen(false)} />}
        {isCalendarModalOpen && <CalendarModal 
          onClose={() => setIsCalendarModalOpen(false)} 
          history={history[String(wordLength)] || {}}
        />}

        {gameStatus !== 'PLAYING' && isEndGameModalOpen && (
          <EndGameModal 
            status={gameStatus} 
            solution={solution}
            guesses={guesses}
            guessStatuses={guessStatuses}
            gameNumber={gameNumber}
            onShare={() => showToast(UI_MESSAGES.RESULT_COPIED)}
            onClose={() => setIsEndGameModalOpen(false)}
          />
        )}
        <footer className="text-center text-sm text-muted py-4">
          Бағдарламаны жасаған: <a href="https://telegram.me/code_improper" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Азамат Пердеев</a>
        </footer>
      </div>
    </div>
  );
};


// Internal Components for App

const Header: React.FC<{ 
    onInfo: () => void; 
    onStats: () => void; 
    onCalendar: () => void;
    currentLength: number;
    onLengthChange: (length: number) => void;
}> = ({ onInfo, onStats, onCalendar, currentLength, onLengthChange }) => {
    const lengths = [4, 5, 6];
    return (
        <header className="flex items-center justify-between py-3 h-14 border-b border-border">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight">СӨЗДІЛ</h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="flex rounded-md bg-surface p-0.5">
                    {lengths.map(len => (
                        <button 
                            key={len}
                            onClick={() => onLengthChange(len)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                                currentLength === len
                                ? 'bg-accent text-white shadow'
                                : 'text-muted hover:text-text'
                            }`}
                        >
                            {len}
                        </button>
                    ))}
                </div>
                <InstallButton />
                <button onClick={onStats} title={UI_MESSAGES.STATISTICS} className="p-2 rounded-full hover:bg-surface transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                </button>
                <button onClick={onCalendar} title={UI_MESSAGES.CALENDAR} className="p-2 rounded-full hover:bg-surface transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </button>
                <button onClick={onInfo} title={UI_MESSAGES.GAME_RULES} className="p-2 rounded-full hover:bg-surface transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                </button>
            </div>
        </header>
    );
};

const Toast: React.FC<{ message: string }> = ({ message }) => (
  <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-surface text-text px-6 py-3 rounded-2xl shadow-lg border border-border font-semibold animate-fade-in-out z-[100]">
    {message}
    <style>{`
      @keyframes fade-in-out {
        0%, 100% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
        10%, 90% { opacity: 1; transform: translateY(0) translateX(-50%); }
      }
      .animate-fade-in-out { animation: fade-in-out 2s ease-in-out; }
    `}</style>
  </div>
);

const InfoModal: React.FC<{ onClose: () => void; wordLength: number; }> = ({ onClose, wordLength }) => (
    <Modal title={UI_MESSAGES.GAME_RULES} onClose={onClose}>
        <div className="text-sm text-muted space-y-4">
            <p className="text-center">
                {MAX_GUESSES} талпыныста {wordLength} әріптен тұратын сөзді табыңыз.
                <br />
                Әр болжамнан кейін плиткалардың түсі өзгереді.
            </p>
            <div className="space-y-5 pt-4">
               <ExampleRow 
                 word="КҮНДЕР"
                 statuses={['correct', 'absent', 'absent', 'absent', 'absent', 'absent']}
                 description={<><b>К</b> әрпі сөз ішінде бар әрі өз орнында тұр.</>}
               />
               <ExampleRow 
                 word="ЖОҒАЛТ"
                 statuses={['absent', 'absent', 'present', 'absent', 'absent', 'absent']}
                 description={<><b>Ғ</b> әрпі сөз ішінде бар, алайда тұрған жері қате.</>}
               />
               <ExampleRow 
                 word="КОМПАС"
                 statuses={['absent', 'absent', 'absent', 'absent', 'absent', 'absent']}
                 description={<><b>П</b> әрпі сөзде мүлде жоқ.</>}
               />
            </div>
            <p className="pt-4 border-t border-border text-center font-semibold">Күн сайын жаңа сөз шығады!</p>
        </div>
    </Modal>
);

const StatsModal: React.FC<{ stats: StatsData; onClose: () => void; }> = ({ stats, onClose }) => {
  const winPercentage = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  return (
    <Modal title={UI_MESSAGES.STATISTICS} onClose={onClose}>
      <div className="flex flex-col items-center text-text">
        <div className="grid grid-cols-4 gap-4 text-center mb-6 w-full">
          <StatItem value={stats.gamesPlayed} label="Ойналғаны" />
          <StatItem value={winPercentage} label="Жеңіс %" />
          <StatItem value={stats.currentStreak} label="Қазіргі серия" />
          <StatItem value={stats.maxStreak} label="Ең ұзақ серия" />
        </div>

        <div className="w-full space-y-2 mt-4 pt-4 border-t border-border">
          <h3 className="text-xl font-bold text-center mb-4">Табу тарихы</h3>
          {stats.guessDistribution.map((count, i) => {
            const widthPercent = count > 0 ? (count / maxDistribution) * 100 : 0;
            return (
              <div key={i} className="flex items-center gap-3 w-full">
                <div className="w-4 text-right text-muted font-medium">{i + 1}</div>
                <div className="flex-1">
                  <div
                    className="bg-accent h-5 rounded-sm flex items-center justify-end pr-2"
                    style={{ width: count > 0 ? `${widthPercent}%` : '28px', minWidth: '28px' }}
                  >
                    <span className="font-bold text-white text-sm">{count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

const StatItem: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center">
    <div className="text-3xl font-bold font-display">{value}</div>
    <div className="text-xs text-muted uppercase tracking-wider text-center">{label}</div>
  </div>
);

const Countdown: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const updateCountdown = () => {
            const diff = getMsUntilNextGame();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );
        };

        updateCountdown();

        const interval = setInterval(() => {
            updateCountdown();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center">
            <h3 className="uppercase text-sm tracking-wider font-semibold text-muted">{UI_MESSAGES.NEXT_WORD_IN}</h3>
            <p className="text-3xl font-bold tracking-wider font-display">{timeLeft}</p>
        </div>
    );
};

const ShareTile: React.FC<{ status: LetterStatus }> = ({ status }) => {
  const statusClasses = {
    correct: 'bg-correct',
    present: 'bg-present',
    absent: 'bg-absent',
    default: 'bg-surface',
  };
  return <div className={`w-full aspect-square rounded-sm ${statusClasses[status]}`}></div>;
};

const ShareRow: React.FC<{ statuses: LetterStatus[] }> = ({ statuses }) => {
  const gridColsClass = { 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6'}[statuses.length] || 'grid-cols-6';
  return (
    <div className={`grid ${gridColsClass} gap-1`}>
      {statuses.map((status, i) => (
        <ShareTile key={i} status={status} />
      ))}
    </div>
  );
};


const EndGameModal: React.FC<{ 
    status: GameStatus; 
    solution: string;
    guesses: string[];
    guessStatuses: LetterStatus[][];
    gameNumber: number;
    onShare: () => void;
    onClose: () => void;
}> = ({ status, solution, guesses, guessStatuses, gameNumber, onShare, onClose }) => {

    const handleShare = () => {
        const guessCount = status === 'WON' ? guesses.length : 'X';
        const title = `Сөзділ ${gameNumber} ${guessCount}/${MAX_GUESSES}`;

        const emojiGrid = guessStatuses.map(statuses => {
            return statuses
                .map(status => {
                    switch (status) {
                        case 'correct': return '🟩';
                        case 'present': return '🟨';
                        default: return '⬛';
                    }
                })
                .join('');
        }).join('\n');
        
        const shareText = `${title}\n\n${emojiGrid}\n\n${APP_URL}`;
        
        navigator.clipboard.writeText(shareText).then(() => {
            onShare();
        });
    };
    
    const title = status === 'WON' ? UI_MESSAGES.GAME_WON : UI_MESSAGES.GAME_LOST;
    
    return (
        <Modal title="" onClose={onClose}>
            <div className="text-center space-y-4">
                 {status === 'WON' && (
                    <div className="flex justify-center mb-2">
                        <div className="w-16 h-16 bg-correct/10 rounded-full flex items-center justify-center">
                            <svg className="h-10 w-10 text-correct" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                )}
                <h2 className="text-2xl font-bold font-display text-center -mt-2">{title}</h2>

                <div className="flex flex-col gap-1 w-full max-w-[240px] mx-auto my-4">
                    {guessStatuses.map((statuses, i) => (
                        <ShareRow key={i} statuses={statuses} />
                    ))}
                </div>

                <p className="text-lg">Жасырын сөз: <strong className="text-xl text-correct tracking-widest">{solution}</strong></p>
                
                <div className="space-y-4 pt-4 border-t border-border mt-4">
                    <Countdown />
                    <div className="grid grid-cols-2 gap-4">
                        <a
                            href={`https://sozdikqor.kz/search?q=${solution.charAt(0).toUpperCase() + solution.slice(1).toLowerCase()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-surface hover:bg-border text-text font-bold py-4 px-4 rounded-xl transition-colors w-full flex items-center justify-center gap-2 text-center"
                        >
                            {UI_MESSAGES.WORD_DEFINITION}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804V4.804A7.968 7.968 0 0014.5 4z" />
                            </svg>
                        </a>
                        <button 
                            onClick={handleShare}
                            className="bg-accent hover:bg-accent/90 text-white font-bold py-4 px-4 rounded-xl transition-colors w-full flex items-center justify-center gap-2"
                        >
                            {UI_MESSAGES.SHARE_TEXT}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};


const CalendarModal: React.FC<{
  onClose: () => void;
  history: { [date: string]: 'WON' | 'LOST' };
}> = ({ onClose, history }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const monthNames = ["Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым", "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан"];
  const dayNames = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

  const blanks = Array(startDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Modal title={UI_MESSAGES.CALENDAR} onClose={onClose}>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-surface transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          </button>
          <div className="text-lg font-bold font-display">{`${monthNames[month]} ${year}`}</div>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-surface transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {dayNames.map(day => <div key={day} className="font-semibold text-muted">{day}</div>)}
          {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
          {days.map(day => {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const entry = history[dateString];
            let dayClasses = 'bg-transparent text-text';
            if (entry === 'WON') {
                dayClasses = 'bg-correct text-white';
            } else if (entry === 'LOST') {
                dayClasses = 'bg-absent text-white';
            }
            
            return (
              <div key={day} className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${dayClasses}`}>
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default App;
