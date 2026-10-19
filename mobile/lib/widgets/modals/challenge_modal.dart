import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:reicon_flutter/reicon_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../theme/palette.dart';
import '../ui.dart';
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
      showAppToast(context, 'Сілтеме көшірілді');
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    final word = _controller.text.trim().toUpperCase();
    final isValid = _isValidWord(word);
    final isFull = word.length == _length;
    final inputBorder = OutlineInputBorder(borderRadius: BorderRadius.circular(18), borderSide: BorderSide(color: p.line, width: 2));

    return Padding(
      // keep the field above the system keyboard
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: SheetFrame(
        title: 'Досыңа сөз жасыр',
        child: Column(
          children: [
            Text('Сөз ойлап тап — ол сілтеме ішінде шифрланып жасырылады.', textAlign: TextAlign.center, style: inter(13.5, color: p.muted, height: 1.4)),
            const SizedBox(height: 16),
            Segmented<int>(
              maxWidth: 240,
              items: const [(4, '4 әріп'), (5, '5 әріп'), (6, '6 әріп')],
              value: _length,
              onChanged: _onLengthChanged,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _controller,
              autofocus: true,
              textCapitalization: TextCapitalization.characters,
              maxLength: _length,
              onChanged: (_) => setState(() => _generatedUrl = null),
              textAlign: TextAlign.center,
              cursorColor: p.ink,
              style: inter(22, weight: FontWeight.w700, color: p.ink, spacing: 6),
              decoration: InputDecoration(
                counterText: '',
                hintText: '$_length әріпті сөз',
                hintStyle: inter(15, color: p.muted),
                filled: true,
                fillColor: p.bg,
                border: inputBorder,
                enabledBorder: inputBorder,
                focusedBorder: inputBorder.copyWith(borderSide: BorderSide(color: p.ink, width: 2)),
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 18,
              child: word.isEmpty
                  ? Text('Кез келген қазақша зат есім', style: inter(12, color: p.muted))
                  : Text(
                      isValid ? '✓ Сөздікте бар' : (isFull ? 'Бұл сөз сөздікте жоқ — басқасын таңда' : 'Тағы ${_length - word.length} әріп'),
                      style: inter(12, weight: FontWeight.w600, color: isValid ? p.accentInk : (isFull ? p.danger : p.muted)),
                    ),
            ),
            const SizedBox(height: 16),
            if (_generatedUrl == null)
              PrimaryButton(label: 'Сілтеме жасау', onPressed: isValid ? _generateLink : null)
            else ...[
              PrimaryButton(
                label: 'Жіберу',
                icon: ReiconWidget(Reicon.outline.share, color: p.onInk, size: 18),
                onPressed: () => SharePlus.instance.share(ShareParams(text: _getShareMessage(), subject: 'Сөзділ сайысы')),
              ),
              const SizedBox(height: 8),
              Row(children: [
                Expanded(child: SecondaryButton(label: 'WhatsApp', onPressed: _shareWhatsApp)),
                const SizedBox(width: 8),
                Expanded(child: SecondaryButton(label: 'Telegram', onPressed: _shareTelegram)),
              ]),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: SecondaryButton(
                  label: 'Сілтемені көшіру',
                  icon: ReiconWidget(Reicon.outline.copy, color: p.ink, size: 17),
                  onPressed: _copyLink,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
