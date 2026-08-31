import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../constants/app_colors.dart';
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

    return Dialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: AppColors.border),
      ),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        padding: const EdgeInsets.all(20),
        constraints: const BoxConstraints(maxHeight: 620),
        child: Column(
          children: [
            // Header with Close button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Жетістіктер 🏆',
                  style: GoogleFonts.inter(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppColors.text,
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close_rounded, color: AppColors.muted),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Overall Progress Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Text('🎖️', style: TextStyle(fontSize: 18)),
                          const SizedBox(width: 8),
                          Text(
                            'Жалпы прогресс',
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: AppColors.text,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        '$unlockedCount / $totalCount ($percent%)',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: AppColors.accent,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: unlockedCount / totalCount,
                      minHeight: 8,
                      backgroundColor: AppColors.border,
                      valueColor: const AlwaysStoppedAnimation<Color>(AppColors.correct),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Category filter chips
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _CategoryChip(
                    label: 'Барлығы',
                    icon: '🌟',
                    isSelected: _selectedCategory == null,
                    onTap: () => setState(() => _selectedCategory = null),
                  ),
                  _CategoryChip(
                    label: 'Жеңістер',
                    icon: '🏆',
                    isSelected: _selectedCategory == AchievementCategory.wins,
                    onTap: () => setState(() => _selectedCategory = AchievementCategory.wins),
                  ),
                  _CategoryChip(
                    label: 'Сериялар',
                    icon: '🔥',
                    isSelected: _selectedCategory == AchievementCategory.streaks,
                    onTap: () => setState(() => _selectedCategory = AchievementCategory.streaks),
                  ),
                  _CategoryChip(
                    label: 'Шеберлік',
                    icon: '🎯',
                    isSelected: _selectedCategory == AchievementCategory.skill,
                    onTap: () => setState(() => _selectedCategory = AchievementCategory.skill),
                  ),
                  _CategoryChip(
                    label: 'Режимдер',
                    icon: '🎮',
                    isSelected: _selectedCategory == AchievementCategory.modes,
                    onTap: () => setState(() => _selectedCategory = AchievementCategory.modes),
                  ),
                  _CategoryChip(
                    label: 'Сайыс',
                    icon: '⚔️',
                    isSelected: _selectedCategory == AchievementCategory.social,
                    onTap: () => setState(() => _selectedCategory = AchievementCategory.social),
                  ),
                  _CategoryChip(
                    label: 'Ерекше',
                    icon: '✨',
                    isSelected: _selectedCategory == AchievementCategory.special,
                    onTap: () => setState(() => _selectedCategory = AchievementCategory.special),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Scrollable list
            Expanded(
              child: ListView.separated(
                itemCount: filtered.length,
                separatorBuilder: (context, index) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final ach = filtered[index];
                  final isUnlocked = unlocked.contains(ach.id);
                  final curVal = progress[ach.id] ?? (isUnlocked ? ach.maxProgress : 0);
                  final achPercent = (curVal / ach.maxProgress).clamp(0.0, 1.0);

                  return Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isUnlocked
                          ? AppColors.correct.withValues(alpha: 0.08)
                          : AppColors.background.withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isUnlocked
                            ? AppColors.correct.withValues(alpha: 0.3)
                            : AppColors.border.withValues(alpha: 0.6),
                      ),
                    ),
                    child: Row(
                      children: [
                        // Icon circle
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: isUnlocked
                                ? AppColors.correct.withValues(alpha: 0.15)
                                : AppColors.border.withValues(alpha: 0.3),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            ach.icon,
                            style: TextStyle(
                              fontSize: 22,
                              color: isUnlocked ? null : Colors.grey,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Title & description & progress
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      ach.title,
                                      style: GoogleFonts.inter(
                                        fontSize: 13.5,
                                        fontWeight: FontWeight.bold,
                                        color: isUnlocked ? AppColors.text : AppColors.muted,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  if (isUnlocked)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: AppColors.correct.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        '✓ Ашылды',
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.correct,
                                        ),
                                      ),
                                    )
                                  else
                                    Text(
                                      '$curVal / ${ach.maxProgress}',
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.muted,
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 3),
                              Text(
                                ach.description,
                                style: GoogleFonts.inter(fontSize: 11.5, color: AppColors.muted),
                              ),
                              if (!isUnlocked && ach.maxProgress > 1) ...[
                                const SizedBox(height: 6),
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(4),
                                  child: LinearProgressIndicator(
                                    value: achPercent,
                                    minHeight: 4,
                                    backgroundColor: AppColors.border,
                                    valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accent),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ],
                    ),
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

class _CategoryChip extends StatelessWidget {
  final String label;
  final String icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _CategoryChip({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.accent : AppColors.background,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? AppColors.accent : AppColors.border,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(icon, style: const TextStyle(fontSize: 12)),
              const SizedBox(width: 4),
              Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 11.5,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? Colors.white : AppColors.muted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
