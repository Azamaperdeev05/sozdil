import React from 'react';
import Modal from './Modal';
import { MedalStar, CupTrophy, ShieldCheck, ArrowCircleRight } from 'reicon-react';

interface NoticeModalProps {
  onClose: () => void;
  onOpenLeaderboard?: () => void;
}

const NoticeModal: React.FC<NoticeModalProps> = ({ onClose, onOpenLeaderboard }) => {
  const handleOpenLeaderboard = () => {
    onClose();
    if (onOpenLeaderboard) {
      onOpenLeaderboard();
    }
  };

  return (
    <Modal title="" onClose={onClose}>
      <div className="text-sm text-text space-y-4 pt-1 text-center">
        {/* Big Trophy Banner */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500/20 via-amber-400/20 to-yellow-300/30 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)] animate-bounce-short">
          <CupTrophy size={32} weight="Filled" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            Жаңа мүмкіндік 🚀
          </span>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-2">
            Рейтинг және Лигалар! 🏅
          </h3>
          <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
            Күнделікті сөздерді тауып, үздік сөз шеберлерінің қатарына қосылыңыз!
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="bg-surface/70 border border-border/80 rounded-2xl p-3.5 space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 shrink-0 mt-0.5 border border-amber-500/20">
              <MedalStar size={18} weight="Filled" />
            </div>
            <div>
              <h4 className="font-bold text-text text-xs sm:text-sm">5 Дәрежелі Лигалар</h4>
              <p className="text-[11px] sm:text-xs text-muted leading-snug mt-0.5">
                Үздіксіз серияңызға (Стрик) байланысты 🥉 Қоладан бастап, ең жоғарғы 👑 «Сөз Зергері» элиталық лигасына дейін өсіңіз.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-accent/15 text-accent shrink-0 mt-0.5 border border-accent/20">
              <CupTrophy size={18} weight="Filled" />
            </div>
            <div>
              <h4 className="font-bold text-text text-xs sm:text-sm">Ақылды ұпайлар жүйесі</h4>
              <p className="text-[11px] sm:text-xs text-muted leading-snug mt-0.5">
                Әр тапқан сөзіңізге ұпай беріледі. 3-талпыныста табу — ең жоғарғы «Алтын ұпай» (100 ұп) әкеледі!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
              <ShieldCheck size={18} weight="Filled" />
            </div>
            <div>
              <h4 className="font-bold text-text text-xs sm:text-sm">Тек шынайы ойыншылар</h4>
              <p className="text-[11px] sm:text-xs text-muted leading-snug mt-0.5">
                Жалған боттар жоқ — тек нақты ойыншылар бір-бірімен жарысады.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleOpenLeaderboard}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-accent via-indigo-600 to-violet-600 hover:brightness-110 active:scale-98 text-white font-bold text-sm transition-all shadow-[0_4px_16px_rgba(108,71,255,0.35)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Рейтингке өту</span>
            <ArrowCircleRight size={18} weight="Bold" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs text-muted hover:text-text hover:bg-white/5 transition-all cursor-pointer font-medium"
          >
            Түсінікті, ойынға көшу
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NoticeModal;
