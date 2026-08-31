import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:reicon_flutter/reicon_flutter.dart';
import '../../constants/app_colors.dart';
import '../reicon_widget.dart';

class StatsModal extends StatelessWidget {
  final Map<String, dynamic> stats;
  final int wordLength;

  const StatsModal({super.key, required this.stats, required this.wordLength});

  @override
  Widget build(BuildContext context) {
    final gamesPlayed = (stats['gamesPlayed'] as num?)?.toInt() ?? 0;
    final wins = (stats['wins'] as num?)?.toInt() ?? 0;
    final currentStreak = (stats['currentStreak'] as num?)?.toInt() ?? 0;
    final maxStreak = (stats['maxStreak'] as num?)?.toInt() ?? 0;
    final winPercent = gamesPlayed > 0 ? ((wins / gamesPlayed) * 100).round() : 0;

    final rawDist = stats['guessDistribution'];
    final List<int> distribution = rawDist is List
        ? rawDist.map((e) => (e as num).toInt()).toList()
        : List<int>.filled(6, 0);

    final maxInDist = distribution.fold(0, (prev, val) => val > prev ? val : prev);

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
                    'Статистика 📊 ($wordLength әріп)',
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
              const SizedBox(height: 16),

              // 4 Stat summary boxes
              Row(
                children: [
                  _StatBox(label: 'Ойындар', value: '$gamesPlayed'),
                  _StatBox(label: 'Жеңіс %', value: '$winPercent%'),
                  _StatBox(label: 'Серия 🔥', value: '$currentStreak'),
                  _StatBox(label: 'Макс ⚡', value: '$maxStreak'),
                ],
              ),
              const SizedBox(height: 20),

              // Guess Distribution Chart
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'ТАЛПЫНЫСТАР СТАТИСТИКАСЫ',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.muted,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              Column(
                children: List.generate(6, (i) {
                  final count = i < distribution.length ? distribution[i] : 0;
                  final widthFraction = maxInDist > 0 ? (count / maxInDist).clamp(0.08, 1.0) : 0.08;

                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 3),
                    child: Row(
                      children: [
                        SizedBox(
                          width: 16,
                          child: Text(
                            '${i + 1}',
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: AppColors.muted,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: widthFraction,
                            child: Container(
                              height: 24,
                              padding: const EdgeInsets.symmetric(horizontal: 8),
                              decoration: BoxDecoration(
                                color: count > 0 ? AppColors.correct : AppColors.background,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              alignment: Alignment.centerRight,
                              child: Text(
                                '$count',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatBox extends StatelessWidget {
  final String label;
  final String value;

  const _StatBox({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 3),
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppColors.text,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: FontWeight.w500,
                color: AppColors.muted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
