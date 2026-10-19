import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:reicon_flutter/reicon_flutter.dart';
import '../constants/kazakh_keyboard.dart';
import '../models/letter_status.dart';
import '../theme/palette.dart';
import 'reicon_widget.dart';

class VirtualKeyboard extends StatelessWidget {
  final Map<String, LetterStatus> keyStatuses;
  final ValueChanged<String> onKeyPress;

  const VirtualKeyboard({super.key, required this.keyStatuses, required this.onKeyPress});

  @override
  Widget build(BuildContext context) {
    // Shorter keys on short phones so the board keeps its room
    final h = MediaQuery.of(context).size.height;
    final keyH = (h * 0.058).clamp(42.0, 56.0);
    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 560),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(4, 8, 4, 10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: KazakhKeyboard.layout.map((row) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 3),
              child: Row(
                children: row.map((key) {
                  final special = key == 'ENTER' || key == 'BACKSPACE';
                  return Expanded(
                    flex: special ? 155 : 100,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2.5),
                      child: _Key(
                        label: key,
                        status: keyStatuses[key] ?? LetterStatus.defaultStatus,
                        height: keyH,
                        onPressed: () {
                          HapticFeedback.lightImpact();
                          onKeyPress(key);
                        },
                      ),
                    ),
                  );
                }).toList(),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

class _Key extends StatefulWidget {
  final String label;
  final LetterStatus status;
  final double height;
  final VoidCallback onPressed;

  const _Key({required this.label, required this.status, required this.height, required this.onPressed});

  @override
  State<_Key> createState() => _KeyState();
}

class _KeyState extends State<_Key> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    final isEnter = widget.label == 'ENTER';
    final isBack = widget.label == 'BACKSPACE';

    Color bg = p.keyBg, fg = p.ink;
    Border? border;
    if (isEnter) {
      bg = p.ink;
      fg = p.onInk;
    } else if (!isBack) {
      switch (widget.status) {
        case LetterStatus.correct:
          bg = p.accent;
          fg = p.onAccent;
        case LetterStatus.present:
          bg = p.presentBg;
          fg = p.presentInk;
          border = Border.all(color: p.accent, width: 1.5);
        case LetterStatus.absent:
          bg = p.keyDeadBg;
          fg = p.keyDeadInk;
        case LetterStatus.defaultStatus:
          break;
      }
    }

    final Widget content = isBack
        ? ReiconWidget(Reicon.outline.backspace, color: fg, size: 22)
        : Text(
            isEnter ? 'ЕНГІЗУ' : widget.label,
            maxLines: 1,
            style: inter(isEnter ? 11 : 16, weight: isEnter ? FontWeight.w700 : FontWeight.w600, color: fg, spacing: isEnter ? 0.4 : 0),
          );

    return Semantics(
      button: true,
      label: isBack ? 'Өшіру' : isEnter ? 'Енгізу' : widget.label,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: (_) {
          setState(() => _down = true);
          widget.onPressed();
        },
        onTapUp: (_) => setState(() => _down = false),
        onTapCancel: () => setState(() => _down = false),
        child: AnimatedScale(
          scale: _down ? 0.93 : 1,
          duration: const Duration(milliseconds: 80),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            height: widget.height,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(7), border: border),
            child: content,
          ),
        ),
      ),
    );
  }
}
