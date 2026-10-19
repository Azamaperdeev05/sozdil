import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:reicon_flutter/reicon_flutter.dart';
import '../../theme/palette.dart';
import '../ui.dart';
import '../../services/storage_service.dart';
import '../reicon_widget.dart';

class CalendarModal extends StatefulWidget {
  final int wordLength;
  final ValueChanged<DateTime> onSelectDate;

  const CalendarModal({
    super.key,
    required this.wordLength,
    required this.onSelectDate,
  });

  @override
  State<CalendarModal> createState() => _CalendarModalState();
}

class _CalendarModalState extends State<CalendarModal> {
  late DateTime _displayedMonth;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _displayedMonth = DateTime(now.year, now.month, 1);
  }

  void _prevMonth() {
    setState(() {
      _displayedMonth = DateTime(_displayedMonth.year, _displayedMonth.month - 1, 1);
    });
  }

  void _nextMonth() {
    final now = DateTime.now();
    if (_displayedMonth.year < now.year ||
        (_displayedMonth.year == now.year && _displayedMonth.month < now.month)) {
      setState(() {
        _displayedMonth = DateTime(_displayedMonth.year, _displayedMonth.month + 1, 1);
      });
    }
  }

  static const List<String> _kazakhMonths = [
    'Қаңтар',
    'Ақпан',
    'Наурыз',
    'Сәуір',
    'Мамыр',
    'Маусым',
    'Шілде',
    'Тамыз',
    'Қыркүйек',
    'Қазан',
    'Қараша',
    'Желтоқсан',
  ];

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    final history = StorageService.getHistory(widget.wordLength);
    final monthName = '${_kazakhMonths[_displayedMonth.month - 1]} ${_displayedMonth.year}';
    final firstDayWeekday = _displayedMonth.weekday; // 1 = Monday ... 7 = Sunday
    final daysInMonth = DateUtils.getDaysInMonth(_displayedMonth.year, _displayedMonth.month);
    final now = DateTime.now();
    final todayStr = DateFormat('yyyy-MM-dd').format(now);
    final isCurrentMonth = _displayedMonth.year == now.year && _displayedMonth.month == now.month;

    return SheetFrame(
      title: 'Күнтізбе',
      child: Column(
        children: [
          Row(
            children: [
              IconButton(onPressed: _prevMonth, tooltip: 'Алдыңғы ай', icon: ReiconWidget(Reicon.outline.chevronLeft, color: p.ink, size: 20)),
              Expanded(child: Text(monthName, textAlign: TextAlign.center, style: inter(15, weight: FontWeight.w700, color: p.ink))),
              Opacity(
                opacity: isCurrentMonth ? 0.25 : 1,
                child: IconButton(onPressed: _nextMonth, tooltip: 'Келесі ай', icon: ReiconWidget(Reicon.outline.chevronRight, color: p.ink, size: 20)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сн', 'Жс']
                .map((d) => Expanded(child: Center(child: Text(d, style: inter(11, weight: FontWeight.w600, color: p.muted)))))
                .toList(),
          ),
          const SizedBox(height: 8),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 42,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 7, mainAxisSpacing: 6, crossAxisSpacing: 6),
            itemBuilder: (context, index) {
              final dayOffset = index - (firstDayWeekday - 1);
              if (dayOffset < 0 || dayOffset >= daysInMonth) return const SizedBox.shrink();
              final day = dayOffset + 1;
              final date = DateTime(_displayedMonth.year, _displayedMonth.month, day);
              final dateStr = DateFormat('yyyy-MM-dd').format(date);
              final isToday = dateStr == todayStr;
              final isFuture = date.isAfter(now);
              final status = history[dateStr];

              Color bg = Colors.transparent, fg = p.ink;
              if (status == 'WON') {
                bg = p.accent;
                fg = p.onAccent;
              } else if (status == 'LOST') {
                bg = p.absentBg;
                fg = p.absentInk;
              }
              if (isFuture) fg = p.muted.withValues(alpha: 0.35);

              return InkWell(
                customBorder: const CircleBorder(),
                onTap: isFuture
                    ? null
                    : () {
                        Navigator.pop(context);
                        widget.onSelectDate(date);
                      },
                child: Container(
                  decoration: BoxDecoration(
                    color: bg,
                    shape: BoxShape.circle,
                    border: isToday ? Border.all(color: p.ink, width: 2) : null,
                  ),
                  alignment: Alignment.center,
                  child: Text('$day', style: inter(13, weight: isToday ? FontWeight.w800 : FontWeight.w600, color: fg)),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          Divider(color: p.line, height: 1),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _LegendItem(color: p.accent, label: 'Тапты'),
              const SizedBox(width: 16),
              _LegendItem(color: p.absentBg, label: 'Таппады'),
            ],
          ),
          const SizedBox(height: 6),
          Text('Өткен күнді басып, сол күннің сөзін ойнаңыз', style: inter(11.5, color: p.muted)),
        ],
      ),
    );
  }
}

class _LegendItem extends StatelessWidget {
  final Color color;
  final String label;

  const _LegendItem({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    return Row(children: [
      Container(width: 12, height: 12, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
      const SizedBox(width: 6),
      Text(label, style: inter(11.5, color: p.muted)),
    ]);
  }
}
