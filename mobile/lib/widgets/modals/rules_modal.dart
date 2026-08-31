import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../constants/app_colors.dart';

class RulesModal extends StatelessWidget {
  final int wordLength;

  const RulesModal({super.key, required this.wordLength});

  @override
  Widget build(BuildContext context) {
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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Ойын ережесі ℹ️',
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

              Text(
                'Жасырын сөзді 6 мүмкіндікте табыңыз. Әрбір талпыныс нақты қазақша сөз болуы керек.',
                style: GoogleFonts.inter(fontSize: 13, color: AppColors.text, height: 1.4),
              ),
              const SizedBox(height: 8),
              Text(
                'Әр сөзді енгізген соң, плиткалардың түсі өзгереді:',
                style: GoogleFonts.inter(fontSize: 13, color: AppColors.muted, height: 1.4),
              ),
              const SizedBox(height: 16),

              // Example 1: Green
              _ExampleTileRow(
                word: 'ҚАЗАҚ',
                highlightIndex: 0,
                color: AppColors.correct,
                explanation: '«Қ» әріпі сөзде бар және өз орнында тұр.',
              ),
              const SizedBox(height: 14),

              // Example 2: Yellow
              _ExampleTileRow(
                word: 'САМАЛ',
                highlightIndex: 2,
                color: AppColors.present,
                explanation: '«М» әріпі сөзде бар, бірақ басқа орында тұр.',
              ),
              const SizedBox(height: 14),

              // Example 3: Absent
              _ExampleTileRow(
                word: 'БІЛІМ',
                highlightIndex: 4,
                color: AppColors.absent,
                explanation: '«М» әріпі жасырын сөзде мүлдем жоқ.',
              ),
              const SizedBox(height: 18),

              // Kazakh note
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    const Text('🇰🇿', style: TextStyle(fontSize: 20)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Қазақ тілінің төл әріптері (Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ) пернетақтада толықтай қолжетімді.',
                        style: GoogleFonts.inter(fontSize: 11.5, color: AppColors.muted, height: 1.35),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ExampleTileRow extends StatelessWidget {
  final String word;
  final int highlightIndex;
  final Color color;
  final String explanation;

  const _ExampleTileRow({
    required this.word,
    required this.highlightIndex,
    required this.color,
    required this.explanation,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: List.generate(word.length, (i) {
            final char = word[i];
            final isTarget = i == highlightIndex;
            final bg = isTarget ? color : AppColors.surface;
            final border = isTarget ? color : AppColors.border;
            final textColor = (isTarget && color == AppColors.present) ? const Color(0xFF0D0F14) : Colors.white;

            return Container(
              width: 36,
              height: 36,
              margin: const EdgeInsets.only(right: 5),
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: border, width: 1.5),
              ),
              alignment: Alignment.center,
              child: Text(
                char,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
            );
          }),
        ),
        const SizedBox(height: 6),
        Text(
          explanation,
          style: GoogleFonts.inter(fontSize: 12, color: AppColors.text),
        ),
      ],
    );
  }
}
