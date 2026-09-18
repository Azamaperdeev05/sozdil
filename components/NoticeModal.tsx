import React from 'react';
import Modal from './Modal';
import { Sparkle, ShieldCheck, Heart } from 'reicon-react';

interface NoticeModalProps {
  onClose: () => void;
}

const NoticeModal: React.FC<NoticeModalProps> = ({ onClose }) => {
  return (
    <Modal title="Маңызды хабарлама 📢" onClose={onClose}>
      <div className="text-sm text-text/90 space-y-4 pt-1">
        <p className="text-muted leading-relaxed text-sm">
          Құрметті <span className="font-semibold text-text">Сөзділ</span> ойыншылары! Соңғы күндері (әсіресе 17 қыркүйекте) сөздік қорындағы техникалық ақау салдарынан кейбір қате немесе қазақ тіліне жат сөздердің («ИЕҢДІ», «АЛЫШДЫ») кездесіп қалғаны үшін <span className="text-amber-400 font-medium">шын жүректен кешірім сұраймыз</span>.
        </p>

        <div className="bg-surface/60 border border-border/80 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <Sparkle size={18} weight="Fill" />
            </div>
            <div>
              <h4 className="font-semibold text-text text-[13px]">Сөздік толық тазартылды</h4>
              <p className="text-xs text-muted leading-snug mt-0.5">
                Базадан 800-ге жуық қырғыз, өзбек, көнетүркі және қате жазылған сөздер түбегейлі өшірілді.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
              <ShieldCheck size={18} weight="Fill" />
            </div>
            <div>
              <h4 className="font-semibold text-text text-[13px]">Алгоритм күшейтілді</h4>
              <p className="text-xs text-muted leading-snug mt-0.5">
                Сөзді іріктейтін алгоритмге қатаң орфоэпиялық және сингармонизм сүзгілері орнатылды. Енді тек таза әдеби қазақ сөздері беріледі.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-muted pt-1">
          <Heart size={16} weight="Fill" className="text-rose-500 shrink-0" />
          <span>Шағымдарыңыз бен ұсыныстарыңыз ойынның сапасын арттыруға зор көмек болды. Көп рақмет!</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-accent hover:bg-accent/90 text-white font-medium text-sm transition-all duration-150 shadow-lg shadow-accent/20 active:scale-[0.98] cursor-pointer"
        >
          Түсінікті, ойынға көшу
        </button>
      </div>
    </Modal>
  );
};

export default NoticeModal;
