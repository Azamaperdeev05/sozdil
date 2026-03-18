import React from 'react';
import Modal from './Modal';
import { StatsData } from '../types';
import { UI_MESSAGES } from '../constants';

const StatItem: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center">
    <div className="text-3xl font-bold font-display">{value}</div>
    <div className="text-xs text-muted uppercase tracking-wider text-center">{label}</div>
  </div>
);

const StatsModal: React.FC<{ stats: StatsData; onClose: () => void }> = ({ stats, onClose }) => {
  const winPercentage = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  return (
    <Modal title={UI_MESSAGES.STATISTICS} onClose={onClose}>
      <div className="flex flex-col items-center text-text">
        <div className="grid grid-cols-4 gap-4 text-center mb-6 w-full">
          <StatItem value={stats.gamesPlayed} label="Ойналғаны" />
          <StatItem value={winPercentage} label="Жеңіс %" />
          <StatItem value={stats.currentStreak} label="Қазіргі серия" />
          <StatItem value={stats.maxStreak} label="Ең ұзақ серия" />
        </div>
        <div className="w-full space-y-2 mt-4 pt-4 border-t border-border">
          <h3 className="text-xl font-bold text-center mb-4">Табу тарихы</h3>
          {stats.guessDistribution.map((count, i) => {
            const widthPercent = count > 0 ? (count / maxDistribution) * 100 : 0;
            return (
              <div key={i} className="flex items-center gap-3 w-full">
                <div className="w-4 text-right text-muted font-medium">{i + 1}</div>
                <div className="flex-1">
                  <div
                    className="bg-accent h-5 rounded-sm flex items-center justify-end pr-2"
                    style={{ width: count > 0 ? `${widthPercent}%` : '28px', minWidth: '28px' }}
                  >
                    <span className="font-bold text-white text-sm">{count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default StatsModal;
