import React, { useState, useEffect } from 'react';
import { CheckCircle, Share, Gamepad, BookOpen } from 'reicon-react';
import Modal from './Modal';
import Countdown from './Countdown';
import { LetterStatus, GameStatus, StatsData } from '../types';
import { MAX_GUESSES, APP_URL, UI_MESSAGES } from '../constants';
import { usePWAInstall } from '../lib/usePWAInstall';
import { trackEvent } from '../lib/analytics';
import { fetchWordDefinitions, WordDefinition } from '../lib/definitions';

const ShareTile: React.FC<{ status: LetterStatus }> = ({ status }) => {
  const statusClasses: Record<LetterStatus, string> = {
    correct: 'bg-correct',
    present: 'bg-present',
    absent: 'bg-absent',
    default: 'bg-surface',
  };
  return <div className={`w-full aspect-square rounded-[3px] ${statusClasses[status]}`} />;
};

const ShareRow: React.FC<{ statuses: LetterStatus[] }> = ({ statuses }) => {
  const cols: Record<number, string> = { 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' };
  return (
    <div className={`grid ${cols[statuses.length] ?? 'grid-cols-6'} gap-1`}>
      {statuses.map((s, i) => <ShareTile key={i} status={s} />)}
    </div>
  );
};

interface EndGameModalProps {
  status: GameStatus;
  solution: string;
  guesses: string[];
  guessStatuses: LetterStatus[][];
  gameNumber: number;
  stats?: StatsData;
  isChallenge?: boolean;
  onCreateChallenge?: () => void;
  onShare: () => void;
  onClose: () => void;
}

const EndGameModal: React.FC<EndGameModalProps> = ({
  status,
  solution,
  guesses,
  guessStatuses,
  gameNumber,
  stats,
  isChallenge = false,
  onCreateChallenge,
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

  const guessCount = status === 'WON' ? guesses.length : 'X';
  const emojiGrid = guessStatuses
    .map((row) =>
      row.map((s) => (s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛')).join('')
    )
    .join('\n');

  const streakBonus = !isChallenge && status === 'WON' && stats && stats.currentStreak > 0
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

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${encodeURIComponent(shareHeader + '\n\n' + emojiGrid)}`;

  return (
    <Modal title="" onClose={onClose}>
      <div className="text-center space-y-2.5 sm:space-y-3">
        {/* Top Celebration / Encouragement Status Badge */}
        <div className="space-y-1">
          {status === 'WON' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-correct/15 border border-correct/30 text-correct text-xs font-bold shadow-[0_0_15px_rgba(34,197,94,0.15)] animate-fade-in">
              <CheckCircle size={15} weight="Filled" />
              <span>{isChallenge ? 'ТАПСЫРМА ОРЫНДАЛДЫ!' : 'КЕРЕМЕТ ЖЕҢІС!'}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold animate-fade-in">
              <span>💪</span>
              <span>КЕЛЕСІ ЖОЛЫ СӘТТІЛІК!</span>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            {isChallenge
              ? (status === 'WON' ? 'Досыңыздың сөзін таптыңыз! ⚔️' : 'Сөз табылмады ⚔️')
              : (status === 'WON' ? UI_MESSAGES.GAME_WON : UI_MESSAGES.GAME_LOST)}
          </h2>

          {/* Daily Streak Motivation Banner */}
          {!isChallenge && status === 'WON' && stats && stats.currentStreak > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/30 rounded-full py-0.5 px-3 text-amber-400 font-bold text-[11px] shadow-sm">
              <span>🔥</span>
              <span>
                {stats.currentStreak === 1
                  ? 'Алғашқы күн жеңісі! Құттықтаймыз!'
                  : `Қатарынан ${stats.currentStreak} күн жеңіс!`}
              </span>
            </div>
          )}

          {/* Мұздық 🧊 (Streak Freeze Banner on LOST) */}
          {!isChallenge && status === 'LOST' && stats && stats.currentStreak > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sky-500/15 via-blue-500/15 to-sky-500/15 border border-sky-500/30 rounded-full py-0.5 px-3 text-sky-300 font-bold text-[11px] shadow-sm animate-fade-in">
              <span>🧊</span>
              <span>Мұздық іске қосылды: {stats.currentStreak} күндік серияңыз сақталды!</span>
            </div>
          )}
        </div>

        {/* Compact Emoji Guess Grid */}
        <div className="flex justify-center my-0.5">
          <div className="bg-black/35 border border-white/10 rounded-xl p-2 shadow-inner w-[140px] sm:w-[150px]">
            <div className="flex flex-col gap-1 w-full">
              {guessStatuses.map((statuses, i) => (
                <ShareRow key={i} statuses={statuses} />
              ))}
            </div>
          </div>
        </div>

        {/* Target Solution Word Showcase (Wordle Tile Style) */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted/70">
            {status === 'WON' ? 'Табылған сөз' : 'Жасырын сөз'}
          </span>
          <div className="flex items-center justify-center gap-1">
            {solution.split('').map((char, idx) => (
              <div
                key={idx}
                className={`w-7 h-8 sm:w-8 sm:h-9 rounded-lg font-black text-base sm:text-lg flex items-center justify-center transition-all ${
                  status === 'WON'
                    ? 'bg-correct/20 border border-correct/50 text-correct shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                    : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>

        {/* In-app Dictionary Definition Card */}
        <div className="bg-gradient-to-b from-[#162035]/90 to-[#12192A]/90 border border-white/10 rounded-2xl p-3 sm:p-3.5 text-left text-xs shadow-lg relative overflow-hidden">
          {/* Subtle ambient light */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 text-accent flex items-center justify-center shrink-0">
                <BookOpen size={15} weight="Filled" />
              </div>
              <div>
                <h4 className="font-bold text-text text-xs sm:text-sm tracking-tight leading-none">
                  Сөздік анықтамасы
                </h4>
                {definitions[0]?.s && (
                  <span className="text-[10px] text-muted line-clamp-1 mt-0.5">
                    {definitions[0].s}
                  </span>
                )}
              </div>
            </div>

            {definitions.length > 0 && (
              <span className="text-[10px] bg-white/5 border border-white/10 text-muted px-2 py-0.5 rounded-full font-medium shrink-0">
                {definitions.length} {definitions.length === 1 ? 'сөздік' : 'дереккөз'}
              </span>
            )}
          </div>

          {isLoadingDefs ? (
            <div className="space-y-1.5 py-2 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-1/3"></div>
              <div className="h-3 bg-white/5 rounded w-full"></div>
              <div className="h-3 bg-white/5 rounded w-4/5"></div>
            </div>
          ) : definitions.length > 0 ? (
            <div className="space-y-2 mt-1">
              {/* Primary Definition */}
              <p
                className={`text-slate-200 leading-relaxed text-xs sm:text-[13px] font-normal ${
                  showAllDefs ? 'max-h-48 overflow-y-auto pr-1' : 'line-clamp-3'
                }`}
              >
                {definitions[0].t}
              </p>

              {/* Collapsed Secondary Definitions */}
              {showAllDefs && definitions.length > 1 && (
                <div className="space-y-2 pt-2 border-t border-white/10 max-h-40 overflow-y-auto pr-1">
                  {definitions.slice(1).map((def, idx) => (
                    <div key={idx} className="space-y-1 border-l-2 border-accent/40 pl-2">
                      <span className="text-[10px] font-semibold text-accent/80 block">
                        {def.s}
                      </span>
                      <p className="text-slate-300 leading-relaxed text-xs">
                        {def.t}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowAllDefs(!showAllDefs)}
                  className="text-accent hover:text-accent/80 font-semibold cursor-pointer transition-colors"
                >
                  {showAllDefs ? 'Жинақтау ▲' : 'Толық оқу ▾'}
                </button>
                <a
                  href={`https://sozdikqor.kz/search?q=${encodeURIComponent(solution)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Sozdikqor</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>
          ) : (
            <p className="text-muted text-[11px] pt-1">
              Бұл сөздің толық мағынасын Sozdikqor.kz сайтынан көре аласыз.
            </p>
          )}
        </div>

        {/* Create Challenge Reply Button (Gamified Action) */}
        {onCreateChallenge && (
          <button
            type="button"
            onClick={onCreateChallenge}
            className="w-full bg-gradient-to-r from-purple-950/40 via-violet-900/30 to-indigo-950/40 hover:from-purple-900/50 hover:to-indigo-900/50 border border-purple-500/30 hover:border-purple-500/50 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between text-left transition-all active:scale-98 group cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Gamepad size={18} weight="Outline" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                  Өз кезегіңде досыңа сөз жасыр!
                </div>
                <div className="text-[10px] text-muted">
                  Сөз ойлап тап та, сілтемесін жібер ⚔️
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30 shrink-0 group-hover:bg-purple-500/30 transition-colors">
              Жасыру →
            </span>
          </button>
        )}

        {/* Retention / PWA Install Prompt */}
        {!installed && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-left">
            <div className="flex items-center gap-2">
              <span className="text-base">📲</span>
              <div>
                <span className="font-semibold text-text block text-[11px]">Күн сайын сөзді тап!</span>
                <span className="text-[10px] text-muted">Басты экранға қосып, тез ашыңыз</span>
              </div>
            </div>
            {canPrompt ? (
              <button
                type="button"
                onClick={promptInstall}
                className="px-3 py-1 bg-gradient-to-r from-accent to-violet-600 text-white font-bold rounded-lg text-[11px] hover:brightness-110 active:scale-95 transition-all shadow cursor-pointer whitespace-nowrap"
              >
                Орнату
              </button>
            ) : isIOS ? (
              <span className="text-[10px] text-accent font-semibold whitespace-nowrap bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                Бөлісу ⎋ → Басты экран
              </span>
            ) : null}
          </div>
        )}

        {/* Countdown & Social Share Actions */}
        <div className="space-y-2 pt-2 border-t border-white/10 mt-1">
          {!isChallenge && <Countdown compact={true} />}

          {/* WhatsApp & Telegram Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent({
                  event_type: 'share',
                  game_number: gameNumber,
                  word_length: guessStatuses[0]?.length,
                  platform: 'whatsapp',
                });
              }}
              className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-105 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-[0_4px_14px_rgba(37,211,102,0.2)]"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent({
                  event_type: 'share',
                  game_number: gameNumber,
                  word_length: guessStatuses[0]?.length,
                  platform: 'telegram',
                });
              }}
              className="bg-gradient-to-r from-[#2AABEE] to-[#229ED9] hover:brightness-105 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-[0_4px_14px_rgba(42,171,238,0.2)]"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.34-.674.34l.211-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.833.877z" />
              </svg>
              <span>Telegram</span>
            </a>
          </div>

          {/* Primary Share Action */}
          <button
            type="button"
            onClick={handleShare}
            aria-label={UI_MESSAGES.SHARE_TEXT}
            className="w-full bg-gradient-to-r from-[#6C47FF] via-[#7B57FF] to-[#8E6CFF] hover:brightness-110 active:scale-98 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-[0_4px_20px_rgba(108,71,255,0.35)] cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle size={18} weight="Filled" className="text-white" />
                <span>Нәтиже көшірілді! ✅</span>
              </>
            ) : (
              <>
                <Share size={18} weight="Outline" />
                <span>{UI_MESSAGES.SHARE_TEXT}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EndGameModal;
