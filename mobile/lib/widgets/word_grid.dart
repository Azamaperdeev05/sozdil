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
    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 380),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(6, (rowIndex) {
            if (rowIndex < guesses.length) {
              return _CompletedRow(
                guess: guesses[rowIndex],
                statuses: guessStatuses[rowIndex],
                wordLength: wordLength,
              );
            } else if (rowIndex == guesses.length) {
              return _CurrentRow(
                guess: currentGuess,
                wordLength: wordLength,
                isShaking: isShaking,
              );
            } else {
              return _EmptyRow(wordLength: wordLength);
            }
          }),
        ),
      ),
    );
  }
}

class _CompletedRow extends StatelessWidget {
  final String guess;
  final List<LetterStatus> statuses;
  final int wordLength;

  const _CompletedRow({
    required this.guess,
    required this.statuses,
    required this.wordLength,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
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

          return _Tile(char: char, backgroundColor: bg, textColor: textColor, borderColor: bg);
        }),
      ),
    );
  }
}

class _CurrentRow extends StatelessWidget {
  final String guess;
  final int wordLength;
  final bool isShaking;

  const _CurrentRow({
    required this.guess,
    required this.wordLength,
    required this.isShaking,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedPadding(
      duration: const Duration(milliseconds: 50),
      padding: EdgeInsets.only(left: isShaking ? 8 : 0, right: isShaking ? 0 : 8, top: 3, bottom: 3),
      child: Row(
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
          );
        }),
      ),
    );
  }
}

class _EmptyRow extends StatelessWidget {
  final int wordLength;

  const _EmptyRow({required this.wordLength});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(wordLength, (i) {
          return const _Tile(
            char: '',
            backgroundColor: AppColors.surface,
            textColor: AppColors.text,
            borderColor: AppColors.border,
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

  const _Tile({
    required this.char,
    required this.backgroundColor,
    required this.textColor,
    required this.borderColor,
    this.borderWidth = 1.5,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: AspectRatio(
        aspectRatio: 1.0,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 2.5),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: borderColor, width: borderWidth),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.15),
                blurRadius: 2,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          alignment: Alignment.center,
          child: Text(
            char,
            style: GoogleFonts.inter(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
        ),
      ),
    );
  }
}
