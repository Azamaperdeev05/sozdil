export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'wins' | 'streaks' | 'skill' | 'modes' | 'social' | 'special';
  maxProgress: number;
}

export interface AchievementState {
  unlockedIds: string[];
  progress: Record<string, number>;
  unlockedAt: Record<string, string>; // ISO timestamp
}

export const ACHIEVEMENTS: Achievement[] = [
  // 1. ЖЕҢІСТЕР САНЫ (WINS & EXPERIENCE)
  { id: 'win_1', title: 'Алғашқы қадам', description: 'Кез келген 1 сөзді табыңыз', icon: '🌱', category: 'wins', maxProgress: 1 },
  { id: 'win_3', title: 'Қызығушылық', description: '3 сөзді табыңыз', icon: '🥉', category: 'wins', maxProgress: 3 },
  { id: 'win_5', title: 'Талпыныс', description: '5 сөзді табыңыз', icon: '🥈', category: 'wins', maxProgress: 5 },
  { id: 'win_10', title: 'Ойыншы', description: '10 сөзді табыңыз', icon: '🥇', category: 'wins', maxProgress: 10 },
  { id: 'win_20', title: 'Тәжірибелі', description: '20 сөзді табыңыз', icon: '🎖️', category: 'wins', maxProgress: 20 },
  { id: 'win_30', title: 'Сөз сүңгүрі', description: '30 сөзді табыңыз', icon: '🤿', category: 'wins', maxProgress: 30 },
  { id: 'win_50', title: 'Сөз шебері', description: '50 сөзді табыңыз', icon: '📚', category: 'wins', maxProgress: 50 },
  { id: 'win_75', title: 'Эрудит', description: '75 сөзді табыңыз', icon: '🧠', category: 'wins', maxProgress: 75 },
  { id: 'win_100', title: 'Ғасыр ойыншысы', description: '100 сөзді табыңыз', icon: '💯', category: 'wins', maxProgress: 100 },
  { id: 'win_150', title: 'Тіл білгірі', description: '150 сөзді табыңыз', icon: '📖', category: 'wins', maxProgress: 150 },
  { id: 'win_200', title: 'Сөз маршалы', description: '200 сөзді табыңыз', icon: '👑', category: 'wins', maxProgress: 200 },
  { id: 'win_300', title: 'Тілтанушы', description: '300 сөзді табыңыз', icon: '🏛️', category: 'wins', maxProgress: 300 },
  { id: 'win_365', title: 'Жыл кейіпкері', description: '365 сөзді табыңыз', icon: '🌟', category: 'wins', maxProgress: 365 },
  { id: 'win_500', title: 'Сөзділ аңызы', description: '500 сөзді табыңыз', icon: '🏆', category: 'wins', maxProgress: 500 },

  // 2. ҮЗДІКСІЗ СЕРИЯЛАР (STREAKS & DEDICATION)
  { id: 'streak_2', title: 'Жұп жеңіс', description: 'Қатарынан 2 күн сөз табыңыз', icon: '✌️', category: 'streaks', maxProgress: 2 },
  { id: 'streak_3', title: 'Үштік екпін', description: 'Қатарынан 3 күн сөз табыңыз', icon: '⚡', category: 'streaks', maxProgress: 3 },
  { id: 'streak_5', title: 'Жалынды қарқын', description: 'Қатарынан 5 күн сөз табыңыз', icon: '🔥', category: 'streaks', maxProgress: 5 },
  { id: 'streak_7', title: 'Бір апта бойы', description: 'Қатарынан 7 күн сөз табыңыз', icon: '📅', category: 'streaks', maxProgress: 7 },
  { id: 'streak_10', title: 'Ондық шеру', description: 'Қатарынан 10 күн сөз табыңыз', icon: '🔟', category: 'streaks', maxProgress: 10 },
  { id: 'streak_14', title: 'Екі апта үздіксіз', description: 'Қатарынан 14 күн сөз табыңыз', icon: '🌙', category: 'streaks', maxProgress: 14 },
  { id: 'streak_21', title: 'Әдетке айналды', description: 'Қатарынан 21 күн сөз табыңыз', icon: '🧘', category: 'streaks', maxProgress: 21 },
  { id: 'streak_30', title: 'Бір айлық триумф', description: 'Қатарынан 30 күн сөз табыңыз', icon: '🌕', category: 'streaks', maxProgress: 30 },
  { id: 'streak_50', title: 'Темірдей тәртіп', description: 'Қатарынан 50 күн сөз табыңыз', icon: '🛡️', category: 'streaks', maxProgress: 50 },
  { id: 'streak_60', title: 'Екі айлық марафон', description: 'Қатарынан 60 күн сөз табыңыз', icon: '🏃', category: 'streaks', maxProgress: 60 },
  { id: 'streak_100', title: 'Тоқтаусыз жүздік', description: 'Қатарынан 100 күн сөз табыңыз', icon: '🚀', category: 'streaks', maxProgress: 100 },

  // 3. ДӘЛДІК ПЕН ШЕБЕРЛІК (SKILL & ACCURACY)
  { id: 'guess_1', title: 'Көріпкел', description: 'Сөзді 1-ші мүмкіндіктен табыңыз', icon: '🔮', category: 'skill', maxProgress: 1 },
  { id: 'guess_2', title: 'Мерген', description: 'Сөзді 2-ші мүмкіндіктен табыңыз', icon: '🎯', category: 'skill', maxProgress: 1 },
  { id: 'guess_3', title: 'Оңтайлы шешім', description: 'Сөзді 3-ші мүмкіндіктен табыңыз', icon: '💡', category: 'skill', maxProgress: 1 },
  { id: 'guess_6', title: 'Қыл үстінде', description: 'Сөзді соңғы 6-шы мүмкіндіктен құтқарыңыз', icon: '🧗', category: 'skill', maxProgress: 1 },
  { id: 'clutch_3', title: 'Тәуекелшіл', description: '6-шы мүмкіндіктен 3 рет сөз табыңыз', icon: '🎭', category: 'skill', maxProgress: 3 },
  { id: 'fast_3_streak', title: 'Снайпер', description: 'Қатарынан 3 рет сөзді 3 не одан аз талпыныста табыңыз', icon: '🏹', category: 'skill', maxProgress: 3 },
  { id: 'first_guess_yellows', title: 'Сары салют', description: '1-ші қадамда кемінде 3 сары әріп ашыңыз', icon: '🟨', category: 'skill', maxProgress: 1 },
  { id: 'first_guess_greens', title: 'Жасыл бастама', description: '1-ші қадамда кемінде 3 жасыл әріп ашыңыз', icon: '🟩', category: 'skill', maxProgress: 1 },
  { id: 'no_yellows_win', title: 'Тура жол', description: 'Бірде-бір сары әріп шығармай тікелей жеңіңіз', icon: '🛤️', category: 'skill', maxProgress: 1 },
  { id: 'all_different_vowels', title: 'Дауыстылар үйлесімі', description: 'Құрамында 3 түрлі дауысты әріп бар сөзді табыңыз', icon: '🗣️', category: 'skill', maxProgress: 1 },

  // 4. РЕЖИМДЕР БОЙЫНША (4, 5, 6 ӘРІПТІК РЕЖИМДЕР)
  { id: 'mode_4_win_1', title: '4 әріп бастауы', description: '4 әріптік режимде 1 рет жеңіңіз', icon: '🔹', category: 'modes', maxProgress: 1 },
  { id: 'mode_4_win_10', title: '4 әріп білгірі', description: '4 әріптік режимде 10 рет жеңіңіз', icon: '🔷', category: 'modes', maxProgress: 10 },
  { id: 'mode_4_win_50', title: '4 әріп шебері', description: '4 әріптік режимде 50 рет жеңіңіз', icon: '💠', category: 'modes', maxProgress: 50 },
  { id: 'mode_5_win_1', title: '5 әріп классикасы', description: '5 әріптік режимде 1 рет жеңіңіз', icon: '🔶', category: 'modes', maxProgress: 1 },
  { id: 'mode_5_win_10', title: '5 әріп білгірі', description: '5 әріптік режимде 10 рет жеңіңіз', icon: '🟧', category: 'modes', maxProgress: 10 },
  { id: 'mode_5_win_50', title: '5 әріп шебері', description: '5 әріптік режимде 50 рет жеңіңіз', icon: '⚜️', category: 'modes', maxProgress: 50 },
  { id: 'mode_6_win_1', title: '6 әріп батыры', description: '6 әріптік режимде 1 рет жеңіңіз', icon: '🔺', category: 'modes', maxProgress: 1 },
  { id: 'mode_6_win_10', title: '6 әріп білгірі', description: '6 әріптік режимде 10 рет жеңіңіз', icon: '🏮', category: 'modes', maxProgress: 10 },
  { id: 'mode_6_win_50', title: '6 әріп академигі', description: '6 әріптік режимде 50 рет жеңіңіз', icon: '🎓', category: 'modes', maxProgress: 50 },
  { id: 'triple_crown', title: 'Үштік тәж', description: 'Бір күнде 4, 5 және 6 әріптік режимнің барлығын жеңіңіз', icon: '🤴', category: 'modes', maxProgress: 1 },
  { id: 'mode_switch_explorer', title: 'Әмбебап ойыншы', description: 'Барлық 3 режимде кемінде 5 жеңіске жетіңіз', icon: '🌐', category: 'modes', maxProgress: 3 },

  // 5. САЙЫС ЖӘНЕ ДОСТАР (SOCIAL & CHALLENGES)
  { id: 'challenge_create_1', title: 'Жұмбақшы', description: 'Досыңызға алғашқы сөзіңізді жасырыңыз', icon: '✉️', category: 'social', maxProgress: 1 },
  { id: 'challenge_create_5', title: 'Сөз құрастырушы', description: 'Достарыңызға 5 сөз жасырыңыз', icon: '📜', category: 'social', maxProgress: 5 },
  { id: 'challenge_create_20', title: 'Жұмбақтар фабрикасы', description: 'Достарыңызға 20 сөз жасырыңыз', icon: '🏭', category: 'social', maxProgress: 20 },
  { id: 'challenge_solve_1', title: 'Сайыскер', description: 'Досыңыз жасырған 1 сөзді табыңыз', icon: '⚔️', category: 'social', maxProgress: 1 },
  { id: 'challenge_solve_5', title: 'Құпия шешуші', description: 'Достарыңыз жасырған 5 сөзді табыңыз', icon: '🕵️', category: 'social', maxProgress: 5 },
  { id: 'challenge_solve_20', title: 'Дедукция майталманы', description: 'Достарыңыз жасырған 20 сөзді табыңыз', icon: '🔍', category: 'social', maxProgress: 20 },
  { id: 'challenge_fast_win', title: 'Шапшаң жауап', description: 'Досыңыздың сөзін 3 не одан аз талпыныста табыңыз', icon: '💨', category: 'social', maxProgress: 1 },
  { id: 'share_result_1', title: 'Жаршы', description: 'Нәтижеңізді достарыңызбен бөлісіңіз', icon: '📢', category: 'social', maxProgress: 1 },
  { id: 'share_result_10', title: 'Желі белсендісі', description: 'Нәтижеңізді 10 рет бөлісіңіз', icon: '📣', category: 'social', maxProgress: 10 },

  // 6. ТІЛДІК ЖӘНЕ ЕРЕКШЕ ЖАҒДАЙЛАР (SPECIAL & LINGUISTIC)
  { id: 'kazakh_char_win', title: 'Төл дыбыс', description: 'Құрамында Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ бар сөзді табыңыз', icon: '🇰🇿', category: 'special', maxProgress: 1 },
  { id: 'kazakh_char_rich', title: 'Тіл жанашыры', description: 'Құрамында кемінде 2 төл әріп бар сөзді табыңыз', icon: '🦅', category: 'special', maxProgress: 1 },
  { id: 'sozdik_definition_view', title: 'Ізденімпаз', description: 'Сөздің мағынасын Сөздікқордан ашып көрдіңіз', icon: '🧐', category: 'special', maxProgress: 1 },
  { id: 'pwa_installed', title: 'Тұрақты жанкүйер', description: 'Сөзділді телефон экранына қостыңыз (PWA)', icon: '📲', category: 'special', maxProgress: 1 },
  { id: 'calendar_history_view', title: 'Тарихшы', description: 'Күнтізбе арқылы өткен ойындар тарихын ашыңыз', icon: '🗓️', category: 'special', maxProgress: 1 },
  { id: 'rules_reader', title: 'Зерделі оқырман', description: 'Ойын ережелерін толық оқып шықтыңыз', icon: '📜', category: 'special', maxProgress: 1 },
  { id: 'early_bird', title: 'Ерте тұрған ойыншы', description: 'Таңғы 06:00 мен 09:00 арасында сөз табыңыз', icon: '🌅', category: 'special', maxProgress: 1 },
  { id: 'night_owl', title: 'Түнгі үкі', description: 'Түнгі 00:00 мен 03:00 арасында сөз табыңыз', icon: '🦉', category: 'special', maxProgress: 1 },
  { id: 'weekend_player', title: 'Демалыс білгірі', description: 'Сенбі не жексенбі күні сөз табыңыз', icon: '🎉', category: 'special', maxProgress: 1 },
  { id: 'perfect_accuracy', title: 'Мінсіз жеңіс', description: '100% жеңіс көрсеткішімен кемінде 10 ойын өткізіңіз', icon: '💎', category: 'special', maxProgress: 1 },
];

const STORAGE_KEY = 'sozdil-achievements-v1';

export function loadAchievementsState(): AchievementState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlockedIds: [], progress: {}, unlockedAt: {} };
    return JSON.parse(raw);
  } catch {
    return { unlockedIds: [], progress: {}, unlockedAt: {} };
  }
}

export function saveAchievementsState(state: AchievementState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export interface CheckEventPayload {
  type: 'GAME_OVER' | 'CHALLENGE_CREATE' | 'CHALLENGE_SOLVE' | 'SHARE' | 'VIEW_DEFINITION' | 'VIEW_CALENDAR' | 'VIEW_RULES' | 'PWA_INSTALL';
  gameStatus?: 'WON' | 'LOST';
  wordLength?: number;
  guessesCount?: number;
  solution?: string;
  firstGuessStatuses?: ('correct' | 'present' | 'absent')[];
  guessStatuses?: ('correct' | 'present' | 'absent')[][];
  totalWinsAllModes?: number;
  currentStreak?: number;
  modeStats?: { 4: { wins: number }; 5: { wins: number }; 6: { wins: number } };
  historyToday?: { 4?: string; 5?: string; 6?: string };
}

/**
 * Evaluates achievements based on gameplay events and returns newly unlocked achievements.
 */
export function checkAchievements(payload: CheckEventPayload): Achievement[] {
  const state = loadAchievementsState();
  const newlyUnlocked: Achievement[] = [];
  const now = new Date();
  const currentHour = now.getHours();
  const dayOfWeek = now.getDay(); // 0 = Sun, 6 = Sat

  const unlock = (ach: Achievement) => {
    if (!state.unlockedIds.includes(ach.id)) {
      state.unlockedIds.push(ach.id);
      state.unlockedAt[ach.id] = new Date().toISOString();
      state.progress[ach.id] = ach.maxProgress;
      newlyUnlocked.push(ach);
    }
  };

  const updateProgress = (ach: Achievement, val: number) => {
    state.progress[ach.id] = Math.max(state.progress[ach.id] || 0, val);
    if (state.progress[ach.id] >= ach.maxProgress) {
      unlock(ach);
    }
  };

  // Process based on event
  if (payload.type === 'GAME_OVER' && payload.gameStatus === 'WON') {
    const totalWins = payload.totalWinsAllModes || 1;
    const streak = payload.currentStreak || 1;
    const gc = payload.guessesCount || 6;
    const len = payload.wordLength || 6;
    const sol = (payload.solution || '').toUpperCase();

    // 1. Total wins
    ACHIEVEMENTS.filter(a => a.id.startsWith('win_')).forEach(a => {
      updateProgress(a, totalWins);
    });

    // 2. Streaks
    ACHIEVEMENTS.filter(a => a.id.startsWith('streak_')).forEach(a => {
      updateProgress(a, streak);
    });

    // 3. Guesses
    if (gc === 1) unlock(ACHIEVEMENTS.find(a => a.id === 'guess_1')!);
    if (gc === 2) unlock(ACHIEVEMENTS.find(a => a.id === 'guess_2')!);
    if (gc === 3) unlock(ACHIEVEMENTS.find(a => a.id === 'guess_3')!);
    if (gc === 6) {
      unlock(ACHIEVEMENTS.find(a => a.id === 'guess_6')!);
      const clutchAch = ACHIEVEMENTS.find(a => a.id === 'clutch_3')!;
      updateProgress(clutchAch, (state.progress['clutch_3'] || 0) + 1);
    }

    // First guess checks
    if (payload.firstGuessStatuses) {
      const greens = payload.firstGuessStatuses.filter(s => s === 'correct').length;
      const yellows = payload.firstGuessStatuses.filter(s => s === 'present').length;
      if (greens >= 3) unlock(ACHIEVEMENTS.find(a => a.id === 'first_guess_greens')!);
      if (yellows >= 3) unlock(ACHIEVEMENTS.find(a => a.id === 'first_guess_yellows')!);
    }

    // No yellows win
    if (payload.guessStatuses && !payload.guessStatuses.flat().includes('present')) {
      unlock(ACHIEVEMENTS.find(a => a.id === 'no_yellows_win')!);
    }

    // Vowels check
    const vowels = new Set(['А', 'Ә', 'Е', 'Ё', 'И', 'О', 'Ө', 'Ұ', 'Ү', 'Ы', 'І', 'Э', 'Ю', 'Я']);
    const uniqueVowels = new Set(sol.split('').filter(c => vowels.has(c)));
    if (uniqueVowels.size >= 3) {
      unlock(ACHIEVEMENTS.find(a => a.id === 'all_different_vowels')!);
    }

    // Mode-specific wins
    if (payload.modeStats) {
      const m4Wins = payload.modeStats[4]?.wins || 0;
      const m5Wins = payload.modeStats[5]?.wins || 0;
      const m6Wins = payload.modeStats[6]?.wins || 0;

      if (len === 4) {
        ACHIEVEMENTS.filter(a => a.id.startsWith('mode_4_')).forEach(a => updateProgress(a, m4Wins));
      } else if (len === 5) {
        ACHIEVEMENTS.filter(a => a.id.startsWith('mode_5_')).forEach(a => updateProgress(a, m5Wins));
      } else if (len === 6) {
        ACHIEVEMENTS.filter(a => a.id.startsWith('mode_6_')).forEach(a => updateProgress(a, m6Wins));
      }

      if (m4Wins >= 5 && m5Wins >= 5 && m6Wins >= 5) {
        unlock(ACHIEVEMENTS.find(a => a.id === 'mode_switch_explorer')!);
      }
    }

    // Triple crown (won all 3 modes today)
    if (payload.historyToday) {
      if (
        payload.historyToday[4] === 'WON' &&
        payload.historyToday[5] === 'WON' &&
        payload.historyToday[6] === 'WON'
      ) {
        unlock(ACHIEVEMENTS.find(a => a.id === 'triple_crown')!);
      }
    }

    // Kazakh specific letters
    const kzChars = ['Ә', 'І', 'Ң', 'Ғ', 'Ү', 'Ұ', 'Қ', 'Ө', 'Һ'];
    const foundKz = sol.split('').filter(c => kzChars.includes(c));
    if (foundKz.length >= 1) unlock(ACHIEVEMENTS.find(a => a.id === 'kazakh_char_win')!);
    if (foundKz.length >= 2) unlock(ACHIEVEMENTS.find(a => a.id === 'kazakh_char_rich')!);

    // Time-based
    if (currentHour >= 6 && currentHour <= 9) unlock(ACHIEVEMENTS.find(a => a.id === 'early_bird')!);
    if (currentHour >= 0 && currentHour <= 3) unlock(ACHIEVEMENTS.find(a => a.id === 'night_owl')!);
    if (dayOfWeek === 0 || dayOfWeek === 6) unlock(ACHIEVEMENTS.find(a => a.id === 'weekend_player')!);
  }

  // Challenge Events
  if (payload.type === 'CHALLENGE_CREATE') {
    const ach1 = ACHIEVEMENTS.find(a => a.id === 'challenge_create_1')!;
    const ach5 = ACHIEVEMENTS.find(a => a.id === 'challenge_create_5')!;
    const ach20 = ACHIEVEMENTS.find(a => a.id === 'challenge_create_20')!;
    const count = (state.progress['challenge_create_1'] || 0) + 1;
    updateProgress(ach1, count);
    updateProgress(ach5, count);
    updateProgress(ach20, count);
  }

  if (payload.type === 'CHALLENGE_SOLVE') {
    const ach1 = ACHIEVEMENTS.find(a => a.id === 'challenge_solve_1')!;
    const ach5 = ACHIEVEMENTS.find(a => a.id === 'challenge_solve_5')!;
    const ach20 = ACHIEVEMENTS.find(a => a.id === 'challenge_solve_20')!;
    const count = (state.progress['challenge_solve_1'] || 0) + 1;
    updateProgress(ach1, count);
    updateProgress(ach5, count);
    updateProgress(ach20, count);

    if (payload.guessesCount && payload.guessesCount <= 3) {
      unlock(ACHIEVEMENTS.find(a => a.id === 'challenge_fast_win')!);
    }
  }

  // Social share
  if (payload.type === 'SHARE') {
    const ach1 = ACHIEVEMENTS.find(a => a.id === 'share_result_1')!;
    const ach10 = ACHIEVEMENTS.find(a => a.id === 'share_result_10')!;
    const count = (state.progress['share_result_1'] || 0) + 1;
    updateProgress(ach1, count);
    updateProgress(ach10, count);
  }

  // View actions
  if (payload.type === 'VIEW_DEFINITION') unlock(ACHIEVEMENTS.find(a => a.id === 'sozdik_definition_view')!);
  if (payload.type === 'VIEW_CALENDAR') unlock(ACHIEVEMENTS.find(a => a.id === 'calendar_history_view')!);
  if (payload.type === 'VIEW_RULES') unlock(ACHIEVEMENTS.find(a => a.id === 'rules_reader')!);
  if (payload.type === 'PWA_INSTALL') unlock(ACHIEVEMENTS.find(a => a.id === 'pwa_installed')!);

  saveAchievementsState(state);
  return newlyUnlocked;
}
