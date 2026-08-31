import 'dart:async';
import 'package:app_links/app_links.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'constants/app_colors.dart';
import 'models/letter_status.dart';
import 'services/achievement_service.dart';
import 'services/challenge_service.dart';
import 'services/game_engine.dart';
import 'services/storage_service.dart';
import 'widgets/app_header.dart';
import 'widgets/modals/achievements_modal.dart';
import 'widgets/modals/calendar_modal.dart';
import 'widgets/modals/challenge_modal.dart';
import 'widgets/modals/end_game_modal.dart';
import 'widgets/modals/rules_modal.dart';
import 'widgets/modals/stats_modal.dart';
import 'widgets/virtual_keyboard.dart';
import 'widgets/word_grid.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await StorageService.init();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppColors.background,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const SozdilApp());
}

class SozdilApp extends StatelessWidget {
  const SozdilApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Сөзділ',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.accent,
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      ),
      home: const GameScreen(),
    );
  }
}

class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  int _wordLength = 5;
  DateTime _currentDate = DateTime.now();
  String _solution = '';
  List<String> _dictionary = [];
  bool _isLoading = true;

  // Deep Link handler
  late final AppLinks _appLinks;
  StreamSubscription<Uri>? _linkSubscription;

  // Game Play State
  final List<String> _guesses = [];
  final List<List<LetterStatus>> _guessStatuses = [];
  final Map<String, LetterStatus> _keyStatuses = {};
  String _currentGuess = '';
  GameStatus _gameStatus = GameStatus.playing;
  bool _isShaking = false;

  // Challenge Mode
  String? _challengeWord;

  @override
  void initState() {
    super.initState();
    _wordLength = StorageService.getWordLength();
    _initDeepLinks();
  }

  Future<void> _initDeepLinks() async {
    _appLinks = AppLinks();

    try {
      final initialUri = await _appLinks.getInitialLink();
      if (initialUri != null) {
        _handleIncomingUri(initialUri);
        return;
      }
    } catch (_) {}

    _initGame();

    _linkSubscription = _appLinks.uriLinkStream.listen((uri) {
      _handleIncomingUri(uri);
    });
  }

  void _handleIncomingUri(Uri uri) {
    final code = uri.queryParameters['c'] ??
        uri.queryParameters['challenge'] ??
        uri.queryParameters['w'] ??
        uri.queryParameters['word'] ??
        uri.queryParameters['play'];

    if (code != null && code.isNotEmpty) {
      final decoded = ChallengeService.decodeChallenge(code);
      if (decoded != null && decoded.length >= 4 && decoded.length <= 6) {
        setState(() {
          _wordLength = decoded.length;
        });
        _initGame(challenge: decoded);
        return;
      }
    }
    _initGame();
  }

  @override
  void dispose() {
    _linkSubscription?.cancel();
    super.dispose();
  }

  Future<void> _initGame({DateTime? specificDate, String? challenge}) async {
    setState(() => _isLoading = true);

    _currentDate = specificDate ?? DateTime.now();
    _challengeWord = challenge;

    final dict = await GameEngine.loadDictionary(_wordLength);
    final solution = challenge != null
        ? challenge.toUpperCase()
        : await GameEngine.getDailyWord(_wordLength, _currentDate);

    _dictionary = dict;
    _solution = solution;
    _guesses.clear();
    _guessStatuses.clear();
    _keyStatuses.clear();
    _currentGuess = '';
    _gameStatus = GameStatus.playing;

    // Load saved game if not in challenge mode
    if (challenge == null) {
      final dateStr = GameEngine.getGameDateString(_currentDate);
      final saved = StorageService.getSavedGameState(dateStr, _wordLength);
      if (saved != null) {
        final savedGuesses = (saved['guesses'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [];
        for (final g in savedGuesses) {
          _guesses.add(g);
          final statuses = GameEngine.getGuessStatuses(g, _solution);
          _guessStatuses.add(statuses);
          _updateKeyStatuses(g, statuses);
        }

        final statusStr = saved['status']?.toString();
        if (statusStr == GameStatus.won.name) {
          _gameStatus = GameStatus.won;
        } else if (statusStr == GameStatus.lost.name || _guesses.length >= 6) {
          _gameStatus = GameStatus.lost;
        }
      }
    }

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  void _updateKeyStatuses(String guess, List<LetterStatus> statuses) {
    for (int i = 0; i < guess.length; i++) {
      final letter = guess[i];
      final status = statuses[i];
      final current = _keyStatuses[letter];

      if (current == LetterStatus.correct) continue;
      if (current == LetterStatus.present && status == LetterStatus.absent) continue;

      _keyStatuses[letter] = status;
    }
  }

  void _onLengthChanged(int newLen) {
    if (_wordLength != newLen) {
      setState(() {
        _wordLength = newLen;
        StorageService.setWordLength(newLen);
      });
      _initGame();
    }
  }

  void _showToast(String message, {Color color = AppColors.surfaceLight}) {
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
        ),
        backgroundColor: color,
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
      ),
    );
  }

  void _triggerShake() {
    HapticFeedback.heavyImpact();
    setState(() => _isShaking = true);
    Future.delayed(const Duration(milliseconds: 400), () {
      if (mounted) setState(() => _isShaking = false);
    });
  }

  void _handleKeyPress(String key) {
    if (_gameStatus != GameStatus.playing || _isLoading) return;

    if (key == 'ENTER') {
      _submitGuess();
    } else if (key == 'BACKSPACE') {
      if (_currentGuess.isNotEmpty) {
        setState(() {
          _currentGuess = _currentGuess.substring(0, _currentGuess.length - 1);
        });
      }
    } else {
      if (_currentGuess.length < _wordLength) {
        setState(() {
          _currentGuess += key;
        });
      }
    }
  }

  void _submitGuess() async {
    if (_currentGuess.length < _wordLength) {
      _showToast('Әріп саны жеткіліксіз');
      _triggerShake();
      return;
    }

    if (!_dictionary.contains(_currentGuess)) {
      _showToast('Сөздікте мұндай сөз жоқ');
      _triggerShake();
      return;
    }

    final guess = _currentGuess;
    final statuses = GameEngine.getGuessStatuses(guess, _solution);

    setState(() {
      _guesses.add(guess);
      _guessStatuses.add(statuses);
      _updateKeyStatuses(guess, statuses);
      _currentGuess = '';
    });

    final isWon = guess == _solution;
    final isLost = !isWon && _guesses.length >= 6;

    if (isWon || isLost) {
      final newStatus = isWon ? GameStatus.won : GameStatus.lost;
      setState(() => _gameStatus = newStatus);

      // Save state & stats if not challenge
      if (_challengeWord == null) {
        final dateStr = GameEngine.getGameDateString(_currentDate);
        await StorageService.saveGameState(dateStr, _wordLength, _guesses, newStatus);

        final stats = StorageService.getStats(_wordLength);
        final history = StorageService.getHistory(_wordLength);

        stats['gamesPlayed'] = (stats['gamesPlayed'] as int) + 1;
        if (isWon) {
          stats['wins'] = (stats['wins'] as int) + 1;
          stats['currentStreak'] = (stats['currentStreak'] as int) + 1;
          final maxS = stats['maxStreak'] as int;
          if ((stats['currentStreak'] as int) > maxS) {
            stats['maxStreak'] = stats['currentStreak'];
          }
          final dist = List<int>.from(stats['guessDistribution'] as List);
          dist[_guesses.length - 1] += 1;
          stats['guessDistribution'] = dist;
          history[dateStr] = 'WON';
        } else {
          stats['currentStreak'] = 0;
          history[dateStr] = 'LOST';
        }

        await StorageService.saveStats(_wordLength, stats);
        await StorageService.saveHistory(_wordLength, history);

        // Check achievements
        final modeWins = {
          4: StorageService.getStats(4)['wins'] as int,
          5: StorageService.getStats(5)['wins'] as int,
          6: StorageService.getStats(6)['wins'] as int,
        };

        final newlyUnlocked = await AchievementService.checkOnGameOver(
          isWon: isWon,
          wordLength: _wordLength,
          guessesCount: _guesses.length,
          solution: _solution,
          firstGuessStatuses: _guessStatuses.first,
          allStatuses: _guessStatuses,
          totalWins: stats['wins'] as int,
          currentStreak: stats['currentStreak'] as int,
          modeWins: modeWins,
          isChallenge: false,
        );

        if (newlyUnlocked.isNotEmpty) {
          _showToast('Жаңа жетістік: ${newlyUnlocked.first.icon} ${newlyUnlocked.first.title}!', color: AppColors.trophy);
        }
      }

      // Show End Game Dialog after brief animation
      Future.delayed(const Duration(milliseconds: 600), () {
        if (mounted) {
          _openEndGameModal();
        }
      });
    }
  }

  void _openEndGameModal() {
    final stats = StorageService.getStats(_wordLength);
    showDialog(
      context: context,
      builder: (_) => EndGameModal(
        isWon: _gameStatus == GameStatus.won,
        solution: _solution,
        guesses: _guesses,
        guessStatuses: _guessStatuses,
        gameNumber: GameEngine.getGameDayIndex(_currentDate) + 1,
        currentStreak: (stats['currentStreak'] as num?)?.toInt() ?? 0,
        isChallenge: _challengeWord != null,
        onCreateChallenge: () => _openChallengeModal(),
      ),
    );
  }

  void _openChallengeModal() {
    showDialog(
      context: context,
      builder: (_) => ChallengeModal(initialLength: _wordLength),
    );
  }

  void _openAchievementsModal() {
    showDialog(
      context: context,
      builder: (_) => const AchievementsModal(),
    );
  }

  void _openStatsModal() {
    final stats = StorageService.getStats(_wordLength);
    showDialog(
      context: context,
      builder: (_) => StatsModal(stats: stats, wordLength: _wordLength),
    );
  }

  void _openCalendarModal() {
    showDialog(
      context: context,
      builder: (_) => CalendarModal(
        wordLength: _wordLength,
        onSelectDate: (date) {
          _initGame(specificDate: date);
        },
      ),
    );
    AchievementService.checkSimpleEvent('VIEW_CALENDAR');
  }

  void _openRulesModal() {
    showDialog(
      context: context,
      builder: (_) => RulesModal(wordLength: _wordLength),
    );
    AchievementService.checkSimpleEvent('VIEW_RULES');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: _isLoading
            ? const Center(child: CircularProgressIndicator(color: AppColors.accent))
            : Column(
                children: [
                  // App Header with 2-Row ergonomic layout
                  AppHeader(
                    currentLength: _wordLength,
                    onLengthChanged: _onLengthChanged,
                    onChallenge: _openChallengeModal,
                    onAchievements: _openAchievementsModal,
                    onStats: _openStatsModal,
                    onCalendar: _openCalendarModal,
                    onInfo: _openRulesModal,
                  ),

                  // Challenge Mode Active Banner
                  if (_challengeWord != null)
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.accent.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.accent.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Text('⚔️', style: TextStyle(fontSize: 13)),
                              const SizedBox(width: 6),
                              Text(
                                'Досыңыздың сөзі (${_challengeWord!.length} әріп)',
                                style: GoogleFonts.inter(
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.accent,
                                ),
                              ),
                            ],
                          ),
                          GestureDetector(
                            onTap: () => _initGame(),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppColors.surface,
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: Text(
                                'Күнделікті ойын',
                                style: GoogleFonts.inter(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppColors.text),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                  // 6-row Word Grid
                  Expanded(
                    child: Center(
                      child: WordGrid(
                        guesses: _guesses,
                        guessStatuses: _guessStatuses,
                        currentGuess: _currentGuess,
                        wordLength: _wordLength,
                        isShaking: _isShaking,
                      ),
                    ),
                  ),

                  // 35-letter Kazakh Keyboard
                  VirtualKeyboard(
                    keyStatuses: _keyStatuses,
                    onKeyPress: _handleKeyPress,
                  ),
                ],
              ),
      ),
    );
  }
}
