import 'dart:async';
import 'package:flutter/material.dart';
import 'package:reicon_flutter/reicon_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../models/letter_status.dart';
import '../../services/analytics_service.dart';
import '../../services/definition_service.dart';
import '../../services/game_engine.dart';
import '../../theme/palette.dart';
import '../reicon_widget.dart';
import '../ui.dart';

class EndGameModal extends StatefulWidget {
  final bool isWon;
  final String solution;
  final List<String> guesses;
  final List<List<LetterStatus>> guessStatuses;
  final int gameNumber;
  final int currentStreak;
  final bool isChallenge;
  final VoidCallback? onCreateChallenge;

  const EndGameModal({
    super.key,
    required this.isWon,
    required this.solution,
    required this.guesses,
    required this.guessStatuses,
    required this.gameNumber,
    required this.currentStreak,
    this.isChallenge = false,
    this.onCreateChallenge,
  });

  @override
  State<EndGameModal> createState() => _EndGameModalState();
}

class _EndGameModalState extends State<EndGameModal> {
  late Timer _timer;
  Duration _timeLeft = Duration.zero;
  List<WordDefinition>? _defs;
  bool _showAll = false;

  @override
  void initState() {
    super.initState();
    _timeLeft = GameEngine.getTimeUntilMidnight();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _timeLeft = GameEngine.getTimeUntilMidnight());
    });
    DefinitionService.fetch(widget.solution).then((d) {
      if (mounted) setState(() => _defs = d);
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  String _fmt(Duration d) =>
      '${d.inHours.toString().padLeft(2, '0')}:${(d.inMinutes % 60).toString().padLeft(2, '0')}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';

  // Share grid keeps the universal Wordle emoji so it reads the same in every chat
  String get _emojiGrid => widget.guessStatuses
      .map((row) => row.map((s) => s == LetterStatus.correct ? '🟩' : s == LetterStatus.present ? '🟨' : '⬛').join())
      .join('\n');

  String get _count => widget.isWon ? '${widget.guesses.length}' : 'X';

  String get _header {
    final streak = (!widget.isChallenge && widget.isWon && widget.currentStreak > 0) ? ' 🔥 ${widget.currentStreak} күн қатарынан!' : '';
    return widget.isChallenge
        ? 'Мен досымның жасырған сөзін $_count/6 талпыныста таптым! ⚔️'
        : 'Сөзділ #${widget.gameNumber} $_count/6$streak';
  }

  String get _shareText => '$_header\n\n$_emojiGrid\n\nhttps://sozdil.vercel.app';

  void _track(String platform) => AnalyticsService.track('share', gameNumber: widget.gameNumber, wordLength: widget.solution.length, payload: {'via': platform});

  Future<void> _open(Uri url) async {
    if (await canLaunchUrl(url)) await launchUrl(url, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    final title = widget.isChallenge
        ? (widget.isWon ? 'Досыңыздың сөзін таптыңыз!' : 'Сөз табылмады')
        : (widget.isWon ? 'Әп, бәрекелді!' : 'Келесі жолы сәттілік!');

    return SheetFrame(
      child: Column(
        children: [
          Text(widget.isChallenge ? 'Сайыс · $_count/6' : 'Сөзділ #${widget.gameNumber} · $_count/6', style: inter(12, weight: FontWeight.w600, color: p.muted)),
          const SizedBox(height: 6),
          Text(title, textAlign: TextAlign.center, style: inter(25, weight: FontWeight.w800, color: p.ink, spacing: -0.4)),
          if (!widget.isChallenge && widget.isWon && widget.currentStreak > 0) ...[
            const SizedBox(height: 8),
            Row(mainAxisSize: MainAxisSize.min, children: [
              ReiconWidget(Reicon.filled.flame, color: p.ink, size: 15),
              const SizedBox(width: 4),
              Text(widget.currentStreak == 1 ? 'Серияның алғашқы күні' : 'Қатарынан ${widget.currentStreak} күн',
                  style: inter(12.5, weight: FontWeight.w600, color: p.ink)),
            ]),
          ],
          const SizedBox(height: 20),
          if (!widget.isWon) ...[Text('Жасырын сөз', style: inter(11.5, weight: FontWeight.w600, color: p.muted)), const SizedBox(height: 8)],
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: widget.solution.split('').map((ch) {
              return Container(
                width: 40,
                height: 44,
                margin: const EdgeInsets.symmetric(horizontal: 3),
                decoration: BoxDecoration(
                  color: widget.isWon ? p.accent : Colors.transparent,
                  borderRadius: BorderRadius.circular(9),
                  border: Border.all(color: widget.isWon ? p.accent : p.ink, width: 2),
                ),
                alignment: Alignment.center,
                child: Text(ch, style: inter(19, weight: FontWeight.w700, color: widget.isWon ? p.onAccent : p.ink)),
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
          _definitionCard(p),
          const SizedBox(height: 20),
          PrimaryButton(
            label: 'Нәтижемен бөлісу',
            icon: ReiconWidget(Reicon.outline.share, color: p.onInk, size: 18),
            onPressed: () {
              _track('system');
              SharePlus.instance.share(ShareParams(text: _shareText, subject: 'Сөзділ нәтижесі'));
            },
          ),
          const SizedBox(height: 8),
          Row(children: [
            Expanded(
              child: SecondaryButton(
                label: 'WhatsApp',
                onPressed: () {
                  _track('whatsapp');
                  _open(Uri.parse('https://api.whatsapp.com/send?text=${Uri.encodeComponent(_shareText)}'));
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: SecondaryButton(
                label: 'Telegram',
                onPressed: () {
                  _track('telegram');
                  _open(Uri.parse('https://t.me/share/url?url=https://sozdil.vercel.app&text=${Uri.encodeComponent('$_header\n\n$_emojiGrid')}'));
                },
              ),
            ),
          ]),
          if (widget.onCreateChallenge != null) ...[
            const SizedBox(height: 16),
            Container(
              decoration: BoxDecoration(border: Border.all(color: p.line), borderRadius: BorderRadius.circular(18)),
              clipBehavior: Clip.antiAlias,
              child: ActionRow(
                icon: ReiconWidget(Reicon.outline.gamepad, color: p.ink, size: 18),
                title: 'Досыңа сөз жасыр',
                hint: 'Сөз ойлап тап та, сілтемесін жібер',
                onTap: () {
                  Navigator.pop(context);
                  widget.onCreateChallenge!();
                },
              ),
            ),
          ],
          if (!widget.isChallenge) ...[
            const SizedBox(height: 18),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              Text('Келесі сөз  ', style: inter(12.5, color: p.muted)),
              Text(_fmt(_timeLeft), style: inter(14, weight: FontWeight.w700, color: p.ink).copyWith(fontFeatures: const [FontFeature.tabularFigures()])),
            ]),
          ],
        ],
      ),
    );
  }

  Widget _definitionCard(Palette p) {
    final defs = _defs;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(18)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Expanded(child: Text('Сөздік анықтамасы', style: inter(12, weight: FontWeight.w600, color: p.muted))),
            GestureDetector(
              onTap: () => _open(Uri.parse('https://sozdikqor.kz/search?q=${Uri.encodeComponent(widget.solution.toLowerCase())}')),
              child: Text('Sozdikqor ↗', style: inter(11.5, weight: FontWeight.w500, color: p.muted)),
            ),
          ]),
          const SizedBox(height: 8),
          if (defs == null)
            Column(children: [
              Container(height: 11, decoration: BoxDecoration(color: p.surface2, borderRadius: BorderRadius.circular(4))),
              const SizedBox(height: 6),
              FractionallySizedBox(
                widthFactor: 0.8,
                alignment: Alignment.centerLeft,
                child: Container(height: 11, decoration: BoxDecoration(color: p.surface2, borderRadius: BorderRadius.circular(4))),
              ),
            ])
          else if (defs.isEmpty)
            Text('Бұл сөздің мағынасын Sozdikqor.kz сайтынан көре аласыз.', style: inter(13.5, color: p.muted, height: 1.4))
          else ...[
            Text(defs.first.text, maxLines: _showAll ? null : 3, overflow: _showAll ? null : TextOverflow.ellipsis, style: inter(14, color: p.ink, height: 1.45)),
            if (defs.first.source.isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(defs.first.source, maxLines: 1, overflow: TextOverflow.ellipsis, style: inter(11, color: p.muted)),
            ],
            if (_showAll)
              for (final d in defs.skip(1)) ...[
                const SizedBox(height: 12),
                Text(d.text, style: inter(14, color: p.ink, height: 1.45)),
                Text(d.source, style: inter(11, color: p.muted)),
              ],
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () => setState(() => _showAll = !_showAll),
              child: Text(
                _showAll ? 'Жинау' : (defs.length > 1 ? 'Толық оқу · ${defs.length} дереккөз' : 'Толық оқу'),
                style: inter(12.5, weight: FontWeight.w600, color: p.ink).copyWith(decoration: TextDecoration.underline, decorationColor: p.line),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
