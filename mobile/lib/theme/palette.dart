import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/letter_status.dart';

/// Design tokens shared with the web app (index.css): monochrome + one green accent.
/// Green = "the letter is in the word": solid = right spot, tint = wrong spot.
@immutable
class Palette extends ThemeExtension<Palette> {
  final Color bg, surface, surface2, line, lineStrong, ink, onInk, muted;
  final Color accent, accentInk, onAccent, presentBg, presentInk, absentBg, absentInk;
  final Color keyBg, keyDeadBg, keyDeadInk, danger, scrim;

  const Palette({
    required this.bg,
    required this.surface,
    required this.surface2,
    required this.line,
    required this.lineStrong,
    required this.ink,
    required this.onInk,
    required this.muted,
    required this.accent,
    required this.accentInk,
    required this.onAccent,
    required this.presentBg,
    required this.presentInk,
    required this.absentBg,
    required this.absentInk,
    required this.keyBg,
    required this.keyDeadBg,
    required this.keyDeadInk,
    required this.danger,
    required this.scrim,
  });

  static const light = Palette(
    bg: Color(0xFFFFFFFF),
    surface: Color(0xFFF4F4F5),
    surface2: Color(0xFFE9E9EC),
    line: Color(0xFFE4E4E7),
    lineStrong: Color(0xFFA1A1AA),
    ink: Color(0xFF0A0A0A),
    onInk: Color(0xFFFFFFFF),
    muted: Color(0xFF71717A),
    accent: Color(0xFF1FBF62),
    accentInk: Color(0xFF0B7A3B),
    onAccent: Color(0xFF052E16),
    presentBg: Color(0xFFE3F7EA),
    presentInk: Color(0xFF0B7A3B),
    absentBg: Color(0xFFE4E4E7),
    absentInk: Color(0xFF52525B),
    keyBg: Color(0xFFE9E9EC),
    keyDeadBg: Color(0xFFFAFAFA),
    keyDeadInk: Color(0xFFC4C4C9),
    danger: Color(0xFFDC2626),
    scrim: Color(0x660A0A0A),
  );

  static const dark = Palette(
    bg: Color(0xFF0A0A0A),
    surface: Color(0xFF161616),
    surface2: Color(0xFF202020),
    line: Color(0xFF2A2A2A),
    lineStrong: Color(0xFF5A5A5F),
    ink: Color(0xFFFAFAFA),
    onInk: Color(0xFF0A0A0A),
    muted: Color(0xFFA1A1AA),
    accent: Color(0xFF2BD46E),
    accentInk: Color(0xFF5EE696),
    onAccent: Color(0xFF04230F),
    presentBg: Color(0xFF0F2A19),
    presentInk: Color(0xFF7CF0AA),
    absentBg: Color(0xFF262626),
    absentInk: Color(0xFF9A9AA2),
    keyBg: Color(0xFF2A2A2A),
    keyDeadBg: Color(0xFF121212),
    keyDeadInk: Color(0xFF4A4A4F),
    danger: Color(0xFFF87171),
    scrim: Color(0x99000000),
  );

  static Palette of(BuildContext context) => Theme.of(context).extension<Palette>()!;

  /// Tile fill / border / letter for a guess status.
  ({Color bg, Color line, Color ink}) tile(LetterStatus s) {
    switch (s) {
      case LetterStatus.correct:
        return (bg: accent, line: accent, ink: onAccent);
      case LetterStatus.present:
        return (bg: presentBg, line: accent, ink: presentInk);
      case LetterStatus.absent:
        return (bg: absentBg, line: absentBg, ink: absentInk);
      case LetterStatus.defaultStatus:
        return (bg: Colors.transparent, line: line, ink: ink);
    }
  }

  @override
  Palette copyWith() => this;

  @override
  Palette lerp(ThemeExtension<Palette>? other, double t) => t < 0.5 ? this : (other as Palette? ?? this);
}

ThemeData buildTheme(Palette p, Brightness b) {
  final base = b == Brightness.dark ? ThemeData.dark() : ThemeData.light();
  return ThemeData(
    brightness: b,
    scaffoldBackgroundColor: p.bg,
    colorScheme: ColorScheme.fromSeed(seedColor: p.accent, brightness: b, surface: p.bg),
    textTheme: GoogleFonts.interTextTheme(base.textTheme).apply(bodyColor: p.ink, displayColor: p.ink),
    splashFactory: NoSplash.splashFactory,
    bottomSheetTheme: BottomSheetThemeData(backgroundColor: p.bg, modalBackgroundColor: p.bg, surfaceTintColor: Colors.transparent),
    highlightColor: Colors.transparent,
    extensions: [p],
  );
}

/// Text helper so widgets don't repeat GoogleFonts boilerplate.
TextStyle inter(double size, {FontWeight weight = FontWeight.w500, Color? color, double? height, double? spacing}) =>
    GoogleFonts.inter(fontSize: size, fontWeight: weight, color: color, height: height, letterSpacing: spacing);
