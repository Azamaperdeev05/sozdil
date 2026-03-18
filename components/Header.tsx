import React from 'react';
import { UI_MESSAGES } from '../constants';
import type { User } from '../lib/authService';
import UserMenu from './UserMenu';
import InstallButton from './InstallButton';

interface HeaderProps {
  onInfo: () => void;
  onStats: () => void;
  onCalendar: () => void;
  currentLength: number;
  onLengthChange: (length: number) => void;
  user: User | null;
  isSyncing: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

const WORD_LENGTHS = [4, 5, 6];

const Header: React.FC<HeaderProps> = ({ onInfo, onStats, onCalendar, currentLength, onLengthChange, user, isSyncing, onSignIn, onSignOut }) => (
  <header className="flex items-center justify-between py-3 h-14 border-b border-border">
    <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight">СӨЗДІЛ</h1>
    <div className="flex items-center space-x-1 sm:space-x-2">
      <div className="flex rounded-md bg-surface p-0.5">
        {WORD_LENGTHS.map(len => (
          <button
            key={len}
            onClick={() => onLengthChange(len)}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
              currentLength === len ? 'bg-accent text-white shadow' : 'text-muted hover:text-text'
            }`}
          >
            {len}
          </button>
        ))}
      </div>
      <UserMenu user={user} isSyncing={isSyncing} onSignIn={onSignIn} onSignOut={onSignOut} />
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

export default Header;
