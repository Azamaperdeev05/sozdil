import '../models/achievement.dart';
import '../models/letter_status.dart';
import 'storage_service.dart';

class AchievementService {
  static const List<Achievement> allAchievements = [
    // 1. ЖЕҢІСТЕР САНЫ (WINS & EXPERIENCE)
    Achievement(id: 'win_1', title: 'Алғашқы қадам', description: 'Кез келген 1 сөзді табыңыз', icon: '🌱', category: AchievementCategory.wins, maxProgress: 1),
    Achievement(id: 'win_3', title: 'Қызығушылық', description: '3 сөзді табыңыз', icon: '🥉', category: AchievementCategory.wins, maxProgress: 3),
    Achievement(id: 'win_5', title: 'Талпыныс', description: '5 сөзді табыңыз', icon: '🥈', category: AchievementCategory.wins, maxProgress: 5),
    Achievement(id: 'win_10', title: 'Ойыншы', description: '10 сөзді табыңыз', icon: '🥇', category: AchievementCategory.wins, maxProgress: 10),
    Achievement(id: 'win_20', title: 'Тәжірибелі', description: '20 сөзді табыңыз', icon: '🎖️', category: AchievementCategory.wins, maxProgress: 20),
    Achievement(id: 'win_30', title: 'Сөз сүңгүрі', description: '30 сөзді табыңыз', icon: '🤿', category: AchievementCategory.wins, maxProgress: 30),
    Achievement(id: 'win_50', title: 'Сөз шебері', description: '50 сөзді табыңыз', icon: '📚', category: AchievementCategory.wins, maxProgress: 50),
    Achievement(id: 'win_75', title: 'Эрудит', description: '75 сөзді табыңыз', icon: '🧠', category: AchievementCategory.wins, maxProgress: 75),
    Achievement(id: 'win_100', title: 'Ғасыр ойыншысы', description: '100 сөзді табыңыз', icon: '💯', category: AchievementCategory.wins, maxProgress: 100),
    Achievement(id: 'win_150', title: 'Тіл білгірі', description: '150 сөзді табыңыз', icon: '📖', category: AchievementCategory.wins, maxProgress: 150),
    Achievement(id: 'win_200', title: 'Сөз маршалы', description: '200 сөзді табыңыз', icon: '👑', category: AchievementCategory.wins, maxProgress: 200),
    Achievement(id: 'win_300', title: 'Тілтанушы', description: '300 сөзді табыңыз', icon: '🏛️', category: AchievementCategory.wins, maxProgress: 300),
    Achievement(id: 'win_365', title: 'Жыл кейіпкері', description: '365 сөзді табыңыз', icon: '🌟', category: AchievementCategory.wins, maxProgress: 365),
    Achievement(id: 'win_500', title: 'Сөзділ аңызы', description: '500 сөзді табыңыз', icon: '🏆', category: AchievementCategory.wins, maxProgress: 500),

    // 2. ҮЗДІКСІЗ СЕРИЯЛАР (STREAKS & DEDICATION)
    Achievement(id: 'streak_2', title: 'Жұп жеңіс', description: 'Қатарынан 2 күн сөз табыңыз', icon: '✌️', category: AchievementCategory.streaks, maxProgress: 2),
    Achievement(id: 'streak_3', title: 'Үштік екпін', description: 'Қатарынан 3 күн сөз табыңыз', icon: '⚡', category: AchievementCategory.streaks, maxProgress: 3),
    Achievement(id: 'streak_5', title: 'Жалынды қарқын', description: 'Қатарынан 5 күн сөз табыңыз', icon: '🔥', category: AchievementCategory.streaks, maxProgress: 5),
    Achievement(id: 'streak_7', title: 'Бір апта бойы', description: 'Қатарынан 7 күн сөз табыңыз', icon: '📅', category: AchievementCategory.streaks, maxProgress: 7),
    Achievement(id: 'streak_10', title: 'Ондық шеру', description: 'Қатарынан 10 күн сөз табыңыз', icon: '🔟', category: AchievementCategory.streaks, maxProgress: 10),
    Achievement(id: 'streak_14', title: 'Екі апта үздіксіз', description: 'Қатарынан 14 күн сөз табыңыз', icon: '🌙', category: AchievementCategory.streaks, maxProgress: 14),
    Achievement(id: 'streak_21', title: 'Әдетке айналды', description: 'Қатарынан 21 күн сөз табыңыз', icon: '🧘', category: AchievementCategory.streaks, maxProgress: 21),
    Achievement(id: 'streak_30', title: 'Бір айлық триумф', description: 'Қатарынан 30 күн сөз табыңыз', icon: '🌕', category: AchievementCategory.streaks, maxProgress: 30),
    Achievement(id: 'streak_50', title: 'Темірдей тәртіп', description: 'Қатарынан 50 күн сөз табыңыз', icon: '🛡️', category: AchievementCategory.streaks, maxProgress: 50),
    Achievement(id: 'streak_60', title: 'Екі айлық марафон', description: 'Қатарынан 60 күн сөз табыңыз', icon: '🏃', category: AchievementCategory.streaks, maxProgress: 60),
    Achievement(id: 'streak_100', title: 'Тоқтаусыз жүздік', description: 'Қатарынан 100 күн сөз табыңыз', icon: '🚀', category: AchievementCategory.streaks, maxProgress: 100),

    // 3. ДӘЛДІК ПЕН ШЕБЕРЛІК (SKILL & ACCURACY)
    Achievement(id: 'guess_1', title: 'Көріпкел', description: 'Сөзді 1-ші мүмкіндіктен табыңыз', icon: '🔮', category: AchievementCategory.skill, maxProgress: 1),
    Achievement(id: 'guess_2', title: 'Мерген', description: 'Сөзді 2-ші мүмкіндіктен табыңыз', icon: '🎯', category: AchievementCategory.skill, maxProgress: 1),
    Achievement(id: 'guess_3', title: 'Оңтайлы шешім', description: 'Сөзді 3-ші мүмкіндіктен табыңыз', icon: '💡', category: AchievementCategory.skill, maxProgress: 1),
    Achievement(id: 'guess_6', title: 'Қыл үстінде', description: 'Сөзді соңғы 6-шы мүмкіндіктен құтқарыңыз', icon: '🧗', category: AchievementCategory.skill, maxProgress: 1),
    Achievement(id: 'clutch_3', title: 'Тәуекелшіл', description: '6-шы мүмкіндіктен 3 рет сөз табыңыз', icon: '🎭', category: AchievementCategory.skill, maxProgress: 3),
    Achievement(id: 'fast_3_streak', title: 'Снайпер', description: 'Қатарынан 3 рет сөзді 3 не одан аз талпыныста табыңыз', icon: '🏹', category: AchievementCategory.skill, maxProgress: 3),
    Achievement(id: 'first_guess_yellows', title: 'Сары салют', description: '1-ші қадамда кемінде 3 сары әріп ашыңыз', icon: '🟨', category: AchievementCategory.skill, maxProgress: 1),
    Achievement(id: 'first_guess_greens', title: 'Жасыл бастама', description: '1-ші қадамда кемінде 3 жасыл әріп ашыңыз', icon: '🟩', category: AchievementCategory.skill, maxProgress: 1),
    Achievement(id: 'no_yellows_win', title: 'Тура жол', description: 'Бірде-бір сары әріп шығармай тікелей жеңіңіз', icon: '🛤️', category: AchievementCategory.skill, maxProgress: 1),
    Achievement(id: 'all_different_vowels', title: 'Дауыстылар үйлесімі', description: 'Құрамында 3 түрлі дауысты әріп бар сөзді табыңыз', icon: '🗣️', category: AchievementCategory.skill, maxProgress: 1),

    // 4. РЕЖИМДЕР БОЙЫНША (MODES)
    Achievement(id: 'mode_4_win_1', title: '4 әріп бастауы', description: '4 әріптік режимде 1 рет жеңіңіз', icon: '🔹', category: AchievementCategory.modes, maxProgress: 1),
    Achievement(id: 'mode_4_win_10', title: '4 әріп білгірі', description: '4 әріптік режимде 10 рет жеңіңіз', icon: '🔷', category: AchievementCategory.modes, maxProgress: 10),
    Achievement(id: 'mode_4_win_50', title: '4 әріп шебері', description: '4 әріптік режимде 50 рет жеңіңіз', icon: '💠', category: AchievementCategory.modes, maxProgress: 50),
    Achievement(id: 'mode_5_win_1', title: '5 әріп классикасы', description: '5 әріптік режимде 1 рет жеңіңіз', icon: '🔶', category: AchievementCategory.modes, maxProgress: 1),
    Achievement(id: 'mode_5_win_10', title: '5 әріп білгірі', description: '5 әріптік режимде 10 рет жеңіңіз', icon: '🟧', category: AchievementCategory.modes, maxProgress: 10),
    Achievement(id: 'mode_5_win_50', title: '5 әріп шебері', description: '5 әріптік режимде 50 рет жеңіңіз', icon: '⚜️', category: AchievementCategory.modes, maxProgress: 50),
    Achievement(id: 'mode_6_win_1', title: '6 әріп батыры', description: '6 әріптік режимде 1 рет жеңіңіз', icon: '🔺', category: AchievementCategory.modes, maxProgress: 1),
    Achievement(id: 'mode_6_win_10', title: '6 әріп білгірі', description: '6 әріптік режимде 10 рет жеңіңіз', icon: '🏮', category: AchievementCategory.modes, maxProgress: 10),
    Achievement(id: 'mode_6_win_50', title: '6 әріп академигі', description: '6 әріптік режимде 50 рет жеңіңіз', icon: '🎓', category: AchievementCategory.modes, maxProgress: 50),
    Achievement(id: 'triple_crown', title: 'Үштік тәж', description: 'Бір күнде 4, 5 және 6 әріптік режимнің барлығын жеңіңіз', icon: '🤴', category: AchievementCategory.modes, maxProgress: 1),
    Achievement(id: 'mode_switch_explorer', title: 'Әмбебап ойыншы', description: 'Барлық 3 режимде кемінде 5 жеңіске жетіңіз', icon: '🌐', category: AchievementCategory.modes, maxProgress: 3),

    // 5. САЙЫС ЖӘНЕ ДОСТАР (SOCIAL)
    Achievement(id: 'challenge_create_1', title: 'Жұмбақшы', description: 'Досыңызға алғашқы сөзіңізді жасырыңыз', icon: '✉️', category: AchievementCategory.social, maxProgress: 1),
    Achievement(id: 'challenge_create_5', title: 'Сөз құрастырушы', description: 'Достарыңызға 5 сөз жасырыңыз', icon: '📜', category: AchievementCategory.social, maxProgress: 5),
    Achievement(id: 'challenge_create_20', title: 'Жұмбақтар фабрикасы', description: 'Достарыңызға 20 сөз жасырыңыз', icon: '🏭', category: AchievementCategory.social, maxProgress: 20),
    Achievement(id: 'challenge_solve_1', title: 'Сайыскер', description: 'Досыңыз жасырған 1 сөзді табыңыз', icon: '⚔️', category: AchievementCategory.social, maxProgress: 1),
    Achievement(id: 'challenge_solve_5', title: 'Құпия шешуші', description: 'Достарыңыз жасырған 5 сөзді табыңыз', icon: '🕵️', category: AchievementCategory.social, maxProgress: 5),
    Achievement(id: 'challenge_solve_20', title: 'Дедукция майталманы', description: 'Достарыңыз жасырған 20 сөзді табыңыз', icon: '🔍', category: AchievementCategory.social, maxProgress: 20),
    Achievement(id: 'challenge_fast_win', title: 'Шапшаң жауап', description: 'Досыңыздың сөзін 3 не одан аз талпыныста табыңыз', icon: '💨', category: AchievementCategory.social, maxProgress: 1),
    Achievement(id: 'share_result_1', title: 'Жаршы', description: 'Нәтижеңізді достарыңызбен бөлісіңіз', icon: '📢', category: AchievementCategory.social, maxProgress: 1),
    Achievement(id: 'share_result_10', title: 'Желі белсендісі', description: 'Нәтижеңізді 10 рет бөлісіңіз', icon: '📣', category: AchievementCategory.social, maxProgress: 10),

    // 6. ТІЛДІК ЖӘНЕ ЕРЕКШЕ ЖАҒДАЙЛАР (SPECIAL)
    Achievement(id: 'kazakh_char_win', title: 'Төл дыбыс', description: 'Құрамында Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ бар сөзді табыңыз', icon: '🇰🇿', category: AchievementCategory.special, maxProgress: 1),
    Achievement(id: 'kazakh_char_rich', title: 'Тіл жанашыры', description: 'Құрамында кемінде 2 төл әріп бар сөзді табыңыз', icon: '🦅', category: AchievementCategory.special, maxProgress: 1),
    Achievement(id: 'sozdik_definition_view', title: 'Ізденімпаз', description: 'Сөздің мағынасын Сөздікқордан ашып көрдіңіз', icon: '🧐', category: AchievementCategory.special, maxProgress: 1),
    Achievement(id: 'calendar_history_view', title: 'Тарихшы', description: 'Күнтізбе арқылы өткен ойындар тарихын ашыңыз', icon: '🗓️', category: AchievementCategory.special, maxProgress: 1),
    Achievement(id: 'rules_reader', title: 'Зерделі оқырман', description: 'Ойын ережелерін толық оқып шықтыңыз', icon: '📜', category: AchievementCategory.special, maxProgress: 1),
    Achievement(id: 'early_bird', title: 'Ерте тұрған ойыншы', description: 'Таңғы 06:00 мен 09:00 арасында сөз табыңыз', icon: '🌅', category: AchievementCategory.special, maxProgress: 1),
    Achievement(id: 'night_owl', title: 'Түнгі үкі', description: 'Түнгі 00:00 мен 03:00 арасында сөз табыңыз', icon: '🦉', category: AchievementCategory.special, maxProgress: 1),
    Achievement(id: 'weekend_player', title: 'Демалыс білгірі', description: 'Сенбі не жексенбі күні сөз табыңыз', icon: '🎉', category: AchievementCategory.special, maxProgress: 1),
  ];

  static Future<List<Achievement>> checkOnGameOver({
    required bool isWon,
    required int wordLength,
    required int guessesCount,
    required String solution,
    required List<LetterStatus> firstGuessStatuses,
    required List<List<LetterStatus>> allStatuses,
    required int totalWins,
    required int currentStreak,
    required Map<int, int> modeWins,
    required bool isChallenge,
  }) async {
    final unlocked = StorageService.getUnlockedAchievements();
    final progress = StorageService.getAchievementProgress();
    final newlyUnlocked = <Achievement>[];
    final now = DateTime.now();

    void unlock(Achievement a) {
      if (!unlocked.contains(a.id)) {
        unlocked.add(a.id);
        progress[a.id] = a.maxProgress;
        newlyUnlocked.add(a);
      }
    }

    void updateProg(Achievement a, int val) {
      final cur = progress[a.id] ?? 0;
      final next = val > cur ? val : cur;
      progress[a.id] = next;
      if (next >= a.maxProgress) {
        unlock(a);
      }
    }

    if (isChallenge) {
      if (isWon) {
        final ach1 = allAchievements.firstWhere((a) => a.id == 'challenge_solve_1');
        final ach5 = allAchievements.firstWhere((a) => a.id == 'challenge_solve_5');
        final count = (progress['challenge_solve_1'] ?? 0) + 1;
        updateProg(ach1, count);
        updateProg(ach5, count);
        if (guessesCount <= 3) {
          unlock(allAchievements.firstWhere((a) => a.id == 'challenge_fast_win'));
        }
      }
    } else if (isWon) {
      // 1. Total wins
      for (final a in allAchievements.where((a) => a.id.startsWith('win_'))) {
        updateProg(a, totalWins);
      }

      // 2. Streaks
      for (final a in allAchievements.where((a) => a.id.startsWith('streak_'))) {
        updateProg(a, currentStreak);
      }

      // 3. Guesses count
      if (guessesCount == 1) unlock(allAchievements.firstWhere((a) => a.id == 'guess_1'));
      if (guessesCount == 2) unlock(allAchievements.firstWhere((a) => a.id == 'guess_2'));
      if (guessesCount == 3) unlock(allAchievements.firstWhere((a) => a.id == 'guess_3'));
      if (guessesCount == 6) {
        unlock(allAchievements.firstWhere((a) => a.id == 'guess_6'));
        final clutch = allAchievements.firstWhere((a) => a.id == 'clutch_3');
        updateProg(clutch, (progress['clutch_3'] ?? 0) + 1);
      }

      // First guess
      final greens = firstGuessStatuses.where((s) => s == LetterStatus.correct).length;
      final yellows = firstGuessStatuses.where((s) => s == LetterStatus.present).length;
      if (greens >= 3) unlock(allAchievements.firstWhere((a) => a.id == 'first_guess_greens'));
      if (yellows >= 3) unlock(allAchievements.firstWhere((a) => a.id == 'first_guess_yellows'));

      // No yellows
      final hasYellow = allStatuses.any((row) => row.any((s) => s == LetterStatus.present));
      if (!hasYellow) unlock(allAchievements.firstWhere((a) => a.id == 'no_yellows_win'));

      // Modes
      final mWins = modeWins[wordLength] ?? 0;
      for (final a in allAchievements.where((a) => a.id.startsWith('mode_${wordLength}_'))) {
        updateProg(a, mWins);
      }

      // Kazakh characters
      const kzLetters = {'Ә', 'І', 'Ң', 'Ғ', 'Ү', 'Ұ', 'Қ', 'Ө', 'Һ'};
      final kzCount = solution.split('').where((c) => kzLetters.contains(c)).length;
      if (kzCount >= 1) unlock(allAchievements.firstWhere((a) => a.id == 'kazakh_char_win'));
      if (kzCount >= 2) unlock(allAchievements.firstWhere((a) => a.id == 'kazakh_char_rich'));

      // Time of day
      final hour = now.hour;
      if (hour >= 6 && hour <= 9) unlock(allAchievements.firstWhere((a) => a.id == 'early_bird'));
      if (hour >= 0 && hour <= 3) unlock(allAchievements.firstWhere((a) => a.id == 'night_owl'));
      if (now.weekday == DateTime.saturday || now.weekday == DateTime.sunday) {
        unlock(allAchievements.firstWhere((a) => a.id == 'weekend_player'));
      }
    }

    await StorageService.saveUnlockedAchievements(unlocked);
    await StorageService.saveAchievementProgress(progress);
    return newlyUnlocked;
  }

  static Future<List<Achievement>> checkSimpleEvent(String eventType) async {
    final unlocked = StorageService.getUnlockedAchievements();
    final progress = StorageService.getAchievementProgress();
    final newlyUnlocked = <Achievement>[];

    void unlock(Achievement a) {
      if (!unlocked.contains(a.id)) {
        unlocked.add(a.id);
        progress[a.id] = a.maxProgress;
        newlyUnlocked.add(a);
      }
    }

    void updateProg(Achievement a, int val) {
      final cur = progress[a.id] ?? 0;
      final next = val > cur ? val : cur;
      progress[a.id] = next;
      if (next >= a.maxProgress) {
        unlock(a);
      }
    }

    if (eventType == 'SHARE') {
      final a1 = allAchievements.firstWhere((a) => a.id == 'share_result_1');
      final a10 = allAchievements.firstWhere((a) => a.id == 'share_result_10');
      final count = (progress['share_result_1'] ?? 0) + 1;
      updateProg(a1, count);
      updateProg(a10, count);
    } else if (eventType == 'CHALLENGE_CREATE') {
      final a1 = allAchievements.firstWhere((a) => a.id == 'challenge_create_1');
      final a5 = allAchievements.firstWhere((a) => a.id == 'challenge_create_5');
      final count = (progress['challenge_create_1'] ?? 0) + 1;
      updateProg(a1, count);
      updateProg(a5, count);
    } else if (eventType == 'VIEW_RULES') {
      unlock(allAchievements.firstWhere((a) => a.id == 'rules_reader'));
    } else if (eventType == 'VIEW_CALENDAR') {
      unlock(allAchievements.firstWhere((a) => a.id == 'calendar_history_view'));
    } else if (eventType == 'VIEW_DEFINITION') {
      unlock(allAchievements.firstWhere((a) => a.id == 'sozdik_definition_view'));
    }

    await StorageService.saveUnlockedAchievements(unlocked);
    await StorageService.saveAchievementProgress(progress);
    return newlyUnlocked;
  }
}
