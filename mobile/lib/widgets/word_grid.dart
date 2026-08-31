import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../models/letter_status.dart';

class WordGrid extends StatelessWidget {
  final List<String> guesses;
  final List<List<LetterStatus>> guessStatuses;
  final String currentGuess;
  final int wordLength;
  final bool isShaking;

  const WordGrid({
    super.key,
    required this.guesses,
    required this.guessStatuses,
    required this.currentGuess,
    required this.wordLength,
    this.isShaking = false,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Calculate dynamic optimal tile size based on available width and height
        final maxH = constraints.maxHeight;
        final maxW = constraints.maxWidth;

        // Total 6 rows + gaps (5 gaps * 6px = 30px) + vertical padding
        final sizeByHeight = ((maxH - 50) / 6).clamp(38.0, 58.0);
        // Total wordLength columns + gaps
        final sizeByWidth = ((maxW - 32 - (wordLength - 1) * 6) / wordLength).clamp(38.0, 58.0);

        final tileSize = sizeByHeight < sizeByWidth ? sizeByHeight : sizeByWidth;

        return Center(
          child: FittedBox(
            fit: BoxFit.scaleDown,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: List.generate(6, (rowIndex) {
                  if (rowIndex < guesses.length) {
                    return _CompletedRow(
                      guess: guesses[rowIndex],
                      statuses: guessStatuses[rowIndex],
                      wordLength: wordLength,
                      tileSize: tileSize,
                    );
                  } else if (rowIndex == guesses.length) {
                    return _CurrentRow(
                      guess: currentGuess,
                      wordLength: wordLength,
                      isShaking: isShaking,
                      tileSize: tileSize,
                    );
                  } else {
                    return _EmptyRow(wordLength: wordLength, tileSize: tileSize);
                  }
                }),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _CompletedRow extends StatelessWidget {
  final String guess;
  final List<LetterStatus> statuses;
  final int wordLength;
  final double tileSize;

  const _CompletedRow({
    required this.guess,
    required this.statuses,
    required this.wordLength,
    required this.tileSize,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(wordLength, (i) {
          final char = i < guess.length ? guess[i] : '';
          final status = i < statuses.length ? statuses[i] : LetterStatus.absent;

          Color bg;
          Color textColor = Colors.white;

          switch (status) {
            case LetterStatus.correct:
              bg = AppColors.correct;
              break;
            case LetterStatus.present:
              bg = AppColors.present;
              textColor = const Color(0xFF0D0F14);
              break;
            case LetterStatus.absent:
              bg = AppColors.absent;
              break;
            default:
              bg = AppColors.surface;
          }

          return _Tile(
            char: char,
            backgroundColor: bg,
            textColor: textColor,
            borderColor: bg,
            size: tileSize,
          );
        }),
      ),
    );
  }
}

class _CurrentRow extends StatelessWidget {
  final String guess;
  final int wordLength;
  final bool isShaking;
  final double tileSize;

  const _CurrentRow({
    required this.guess,
    required this.wordLength,
    required this.isShaking,
    required this.tileSize,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedPadding(
      duration: const Duration(milliseconds: 50),
      padding: EdgeInsets.only(left: isShaking ? 6 : 0, right: isShaking ? 0 : 6, top: 3, bottom: 3),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(wordLength, (i) {
          final char = i < guess.length ? guess[i] : '';
          final hasLetter = char.isNotEmpty;

          return _Tile(
            char: char,
            backgroundColor: AppColors.surface,
            textColor: AppColors.text,
            borderColor: hasLetter ? AppColors.accent : AppColors.border,
            borderWidth: hasLetter ? 2.0 : 1.5,
            size: tileSize,
          );
        }),
      ),
    );
  }
}

class _EmptyRow extends StatelessWidget {
  final int wordLength;
  final double tileSize;

  const _EmptyRow({required this.wordLength, required this.tileSize});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(wordLength, (i) {
          return _Tile(
            char: '',
            backgroundColor: AppColors.surface,
            textColor: AppColors.text,
            borderColor: AppColors.border,
            size: tileSize,
          );
        }),
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  final String char;
  final Color backgroundColor;
  final Color textColor;
  final Color borderColor;
  final double borderWidth;
  final double size;

  const _Tile({
    required this.char,
    required this.backgroundColor,
    required this.textColor,
    required this.borderColor,
    this.borderWidth = 1.5,
    required this.size,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      margin: const EdgeInsets.symmetric(horizontal: 2.5),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: borderColor, width: borderWidth),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 2,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      alignment: Alignment.center,
      child: Text(
        char.toUpperCase(),
        style: GoogleFonts.inter(
          fontSize: size * 0.44,
          fontWeight: FontWeight.bold,
          color: textColor,
        ),
      ),
    );
  }
}
