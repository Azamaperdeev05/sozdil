enum AchievementCategory {
  wins,
  streaks,
  skill,
  modes,
  social,
  special,
}

class Achievement {
  final String id;
  final String title;
  final String description;
  final String icon;
  final AchievementCategory category;
  final int maxProgress;

  const Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.category,
    required this.maxProgress,
  });
}
