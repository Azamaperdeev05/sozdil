import 'package:flutter/material.dart';
import '../../models/letter_status.dart';
import '../../theme/palette.dart';
import '../ui.dart';

class RulesModal extends StatelessWidget {
  final int wordLength;

  const RulesModal({super.key, required this.wordLength});

  static const _examples = {
    4: [('КҮНІ', 0, LetterStatus.correct), ('ЖАРҚ', 1, LetterStatus.present), ('АУЫЛ', 1, LetterStatus.absent)],
    5: [('ЖАРЫС', 0, LetterStatus.correct), ('ТІЛШІ', 2, LetterStatus.present), ('БОЛАТ', 1, LetterStatus.absent)],
    6: [('КҮНДЕР', 0, LetterStatus.correct), ('ЖОҒАЛТ', 2, LetterStatus.present), ('КОМПАС', 3, LetterStatus.absent)],
  };

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    final ex = _examples[wordLength] ?? _examples[5]!;
    const names = {LetterStatus.correct: 'Толық жасыл', LetterStatus.present: 'Ашық жасыл', LetterStatus.absent: 'Сұр'};
    const meaning = {
      LetterStatus.correct: 'әрпі сөзде бар әрі өз орнында тұр.',
      LetterStatus.present: 'әрпі сөзде бар, бірақ орны басқа.',
      LetterStatus.absent: 'әрпі сөзде мүлде жоқ.',
    };

    return SheetFrame(
      title: 'Ойын шарттары',
      child: Column(
        children: [
          Text('6 талпыныста $wordLength әріптен тұратын сөзді табыңыз.', textAlign: TextAlign.center, style: inter(14, color: p.ink, height: 1.4)),
          const SizedBox(height: 2),
          Text('Әр болжамнан кейін әріптердің түсі өзгереді.', textAlign: TextAlign.center, style: inter(14, color: p.muted, height: 1.4)),
          const SizedBox(height: 22),
          for (final (word, idx, status) in ex) ...[
            _ExampleRow(word: word, index: idx, status: status),
            const SizedBox(height: 8),
            Text.rich(
              TextSpan(children: [
                TextSpan(text: '${names[status]} — ', style: inter(13.5, weight: FontWeight.w700, color: p.ink)),
                TextSpan(text: word[idx], style: inter(13.5, weight: FontWeight.w700, color: p.ink)),
                TextSpan(text: ' ${meaning[status]}', style: inter(13.5, color: p.muted)),
              ]),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
          ],
          Divider(color: p.line, height: 1),
          const SizedBox(height: 16),
          Text('Күн сайын 00:00-де жаңа сөз шығады', style: inter(14, weight: FontWeight.w600, color: p.ink)),
        ],
      ),
    );
  }
}

class _ExampleRow extends StatelessWidget {
  final String word;
  final int index;
  final LetterStatus status;

  const _ExampleRow({required this.word, required this.index, required this.status});

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(word.length, (i) {
        final c = p.tile(i == index ? status : LetterStatus.defaultStatus);
        return Container(
          width: 40,
          height: 40,
          margin: const EdgeInsets.symmetric(horizontal: 3),
          decoration: BoxDecoration(color: c.bg, borderRadius: BorderRadius.circular(8), border: Border.all(color: c.line, width: 2)),
          alignment: Alignment.center,
          child: Text(word[i], style: inter(18, weight: FontWeight.w700, color: c.ink)),
        );
      }),
    );
  }
}
