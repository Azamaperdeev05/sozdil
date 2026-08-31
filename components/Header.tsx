import React from 'react';
import { UI_MESSAGES } from '../constants';
import InstallButton from './InstallButton';

interface HeaderProps {
  onInfo: () => void;
  onStats: () => void;
  onCalendar: () => void;
  onChallenge: () => void;
  currentLength: number;
  onLengthChange: (length: number) => void;
}

const WORD_LENGTHS = [4, 5, 6];

const Header: React.FC<HeaderProps> = ({
  onInfo,
  onStats,
  onCalendar,
  onChallenge,
  currentLength,
  onLengthChange,
}) => (
  <header className="flex items-center justify-between py-3 h-14 border-b border-border">
    <h1 className="text-2xl sm:text-4xl font-display font-semibold tracking-tight">СӨЗДІЛ</h1>
    <div className="flex items-center space-x-1 sm:space-x-1.5">
      <div className="flex rounded-md bg-surface p-0.5" role="group" aria-label="Сөз ұзындығын таңдау">
        {WORD_LENGTHS.map(len => (
          <button
            key={len}
            type="button"
            onClick={() => onLengthChange(len)}
            aria-label={`${len} әріптен тұратын сөз режимі`}
            aria-pressed={currentLength === len}
            className={`px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
              currentLength === len ? 'bg-accent text-white shadow' : 'text-muted hover:text-text'
            }`}
          >
            {len}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onChallenge}
        title="Досыңа сөз жасыр ⚔️"
        aria-label="Досыңа сөз жасыр"
        className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface text-accent hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
          <line x1="13" y1="19" x2="19" y2="13" />
          <line x1="16" y1="16" x2="20" y2="20" />
          <line x1="19" y1="21" x2="21" y2="19" />
          <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
          <line x1="5" y1="14" x2="9" y2="18" />
          <line x1="7" y1="17" x2="4" y2="20" />
          <line x1="3" y1="19" x2="5" y2="21" />
        </svg>
      </button>

      <InstallButton />

      <button
        type="button"
        onClick={onStats}
        title={UI_MESSAGES.STATISTICS}
        aria-label={UI_MESSAGES.STATISTICS}
        className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
      </button>

      <button
        type="button"
        onClick={onCalendar}
        title={UI_MESSAGES.CALENDAR}
        aria-label={UI_MESSAGES.CALENDAR}
        className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
      </button>

      <button
        type="button"
        onClick={onInfo}
        title={UI_MESSAGES.GAME_RULES}
        aria-label={UI_MESSAGES.GAME_RULES}
        className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
      </button>
    </div>
  </header>
);

export default Header;
