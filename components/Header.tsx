import React from 'react';
import { Gamepad, CupTrophy, ChartBar, Calendar, InfoCircle } from 'reicon-react';
import { UI_MESSAGES } from '../constants';
import InstallButton from './InstallButton';

interface HeaderProps {
  onInfo: () => void;
  onStats: () => void;
  onAchievements: () => void;
  onCalendar: () => void;
  onChallenge: () => void;
  currentLength: number;
  onLengthChange: (length: number) => void;
}

const WORD_LENGTHS = [4, 5, 6];

const Header: React.FC<HeaderProps> = ({
  onInfo,
  onStats,
  onAchievements,
  onCalendar,
  onChallenge,
  currentLength,
  onLengthChange,
}) => (
  <header className="flex items-center justify-between py-3 h-14 border-b border-border">
    <h1 className="text-2xl sm:text-4xl font-display font-semibold tracking-tight">СӨЗДІЛ</h1>
    <div className="flex items-center space-x-0.5 sm:space-x-1.5">
      <div className="flex rounded-md bg-surface p-0.5" role="group" aria-label="Сөз ұзындығын таңдау">
        {WORD_LENGTHS.map(len => (
          <button
            key={len}
            type="button"
            onClick={() => onLengthChange(len)}
            aria-label={`${len} әріптен тұратын сөз режимі`}
            aria-pressed={currentLength === len}
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
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
        className="p-1.5 sm:p-2 min-w-[36px] sm:min-w-[40px] min-h-[36px] sm:min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface text-accent hover:text-white transition-colors"
      >
        <Gamepad size={20} weight="Outline" />
      </button>

      <button
        type="button"
        onClick={onAchievements}
        title="Жетістіктер 🏆"
        aria-label="Жетістіктер"
        className="p-1.5 sm:p-2 min-w-[36px] sm:min-w-[40px] min-h-[36px] sm:min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface text-amber-400 hover:text-amber-300 transition-colors"
      >
        <CupTrophy size={20} weight="Outline" />
      </button>

      <InstallButton />

      <button
        type="button"
        onClick={onStats}
        title={UI_MESSAGES.STATISTICS}
        aria-label={UI_MESSAGES.STATISTICS}
        className="p-1.5 sm:p-2 min-w-[36px] sm:min-w-[40px] min-h-[36px] sm:min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface text-muted hover:text-text transition-colors"
      >
        <ChartBar size={20} weight="Outline" />
      </button>

      <button
        type="button"
        onClick={onCalendar}
        title={UI_MESSAGES.CALENDAR}
        aria-label={UI_MESSAGES.CALENDAR}
        className="p-1.5 sm:p-2 min-w-[36px] sm:min-w-[40px] min-h-[36px] sm:min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface text-muted hover:text-text transition-colors"
      >
        <Calendar size={20} weight="Outline" />
      </button>

      <button
        type="button"
        onClick={onInfo}
        title={UI_MESSAGES.GAME_RULES}
        aria-label={UI_MESSAGES.GAME_RULES}
        className="p-1.5 sm:p-2 min-w-[36px] sm:min-w-[40px] min-h-[36px] sm:min-h-[40px] flex items-center justify-center rounded-full hover:bg-surface text-muted hover:text-text transition-colors"
      >
        <InfoCircle size={20} weight="Outline" />
      </button>
    </div>
  </header>
);

export default Header;
