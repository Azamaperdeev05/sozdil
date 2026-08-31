import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/letter_status.dart';

class StorageService {
  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  // Word length preference
  static int getWordLength() {
    return _prefs?.getInt('sozdil_word_length') ?? 5;
  }

  static Future<void> setWordLength(int len) async {
    await _prefs?.setInt('sozdil_word_length', len);
  }

  // Saved game state per date & length
  static Map<String, dynamic>? getSavedGameState(String dateStr, int len) {
    final raw = _prefs?.getString('sozdil_state_${dateStr}_$len');
    if (raw == null) return null;
    try {
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  static Future<void> saveGameState(String dateStr, int len, List<String> guesses, GameStatus status) async {
    final map = {
      'guesses': guesses,
      'status': status.name,
    };
    await _prefs?.setString('sozdil_state_${dateStr}_$len', jsonEncode(map));
  }

  // Stats per word length
  static Map<String, dynamic> getStats(int len) {
    final raw = _prefs?.getString('sozdil_stats_$len');
    if (raw == null) {
      return {
        'gamesPlayed': 0,
        'wins': 0,
        'currentStreak': 0,
        'maxStreak': 0,
        'guessDistribution': List<int>.filled(6, 0),
        'lastGameDate': '',
      };
    }
    try {
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return {
        'gamesPlayed': 0,
        'wins': 0,
        'currentStreak': 0,
        'maxStreak': 0,
        'guessDistribution': List<int>.filled(6, 0),
        'lastGameDate': '',
      };
    }
  }

  static Future<void> saveStats(int len, Map<String, dynamic> stats) async {
    await _prefs?.setString('sozdil_stats_$len', jsonEncode(stats));
  }

  // History mapping { 'yyyy-MM-dd': 'WON' / 'LOST' }
  static Map<String, String> getHistory(int len) {
    final raw = _prefs?.getString('sozdil_history_$len');
    if (raw == null) return {};
    try {
      final Map<String, dynamic> map = jsonDecode(raw);
      return map.map((k, v) => MapEntry(k, v.toString()));
    } catch (_) {
      return {};
    }
  }

  static Future<void> saveHistory(int len, Map<String, String> history) async {
    await _prefs?.setString('sozdil_history_$len', jsonEncode(history));
  }

  // Achievements
  static List<String> getUnlockedAchievements() {
    return _prefs?.getStringList('sozdil_unlocked_achievements') ?? [];
  }

  static Future<void> saveUnlockedAchievements(List<String> list) async {
    await _prefs?.setStringList('sozdil_unlocked_achievements', list);
  }

  static Map<String, int> getAchievementProgress() {
    final raw = _prefs?.getString('sozdil_achievements_progress');
    if (raw == null) return {};
    try {
      final Map<String, dynamic> map = jsonDecode(raw);
      return map.map((k, v) => MapEntry(k, (v as num).toInt()));
    } catch (_) {
      return {};
    }
  }

  static Future<void> saveAchievementProgress(Map<String, int> prog) async {
    await _prefs?.setString('sozdil_achievements_progress', jsonEncode(prog));
  }
}
