import React from 'react';
import Modal from './Modal';
import { MedalStar, CupTrophy, ShieldCheck } from 'reicon-react';

interface NoticeModalProps {
  onClose: () => void;
  onOpenLeaderboard?: () => void;
}

const FEATURES = [
  {
    icon: <MedalStar size={18} weight="Outline" />,
    title: '5 лига',
    text: 'Үзбей ойнаған күндеріңе қарай Қоладан «Сөз Зергеріне» дейін өс.',
  },
  {
    icon: <CupTrophy size={18} weight="Outline" />,
    title: 'Ақылды ұпай',
    text: 'Әр тапқан сөзге ұпай. Ең көбі — 3-талпыныста тапқанға (100 ұп).',
  },
  {
    icon: <ShieldCheck size={18} weight="Outline" />,
    title: 'Тек шынайы ойыншылар',
    text: 'Бот жоқ — тек нақты адамдар жарысады.',
  },
];

const NoticeModal: React.FC<NoticeModalProps> = ({ onClose, onOpenLeaderboard }) => {
  const handleOpenLeaderboard = () => {
    onClose();
    onOpenLeaderboard?.();
  };

  return (
    <Modal title="" onClose={onClose}>
      <div className="text-text space-y-5 pt-1">
        <div className="text-center space-y-1.5">
          <span className="inline-block text-[11px] font-semibold text-muted border border-border rounded-full px-2.5 py-0.5">
            Жаңа
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight">Рейтинг және лигалар</h3>
          <p className="text-sm text-muted">Күнделікті сөзді тауып, үздіктер қатарына қосыл.</p>
        </div>

        <ul className="space-y-3.5">
          {FEATURES.map(f => (
            <li key={f.title} className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-full bg-surface flex items-center justify-center shrink-0">{f.icon}</span>
              <span>
                <span className="block text-sm font-semibold">{f.title}</span>
                <span className="block text-xs text-muted leading-snug mt-0.5">{f.text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={handleOpenLeaderboard}
            className="w-full h-12 rounded-full bg-ink text-on-ink font-semibold text-sm active:scale-[0.98] transition"
          >
            Рейтингке өту
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-full text-sm font-medium text-muted hover:text-text transition"
          >
            Кейін
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NoticeModal;
