import React, { useState, useEffect } from 'react';
import { UI_MESSAGES } from '../constants';
import { getMsUntilNextGame } from '../lib/gameTime';

const Countdown: React.FC = () => {
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

  return (
    <div className="text-center">
      <h3 className="uppercase text-sm tracking-wider font-semibold text-muted">{UI_MESSAGES.NEXT_WORD_IN}</h3>
      <p className="text-3xl font-bold tracking-wider font-display">{timeLeft}</p>
    </div>
  );
};

export default Countdown;
