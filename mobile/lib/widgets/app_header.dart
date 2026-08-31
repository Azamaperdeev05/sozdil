import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';

class AppHeader extends StatelessWidget {
  final int currentLength;
  final ValueChanged<int> onLengthChanged;
  final VoidCallback onChallenge;
  final VoidCallback onAchievements;
  final VoidCallback onStats;
  final VoidCallback onCalendar;
  final VoidCallback onInfo;

  const AppHeader({
    super.key,
    required this.currentLength,
    required this.onLengthChanged,
    required this.onChallenge,
    required this.onAchievements,
    required this.onStats,
    required this.onCalendar,
    required this.onInfo,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: AppColors.border, width: 1),
        ),
      ),
      child: Column(
        children: [
          // Row 1: Logo on left, action icons on right
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'СӨЗДІЛ',
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                  color: AppColors.text,
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _HeaderIconButton(
                    icon: Icons.sports_esports_outlined,
                    tooltip: 'Досыңа сөз жасыр ⚔️',
                    color: AppColors.accent,
                    onPressed: onChallenge,
                  ),
                  _HeaderIconButton(
                    icon: Icons.emoji_events_outlined,
                    tooltip: 'Жетістіктер 🏆',
                    color: AppColors.trophy,
                    onPressed: onAchievements,
                  ),
                  _HeaderIconButton(
                    icon: Icons.bar_chart_rounded,
                    tooltip: 'Статистика 📊',
                    color: AppColors.muted,
                    onPressed: onStats,
                  ),
                  _HeaderIconButton(
                    icon: Icons.calendar_today_outlined,
                    tooltip: 'Күнтізбе 📅',
                    color: AppColors.muted,
                    onPressed: onCalendar,
                  ),
                  _HeaderIconButton(
                    icon: Icons.info_outline_rounded,
                    tooltip: 'Ережелер ℹ️',
                    color: AppColors.muted,
                    onPressed: onInfo,
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 4),

          // Row 2: Ergonomic 4, 5, 6 letter mode switcher
          Center(
            child: Container(
              padding: const EdgeInsets.all(3),
              constraints: const BoxConstraints(maxWidth: 260),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [4, 5, 6].map((len) {
                  final isSelected = currentLength == len;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => onLengthChanged(len),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        padding: const EdgeInsets.symmetric(vertical: 5),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.accent : Colors.transparent,
                          borderRadius: BorderRadius.circular(7),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: AppColors.accent.withValues(alpha: 0.3),
                                    blurRadius: 4,
                                    offset: const Offset(0, 1),
                                  )
                                ]
                              : null,
                        ),
                        child: Text(
                          '$len әріп',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            fontSize: 11.5,
                            fontWeight: FontWeight.bold,
                            color: isSelected ? Colors.white : AppColors.muted,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeaderIconButton extends StatelessWidget {
  final IconData icon;
  final String tooltip;
  final Color color;
  final VoidCallback onPressed;

  const _HeaderIconButton({
    required this.icon,
    required this.tooltip,
    required this.color,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          width: 38,
          height: 38,
          alignment: Alignment.center,
          child: Icon(icon, color: color, size: 22),
        ),
      ),
    );
  }
}
