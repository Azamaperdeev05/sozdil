import React, { useState } from 'react';
import Modal from './Modal';
import { ACHIEVEMENTS, loadAchievementsState, Achievement } from '../lib/achievements';

interface AchievementsModalProps {
  onClose: () => void;
}

type CategoryFilter = 'all' | 'wins' | 'streaks' | 'skill' | 'modes' | 'social' | 'special';

const CATEGORIES: { id: CategoryFilter; label: string; icon: string }[] = [
  { id: 'all', label: 'Барлығы', icon: '🌟' },
  { id: 'wins', label: 'Жеңістер', icon: '🏆' },
  { id: 'streaks', label: 'Сериялар', icon: '🔥' },
  { id: 'skill', label: 'Шеберлік', icon: '🎯' },
  { id: 'modes', label: 'Режимдер', icon: '🎮' },
  { id: 'social', label: 'Сайыс', icon: '⚔️' },
  { id: 'special', label: 'Ерекше', icon: '✨' },
];

const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const state = loadAchievementsState();

  const unlockedCount = state.unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;
  const percentComplete = Math.round((unlockedCount / totalCount) * 100);

  const filtered = selectedCategory === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter((a) => a.category === selectedCategory);

  return (
    <Modal title="Жетістіктер 🏆" onClose={onClose}>
      <div className="text-text space-y-4 max-h-[75vh] flex flex-col">
        {/* Overall Progress Banner */}
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="flex items-center gap-2">
              <span className="text-xl">🎖️</span>
              <span>Жалпы прогресс</span>
            </span>
            <span className="text-accent">
              {unlockedCount} / {totalCount} ({percentComplete}%)
            </span>
          </div>

          <div className="w-full bg-border/60 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-accent to-correct h-full rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-surface hover:bg-border text-muted hover:text-text border border-border/50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
          {filtered.map((ach) => {
            const isUnlocked = state.unlockedIds.includes(ach.id);
            const currentVal = state.progress[ach.id] || (isUnlocked ? ach.maxProgress : 0);
            const progressPercent = Math.min(100, Math.round((currentVal / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3.5 ${
                  isUnlocked
                    ? 'bg-surface border-correct/30 shadow-sm'
                    : 'bg-surface/40 border-border/60 opacity-75'
                }`}
              >
                {/* Icon Circle */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform ${
                    isUnlocked
                      ? 'bg-correct/15 border border-correct/30 scale-105'
                      : 'bg-border/40 grayscale opacity-60'
                  }`}
                >
                  {ach.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-bold truncate ${isUnlocked ? 'text-text' : 'text-muted'}`}>
                      {ach.title}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-[11px] font-bold text-correct bg-correct/10 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                        ✓ Ашылды
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-muted flex-shrink-0">
                        {currentVal} / {ach.maxProgress}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted leading-tight mt-0.5">
                    {ach.description}
                  </p>

                  {/* Progress bar if not unlocked and maxProgress > 1 */}
                  {!isUnlocked && ach.maxProgress > 1 && (
                    <div className="w-full bg-border/80 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-accent h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default AchievementsModal;
