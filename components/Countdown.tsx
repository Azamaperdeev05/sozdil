import React, { useState, useEffect } from 'react';
import { UI_MESSAGES } from '../constants';
import { getMsUntilNextGame } from '../lib/gameTime';

interface CountdownProps {
  compact?: boolean;
}

const Countdown: React.FC<CountdownProps> = ({ compact = true }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = getMsUntilNextGame();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div className="flex items-center justify-center gap-2 select-none text-xs text-muted">
        <span>{UI_MESSAGES.NEXT_WORD_IN}</span>
        <span className="font-bold tabular-nums text-text text-sm">{timeLeft}</span>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="text-xs font-semibold text-muted">{UI_MESSAGES.NEXT_WORD_IN}</h3>
      <p className="text-3xl font-bold tabular-nums">{timeLeft}</p>
    </div>
  );
};

export default Countdown;
