import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:reicon_flutter/reicon_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../constants/app_colors.dart';
import '../../models/letter_status.dart';
import '../../services/game_engine.dart';
import '../reicon_widget.dart';

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

  @override
  void initState() {
    super.initState();
    _timeLeft = GameEngine.getTimeUntilMidnight();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) {
        setState(() {
          _timeLeft = GameEngine.getTimeUntilMidnight();
        });
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  String _formatDuration(Duration d) {
    final hours = d.inHours.toString().padLeft(2, '0');
    final minutes = (d.inMinutes % 60).toString().padLeft(2, '0');
    final seconds = (d.inSeconds % 60).toString().padLeft(2, '0');
    return '$hours:$minutes:$seconds';
  }

  String _generateEmojiGrid() {
    return widget.guessStatuses.map((row) {
      return row.map((s) {
        if (s == LetterStatus.correct) return '🟩';
        if (s == LetterStatus.present) return '🟨';
        return '⬛';
      }).join('');
    }).join('\n');
  }

  String _getShareText() {
    final guessCount = widget.isWon ? widget.guesses.length.toString() : 'X';
    final streak = (!widget.isChallenge && widget.isWon && widget.currentStreak > 0)
        ? ' 🔥 ${widget.currentStreak} күн қатарынан!'
        : '';
    final header = widget.isChallenge
        ? 'Мен досымның жасырған сөзін $guessCount/6 талпыныста таптым! ⚔️'
        : 'Сөзділ #${widget.gameNumber} $guessCount/6$streak';

    return '$header\n\n${_generateEmojiGrid()}\n\nhttps://sozdil.vercel.app';
  }

  void _shareWhatsApp() async {
    final text = _getShareText();
    final url = Uri.parse('https://api.whatsapp.com/send?text=${Uri.encodeComponent(text)}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _shareTelegram() async {
    final text = _getShareText();
    final url = Uri.parse('https://t.me/share/url?url=https://sozdil.vercel.app&text=${Uri.encodeComponent(text)}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _shareGeneral() {
    SharePlus.instance.share(
      ShareParams(
        text: _getShareText(),
        subject: 'Сөзділ нәтижесі',
      ),
    );
  }

  void _openDefinition() async {
    final word = widget.solution.toLowerCase();
    final url = Uri.parse('https://sozdikqor.kz/search?q=$word');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: AppColors.border),
      ),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Icon
              if (widget.isWon)
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: AppColors.correct.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: ReiconWidget(
                    Reicon.outline.checkCircle,
                    color: AppColors.correct,
                    size: 34,
                  ),
                ),
              const SizedBox(height: 12),

              // Title
              Text(
                widget.isChallenge
                    ? (widget.isWon ? 'Досыңыздың сөзін таптыңыз! ⚔️' : 'Сөз табылмады ⚔️')
                    : (widget.isWon ? 'Керемет жеңіс!' : 'Өкінішке қарай, табылмады'),
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.text,
                ),
              ),

              // Streak Banner
              if (!widget.isChallenge && widget.isWon && widget.currentStreak > 0) ...[
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.amber.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('🔥', style: TextStyle(fontSize: 16)),
                      const SizedBox(width: 6),
                      Text(
                        'Сіз қатарынан ${widget.currentStreak} күн сөз таптыңыз!',
                        style: GoogleFonts.inter(
                          fontSize: 12.5,
                          fontWeight: FontWeight.bold,
                          color: Colors.amber.shade300,
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 16),

              // Solution word
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Жасырын сөз: ',
                    style: GoogleFonts.inter(fontSize: 14, color: AppColors.muted),
                  ),
                  Text(
                    widget.solution,
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 2.0,
                      color: AppColors.correct,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Next game timer
              if (!widget.isChallenge) ...[
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    children: [
                      Text(
                        'КЕЛЕСІ СӨЗГЕ ДЕЙІН:',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppColors.muted,
                          letterSpacing: 1.0,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _formatDuration(_timeLeft),
                        style: GoogleFonts.inter(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppColors.text,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Challenge Reply Button
              if (widget.onCreateChallenge != null) ...[
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      widget.onCreateChallenge!();
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      side: BorderSide(color: AppColors.accent.withValues(alpha: 0.5)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        ReiconWidget(Reicon.outline.gamepad, color: AppColors.accent, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          'Өз кезегіңде сөз жасыр ⚔️',
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: AppColors.accent,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
              ],

              // Social Share Buttons (WhatsApp & Telegram)
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _shareWhatsApp,
                      icon: const Icon(Icons.chat, color: Colors.white, size: 18),
                      label: Text(
                        'WhatsApp',
                        style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF25D366),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _shareTelegram,
                      icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
                      label: Text(
                        'Telegram',
                        style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF229ED9),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 10),

              // Definition & System Share Row
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _openDefinition,
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: const BorderSide(color: AppColors.border),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          ReiconWidget(Reicon.outline.book, color: AppColors.text, size: 17),
                          const SizedBox(width: 6),
                          Text(
                            'Сөздікқор',
                            style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 12.5, color: AppColors.text),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _shareGeneral,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accent,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          ReiconWidget(Reicon.outline.share, color: Colors.white, size: 17),
                          const SizedBox(width: 6),
                          Text(
                            'Бөлісу',
                            style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 12.5),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
