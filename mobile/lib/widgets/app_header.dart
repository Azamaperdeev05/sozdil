import 'package:flutter/material.dart';
import 'package:reicon_flutter/reicon_flutter.dart';
import '../theme/palette.dart';
import '../theme/theme_controller.dart';
import 'reicon_widget.dart';
import 'ui.dart';

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

  void _openMenu(BuildContext context) {
    showAppSheet(
      context,
      _MenuSheet(onChallenge: onChallenge, onAchievements: onAchievements, onCalendar: onCalendar),
    );
  }

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    return Column(
      children: [
        Container(
          height: 56,
          padding: const EdgeInsets.only(left: 18, right: 6),
          decoration: BoxDecoration(border: Border(bottom: BorderSide(color: p.line))),
          child: Row(
            children: [
              Text('СӨЗДІЛ', style: inter(21, weight: FontWeight.w800, color: p.ink, spacing: 3.2)),
              const Spacer(),
              _IconBtn(icon: Reicon.outline.helpCircle, label: 'Ойын шарттары', onTap: onInfo),
              _IconBtn(icon: Reicon.outline.chartBar, label: 'Статистика', onTap: onStats),
              _IconBtn(icon: Reicon.outline.menu, label: 'Мәзір', onTap: () => _openMenu(context)),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          child: Segmented<int>(
            items: const [(4, '4 әріп'), (5, '5 әріп'), (6, '6 әріп')],
            value: currentLength,
            onChanged: onLengthChanged,
          ),
        ),
      ],
    );
  }
}

class _IconBtn extends StatelessWidget {
  final String icon;
  final String label;
  final VoidCallback onTap;

  const _IconBtn({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    return IconButton(
      onPressed: onTap,
      tooltip: label,
      icon: ReiconWidget(icon, color: p.ink, size: 23),
    );
  }
}

class _MenuSheet extends StatelessWidget {
  final VoidCallback onChallenge;
  final VoidCallback onAchievements;
  final VoidCallback onCalendar;

  const _MenuSheet({required this.onChallenge, required this.onAchievements, required this.onCalendar});

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    void run(VoidCallback action) {
      Navigator.pop(context);
      action();
    }

    return SheetFrame(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            decoration: BoxDecoration(border: Border.all(color: p.line), borderRadius: BorderRadius.circular(18)),
            clipBehavior: Clip.antiAlias,
            child: Column(
              children: [
                ActionRow(
                  icon: ReiconWidget(Reicon.outline.gamepad, color: p.ink, size: 19),
                  title: 'Досыңа сөз жасыр',
                  hint: 'Сілтеме жасап, досыңды сына',
                  onTap: () => run(onChallenge),
                ),
                Divider(height: 1, color: p.line),
                ActionRow(
                  icon: ReiconWidget(Reicon.outline.medalStar, color: p.ink, size: 19),
                  title: 'Жетістіктер',
                  onTap: () => run(onAchievements),
                ),
                Divider(height: 1, color: p.line),
                ActionRow(
                  icon: ReiconWidget(Reicon.outline.calendar, color: p.ink, size: 19),
                  title: 'Күнтізбе',
                  hint: 'Өткен күндердің сөздерін ойна',
                  onTap: () => run(onCalendar),
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),
          Text('ТАҚЫРЫП', style: inter(11, weight: FontWeight.w600, color: p.muted, spacing: 1.2)),
          const SizedBox(height: 10),
          ValueListenableBuilder<ThemeMode>(
            valueListenable: ThemeController.mode,
            builder: (context, mode, _) => Segmented<ThemeMode>(
              maxWidth: double.infinity,
              items: const [(ThemeMode.system, 'Жүйе'), (ThemeMode.light, 'Ақ'), (ThemeMode.dark, 'Қара')],
              value: mode,
              onChanged: ThemeController.set,
            ),
          ),
        ],
      ),
    );
  }
}
