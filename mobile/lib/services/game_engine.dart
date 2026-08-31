import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import '../models/letter_status.dart';

class GameEngine {
  static final Map<int, List<String>> _dictionaryCache = {};

  static Future<List<String>> loadDictionary(int length) async {
    if (_dictionaryCache.containsKey(length)) {
      return _dictionaryCache[length]!;
    }
    final jsonStr = await rootBundle.loadString('assets/dict/words_$length.json');
    final List<dynamic> raw = jsonDecode(jsonStr);
    final list = raw.map((e) => e.toString().toUpperCase()).toList();
    _dictionaryCache[length] = list;
    return list;
  }

  // Exact letter matching with priority (correct, present, absent)
  static List<LetterStatus> getGuessStatuses(String guess, String solution) {
    final splitSolution = solution.split('');
    final splitGuess = guess.split('');
    final length = solution.length;

    final solutionCharsTaken = List<bool>.filled(length, false);
    final statuses = List<LetterStatus>.filled(length, LetterStatus.absent);

    // 1. Correct position
    for (int i = 0; i < length; i++) {
      if (i < splitGuess.length && splitSolution[i] == splitGuess[i]) {
        statuses[i] = LetterStatus.correct;
        solutionCharsTaken[i] = true;
      }
    }

    // 2. Present in word
    for (int i = 0; i < length; i++) {
      if (statuses[i] == LetterStatus.correct) continue;

      if (i < splitGuess.length) {
        final letter = splitGuess[i];
        for (int j = 0; j < length; j++) {
          if (splitSolution[j] == letter && !solutionCharsTaken[j]) {
            statuses[i] = LetterStatus.present;
            solutionCharsTaken[j] = true;
            break;
          }
        }
      }
    }

    return statuses;
  }

  // Almaty timezone date & day calculations (Asia/Almaty GMT+5)
  static String getGameDateString([DateTime? date]) {
    final d = (date ?? DateTime.now()).toUtc().add(const Duration(hours: 5));
    return DateFormat('yyyy-MM-dd').format(d);
  }

  static int getGameDayIndex([DateTime? date]) {
    final todayStr = getGameDateString(date);
    final epochStr = '2024-08-01';
    final todayUtc = DateTime.parse('${todayStr}T00:00:00Z');
    final epochUtc = DateTime.parse('${epochStr}T00:00:00Z');
    return (todayUtc.difference(epochUtc).inDays).clamp(0, 999999);
  }

  static Duration getTimeUntilMidnight() {
    final nowAlmaty = DateTime.now().toUtc().add(const Duration(hours: 5));
    final nextMidnightAlmaty = DateTime.utc(
      nowAlmaty.year,
      nowAlmaty.month,
      nowAlmaty.day + 1,
      0,
      0,
      0,
    );
    final diff = nextMidnightAlmaty.difference(nowAlmaty);
    return diff.isNegative ? Duration.zero : diff;
  }

  // Deterministic daily word picker
  static const Set<String> _forbidden = {'Ф', 'Ц', 'Я', 'Ё', 'Ъ', 'Ь', 'Э', 'Ю', 'ф', 'ц', 'я', 'ё', 'ъ', 'ь', 'э', 'ю'};
  static const Set<String> _back = {'А', 'О', 'Ұ', 'Ы', 'Қ', 'Ғ', 'Һ', 'а', 'о', 'ұ', 'ы', 'қ', 'ғ', 'һ'};
  static const Set<String> _front = {'Ә', 'Ө', 'Ү', 'І', 'Е', 'И', 'Й', 'ә', 'ө', 'ү', 'і', 'е', 'и', 'й'};

  static bool _isHarmonious(String word) {
    bool hasBack = false;
    bool hasFront = false;
    for (int i = 0; i < word.length; i++) {
      final ch = word[i];
      if (_back.contains(ch)) hasBack = true;
      if (_front.contains(ch)) hasFront = true;
      if (hasBack && hasFront) return false;
    }
    return true;
  }

  static List<String> _filterKazakhWords(List<String> words, int len) {
    return words.where((w) {
      if (w.length != len) return false;
      for (int i = 0; i < w.length; i++) {
        if (_forbidden.contains(w[i])) return false;
      }
      return _isHarmonious(w);
    }).toList();
  }

  static int _fnv1a32(String str) {
    int h = 0x811c9dc5;
    for (int i = 0; i < str.length; i++) {
      h ^= str.codeUnitAt(i);
      h = (h * 0x01000193) & 0xFFFFFFFF;
    }
    return h;
  }

  static List<T> _saltedPermutation<T>(List<T> arr, int seed) {
    final a = List<T>.from(arr);
    int s = seed & 0xFFFFFFFF;
    double rnd() {
      s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
      return s / 0x100000000;
    }

    for (int i = a.length - 1; i > 0; i--) {
      final j = (rnd() * (i + 1)).floor();
      if (j != i) {
        final t = a[i];
        a[i] = a[j];
        a[j] = t;
      }
    }
    return a;
  }

  static T _pickNoRecent<T>(List<T> perm, int start, int windowSize) {
    final n = perm.length;
    if (n == 0) throw Exception('Empty permutation');
    if (n == 1) return perm[0];
    final recent = <int>{};
    final win = windowSize.clamp(0, n - 1);
    for (int k = 1; k <= win; k++) {
      recent.add((start - k + n) % n);
    }
    for (int shift = 0; shift < n; shift++) {
      final idx = (start + shift) % n;
      if (!recent.contains(idx)) return perm[idx];
    }
    return perm[start % n];
  }

  static Future<String> getDailyWord(int length, [DateTime? date]) async {
    final dict = await loadDictionary(length);
    final clean = _filterKazakhWords(dict, length);
    if (clean.isEmpty) return dict.first;

    final gameDay = getGameDayIndex(date);
    const seasonSpan = 180;
    final seasonIndex = gameDay ~/ seasonSpan;
    final seedStr = 'season:$seasonIndex|len:$length|salt:local';
    final seed = _fnv1a32(seedStr);
    final perm = _saltedPermutation(clean, seed);
    final start = perm.isNotEmpty ? (gameDay % perm.length) : 0;
    return _pickNoRecent(perm, start, 120);
  }
}
