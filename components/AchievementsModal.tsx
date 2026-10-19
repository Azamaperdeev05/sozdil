import React, { useState } from 'react';
import Modal from './Modal';
import { ACHIEVEMENTS, loadAchievementsState, Achievement } from '../lib/achievements';

interface AchievementsModalProps {
  onClose: () => void;
}

type CategoryFilter = 'all' | 'wins' | 'streaks' | 'skill' | 'modes' | 'social' | 'special';

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'Барлығы' },
  { id: 'wins', label: 'Жеңістер' },
  { id: 'streaks', label: 'Сериялар' },
  { id: 'skill', label: 'Шеберлік' },
  { id: 'modes', label: 'Режимдер' },
  { id: 'social', label: 'Сайыс' },
  { id: 'special', label: 'Ерекше' },
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
    <Modal title="Жетістіктер" onClose={onClose}>
      <div className="text-text space-y-4 max-h-[75svh] flex flex-col">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">Ашылғаны</span>
            <span className="font-bold tabular-nums">
              {unlockedCount}<span className="text-muted font-medium"> / {totalCount}</span>
            </span>
          </div>
          <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
            <div className="bg-ink h-full rounded-full transition-all duration-500" style={{ width: `${percentComplete}%` }} />
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0 -mx-5 px-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              aria-pressed={selectedCategory === cat.id}
              className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id ? 'bg-ink text-on-ink' : 'bg-surface text-muted hover:text-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto divide-y divide-border flex-1 -mx-1 px-1">
          {filtered.map((ach) => {
            const isUnlocked = state.unlockedIds.includes(ach.id);
            const currentVal = state.progress[ach.id] || (isUnlocked ? ach.maxProgress : 0);
            const progressPercent = Math.min(100, Math.round((currentVal / ach.maxProgress) * 100));

            return (
              <div key={ach.id} className="py-3 flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                    isUnlocked ? 'bg-present ring-2 ring-accent' : 'bg-surface grayscale opacity-50'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-semibold truncate ${isUnlocked ? 'text-text' : 'text-muted'}`}>{ach.title}</h4>
                    {isUnlocked ? (
                      <span className="text-[11px] font-semibold text-accent-ink flex-shrink-0">✓ Ашылды</span>
                    ) : (
                      <span className="text-[11px] font-medium text-muted tabular-nums flex-shrink-0">
                        {currentVal}/{ach.maxProgress}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted leading-snug mt-0.5">{ach.description}</p>
                  {!isUnlocked && ach.maxProgress > 1 && (
                    <div className="w-full bg-surface h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-ink h-full rounded-full" style={{ width: `${progressPercent}%` }} />
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
