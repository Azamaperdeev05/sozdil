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
  <div className="flex flex-col border-b border-border/80 pb-2">
    {/* Main Top Header: Title on Left, Action Icons on Right */}
    <header className="flex items-center justify-between py-2 sm:py-3 min-h-[52px]">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold tracking-tight text-text">
        СӨЗДІЛ
      </h1>

      {/* Action Icons Bar */}
      <div className="flex items-center gap-0.5 sm:gap-1.5">
        <button
          type="button"
          onClick={onChallenge}
          title="Досыңа сөз жасыр ⚔️"
          aria-label="Досыңа сөз жасыр"
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface text-accent hover:text-white transition-all active:scale-90"
        >
          <Gamepad size={22} weight="Outline" />
        </button>

        <button
          type="button"
          onClick={onAchievements}
          title="Жетістіктер 🏆"
          aria-label="Жетістіктер"
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface text-amber-400 hover:text-amber-300 transition-all active:scale-90"
        >
          <CupTrophy size={22} weight="Outline" />
        </button>

        <InstallButton />

        <button
          type="button"
          onClick={onStats}
          title={UI_MESSAGES.STATISTICS}
          aria-label={UI_MESSAGES.STATISTICS}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface text-muted hover:text-text transition-all active:scale-90"
        >
          <ChartBar size={22} weight="Outline" />
        </button>

        <button
          type="button"
          onClick={onCalendar}
          title={UI_MESSAGES.CALENDAR}
          aria-label={UI_MESSAGES.CALENDAR}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface text-muted hover:text-text transition-all active:scale-90"
        >
          <Calendar size={22} weight="Outline" />
        </button>

        <button
          type="button"
          onClick={onInfo}
          title={UI_MESSAGES.GAME_RULES}
          aria-label={UI_MESSAGES.GAME_RULES}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface text-muted hover:text-text transition-all active:scale-90"
        >
          <InfoCircle size={22} weight="Outline" />
        </button>
      </div>
    </header>

    {/* Mode Switcher: Ergonomic, Centered 4, 5, 6 letter selector */}
    <div className="flex justify-center items-center pt-1">
      <div
        className="flex items-center rounded-xl bg-surface/90 p-1 border border-border shadow-sm w-full max-w-[260px] justify-between"
        role="group"
        aria-label="Сөз ұзындығын таңдау"
      >
        {WORD_LENGTHS.map(len => (
          <button
            key={len}
            type="button"
            onClick={() => onLengthChange(len)}
            aria-label={`${len} әріптен тұратын сөз режимі`}
            aria-pressed={currentLength === len}
            className={`flex-1 h-9 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-bold rounded-lg transition-all ${
              currentLength === len
                ? 'bg-accent text-white shadow'
                : 'text-muted hover:text-text hover:bg-border/30'
            }`}
          >
            {len} әріп
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default Header;
