import 'dart:async';
import 'package:app_links/app_links.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'models/letter_status.dart';
import 'services/achievement_service.dart';
import 'services/analytics_service.dart';
import 'services/challenge_service.dart';
import 'services/game_engine.dart';
import 'services/storage_service.dart';
import 'theme/palette.dart';
import 'theme/theme_controller.dart';
import 'widgets/app_header.dart';
import 'widgets/modals/achievements_modal.dart';
import 'widgets/modals/calendar_modal.dart';
import 'widgets/modals/challenge_modal.dart';
import 'widgets/modals/end_game_modal.dart';
import 'widgets/modals/rules_modal.dart';
import 'widgets/modals/stats_modal.dart';
import 'widgets/ui.dart';
import 'widgets/virtual_keyboard.dart';
import 'widgets/word_grid.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await StorageService.init();
  ThemeController.load();
  runApp(const SozdilApp());
  AnalyticsService.track('visit');
}

class SozdilApp extends StatelessWidget {
  const SozdilApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: ThemeController.mode,
      builder: (context, mode, _) => MaterialApp(
        title: 'Сөзділ',
        debugShowCheckedModeBanner: false,
        themeMode: mode,
        theme: buildTheme(Palette.light, Brightness.light),
        darkTheme: buildTheme(Palette.dark, Brightness.dark),
        home: const GameScreen(),
      ),
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
  int _shakeTick = 0;
  int? _revealRow; // row submitted in this session → animated flip
  bool _legendSeen = StorageService.isLegendSeen();
  DateTime _startedAt = DateTime.now();

  // Challenge Mode
  String? _challengeWord;

  @override
  void initState() {
    super.initState();
    _wordLength = StorageService.getWordLength();
    _initDeepLinks();
    HardwareKeyboard.instance.addHandler(_onHardwareKey);
  }

  // Physical keyboard (macOS, tablets with keyboards); inactive while a sheet is on top.
  bool _onHardwareKey(KeyEvent e) {
    if (e is! KeyDownEvent || !(ModalRoute.of(context)?.isCurrent ?? true)) return false;
    final hw = HardwareKeyboard.instance;
    if (hw.isMetaPressed || hw.isControlPressed || hw.isAltPressed) return false;
    if (e.logicalKey == LogicalKeyboardKey.enter || e.logicalKey == LogicalKeyboardKey.numpadEnter) {
      _handleKeyPress('ENTER');
    } else if (e.logicalKey == LogicalKeyboardKey.backspace) {
      _handleKeyPress('BACKSPACE');
    } else {
      final ch = (e.character ?? '').toUpperCase();
      if (!RegExp(r'^[А-ЯЁӘІҢҒҮҰҚӨҺ]$').hasMatch(ch)) return false;
      _handleKeyPress(ch);
    }
    return true;
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
    HardwareKeyboard.instance.removeHandler(_onHardwareKey);
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
    _revealRow = null;

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

    if (mounted) setState(() => _isLoading = false);
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

  void _showToast(String message) => showAppToast(context, message);

  void _triggerShake() {
    HapticFeedback.heavyImpact();
    setState(() => _shakeTick++);
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
    if (_guesses.isEmpty) {
      _startedAt = DateTime.now();
      AnalyticsService.track('game_start',
          wordLength: _wordLength, gameNumber: GameEngine.getGameDayIndex(_currentDate) + 1, solution: _challengeWord == null ? _solution : null);
    }

    setState(() {
      _guesses.add(guess);
      _guessStatuses.add(statuses);
      _revealRow = _guesses.length - 1;
      _currentGuess = '';
    });
    // keyboard colours update once the row has flipped, as on the web
    final revealMs = (_wordLength - 1) * 250 + 480;
    Future.delayed(Duration(milliseconds: revealMs), () {
      if (mounted) setState(() => _updateKeyStatuses(guess, statuses));
    });

    final isWon = guess == _solution;
    final isLost = !isWon && _guesses.length >= 6;

    if (isWon || isLost) {
      final newStatus = isWon ? GameStatus.won : GameStatus.lost;
      setState(() {
        _gameStatus = newStatus;
        _legendSeen = true;
      });
      StorageService.setLegendSeen();
      AnalyticsService.track('game_end',
          wordLength: _wordLength,
          gameNumber: _challengeWord == null ? GameEngine.getGameDayIndex(_currentDate) + 1 : null,
          status: isWon ? 'WON' : 'LOST',
          guessCount: _guesses.length,
          durationSeconds: DateTime.now().difference(_startedAt).inSeconds.clamp(1, 86400),
          solution: _solution,
          payload: {'guesses': List<String>.from(_guesses), if (_challengeWord != null) 'challenge': true});

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
          // Мұздық (Streak Freeze) - жеңілген кезде стрик 0-ге түспейді, сақталады
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
          _showToast('Жаңа жетістік: ${newlyUnlocked.first.icon} ${newlyUnlocked.first.title}!');
        }
      }

      // End sheet after the flip (and the win bounce)
      Future.delayed(Duration(milliseconds: revealMs + (isWon ? 1100 : 500)), () {
        if (mounted) {
          _openEndGameModal();
        }
      });
    }
  }

  void _openEndGameModal() {
    final stats = StorageService.getStats(_wordLength);
    showAppSheet(context, EndGameModal(
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
    showAppSheet(context, ChallengeModal(initialLength: _wordLength),
    );
  }

  void _openAchievementsModal() {
    showAppSheet(context, const AchievementsModal(),
    );
  }

  void _openStatsModal() {
    final stats = StorageService.getStats(_wordLength);
    showAppSheet(context, StatsModal(stats: stats, wordLength: _wordLength),
    );
  }

  void _openCalendarModal() {
    showAppSheet(context, CalendarModal(
        wordLength: _wordLength,
        onSelectDate: (date) {
          _initGame(specificDate: date);
        },
      ),
    );
    AchievementService.checkSimpleEvent('VIEW_CALENDAR');
  }

  void _openRulesModal() {
    showAppSheet(context, RulesModal(wordLength: _wordLength),
    );
    AchievementService.checkSimpleEvent('VIEW_RULES');
  }

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    final dark = Theme.of(context).brightness == Brightness.dark;
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: (dark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark).copyWith(
        statusBarColor: Colors.transparent,
        systemNavigationBarColor: p.bg,
        systemNavigationBarIconBrightness: dark ? Brightness.light : Brightness.dark,
      ),
      child: Scaffold(
        body: SafeArea(
          child: _isLoading
              ? Center(child: CircularProgressIndicator(color: p.ink, strokeWidth: 2))
              : Column(
                  children: [
                    AppHeader(
                      currentLength: _wordLength,
                      onLengthChanged: _onLengthChanged,
                      onChallenge: _openChallengeModal,
                      onAchievements: _openAchievementsModal,
                      onStats: _openStatsModal,
                      onCalendar: _openCalendarModal,
                      onInfo: _openRulesModal,
                    ),
                    if (_challengeWord != null)
                      Container(
                        margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                        padding: const EdgeInsets.fromLTRB(14, 8, 8, 8),
                        decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: p.line)),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text('Досыңыздың сөзі · ${_challengeWord!.length} әріп',
                                  style: inter(13, weight: FontWeight.w600, color: p.ink)),
                            ),
                            Material(
                              color: p.ink,
                              shape: const StadiumBorder(),
                              child: InkWell(
                                customBorder: const StadiumBorder(),
                                onTap: () => _initGame(),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                                  child: Text('Күнделікті ойын', style: inter(12, weight: FontWeight.w600, color: p.onInk)),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        child: Column(
                          children: [
                            Expanded(
                              child: WordGrid(
                                guesses: _guesses,
                                guessStatuses: _guessStatuses,
                                currentGuess: _currentGuess,
                                wordLength: _wordLength,
                                shakeTick: _shakeTick,
                                revealRow: _revealRow,
                                revealIsWin: _gameStatus == GameStatus.won,
                              ),
                            ),
                            if (!_legendSeen && _guesses.isEmpty)
                              const Padding(padding: EdgeInsets.only(top: 12), child: ColorLegend()),
                          ],
                        ),
                      ),
                    ),
                    VirtualKeyboard(keyStatuses: _keyStatuses, onKeyPress: _handleKeyPress),
                  ],
                ),
        ),
      ),
    );
  }
}
