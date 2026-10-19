import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../models/letter_status.dart';
import '../theme/palette.dart';

const _flipMs = 480;
const _staggerMs = 250;
const _gap = 6.0;

class WordGrid extends StatelessWidget {
  final List<String> guesses;
  final List<List<LetterStatus>> guessStatuses;
  final String currentGuess;
  final int wordLength;

  /// Increments on every rejected guess; each change plays one shake.
  final int shakeTick;

  /// Row that was just submitted (animated flip), or null (e.g. a restored game).
  final int? revealRow;
  final bool revealIsWin;

  const WordGrid({
    super.key,
    required this.guesses,
    required this.guessStatuses,
    required this.currentGuess,
    required this.wordLength,
    this.shakeTick = 0,
    this.revealRow,
    this.revealIsWin = false,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, c) {
        final byH = (c.maxHeight - 5 * _gap) / 6;
        final byW = (c.maxWidth - 64 - (wordLength - 1) * _gap) / wordLength;
        final size = math.min(byH, byW).clamp(32.0, 60.0);

        return Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(6, (r) {
              final Widget row;
              if (r < guesses.length) {
                row = _CompletedRow(
                  key: ValueKey('done-$r-${guesses[r]}'),
                  guess: guesses[r],
                  statuses: guessStatuses[r],
                  size: size,
                  animate: r == revealRow,
                  win: r == revealRow && revealIsWin,
                );
              } else if (r == guesses.length) {
                row = _CurrentRow(guess: currentGuess, wordLength: wordLength, size: size, shakeTick: shakeTick);
              } else {
                row = _Row(children: List.generate(wordLength, (_) => _Tile(size: size)));
              }
              return Padding(padding: EdgeInsets.only(top: r == 0 ? 0 : _gap), child: row);
            }),
          ),
        );
      },
    );
  }
}

class _Row extends StatelessWidget {
  final List<Widget> children;
  const _Row({required this.children});

  @override
  Widget build(BuildContext context) {
    final spaced = <Widget>[];
    for (var i = 0; i < children.length; i++) {
      if (i > 0) spaced.add(const SizedBox(width: _gap));
      spaced.add(children[i]);
    }
    return Row(mainAxisSize: MainAxisSize.min, children: spaced);
  }
}

class _CompletedRow extends StatelessWidget {
  final String guess;
  final List<LetterStatus> statuses;
  final double size;
  final bool animate;
  final bool win;

  const _CompletedRow({super.key, required this.guess, required this.statuses, required this.size, required this.animate, required this.win});

  @override
  Widget build(BuildContext context) {
    final n = guess.length;
    if (!animate) {
      return _Row(children: List.generate(n, (i) => _Tile(size: size, char: guess[i], status: statuses[i])));
    }
    final revealMs = (n - 1) * _staggerMs + _flipMs;
    final winStart = n * _staggerMs + 200;
    final totalMs = win ? winStart + (n - 1) * 80 + 420 : revealMs;

    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: totalMs.toDouble()),
      duration: Duration(milliseconds: totalMs),
      builder: (context, ms, _) => _Row(
        children: List.generate(n, (i) {
          final p = ((ms - i * _staggerMs) / _flipMs).clamp(0.0, 1.0);
          final angle = p < 0.5
              ? Curves.easeInOut.transform(p * 2) * math.pi / 2
              : (1 - Curves.easeInOut.transform((p - 0.5) * 2)) * math.pi / 2;
          var lift = 0.0;
          if (win) {
            final q = ((ms - winStart - i * 80) / 420).clamp(0.0, 1.0);
            lift = -size * 0.32 * math.sin(math.pi * math.min(1.0, q * 1.25));
          }
          return Transform.translate(
            offset: Offset(0, lift),
            child: Transform(
              alignment: Alignment.center,
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.002)
                ..rotateX(angle),
              child: _Tile(
                size: size,
                char: guess[i],
                status: p >= 0.5 ? statuses[i] : LetterStatus.defaultStatus,
                filled: true,
              ),
            ),
          );
        }),
      ),
    );
  }
}

class _CurrentRow extends StatelessWidget {
  final String guess;
  final int wordLength;
  final double size;
  final int shakeTick;

  const _CurrentRow({required this.guess, required this.wordLength, required this.size, required this.shakeTick});

  @override
  Widget build(BuildContext context) {
    final row = _Row(
      children: List.generate(wordLength, (i) {
        final ch = i < guess.length ? guess[i] : '';
        final tile = _Tile(size: size, char: ch, filled: ch.isNotEmpty);
        if (ch.isEmpty) return tile;
        // pop once when the letter appears
        return TweenAnimationBuilder<double>(
          key: ValueKey('pop-$i-$ch'),
          tween: Tween(begin: 0, end: 1),
          duration: const Duration(milliseconds: 110),
          builder: (_, t, child) => Transform.scale(scale: 1 + 0.08 * math.sin(math.pi * t), child: child),
          child: tile,
        );
      }),
    );
    if (shakeTick == 0) return row;
    return TweenAnimationBuilder<double>(
      key: ValueKey('shake-$shakeTick'),
      tween: Tween(begin: 0, end: 1),
      duration: const Duration(milliseconds: 320),
      builder: (_, t, child) => Transform.translate(offset: Offset(math.sin(t * math.pi * 5) * 7 * (1 - t), 0), child: child),
      child: row,
    );
  }
}

class _Tile extends StatelessWidget {
  final double size;
  final String char;
  final LetterStatus status;
  final bool filled;

  const _Tile({required this.size, this.char = '', this.status = LetterStatus.defaultStatus, this.filled = false});

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    final c = p.tile(status);
    final border = status == LetterStatus.defaultStatus ? (filled ? p.lineStrong : p.line) : c.line;
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: c.bg,
        borderRadius: BorderRadius.circular(size * 0.13),
        border: Border.all(color: border, width: 2),
      ),
      alignment: Alignment.center,
      child: Text(
        char.toUpperCase(),
        style: inter(math.min(size * 0.5, 32), weight: FontWeight.w700, color: status == LetterStatus.defaultStatus ? p.ink : c.ink),
      ),
    );
  }
}

/// Inline colour key, shown until the first finished game.
class ColorLegend extends StatelessWidget {
  const ColorLegend({super.key});

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    Widget item(LetterStatus s, String label) {
      final c = p.tile(s);
      return Row(mainAxisSize: MainAxisSize.min, children: [
        Container(
          width: 14,
          height: 14,
          decoration: BoxDecoration(color: c.bg, borderRadius: BorderRadius.circular(4), border: Border.all(color: c.line, width: 2)),
        ),
        const SizedBox(width: 6),
        Text(label, style: inter(11.5, color: p.muted)),
      ]);
    }

    return Wrap(
      alignment: WrapAlignment.center,
      spacing: 16,
      runSpacing: 6,
      children: [
        item(LetterStatus.correct, 'Дұрыс орын'),
        item(LetterStatus.present, 'Сөзде бар'),
        item(LetterStatus.absent, 'Сөзде жоқ'),
      ],
    );
  }
}
