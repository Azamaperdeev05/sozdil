import React, { useEffect, useRef, useState } from 'react';
import { HelpCircle, ChartBar, CupTrophy, Menu, Gamepad, MedalStar, Calendar, Download, ChevronRight } from 'reicon-react';
import { UI_MESSAGES } from '../constants';
import { usePWAInstall } from '../lib/usePWAInstall';
import { useTheme, ThemePref } from '../lib/theme';

interface HeaderProps {
  onInfo: () => void;
  onStats: () => void;
  onAchievements: () => void;
  onLeaderboard: () => void;
  onCalendar: () => void;
  onChallenge: () => void;
  currentLength: number;
  onLengthChange: (length: number) => void;
}

const WORD_LENGTHS = [4, 5, 6];

const IconButton: React.FC<{ label: string; onClick: () => void; children: React.ReactNode; expanded?: boolean }> = ({
  label,
  onClick,
  children,
  expanded,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    aria-expanded={expanded}
    className="w-10 h-10 flex items-center justify-center rounded-full text-text hover:bg-surface active:scale-95 transition"
  >
    {children}
  </button>
);

const THEME_OPTIONS: { id: ThemePref; label: string }[] = [
  { id: 'system', label: 'Жүйе' },
  { id: 'light', label: 'Ақ' },
  { id: 'dark', label: 'Қара' },
];

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; hint?: string; onClick: () => void }> = ({ icon, label, hint, onClick }) => (
  <button
    type="button"
    role="menuitem"
    onClick={onClick}
    className="w-full flex items-center gap-3 h-12 px-3 rounded-xl text-left hover:bg-surface active:bg-surface-2 transition"
  >
    <span className="text-muted shrink-0">{icon}</span>
    <span className="flex-1 min-w-0">
      <span className="block text-sm font-semibold text-text leading-tight">{label}</span>
      {hint && <span className="block text-[11px] text-muted leading-tight mt-0.5 truncate">{hint}</span>}
    </span>
    <ChevronRight size={16} weight="Outline" className="text-muted shrink-0" />
  </button>
);

const HeaderMenu: React.FC<Pick<HeaderProps, 'onChallenge' | 'onAchievements' | 'onCalendar'>> = ({
  onChallenge,
  onAchievements,
  onCalendar,
}) => {
  const [open, setOpen] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [theme, setTheme] = useTheme();
  const { canPrompt, promptInstall, installed, isIOS } = usePWAInstall();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const run = (action: () => void) => () => {
    setOpen(false);
    action();
  };

  const handleInstall = async () => {
    if (canPrompt) {
      setOpen(false);
      await promptInstall();
    } else {
      setShowInstallHelp(v => !v);
    }
  };

  return (
    <div ref={ref} className="relative">
      <IconButton label="Мәзір" onClick={() => setOpen(v => !v)} expanded={open}>
        <Menu size={22} weight="Outline" />
      </IconButton>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-[min(18rem,calc(100vw-1.5rem))] bg-bg border border-border rounded-2xl shadow-[0_16px_48px_-12px_rgba(0,0,0,0.25)] p-1.5 animate-zoom-in"
        >
          <MenuItem icon={<Gamepad size={20} weight="Outline" />} label="Досыңа сөз жасыр" hint="Сілтеме жасап, досыңды сына" onClick={run(onChallenge)} />
          <MenuItem icon={<MedalStar size={20} weight="Outline" />} label="Жетістіктер" onClick={run(onAchievements)} />
          <MenuItem icon={<Calendar size={20} weight="Outline" />} label={UI_MESSAGES.CALENDAR} onClick={run(onCalendar)} />

          {!installed && (
            <>
              <MenuItem
                icon={<Download size={20} weight="Outline" />}
                label="Қолданбаны орнату"
                hint="Басты экраннан бір түртумен ашылады"
                onClick={handleInstall}
              />
              {showInstallHelp && (
                <div className="mx-3 mb-2 p-3 rounded-xl bg-surface text-xs text-muted leading-relaxed">
                  {isIOS ? (
                    <>Safari-де <b className="text-text">Бөлісу</b> → <b className="text-text">Басты экранға қосу</b> таңдаңыз.</>
                  ) : (
                    <>
                      Браузер мәзірінен <b className="text-text">«Қолданбаны орнату»</b> таңдаңыз.{' '}
                      <a
                        href="https://github.com/Azamaperdeev05/sozdil/releases/tag/v2.0.0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text font-semibold underline underline-offset-2"
                      >
                        Android APK
                      </a>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          <div className="h-px bg-border my-1.5 mx-2" />

          <div className="px-3 pt-1 pb-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Тақырып</div>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-surface" role="radiogroup" aria-label="Тақырып">
              {THEME_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={theme === opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={`h-8 rounded-lg text-xs font-semibold transition ${
                    theme === opt.id ? 'bg-bg text-text shadow-sm' : 'text-muted hover:text-text'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  onInfo,
  onStats,
  onAchievements,
  onLeaderboard,
  onCalendar,
  onChallenge,
  currentLength,
  onLengthChange,
}) => (
  <>
    <header className="border-b border-border">
      <div className="max-w-xl mx-auto h-14 px-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-[0.16em] text-text select-none">СӨЗДІЛ</h1>

        <nav className="flex items-center gap-0.5 -mr-2" aria-label="Негізгі мәзір">
          <IconButton label={UI_MESSAGES.GAME_RULES} onClick={onInfo}>
            <HelpCircle size={22} weight="Outline" />
          </IconButton>
          <IconButton label={UI_MESSAGES.STATISTICS} onClick={onStats}>
            <ChartBar size={22} weight="Outline" />
          </IconButton>
          <IconButton label="Рейтинг" onClick={onLeaderboard}>
            <CupTrophy size={22} weight="Outline" />
          </IconButton>
          <HeaderMenu onChallenge={onChallenge} onAchievements={onAchievements} onCalendar={onCalendar} />
        </nav>
      </div>
    </header>

    <div className="flex justify-center pt-3 px-4">
      <div
        className="grid grid-cols-3 w-full max-w-[16rem] p-1 rounded-full bg-surface"
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
            className={`h-8 rounded-full text-[13px] font-semibold transition ${
              currentLength === len ? 'bg-ink text-on-ink' : 'text-muted hover:text-text'
            }`}
          >
            {len} әріп
          </button>
        ))}
      </div>
    </div>
  </>
);

export default Header;
