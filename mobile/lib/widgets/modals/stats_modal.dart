import 'package:flutter/material.dart';
import '../../theme/palette.dart';
import '../ui.dart';

class StatsModal extends StatelessWidget {
  final Map<String, dynamic> stats;
  final int wordLength;

  const StatsModal({super.key, required this.stats, required this.wordLength});

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    final played = (stats['gamesPlayed'] as num?)?.toInt() ?? 0;
    final wins = (stats['wins'] as num?)?.toInt() ?? 0;
    final streak = (stats['currentStreak'] as num?)?.toInt() ?? 0;
    final maxStreak = (stats['maxStreak'] as num?)?.toInt() ?? 0;
    final winPct = played > 0 ? ((wins / played) * 100).round() : 0;
    final raw = stats['guessDistribution'];
    final dist = raw is List ? raw.map((e) => (e as num).toInt()).toList() : List<int>.filled(6, 0);
    final maxD = dist.fold<int>(1, (a, b) => b > a ? b : a);

    Widget item(String v, String label) => Expanded(
          child: Column(children: [
            Text(v, style: inter(30, weight: FontWeight.w700, color: p.ink, height: 1)),
            const SizedBox(height: 6),
            Text(label, textAlign: TextAlign.center, style: inter(11, color: p.muted, height: 1.2)),
          ]),
        );

    return SheetFrame(
      title: 'Статистика · $wordLength әріп',
      child: Column(
        children: [
          Row(children: [
            item('$played', 'Ойын'),
            item('$winPct', 'Жеңіс %'),
            item('$streak', 'Қазіргі серия'),
            item('$maxStreak', 'Ең ұзақ серия'),
          ]),
          const SizedBox(height: 22),
          Divider(color: p.line, height: 1),
          const SizedBox(height: 18),
          Text('Неше талпыныста таптыңыз', style: inter(12, weight: FontWeight.w600, color: p.muted)),
          const SizedBox(height: 12),
          for (var i = 0; i < 6; i++)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 3),
              child: Row(children: [
                SizedBox(width: 16, child: Text('${i + 1}', style: inter(12, weight: FontWeight.w600, color: p.muted))),
                const SizedBox(width: 8),
                Expanded(
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: FractionallySizedBox(
                      widthFactor: (i < dist.length ? dist[i] / maxD : 0).clamp(0.08, 1.0).toDouble(),
                      child: Container(
                        height: 26,
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        alignment: Alignment.centerRight,
                        decoration: BoxDecoration(
                          color: (i < dist.length && dist[i] > 0) ? p.ink : p.surface,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '${i < dist.length ? dist[i] : 0}',
                          style: inter(12, weight: FontWeight.w700, color: (i < dist.length && dist[i] > 0) ? p.onInk : p.muted),
                        ),
                      ),
                    ),
                  ),
                ),
              ]),
            ),
        ],
      ),
    );
  }
}
