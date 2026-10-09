import React, { useState, useEffect } from 'react';
import {
  CupTrophy,
  MedalStar,
  CheckCircle,
  Edit2,
  Share,
  Star,
  Flame,
  Crown,
  Diamonds,
  User,
  Bullseye,
  ShieldCheck,
} from 'reicon-react';
import Modal from './Modal';
import {
  LEAGUE_TIERS,
  GUESS_POINTS,
  getPlayerProfile,
  savePlayerNickname,
  fetchLeaderboard,
  getNextLeagueTier,
  getLeagueTier,
  isValidNickname,
  checkNicknameAvailability,
  EMOJI_REGEX,
  PlayerProfile,
  LeaderboardEntry,
} from '../lib/leaderboard';

const TierIcon: React.FC<{ tierId: string; size?: number; className?: string }> = ({
  tierId,
  size = 18,
  className = '',
}) => {
  switch (tierId) {
    case 'master':
      return <Crown size={size} weight="Filled" className={`text-purple-400 ${className}`} />;
    case 'diamond':
      return <Diamonds size={size} weight="Filled" className={`text-cyan-400 ${className}`} />;
    case 'gold':
      return <MedalStar size={size} weight="Filled" className={`text-yellow-400 ${className}`} />;
    case 'silver':
      return <MedalStar size={size} weight="Filled" className={`text-slate-300 ${className}`} />;
    case 'bronze':
      return <MedalStar size={size} weight="Filled" className={`text-amber-600 ${className}`} />;
    case 'starter':
    default:
      return <User size={size} weight="Filled" className={`text-slate-400 ${className}`} />;
  }
};

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-black text-xs shadow-[0_0_12px_rgba(245,158,11,0.45)] border border-amber-300/40">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 font-black text-xs shadow-sm border border-slate-200/40">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-amber-100 font-black text-xs shadow-sm border border-amber-600/40">
        3
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 font-mono font-bold text-muted/70 text-xs">
      #{rank}
    </span>
  );
};

interface LeaderboardModalProps {
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [profile, setProfile] = useState<PlayerProfile>(getPlayerProfile());
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'tiers'>('leaderboard');
  const [isEditingNick, setIsEditingNick] = useState(!profile.nickname);
  const [nicknameInput, setNicknameInput] = useState(profile.nickname || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [suggestedNick, setSuggestedNick] = useState<string | null>(null);
  const [isCheckingNick, setIsCheckingNick] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    fetchLeaderboard()
      .then((data) => {
        setEntries(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nicknameInput.trim();
    const validation = isValidNickname(trimmed);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Қате никнейм');
      return;
    }

    setIsCheckingNick(true);
    setErrorMsg('');
    setSuggestedNick(null);

    const check = await checkNicknameAvailability(trimmed, profile.visitorId);
    if (!check.available) {
      setIsCheckingNick(false);
      setErrorMsg(check.error || 'Бұл никнейм бос емес');
      if (check.suggestion) {
        setSuggestedNick(check.suggestion);
      }
      return;
    }

    const updated = savePlayerNickname(trimmed);
    setProfile(updated);
    setIsEditingNick(false);
    setIsCheckingNick(false);
    setErrorMsg('');
    loadData();
  };

  const { nextTier, daysRemaining } = getNextLeagueTier(profile.currentStreak);
  const myRank = entries.find((e) => e.isCurrentPlayer)?.rank || '-';

  return (
    <Modal title="" onClose={onClose}>
      <div className="text-text space-y-3.5 max-h-[82vh] flex flex-col">
        {/* Onboarding View: When player hasn't entered a nickname yet */}
        {isEditingNick ? (
          <div className="space-y-4 py-2 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <CupTrophy size={32} weight="Filled" />
            </div>

            <div>
              <h3 className="text-xl font-black font-display text-white">
                {profile.nickname ? 'Лақап атын өзгерту' : 'Рейтингке қосылу'}
              </h3>
              <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
                Өз лақап атыңызды жазып, күнделікті сөз шеберлерінің арасында өз орныңызды алыңыз!
              </p>
            </div>

            <form onSubmit={handleSaveNickname} className="space-y-3 max-w-sm mx-auto text-left">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Лақап атыңыз (Никнейм) *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={nicknameInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNicknameInput(val);
                    setSuggestedNick(null);
                    if (EMOJI_REGEX.test(val)) {
                      setErrorMsg('Никнеймде стикер немесе эмодзи қолдануға болмайды');
                    } else if (errorMsg) {
                      setErrorMsg('');
                    }
                  }}
                  placeholder="Мысалы: Батыр_01, Айсұлу"
                  className="w-full bg-surface border border-border/80 focus:border-accent text-text rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-muted/60"
                  autoFocus
                />
                <p className="text-[11px] text-muted/70 mt-1">
                  Тек әріптер, сандар, «_», «.», «-» (стикер мен эмодзиге тыйым салынған)
                </p>
                {errorMsg && (
                  <div className="mt-1.5 space-y-1.5">
                    <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
                    {suggestedNick && (
                      <button
                        type="button"
                        onClick={() => {
                          setNicknameInput(suggestedNick);
                          setSuggestedNick(null);
                          setErrorMsg('');
                        }}
                        className="text-xs text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>«{suggestedNick}» деп таңдау</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {profile.nickname && (
                  <button
                    type="button"
                    onClick={() => setIsEditingNick(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-border bg-surface hover:bg-white/5 text-muted text-xs font-bold transition-all cursor-pointer"
                  >
                    Артқа
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isCheckingNick}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-accent via-indigo-600 to-violet-600 hover:brightness-110 active:scale-98 text-white text-xs sm:text-sm font-bold transition-all shadow-[0_4px_16px_rgba(108,71,255,0.35)] cursor-pointer disabled:opacity-50"
                >
                  {isCheckingNick ? 'Тексерілуде...' : 'Рейтингтен орын алу'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Header with Title and Tab Switcher */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-amber-400">
                <CupTrophy size={20} weight="Filled" />
                <h3 className="text-lg sm:text-xl font-black font-display text-white">
                  Рейтинг және Лигалар
                </h3>
              </div>

              {/* Tab Navigation */}
              <div className="flex rounded-xl bg-surface/90 p-1 border border-border/70 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('leaderboard')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                    activeTab === 'leaderboard'
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  <CupTrophy size={14} weight="Filled" className={activeTab === 'leaderboard' ? 'text-white' : 'text-amber-400'} />
                  <span>ТОП Ойыншылар</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('tiers')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                    activeTab === 'tiers'
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  <MedalStar size={14} weight="Filled" className={activeTab === 'tiers' ? 'text-white' : 'text-amber-400'} />
                  <span>Лигалар</span>
                </button>
              </div>
            </div>

            {/* TAB 1: LEADERBOARD LIST */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-3 flex flex-col overflow-hidden">
                {/* My Status Card */}
                <div className="bg-gradient-to-r from-[#172033] to-[#12192A] border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                        <TierIcon tierId={profile.currentStreak === 0 ? 'starter' : profile.tier.id} size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white">
                            {profile.nickname}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingNick(true)}
                            title="Атты өзгерту"
                            className="text-muted hover:text-accent p-0.5 transition-colors cursor-pointer"
                          >
                            <Edit2 size={13} weight="Outline" />
                          </button>
                        </div>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${profile.tier.bgBadge}`}>
                          {profile.tier.nameKz}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-muted tracking-wider">
                        Орныңыз
                      </div>
                      <div className="text-base sm:text-lg font-black text-amber-400 font-mono">
                        #{myRank}
                      </div>
                    </div>
                  </div>

                  {/* Stats Mini Badges */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/5">
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2 text-center">
                      <span className="text-[10px] text-muted block">Ұпайыңыз</span>
                      <span className="inline-flex items-center justify-center gap-1 text-sm font-black text-white font-mono mt-0.5">
                        <Star size={13} weight="Filled" className="text-amber-400" />
                        <span>{profile.totalScore}</span>
                      </span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2 text-center">
                      <span className="text-[10px] text-muted block">Стрик сериясы</span>
                      <span className="inline-flex items-center justify-center gap-1 text-sm font-black text-amber-400 font-mono mt-0.5">
                        <Flame size={14} weight="Filled" className="text-orange-500" />
                        <span>{profile.currentStreak} күн</span>
                      </span>
                    </div>
                  </div>

                  {/* Next Tier Progression */}
                  {nextTier && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 text-[11px] text-muted flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5">
                        <span>Келесі дәреже:</span>
                        <TierIcon tierId={nextTier.id} size={14} />
                        <span className="font-semibold text-text">{nextTier.nameKz}</span>
                      </span>
                      <span className="font-semibold text-accent">
                        {daysRemaining} күн қалды
                      </span>
                    </div>
                  )}
                </div>

                {/* Leaderboard Table List */}
                <div className="overflow-y-auto max-h-[36vh] space-y-1.5 pr-0.5">
                  {isLoading ? (
                    <div className="space-y-2 py-4 animate-pulse">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 bg-white/5 rounded-xl"></div>
                      ))}
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-surface/50 border border-border/40 rounded-2xl space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <CupTrophy size={26} weight="Filled" />
                      </div>
                      <p className="text-sm font-bold text-text">Әзірге рейтинг бос</p>
                      <p className="text-xs text-muted max-w-xs mx-auto">
                        Күнделікті сөздерді тауып, алғашқы болып ТОП-1 орынға шығыңыз!
                      </p>
                    </div>
                  ) : (
                    entries.map((entry) => {
                      const tier = getLeagueTier(entry.streak);

                      return (
                        <div
                          key={entry.visitorId}
                          className={`flex items-center justify-between p-2 sm:p-2.5 rounded-xl border text-xs transition-all ${
                            entry.isCurrentPlayer
                              ? 'bg-accent/15 border-accent/40 shadow-sm'
                              : 'bg-surface/70 border-border/50 hover:bg-surface'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RankBadge rank={entry.rank} />
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-text">
                                <span className="truncate max-w-[130px] sm:max-w-[180px]">{entry.nickname}</span>
                                {entry.isCurrentPlayer && (
                                  <span className="text-[9px] bg-accent text-white px-1.5 py-0.2 rounded-full font-semibold shrink-0">
                                    Сіз
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-muted/70 block font-normal -mt-0.5">
                                {tier.nameKz}
                              </span>
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-end">
                            <span className="inline-flex items-center gap-1 font-mono font-extrabold text-amber-400 text-xs sm:text-sm">
                              <Flame size={13} weight="Filled" className="text-orange-500 shrink-0" />
                              <span>{entry.streak} күн</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted font-medium mt-0.5">
                              <Star size={11} weight="Filled" className="text-amber-400/90 shrink-0" />
                              <span>{entry.score} ұп</span>
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: LEAGUE TIERS & SMART SCORING EXPLANATION */}
            {activeTab === 'tiers' && (
              <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-0.5 text-left text-xs">
                {/* 5 League Tiers */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted">
                    Лигалар мен Дәрежелер:
                  </h4>
                  {LEAGUE_TIERS.map((tier) => {
                    const isMyTier = profile.tier.id === tier.id;
                    return (
                      <div
                        key={tier.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                          isMyTier
                            ? `${tier.bgBadge} ${tier.borderColor} shadow-sm`
                            : 'bg-surface/80 border-border/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <TierIcon tierId={tier.id} size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-text flex items-center gap-1.5">
                              <span>{tier.nameKz}</span>
                              {isMyTier && (
                                <span className="text-[9px] bg-accent text-white px-1.5 py-0.5 rounded font-bold">
                                  Сіздің лигаңыз
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted">
                              {tier.description}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-muted shrink-0">
                          {tier.maxStreak === Infinity
                            ? '61+ күн'
                            : `${tier.minStreak}–${tier.maxStreak} күн`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Smart Scoring Rules Card */}
                <div className="bg-surface/80 border border-border/80 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
                    <Bullseye size={15} weight="Filled" />
                    <span>«Ақылды ұпай» формуласы (Античит)</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Сөзді соқыр бақпен немесе басқа телефоннан қарап 1-талпыныстан табуға ең аз балл беріледі. Шынайы шеберлік пен логика сыналады:
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono text-[11px]">
                    <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                      <span className="text-muted block text-[10px]">1-талпыныс</span>
                      <span className="font-bold text-muted">30 ұп</span>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                      <span className="text-muted block text-[10px]">2-талпыныс</span>
                      <span className="font-bold text-emerald-400">70 ұп</span>
                    </div>
                    <div className="bg-amber-500/15 p-1.5 rounded-lg border border-amber-500/30">
                      <span className="text-amber-400 font-bold block text-[10px] inline-flex items-center justify-center gap-1">
                        3-талпыныс <Star size={10} weight="Filled" />
                      </span>
                      <span className="font-extrabold text-amber-300">100 ұп</span>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                      <span className="text-muted block text-[10px]">4-талпыныс</span>
                      <span className="font-bold text-text">80 ұп</span>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                      <span className="text-muted block text-[10px]">5-талпыныс</span>
                      <span className="font-bold text-text">60 ұп</span>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                      <span className="text-muted block text-[10px]">6-талпыныс</span>
                      <span className="font-bold text-muted">40 ұп</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-300/90 pt-1 flex items-start gap-1.5 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 leading-snug">
                    <CheckCircle size={16} weight="Filled" className="text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Рейтинг ережесі:</strong> Орындар ең алдымен күнделікті үзбей кірген күндер санына (Стрикке) қарай анықталады. Күндер саны тең түскен жағдайда ғана жиналған ұпай санына қаралады.</span>
                  </div>

                  <div className="text-[11px] text-sky-300/90 flex items-start gap-1.5 bg-sky-500/10 p-2.5 rounded-xl border border-sky-500/20 leading-snug">
                    <ShieldCheck size={16} weight="Filled" className="text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Мұздық жүйесі:</strong> Егер сөзді таба алмай қалсаңыз, стригіңіз 0-ге түсіп кетпейді! Мұздық іске қосылып, жинаған күндеріңіз сол күйінде сақталады.</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default LeaderboardModal;
