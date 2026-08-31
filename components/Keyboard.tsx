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
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-2 pb-4">
      {KEYBOARD_LAYOUT.map((row, i) => (
        <div key={i} className="flex justify-center w-full gap-1.5 sm:gap-2 my-1">
          {row.map((key) => {
            const status = keyStatuses[key] || 'default';
            return <Key key={key} value={key} status={status} onClick={onKeyPress} />;
          })}
        </div>
      ))}
    </div>
  );
};

interface KeyProps {
  value: string;
  status: LetterStatus;
  onClick: (key: string) => void;
}

const Key: React.FC<KeyProps> = ({ value, status, onClick }) => {
  const statusClasses = {
    correct: '!bg-correct text-white',
    present: '!bg-present text-[#0D0F14]',
    absent: '!bg-absent text-gray-200',
    default: 'bg-surface/80 hover:bg-surface text-text',
  };

  const isSpecialKey = value === 'ENTER' || value === 'BACKSPACE';
  const widthClass = isSpecialKey ? 'flex-[1.5]' : 'flex-1';
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick(value);
  };
  
  const specialKeyClass = value === 'ENTER' ? '!bg-accent hover:!bg-accent/90 text-white text-xs sm:text-base' : '';
  const ariaLabel = value === 'BACKSPACE' ? 'Өшіру' : value === 'ENTER' ? 'Енгізу' : value;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`${widthClass} ${statusClasses[status]} ${specialKeyClass} h-12 sm:h-14 min-w-0 flex items-center justify-center rounded-md sm:rounded-xl font-semibold uppercase transition-all duration-100 shadow-[0_3px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-px active:shadow-[0_1px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] text-sm sm:text-base touch-manipulation`}
    >
      {value === 'BACKSPACE' ? (
        <Backspace size={22} weight="Outline" />
      ) : value === 'ENTER' ? (
        UI_MESSAGES.ENTER
      ) : (
        value
      )}
    </button>
  );
};

export default Keyboard;
