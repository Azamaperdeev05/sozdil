import 'package:flutter/material.dart';
import '../../theme/palette.dart';
import '../ui.dart';
import '../../models/achievement.dart';
import '../../services/achievement_service.dart';
import '../../services/storage_service.dart';

class AchievementsModal extends StatefulWidget {
  const AchievementsModal({super.key});

  @override
  State<AchievementsModal> createState() => _AchievementsModalState();
}

class _AchievementsModalState extends State<AchievementsModal> {
  AchievementCategory? _selectedCategory; // null = all

  @override
  Widget build(BuildContext context) {
    final unlocked = StorageService.getUnlockedAchievements();
    final progress = StorageService.getAchievementProgress();
    final all = AchievementService.allAchievements;

    final filtered = _selectedCategory == null
        ? all
        : all.where((a) => a.category == _selectedCategory).toList();

    final unlockedCount = unlocked.length;
    final totalCount = all.length;
    final percent = ((unlockedCount / totalCount) * 100).round();

    final p = Palette.of(context);
    const cats = <(AchievementCategory?, String)>[
      (null, 'Барлығы'),
      (AchievementCategory.wins, 'Жеңістер'),
      (AchievementCategory.streaks, 'Сериялар'),
      (AchievementCategory.skill, 'Шеберлік'),
      (AchievementCategory.modes, 'Режимдер'),
      (AchievementCategory.social, 'Сайыс'),
      (AchievementCategory.special, 'Ерекше'),
    ];

    return SheetFrame(
      title: 'Жетістіктер',
      scroll: false,
      child: SizedBox(
        height: MediaQuery.of(context).size.height * 0.68,
        child: Column(
          children: [
            Row(children: [
              Text('Ашылғаны', style: inter(14, weight: FontWeight.w600, color: p.ink)),
              const Spacer(),
              Text('$unlockedCount', style: inter(14, weight: FontWeight.w700, color: p.ink)),
              Text(' / $totalCount', style: inter(14, color: p.muted)),
            ]),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(value: percent / 100, minHeight: 7, backgroundColor: p.surface, valueColor: AlwaysStoppedAnimation(p.ink)),
            ),
            const SizedBox(height: 14),
            SizedBox(
              height: 34,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: cats.length,
                separatorBuilder: (_, _) => const SizedBox(width: 6),
                itemBuilder: (_, i) {
                  final sel = _selectedCategory == cats[i].$1;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedCategory = cats[i].$1),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(color: sel ? p.ink : p.surface, borderRadius: BorderRadius.circular(999)),
                      child: Text(cats[i].$2, style: inter(12.5, weight: FontWeight.w600, color: sel ? p.onInk : p.muted)),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 6),
            Expanded(
              child: ListView.separated(
                itemCount: filtered.length,
                separatorBuilder: (_, _) => Divider(height: 1, color: p.line),
                itemBuilder: (context, index) {
                  final ach = filtered[index];
                  final isUnlocked = unlocked.contains(ach.id);
                  final cur = progress[ach.id] ?? (isUnlocked ? ach.maxProgress : 0);
                  final frac = (cur / ach.maxProgress).clamp(0.0, 1.0);
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: Row(children: [
                      Opacity(
                        opacity: isUnlocked ? 1 : 0.45,
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: isUnlocked ? p.presentBg : p.surface,
                            shape: BoxShape.circle,
                            border: isUnlocked ? Border.all(color: p.accent, width: 2) : null,
                          ),
                          alignment: Alignment.center,
                          child: Text(ach.icon, style: const TextStyle(fontSize: 20)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Row(children: [
                            Expanded(
                              child: Text(ach.title, overflow: TextOverflow.ellipsis, style: inter(14, weight: FontWeight.w600, color: isUnlocked ? p.ink : p.muted)),
                            ),
                            Text(isUnlocked ? '✓ Ашылды' : '$cur/${ach.maxProgress}',
                                style: inter(11.5, weight: FontWeight.w600, color: isUnlocked ? p.accentInk : p.muted)),
                          ]),
                          const SizedBox(height: 2),
                          Text(ach.description, style: inter(12, color: p.muted, height: 1.3)),
                          if (!isUnlocked && ach.maxProgress > 1) ...[
                            const SizedBox(height: 7),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(3),
                              child: LinearProgressIndicator(value: frac, minHeight: 4, backgroundColor: p.surface, valueColor: AlwaysStoppedAnimation(p.ink)),
                            ),
                          ],
                        ]),
                      ),
                    ]),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
