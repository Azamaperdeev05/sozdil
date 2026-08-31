import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:reicon_flutter/reicon_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../constants/app_colors.dart';
import '../../services/achievement_service.dart';
import '../../services/challenge_service.dart';
import '../../services/game_engine.dart';
import '../reicon_widget.dart';

class ChallengeModal extends StatefulWidget {
  final int initialLength;

  const ChallengeModal({super.key, required this.initialLength});

  @override
  State<ChallengeModal> createState() => _ChallengeModalState();
}

class _ChallengeModalState extends State<ChallengeModal> {
  late int _length;
  final TextEditingController _controller = TextEditingController();
  List<String> _dictionary = [];
  String? _generatedUrl;

  @override
  void initState() {
    super.initState();
    _length = widget.initialLength;
    _loadDict();
  }

  void _loadDict() async {
    final dict = await GameEngine.loadDictionary(_length);
    if (mounted) {
      setState(() {
        _dictionary = dict;
      });
    }
  }

  void _onLengthChanged(int len) {
    if (_length != len) {
      setState(() {
        _length = len;
        _controller.clear();
        _generatedUrl = null;
      });
      _loadDict();
    }
  }

  bool _isValidWord(String word) {
    return word.length == _length && _dictionary.contains(word.toUpperCase());
  }

  void _generateLink() {
    final word = _controller.text.trim().toUpperCase();
    if (_isValidWord(word)) {
      final url = ChallengeService.getChallengeUrl(word);
      setState(() {
        _generatedUrl = url;
      });
      AchievementService.checkSimpleEvent('CHALLENGE_CREATE');
    }
  }

  String _getShareMessage() {
    return 'Досым, мен саған Сөзділ ойынында жасырын сөз жасырдым! ($_length әріп) ⚔️\nТауып көр:\n$_generatedUrl';
  }

  void _shareWhatsApp() async {
    if (_generatedUrl == null) return;
    final msg = _getShareMessage();
    final url = Uri.parse('https://api.whatsapp.com/send?text=${Uri.encodeComponent(msg)}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _shareTelegram() async {
    if (_generatedUrl == null) return;
    final msg = _getShareMessage();
    final url = Uri.parse('https://t.me/share/url?url=$_generatedUrl&text=${Uri.encodeComponent(msg)}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _copyLink() {
    if (_generatedUrl != null) {
      Clipboard.setData(ClipboardData(text: _generatedUrl!));
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Сілтеме көшірілді! ✓', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
          backgroundColor: AppColors.correct,
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final word = _controller.text.trim().toUpperCase();
    final isValid = _isValidWord(word);
    final isFull = word.length == _length;

    return Dialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: AppColors.border),
      ),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Досыңа сөз жасыр ⚔️',
                    style: GoogleFonts.inter(
                      fontSize: 19,
                      fontWeight: FontWeight.bold,
                      color: AppColors.text,
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: ReiconWidget(Reicon.outline.closeCircle, color: AppColors.muted, size: 22),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Description
              Text(
                'Кез келген қазақша сөзді жасырып, досыңызға шифрланған құпия сілтеме жіберіңіз. Сөз сілтемеде көрінбейді!',
                style: GoogleFonts.inter(fontSize: 12.5, color: AppColors.muted, height: 1.4),
              ),
              const SizedBox(height: 16),

              // Length selector
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [4, 5, 6].map((len) {
                    final isSel = _length == len;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () => _onLengthChanged(len),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          decoration: BoxDecoration(
                            color: isSel ? AppColors.accent : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            '$len әріп',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: isSel ? Colors.white : AppColors.muted,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 16),

              // Input field
              TextField(
                controller: _controller,
                autofocus: true,
                textCapitalization: TextCapitalization.characters,
                maxLength: _length,
                onChanged: (_) => setState(() => _generatedUrl = null),
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 4.0,
                  color: AppColors.text,
                ),
                textAlign: TextAlign.center,
                decoration: InputDecoration(
                  counterText: '',
                  hintText: 'СӨЗДІ ЕНГІЗІҢІЗ',
                  hintStyle: GoogleFonts.inter(fontSize: 13, letterSpacing: 1.0, color: AppColors.muted),
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.accent, width: 2),
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // Live validation indicator
              if (word.isNotEmpty)
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      isValid ? Icons.check_circle_rounded : Icons.error_outline_rounded,
                      color: isValid ? AppColors.correct : Colors.redAccent,
                      size: 16,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      isValid
                          ? 'Сөздікте бар! Жасыруға болады ✓'
                          : (isFull ? 'Сөздікте табылмады' : 'Тағы ${_length - word.length} әріп қажет'),
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isValid ? AppColors.correct : Colors.redAccent,
                      ),
                    ),
                  ],
                ),
              const SizedBox(height: 16),

              // Generate Link Button
              if (_generatedUrl == null)
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: isValid ? _generateLink : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accent,
                      foregroundColor: Colors.white,
                      disabledBackgroundColor: AppColors.border,
                      disabledForegroundColor: AppColors.muted,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(
                      'Құпия сілтеме жасау 🔒',
                      style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                  ),
                )
              else ...[
                // Generated Link Preview
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.correct.withValues(alpha: 0.5)),
                  ),
                  child: Row(
                    children: [
                      ReiconWidget(Reicon.outline.share, color: AppColors.correct, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _generatedUrl!,
                          style: GoogleFonts.inter(fontSize: 11.5, color: AppColors.text),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      IconButton(
                        onPressed: _copyLink,
                        icon: ReiconWidget(Reicon.outline.copy, color: AppColors.accent, size: 18),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                // Share Buttons
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _shareWhatsApp,
                        icon: const Icon(Icons.chat, color: Colors.white, size: 18),
                        label: Text('WhatsApp', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 12.5)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF25D366),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _shareTelegram,
                        icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
                        label: Text('Telegram', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 12.5)),
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
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {
                      SharePlus.instance.share(
                        ShareParams(
                          text: _getShareMessage(),
                          subject: 'Сөзділ Сайысы ⚔️',
                        ),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      side: const BorderSide(color: AppColors.border),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        ReiconWidget(Reicon.outline.share, color: AppColors.text, size: 17),
                        const SizedBox(width: 6),
                        Text(
                          'Басқа қолданбалар арқылы бөлісу',
                          style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 12.5, color: AppColors.text),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
