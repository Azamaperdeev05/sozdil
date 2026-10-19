import React from 'react';
import { LetterStatus } from '../types';

const TILE: Record<LetterStatus, string> = {
  correct: 'bg-accent border-accent text-on-accent',
  present: 'bg-present border-accent text-accent-ink',
  absent: 'bg-absent border-absent text-muted',
  default: 'border-border text-text',
};

const ExampleRow: React.FC<{
  word: string;
  statuses: LetterStatus[];
  description?: React.ReactNode;
}> = ({ word, statuses, description }) => (
  <div className="space-y-2">
    <div className="flex justify-center gap-1.5">
      {word.split('').map((letter, index) => (
        <div
          key={index}
          className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg font-bold text-lg ${TILE[statuses[index] || 'default']}`}
        >
          {letter}
        </div>
      ))}
    </div>
    {description && <p className="text-center text-sm text-muted px-4">{description}</p>}
  </div>
);

export default ExampleRow;
