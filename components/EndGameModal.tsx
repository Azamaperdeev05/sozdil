import React, { useState, useEffect } from 'react';
import { CheckCircle, Share, Gamepad, CupTrophy, Download, Flame, ShieldCheck, ChevronRight } from 'reicon-react';
import Modal from './Modal';
import Countdown from './Countdown';
import { LetterStatus, GameStatus, StatsData } from '../types';
import { MAX_GUESSES, APP_URL, UI_MESSAGES } from '../constants';
import { usePWAInstall } from '../lib/usePWAInstall';
import { trackEvent } from '../lib/analytics';
import { fetchWordDefinitions, WordDefinition } from '../lib/definitions';

interface EndGameModalProps {
  status: GameStatus;
  solution: string;
  guesses: string[];
  guessStatuses: LetterStatus[][];
  gameNumber: number;
  stats?: StatsData;
  isChallenge?: boolean;
  onCreateChallenge?: () => void;
  onOpenLeaderboard?: () => void;
  onShare: () => void;
  onClose: () => void;
}

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.34-.674.34l.211-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.833.877z" />
  </svg>
);

const ActionRow: React.FC<{ icon: React.ReactNode; title: string; hint: string; onClick?: () => void }> = ({ icon, title, hint, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface active:bg-surface-2 transition"
  >
    <span className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-text shrink-0">{icon}</span>
    <span className="flex-1 min-w-0">
      <span className="block text-sm font-semibold text-text">{title}</span>
      <span className="block text-xs text-muted truncate">{hint}</span>
    </span>
    <ChevronRight size={18} weight="Outline" className="text-muted shrink-0" />
  </button>
);

const EndGameModal: React.FC<EndGameModalProps> = ({
  status,
  solution,
  guesses,
  guessStatuses,
  gameNumber,
  stats,
  isChallenge = false,
  onCreateChallenge,
  onOpenLeaderboard,
  onShare,
  onClose,
}) => {
  const { installed, canPrompt, promptInstall, isIOS } = usePWAInstall();
  const [definitions, setDefinitions] = useState<WordDefinition[]>([]);
  const [isLoadingDefs, setIsLoadingDefs] = useState(true);
  const [showAllDefs, setShowAllDefs] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoadingDefs(true);
    fetchWordDefinitions(solution)
      .then((defs) => {
        if (!isCancelled) {
          setDefinitions(defs);
          setIsLoadingDefs(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setIsLoadingDefs(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [solution]);

  const won = status === 'WON';
  const guessCount = won ? guesses.length : 'X';
  // Share grid keeps the universal Wordle emoji so it reads the same in every chat
  const emojiGrid = guessStatuses
    .map((row) =>
      row.map((s) => (s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛')).join('')
    )
    .join('\n');

  const streakBonus = !isChallenge && won && stats && stats.currentStreak > 0
    ? ` 🔥 ${stats.currentStreak} күн қатарынан!`
    : '';

  const shareHeader = isChallenge
    ? `Мен досымның жасырған сөзін ${guessCount}/${MAX_GUESSES} талпыныста таптым! ⚔️`
    : `Сөзділ #${gameNumber} ${guessCount}/${MAX_GUESSES}${streakBonus}`;

  const shareText = `${shareHeader}\n\n${emojiGrid}\n\n${APP_URL}`;

  const triggerCopiedFeedback = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Сөзділ',
          text: shareText,
          url: APP_URL,
        });
        trackEvent({
          event_type: 'share',
          game_number: gameNumber,
          word_length: guessStatuses[0]?.length,
          platform: 'web_share',
        });
        onShare();
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    navigator.clipboard.writeText(shareText).then(() => {
      trackEvent({
        event_type: 'share',
        game_number: gameNumber,
        word_length: guessStatuses[0]?.length,
        platform: 'clipboard',
      });
      triggerCopiedFeedback();
      onShare();
    });
  };

  const trackShare = (platform: string) => () =>
    trackEvent({
      event_type: 'share',
      game_number: gameNumber,
      word_length: guessStatuses[0]?.length,
      platform,
    });

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${encodeURIComponent(shareHeader + '\n\n' + emojiGrid)}`;

  const title = isChallenge
    ? (won ? 'Досыңыздың сөзін таптыңыз!' : 'Сөз табылмады')
    : (won ? UI_MESSAGES.GAME_WON : UI_MESSAGES.GAME_LOST);

  const showInstall = !installed && (canPrompt || isIOS);

  return (
    <Modal title="" onClose={onClose}>
      <div className="space-y-5 text-text">
        {/* Result */}
        <div className="text-center pt-1 space-y-1.5">
          <p className="text-xs font-semibold text-muted tabular-nums">
            {isChallenge ? 'Сайыс' : `Сөзділ #${gameNumber}`} · {guessCount}/{MAX_GUESSES}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>

          {!isChallenge && won && stats && stats.currentStreak > 0 && (
            <p className="inline-flex items-center gap-1 text-xs font-semibold text-text">
              <Flame size={14} weight="Filled" />
              {stats.currentStreak === 1 ? 'Серияның алғашқы күні' : `Қатарынан ${stats.currentStreak} күн`}
            </p>
          )}
          {!isChallenge && !won && stats && stats.currentStreak > 0 && (
            <p className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
              <ShieldCheck size={14} weight="Filled" />
              Мұздық: {stats.currentStreak} күндік серия сақталды
            </p>
          )}
        </div>

        {/* Solution */}
        <div className="flex flex-col items-center gap-2">
          {!won && <span className="text-[11px] font-semibold text-muted">Жасырын сөз</span>}
          <div className="flex justify-center gap-1.5">
            {solution.split('').map((char, idx) => (
              <div
                key={idx}
                className={`w-9 h-10 sm:w-10 sm:h-11 rounded-lg border-2 font-bold text-lg flex items-center justify-center ${
                  won ? 'bg-accent border-accent text-on-accent' : 'border-ink text-text'
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>

        {/* Definition */}
        <div className="rounded-2xl bg-surface p-4 text-left">
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h4 className="text-xs font-semibold text-muted">Сөздік анықтамасы</h4>
            <a
              href={`https://sozdikqor.kz/search?q=${encodeURIComponent(solution)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium text-muted hover:text-text transition"
            >
              Sozdikqor ↗
            </a>
          </div>

          {isLoadingDefs ? (
            <div className="space-y-1.5 py-1 animate-pulse">
              <div className="h-3 bg-surface-2 rounded w-full" />
              <div className="h-3 bg-surface-2 rounded w-4/5" />
            </div>
          ) : definitions.length > 0 ? (
            <>
              <p className={`text-sm leading-relaxed ${showAllDefs ? 'max-h-48 overflow-y-auto pr-1' : 'line-clamp-3'}`}>
                {definitions[0].t}
              </p>
              {definitions[0].s && <p className="text-[11px] text-muted mt-1.5 line-clamp-1">{definitions[0].s}</p>}

              {showAllDefs && definitions.length > 1 && (
                <div className="space-y-3 mt-3 pt-3 border-t border-border max-h-40 overflow-y-auto pr-1">
                  {definitions.slice(1).map((def, idx) => (
                    <div key={idx}>
                      <p className="text-sm leading-relaxed">{def.t}</p>
                      <span className="text-[11px] text-muted">{def.s}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowAllDefs(!showAllDefs)}
                className="mt-2 text-xs font-semibold text-text underline underline-offset-4 decoration-border hover:decoration-text"
              >
                {showAllDefs ? 'Жинау' : definitions.length > 1 ? `Толық оқу · ${definitions.length} дереккөз` : 'Толық оқу'}
              </button>
            </>
          ) : (
            <p className="text-sm text-muted">Бұл сөздің мағынасын Sozdikqor.kz сайтынан көре аласыз.</p>
          )}
        </div>

        {/* Share: one primary action, two quiet shortcuts */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleShare}
            aria-label={UI_MESSAGES.SHARE_TEXT}
            className="w-full h-12 rounded-full bg-ink text-on-ink font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            {copied ? (
              <>
                <CheckCircle size={18} weight="Filled" />
                <span>Нәтиже көшірілді</span>
              </>
            ) : (
              <>
                <Share size={18} weight="Outline" />
                <span>Нәтижемен бөлісу</span>
              </>
            )}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackShare('whatsapp')}
              className="h-11 rounded-full border border-border text-text font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface active:scale-[0.98] transition"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackShare('telegram')}
              className="h-11 rounded-full border border-border text-text font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface active:scale-[0.98] transition"
            >
              <TelegramIcon />
              Telegram
            </a>
          </div>
        </div>

        {/* Next steps */}
        {(onCreateChallenge || onOpenLeaderboard || showInstall) && (
          <div className="rounded-2xl border border-border divide-y divide-border overflow-hidden">
            {onCreateChallenge && (
              <ActionRow
                icon={<Gamepad size={18} weight="Outline" />}
                title="Досыңа сөз жасыр"
                hint="Сөз ойлап тап та, сілтемесін жібер"
                onClick={onCreateChallenge}
              />
            )}
            {onOpenLeaderboard && (
              <ActionRow
                icon={<CupTrophy size={18} weight="Outline" />}
                title="Рейтинг"
                hint="Өз орныңды көріп, атыңды сақта"
                onClick={onOpenLeaderboard}
              />
            )}
            {showInstall && (
              <ActionRow
                icon={<Download size={18} weight="Outline" />}
                title="Басты экранға қосу"
                hint={canPrompt ? 'Ертең бір түртумен ашыңыз' : 'Safari: Бөлісу → Басты экранға қосу'}
                onClick={canPrompt ? promptInstall : undefined}
              />
            )}
          </div>
        )}

        {!isChallenge && (
          <div className="pt-1">
            <Countdown compact={true} />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EndGameModal;
