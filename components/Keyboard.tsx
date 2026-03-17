
import React from 'react';
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
    present: '!bg-present text-white',
    absent: '!bg-absent text-muted',
    default: 'bg-surface/80 hover:bg-surface text-text',
  };

  const isSpecialKey = value === 'ENTER' || value === 'BACKSPACE';
  const widthClass = isSpecialKey ? 'flex-[1.5]' : 'flex-1';
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick(value);
  }
  
  const specialKeyClass = value === 'ENTER' ? '!bg-accent hover:!bg-accent/90 text-white text-xs sm:text-base' : '';

  return (
    <button
      onClick={handleClick}
      className={`${widthClass} ${statusClasses[status]} ${specialKeyClass} h-12 sm:h-14 min-w-0 flex items-center justify-center rounded-md sm:rounded-xl font-semibold uppercase transition-all duration-100 shadow-[0_3px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-px active:shadow-[0_1px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] text-sm sm:text-base`}
    >
      {value === 'BACKSPACE' ? <BackspaceIcon /> : value === 'ENTER' ? UI_MESSAGES.ENTER : value}
    </button>
  );
};

const BackspaceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><path d="m18 9-6 6"></path><path d="m12 9 6 6"></path></svg>
);


export default Keyboard;
