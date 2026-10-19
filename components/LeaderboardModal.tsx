import React, { useState, useEffect } from 'react';
import {
  CupTrophy,
  MedalStar,
  CheckCircle,
  Edit2,
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
      return <Crown size={size} weight="Filled" className={className} />;
    case 'diamond':
      return <Diamonds size={size} weight="Filled" className={className} />;
    case 'gold':
    case 'silver':
    case 'bronze':
      return <MedalStar size={size} weight="Filled" className={className} />;
    case 'starter':
    default:
      return <User size={size} weight="Filled" className={className} />;
  }
};

// Podium = solid ink; everyone else = plain number
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => (
  <span
    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold tabular-nums shrink-0 ${
      rank <= 3 ? 'bg-ink text-on-ink' : 'text-muted'
    }`}
  >
    {rank}
  </span>
);

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

  const tabClass = (active: boolean) =>
    `h-8 rounded-full text-xs font-semibold transition ${active ? 'bg-ink text-on-ink' : 'text-muted hover:text-text'}`;

  return (
    <Modal title="" onClose={onClose}>
      <div className="text-text space-y-4 max-h-[82svh] flex flex-col">
        {isEditingNick ? (
          <div className="space-y-5 pt-2 animate-fade-in">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-full bg-surface flex items-center justify-center">
                <CupTrophy size={24} weight="Outline" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight pt-1">
                {profile.nickname ? 'Атыңды өзгерт' : 'Рейтингке қосыл'}
              </h3>
              <p className="text-sm text-muted max-w-xs mx-auto">
                Лақап атыңды жаз — сөз шеберлерінің арасындағы орның сақталады.
              </p>
            </div>

            <form onSubmit={handleSaveNickname} className="space-y-3">
              <div>
                <label htmlFor="nickname-input" className="block text-xs font-semibold text-muted mb-1.5">
                  Лақап ат
                </label>
                <input
                  id="nickname-input"
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
                  placeholder="Мысалы: Батыр_01"
                  className="w-full h-12 bg-bg border-2 border-border focus:border-ink rounded-2xl px-4 text-sm outline-none transition placeholder:text-muted/70"
                  autoFocus
                />
                <p className="text-[11px] text-muted mt-1.5">Әріп, сан және «_ . -» белгілері ғана</p>
                {errorMsg && (
                  <div className="mt-2 space-y-1.5">
                    <p className="text-xs text-danger font-medium">{errorMsg}</p>
                    {suggestedNick && (
                      <button
                        type="button"
                        onClick={() => {
                          setNicknameInput(suggestedNick);
                          setSuggestedNick(null);
                          setErrorMsg('');
                        }}
                        className="text-xs font-semibold border border-border rounded-full px-3 py-1 hover:bg-surface transition"
                      >
                        «{suggestedNick}» деп алу
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                {profile.nickname && (
                  <button
                    type="button"
                    onClick={() => setIsEditingNick(false)}
                    className="h-12 px-5 rounded-full border border-border text-sm font-semibold hover:bg-surface transition"
                  >
                    Артқа
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isCheckingNick}
                  className="flex-1 h-12 rounded-full bg-ink text-on-ink text-sm font-semibold active:scale-[0.98] transition disabled:opacity-50"
                >
                  {isCheckingNick ? 'Тексерілуде…' : 'Рейтингтен орын алу'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="text-center space-y-3">
              <h3 className="text-lg font-bold">Рейтинг</h3>
              <div className="grid grid-cols-2 p-1 rounded-full bg-surface max-w-[15rem] mx-auto" role="tablist">
                <button type="button" role="tab" aria-selected={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} className={tabClass(activeTab === 'leaderboard')}>
                  Ойыншылар
                </button>
                <button type="button" role="tab" aria-selected={activeTab === 'tiers'} onClick={() => setActiveTab('tiers')} className={tabClass(activeTab === 'tiers')}>
                  Лигалар
                </button>
              </div>
            </div>

            {activeTab === 'leaderboard' && (
              <div className="space-y-3 flex flex-col overflow-hidden">
                {/* My card */}
                <div className="rounded-2xl bg-surface p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center shrink-0">
                        <TierIcon tierId={profile.currentStreak === 0 ? 'starter' : profile.tier.id} size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-sm truncate">{profile.nickname}</span>
                          <button
                            type="button"
                            onClick={() => setIsEditingNick(true)}
                            title="Атты өзгерту"
                            aria-label="Атты өзгерту"
                            className="text-muted hover:text-text p-1 transition"
                          >
                            <Edit2 size={13} weight="Outline" />
                          </button>
                        </div>
                        <span className="text-xs text-muted">{profile.tier.nameKz}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-muted">Орның</div>
                      <div className="text-xl font-extrabold tabular-nums">#{myRank}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="rounded-xl bg-bg px-3 py-2">
                      <span className="text-[11px] text-muted block">Ұпай</span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold tabular-nums">
                        <Star size={13} weight="Filled" />
                        {profile.totalScore}
                      </span>
                    </div>
                    <div className="rounded-xl bg-bg px-3 py-2">
                      <span className="text-[11px] text-muted block">Серия</span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold tabular-nums">
                        <Flame size={13} weight="Filled" />
                        {profile.currentStreak} күн
                      </span>
                    </div>
                  </div>

                  {nextTier && (
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 text-muted">
                        Келесі: <TierIcon tierId={nextTier.id} size={13} className="text-text" />
                        <span className="font-semibold text-text">{nextTier.nameKz}</span>
                      </span>
                      <span className="font-semibold tabular-nums">{daysRemaining} күн қалды</span>
                    </div>
                  )}
                </div>

                {/* List */}
                <div className="overflow-y-auto max-h-[36svh] divide-y divide-border -mx-1 px-1">
                  {isLoading ? (
                    <div className="space-y-2 py-2 animate-pulse">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-11 bg-surface rounded-xl" />
                      ))}
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="text-center py-8 space-y-1">
                      <p className="text-sm font-semibold">Әзірге рейтинг бос</p>
                      <p className="text-xs text-muted">Сөзді тауып, бірінші болып ТОП-1-ге шық!</p>
                    </div>
                  ) : (
                    entries.map((entry) => {
                      const tier = getLeagueTier(entry.streak);
                      return (
                        <div
                          key={entry.visitorId}
                          className={`flex items-center justify-between gap-3 py-2.5 px-2 text-sm ${
                            entry.isCurrentPlayer ? 'bg-surface rounded-xl' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <RankBadge rank={entry.rank} />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-semibold">
                                <span className="truncate max-w-[140px] sm:max-w-[200px]">{entry.nickname}</span>
                                {entry.isCurrentPlayer && (
                                  <span className="text-[10px] font-semibold text-muted border border-border rounded-full px-1.5">сіз</span>
                                )}
                              </div>
                              <span className="text-[11px] text-muted">{tier.nameKz}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="inline-flex items-center gap-1 font-bold tabular-nums">
                              <Flame size={12} weight="Filled" />
                              {entry.streak} күн
                            </div>
                            <div className="text-[11px] text-muted tabular-nums">{entry.score} ұп</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tiers' && (
              <div className="space-y-4 overflow-y-auto max-h-[55svh] pr-0.5 text-left">
                <div className="divide-y divide-border">
                  {LEAGUE_TIERS.map((tier) => {
                    const isMyTier = profile.tier.id === tier.id;
                    return (
                      <div key={tier.id} className={`py-3 px-2 flex items-center justify-between gap-3 ${isMyTier ? 'bg-surface rounded-xl' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isMyTier ? 'bg-ink text-on-ink' : 'bg-surface'}`}>
                            <TierIcon tierId={tier.id} size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold flex items-center gap-1.5">
                              {tier.nameKz}
                              {isMyTier && <span className="text-[10px] font-semibold text-muted border border-border rounded-full px-1.5">сіз</span>}
                            </div>
                            <span className="text-xs text-muted">{tier.description}</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-muted tabular-nums shrink-0">
                          {tier.maxStreak === Infinity ? '61+ күн' : `${tier.minStreak}–${tier.maxStreak} күн`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl bg-surface p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Bullseye size={15} weight="Outline" />
                    Ақылды ұпай
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    1-талпыныста табу — көбіне сәттілік, сондықтан ең жоғары ұпай 3-талпынысқа беріледі.
                  </p>
                  <div className="grid grid-cols-6 gap-1 text-center">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <div key={n} className={`rounded-lg py-1.5 ${n === 3 ? 'bg-ink text-on-ink' : 'bg-bg'}`}>
                        <span className={`block text-[10px] ${n === 3 ? 'opacity-70' : 'text-muted'}`}>{n}</span>
                        <span className="block text-xs font-bold tabular-nums">{GUESS_POINTS[n]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-1 text-xs text-muted leading-snug">
                    <p className="flex items-start gap-2">
                      <CheckCircle size={14} weight="Filled" className="text-text shrink-0 mt-0.5" />
                      <span><b className="text-text">Орын</b> алдымен үзбей ойнаған күндерге (серия), тең болса — ұпайға қарай анықталады.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <ShieldCheck size={14} weight="Filled" className="text-text shrink-0 mt-0.5" />
                      <span><b className="text-text">Мұздық:</b> сөзді таппасаң да, серияң 0-ге түспейді.</span>
                    </p>
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
