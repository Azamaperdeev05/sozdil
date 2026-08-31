import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../constants/app_colors.dart';
import '../../services/storage_service.dart';

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

  @override
  Widget build(BuildContext context) {
    final history = StorageService.getHistory(widget.wordLength);
    final monthName = DateFormat('MMMM yyyy', 'kk').format(_displayedMonth);

    final firstDayWeekday = _displayedMonth.weekday; // 1 = Monday ... 7 = Sunday
    final daysInMonth = DateUtils.getDaysInMonth(_displayedMonth.year, _displayedMonth.month);
    final now = DateTime.now();
    final todayStr = DateFormat('yyyy-MM-dd').format(now);

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
                    'Күнтізбе 📅',
                    style: GoogleFonts.inter(
                      fontSize: 19,
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

              // Month Selector Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    onPressed: _prevMonth,
                    icon: const Icon(Icons.chevron_left_rounded, color: AppColors.text, size: 28),
                  ),
                  Text(
                    monthName.toUpperCase(),
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.text,
                    ),
                  ),
                  IconButton(
                    onPressed: _nextMonth,
                    icon: const Icon(Icons.chevron_right_rounded, color: AppColors.text, size: 28),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Day of week headers
              Row(
                children: ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сн', 'Жс'].map((d) {
                  return Expanded(
                    child: Center(
                      child: Text(
                        d,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.muted,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 10),

              // Calendar Grid
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: 42, // 6 weeks * 7 days
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 7,
                  mainAxisSpacing: 6,
                  crossAxisSpacing: 6,
                ),
                itemBuilder: (context, index) {
                  final dayOffset = index - (firstDayWeekday - 1);
                  if (dayOffset < 0 || dayOffset >= daysInMonth) {
                    return const SizedBox.shrink();
                  }

                  final day = dayOffset + 1;
                  final date = DateTime(_displayedMonth.year, _displayedMonth.month, day);
                  final dateStr = DateFormat('yyyy-MM-dd').format(date);
                  final isToday = dateStr == todayStr;
                  final isFuture = date.isAfter(now);
                  final status = history[dateStr]; // 'WON' or 'LOST'

                  Color bg = AppColors.background;
                  Color textColor = AppColors.text;
                  Color borderColor = isToday ? AppColors.accent : AppColors.border;

                  if (status == 'WON') {
                    bg = AppColors.correct.withValues(alpha: 0.2);
                    borderColor = AppColors.correct;
                  } else if (status == 'LOST') {
                    bg = Colors.red.withValues(alpha: 0.15);
                    borderColor = Colors.red.withValues(alpha: 0.4);
                  }

                  if (isFuture) {
                    textColor = AppColors.muted.withValues(alpha: 0.3);
                    borderColor = AppColors.border.withValues(alpha: 0.3);
                  }

                  return InkWell(
                    onTap: isFuture
                        ? null
                        : () {
                            Navigator.pop(context);
                            widget.onSelectDate(date);
                          },
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      decoration: BoxDecoration(
                        color: bg,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: borderColor, width: isToday ? 2.0 : 1.0),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        '$day',
                        style: GoogleFonts.inter(
                          fontSize: 12.5,
                          fontWeight: isToday ? FontWeight.w800 : FontWeight.w600,
                          color: textColor,
                        ),
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 16),

              // Legend
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _LegendItem(color: AppColors.correct, label: 'Табылды'),
                  const SizedBox(width: 14),
                  _LegendItem(color: Colors.redAccent, label: 'Табылмады'),
                  const SizedBox(width: 14),
                  _LegendItem(color: AppColors.accent, label: 'Бүгін'),
                ],
              ),
            ],
          ),
        ),
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
    return Row(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 5),
        Text(
          label,
          style: GoogleFonts.inter(fontSize: 11, color: AppColors.muted),
        ),
      ],
    );
  }
}
