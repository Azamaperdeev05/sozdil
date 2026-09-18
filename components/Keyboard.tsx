import React from 'react';
import { Backspace } from 'reicon-react';
import { KEYBOARD_LAYOUT, UI_MESSAGES } from '../constants';
import { LetterStatus } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStatuses: { [key: string]: LetterStatus };
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyStatuses }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-1 sm:p-2 pb-2 sm:pb-4 select-none touch-manipulation">
      {KEYBOARD_LAYOUT.map((row, i) => (
        <div key={i} className="flex justify-center w-full gap-1 sm:gap-1.5 my-0.5 sm:my-1">
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

const Key: React.FC<KeyProps> = ({ value, status, onKeyPress }) => {
  const statusClasses = {
    correct: '!bg-correct text-[#0D131B] font-bold',
    present: '!bg-present text-[#0D0F14]',
    absent: '!bg-absent text-gray-200',
    default: 'bg-surface/80 hover:bg-surface text-text',
  };

  const isSpecialKey = value === 'ENTER' || value === 'BACKSPACE';
  const widthClass = isSpecialKey ? 'flex-[1.4] sm:flex-[1.5]' : 'flex-1';
  
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
  
  const specialKeyClass = value === 'ENTER' ? '!bg-accent hover:!bg-accent/90 text-white' : '';
  const ariaLabel = value === 'BACKSPACE' ? 'Өшіру' : value === 'ENTER' ? 'Енгізу' : value;

  return (
    <button
      type="button"
      tabIndex={-1}
      onPointerDown={handlePointerDown}
      aria-label={ariaLabel}
      className={`${widthClass} ${statusClasses[status]} ${specialKeyClass} h-12 sm:h-14 min-w-0 flex items-center justify-center rounded-lg sm:rounded-xl font-semibold uppercase transition-all duration-75 shadow-[0_3px_0_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] select-none touch-manipulation`}
    >
      {value === 'BACKSPACE' ? (
        <Backspace size={20} weight="Outline" />
      ) : value === 'ENTER' ? (
        <span className="flex items-center justify-center gap-1 font-bold text-[11px] sm:text-sm tracking-tight">
          <span>Енгізу</span>
          <span className="text-xs sm:text-base font-normal leading-none">⏎</span>
        </span>
      ) : (
        <span className="text-sm sm:text-base">{value}</span>
      )}
    </button>
  );
};

export default Keyboard;
