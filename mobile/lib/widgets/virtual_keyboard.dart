import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../constants/kazakh_keyboard.dart';
import '../models/letter_status.dart';

class VirtualKeyboard extends StatelessWidget {
  final Map<String, LetterStatus> keyStatuses;
  final ValueChanged<String> onKeyPress;

  const VirtualKeyboard({
    super.key,
    required this.keyStatuses,
    required this.onKeyPress,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(3, 4, 3, 10),
      constraints: const BoxConstraints(maxWidth: 500),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: KazakhKeyboard.layout.map((row) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: row.map((key) {
                final status = keyStatuses[key] ?? LetterStatus.defaultStatus;
                final isSpecial = key == 'ENTER' || key == 'BACKSPACE';
                final flex = isSpecial ? 15 : 10;

                return Expanded(
                  flex: flex,
                  child: _KeyButton(
                    keyLabel: key,
                    status: status,
                    onPressed: () {
                      HapticFeedback.lightImpact();
                      onKeyPress(key);
                    },
                  ),
                );
              }).toList(),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _KeyButton extends StatelessWidget {
  final String keyLabel;
  final LetterStatus status;
  final VoidCallback onPressed;

  const _KeyButton({
    required this.keyLabel,
    required this.status,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color textColor = AppColors.text;

    switch (status) {
      case LetterStatus.correct:
        bg = AppColors.correct;
        textColor = Colors.white;
        break;
      case LetterStatus.present:
        bg = AppColors.present;
        textColor = const Color(0xFF0D0F14);
        break;
      case LetterStatus.absent:
        bg = AppColors.absent;
        textColor = Colors.grey.shade400;
        break;
      default:
        bg = AppColors.surface;
    }

    if (keyLabel == 'ENTER') {
      bg = AppColors.accent;
      textColor = Colors.white;
    }

    Widget content;
    if (keyLabel == 'BACKSPACE') {
      content = const Icon(Icons.backspace_outlined, size: 17, color: AppColors.text);
    } else if (keyLabel == 'ENTER') {
      content = Text(
        'ЕНГІЗУ',
        style: GoogleFonts.inter(
          fontSize: 9.5,
          fontWeight: FontWeight.w800,
          color: textColor,
        ),
      );
    } else {
      content = Text(
        keyLabel.toUpperCase(),
        style: GoogleFonts.inter(
          fontSize: 13.5,
          fontWeight: FontWeight.w700,
          color: textColor,
        ),
      );
    }

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 1.5),
      height: 42,
      child: Material(
        color: bg,
        borderRadius: BorderRadius.circular(6),
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(6),
          child: Container(
            alignment: Alignment.center,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(6),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.08),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.25),
                  blurRadius: 1,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: content,
          ),
        ),
      ),
    );
  }
}
