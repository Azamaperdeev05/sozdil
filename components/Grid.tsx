
import React from 'react';
import { MAX_GUESSES } from '../constants';
import { LetterStatus, GameStatus } from '../types';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  isShaking: boolean;
  wordLength: number;
  guessStatuses: LetterStatus[][];
  gameStatus: GameStatus;
}

const Grid: React.FC<GridProps> = ({ guesses, currentGuess, isShaking, wordLength, guessStatuses, gameStatus }) => {
  const isWinning = gameStatus === 'WON';
  const gridStyle: React.CSSProperties = {
      gap: 'var(--gap, 8px)',
      width: `min(calc(var(--tile) * var(--cols) + var(--gap) * (var(--cols) - 1)), 100%)`,
      margin: '0 auto'
  };

  return (
    <div className="grid grid-rows-6" style={gridStyle}>
      {Array.from({ length: MAX_GUESSES }).map((_, i) => {
        if (i < guesses.length) {
          const isLatest = i === guesses.length - 1;
          return (
            <CompletedRow 
              key={i} 
              guess={guesses[i]} 
              statuses={guessStatuses[i]} 
              isWinning={isWinning && isLatest}
              isLatest={isLatest}
              wordLength={wordLength}
            />
          );
        }
        if (i === guesses.length && guesses.length < MAX_GUESSES) {
          return <CurrentRow key={i} guess={currentGuess} isShaking={isShaking} wordLength={wordLength} />;
        }
        return <EmptyRow key={i} wordLength={wordLength} />;
      })}
    </div>
  );
};

// Internal components for Grid

const RowGrid: React.FC<{className?: string, children: React.ReactNode}> = ({className, children}) => (
    <div className={`row-grid ${className || ''}`}>{children}</div>
);

interface RowProps {
  guess: string;
}

const CompletedRow: React.FC<RowProps & { statuses: LetterStatus[], isWinning: boolean, isLatest: boolean, wordLength: number }> = ({ guess, statuses, isWinning, isLatest, wordLength }) => {
  return (
    <RowGrid>
      {guess.split('').map((letter, i) => (
        <Tile 
            key={i} 
            letter={letter} 
            status={statuses?.[i] || 'default'} 
            isCompleted={isLatest} 
            isWinning={isWinning}
            animationDelay={i * 250}
            winDelay={wordLength * 250 + i * 80}
        />
      ))}
    </RowGrid>
  );
};

const CurrentRow: React.FC<RowProps & { isShaking: boolean; wordLength: number }> = ({ guess, isShaking, wordLength }) => {
  const letters = guess.padEnd(wordLength, ' ').split('');
  const animationClass = isShaking ? 'row--shake' : '';

  return (
    <RowGrid className={animationClass}>
      {letters.map((letter, i) => (
        <Tile key={i} letter={letter.trim()} status="default" isCurrent={guess[i] !== undefined} />
      ))}
    </RowGrid>
  );
};

const EmptyRow: React.FC<{ wordLength: number }> = ({ wordLength }) => {
    return (
        <RowGrid>
            {Array(wordLength)
            .fill(0)
            .map((_, i) => (
                <Tile key={i} status="default" />
            ))}
        </RowGrid>
    );
};


interface TileProps {
  letter?: string;
  status: LetterStatus;
  isCompleted?: boolean;
  isCurrent?: boolean;
  isWinning?: boolean;
  animationDelay?: number;
  winDelay?: number;
}

const Tile: React.FC<TileProps> = ({ letter, status, isCompleted, isCurrent, isWinning, animationDelay = 0, winDelay = 0 }) => {
  
  const classNames = ['tile'];
  if (status === 'correct') classNames.push('tile--correct');
  if (status === 'present') classNames.push('tile--present');
  if (status === 'absent') classNames.push('tile--absent');

  if (isCompleted) classNames.push('tile--reveal');
  if (isCurrent) classNames.push('tile--pop');
  if (isWinning) classNames.push('tile--win');
  
  const style: React.CSSProperties = {};
  if (isCompleted) {
    style.animationDelay = `${animationDelay}ms`;
  }
   if (isWinning) {
    style['--win-delay' as any] = `${winDelay + 400}ms`;
  }

  return (
    <div className={classNames.join(' ')} style={style}>
        <span className="tile__ch">{letter || ''}</span>
    </div>
  );
};

export default Grid;