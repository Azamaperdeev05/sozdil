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
  <header className="flex items-center justify-between py-2 sm:py-3 min-h-[56px] border-b border-border">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold tracking-tight">СӨЗДІЛ</h1>
    <div className="flex items-center gap-1 sm:gap-1.5">
      {/* 4, 5, 6 Mode Selector with full 40-44px touch targets */}
      <div className="flex rounded-xl bg-surface p-1 border border-border/60" role="group" aria-label="Сөз ұзындығын таңдау">
        {WORD_LENGTHS.map(len => (
          <button
            key={len}
            type="button"
            onClick={() => onLengthChange(len)}
            aria-label={`${len} әріптен тұратын сөз режимі`}
            aria-pressed={currentLength === len}
            className={`min-w-[38px] sm:min-w-[42px] h-[38px] sm:h-[40px] flex items-center justify-center text-xs sm:text-sm font-bold rounded-lg transition-all ${
              currentLength === len
                ? 'bg-accent text-white shadow-md'
                : 'text-muted hover:text-text hover:bg-border/30'
            }`}
          >
            {len}
          </button>
        ))}
      </div>

      {/* Action Buttons with 40-44px tap targets */}
      <button
        type="button"
        onClick={onChallenge}
        title="Досыңа сөз жасыр ⚔️"
        aria-label="Досыңа сөз жасыр"
        className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-surface text-accent hover:text-white transition-colors active:scale-95"
      >
        <Gamepad size={22} weight="Outline" />
      </button>

      <button
        type="button"
        onClick={onAchievements}
        title="Жетістіктер 🏆"
        aria-label="Жетістіктер"
        className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-surface text-amber-400 hover:text-amber-300 transition-colors active:scale-95"
      >
        <CupTrophy size={22} weight="Outline" />
      </button>

      <InstallButton />

      <button
        type="button"
        onClick={onStats}
        title={UI_MESSAGES.STATISTICS}
        aria-label={UI_MESSAGES.STATISTICS}
        className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-surface text-muted hover:text-text transition-colors active:scale-95"
      >
        <ChartBar size={22} weight="Outline" />
      </button>

      <button
        type="button"
        onClick={onCalendar}
        title={UI_MESSAGES.CALENDAR}
        aria-label={UI_MESSAGES.CALENDAR}
        className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-surface text-muted hover:text-text transition-colors active:scale-95"
      >
        <Calendar size={22} weight="Outline" />
      </button>

      <button
        type="button"
        onClick={onInfo}
        title={UI_MESSAGES.GAME_RULES}
        aria-label={UI_MESSAGES.GAME_RULES}
        className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-surface text-muted hover:text-text transition-colors active:scale-95"
      >
        <InfoCircle size={22} weight="Outline" />
      </button>
    </div>
  </header>
);

export default Header;
