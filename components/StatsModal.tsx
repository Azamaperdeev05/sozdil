import React from 'react';
import Modal from './Modal';
import { StatsData } from '../types';
import { UI_MESSAGES } from '../constants';

const StatItem: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="text-3xl font-bold tabular-nums leading-none">{value}</div>
    <div className="text-[11px] text-muted text-center leading-tight">{label}</div>
  </div>
);

const StatsModal: React.FC<{ stats: StatsData; onClose: () => void }> = ({ stats, onClose }) => {
  const winPercentage = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  return (
    <Modal title={UI_MESSAGES.STATISTICS} onClose={onClose}>
      <div className="text-text">
        <div className="grid grid-cols-4 gap-2 pb-5">
          <StatItem value={stats.gamesPlayed} label="Ойын" />
          <StatItem value={winPercentage} label="Жеңіс %" />
          <StatItem value={stats.currentStreak} label="Қазіргі серия" />
          <StatItem value={stats.maxStreak} label="Ең ұзақ серия" />
        </div>
        <div className="pt-5 border-t border-border space-y-1.5">
          <h3 className="text-xs font-semibold text-muted text-center mb-3">Неше талпыныста таптыңыз</h3>
          {stats.guessDistribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-3 text-right text-xs font-semibold text-muted tabular-nums">{i + 1}</div>
              <div className="flex-1">
                <div
                  className={`h-6 rounded-md flex items-center justify-end px-2 text-xs font-bold tabular-nums ${
                    count > 0 ? 'bg-ink text-on-ink' : 'bg-surface text-muted'
                  }`}
                  style={{ width: `${Math.max((count / maxDistribution) * 100, 8)}%`, minWidth: '1.75rem' }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default StatsModal;
