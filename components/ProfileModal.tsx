import React, { useState } from 'react';
import Modal from './Modal';
import type { User } from '../lib/authService';
import type { StatsData } from '../types';
import { MAX_GUESSES } from '../constants';

interface ProfileModalProps {
  user: User;
  stats: Record<number, StatsData>;
  currentWordLength: number;
  onClose: () => void;
  onSignOut: () => void;
}

const DEFAULT_STATS: StatsData = {
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: Array(MAX_GUESSES).fill(0),
};

const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  stats,
  currentWordLength,
  onClose,
  onSignOut,
}) => {
  const [selectedLen, setSelectedLen] = useState(currentWordLength);
  const s = stats[selectedLen] ?? DEFAULT_STATS;
  const winPct = s.gamesPlayed > 0 ? Math.round((s.wins / s.gamesPlayed) * 100) : 0;
  const maxDist = Math.max(...s.guessDistribution, 1);

  return (
    <Modal title="" onClose={onClose}>
      <div className="flex flex-col items-center text-text">
        {/* ── Профиль ──────────────────────────────── */}
        <div className="flex flex-col items-center mb-6">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="h-20 w-20 rounded-full border-2 border-accent shadow-lg mb-3"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center text-3xl font-bold text-accent mb-3">
              {(user.displayName ?? user.email ?? '?')[0].toUpperCase()}
            </div>
          )}
          <h2 className="text-xl font-bold font-display">
            {user.displayName ?? 'Ойыншы'}
          </h2>
          <p className="text-sm text-muted">{user.email}</p>
        </div>

        {/* ── Ұзындық таңдау ─────────────────────── */}
        <div className="flex w-full border-b border-border mb-5" role="tablist">
          {[4, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={n === selectedLen}
              aria-label={`${n} әріптік сөз статистикасы`}
              onClick={() => setSelectedLen(n)}
              className={`flex-1 py-2 text-sm font-semibold transition-colors border-b-2 ${
                n === selectedLen
                  ? 'text-accent border-accent'
                  : 'text-muted border-transparent hover:text-text'
              }`}
            >
              {n} әріп
            </button>
          ))}
        </div>

        {/* ── Статистика цифрлары ─────────────────── */}
        <div className="grid grid-cols-4 gap-4 text-center mb-6 w-full">
          <StatItem value={s.gamesPlayed} label="Ойын" />
          <StatItem value={`${winPct}%`} label="Жеңіс" />
          <StatItem value={s.currentStreak} label="Қатарынан" />
          <StatItem value={s.maxStreak} label="Рекорд" />
        </div>

        {/* ── Болжам бөлінісі ────────────────────── */}
        <div className="w-full space-y-2 pt-4 border-t border-border">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-widest text-center mb-4">
            Болжам бөлінісі
          </h3>
          {s.guessDistribution.map((count, i) => {
            const pct = count > 0 ? (count / maxDist) * 100 : 0;
            return (
              <div key={i} className="flex items-center gap-3 w-full">
                <div className="w-4 text-right text-muted font-medium text-sm">{i + 1}</div>
                <div className="flex-1">
                  <div
                    className={`h-5 rounded-sm flex items-center justify-end pr-2 transition-all duration-500 ${
                      count > 0 ? 'bg-accent' : 'bg-absent'
                    }`}
                    style={{ width: count > 0 ? `${pct}%` : '28px', minWidth: '28px' }}
                  >
                    <span className="font-bold text-white text-sm">{count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Шығу батырмасы ─────────────────────── */}
        <button
          onClick={() => { onSignOut(); onClose(); }}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-white/5 border border-border hover:bg-red-500/10 hover:border-red-500/30
            transition-all text-sm text-muted hover:text-red-400"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Аккаунттан шығу
        </button>
      </div>
    </Modal>
  );
};

const StatItem: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center">
    <div className="text-3xl font-bold font-display">{value}</div>
    <div className="text-xs text-muted uppercase tracking-wider text-center">{label}</div>
  </div>
);

export default ProfileModal;
