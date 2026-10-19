import React from 'react';
import { Backspace } from 'reicon-react';
import { KEYBOARD_LAYOUT } from '../constants';
import { LetterStatus } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStatuses: { [key: string]: LetterStatus };
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyStatuses }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-[34rem] mx-auto pt-2 pb-3 sm:pb-4 select-none touch-manipulation">
      {KEYBOARD_LAYOUT.map((row, i) => (
        <div key={i} className="flex justify-center w-full gap-1 sm:gap-1.5">
          {row.map((key) => {
            const status = keyStatuses[key] || 'default';
            return <Key key={key} value={key} status={status} onKeyPress={onKeyPress} />;
          })}
        </div>
      ))}
    </div>
  );
};

interface KeyProps {
  value: string;
  status: LetterStatus;
  onKeyPress: (key: string) => void;
}

const STATUS_CLASS: Record<LetterStatus, string> = {
  correct: 'key--correct',
  present: 'key--present',
  absent: 'key--absent',
  default: '',
};

const Key: React.FC<KeyProps> = ({ value, status, onKeyPress }) => {
  const isEnter = value === 'ENTER';
  const isSpecialKey = isEnter || value === 'BACKSPACE';

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Only primary button / touch
    if (e.button !== 0) return;
    e.preventDefault();

    // Light haptic feedback on supported mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }

    onKeyPress(value);
  };

  const ariaLabel = value === 'BACKSPACE' ? 'Өшіру' : isEnter ? 'Енгізу' : value;

  return (
    <button
      type="button"
      tabIndex={-1}
      onPointerDown={handlePointerDown}
      aria-label={ariaLabel}
      className={`key ${isEnter ? 'key--enter' : STATUS_CLASS[status]} ${
        isSpecialKey ? 'flex-[1.55]' : 'flex-1'
      } h-[clamp(42px,6.6svh,56px)] min-w-0 flex items-center justify-center rounded-md font-semibold transition-[transform,background-color] duration-100 active:scale-[0.94] select-none touch-manipulation`}
    >
      {value === 'BACKSPACE' ? (
        <Backspace size={22} weight="Outline" />
      ) : isEnter ? (
        <span className="text-[10.5px] sm:text-xs font-bold tracking-wide">ЕНГІЗУ</span>
      ) : (
        <span className="text-[15px] sm:text-base">{value}</span>
      )}
    </button>
  );
};

export default Keyboard;
