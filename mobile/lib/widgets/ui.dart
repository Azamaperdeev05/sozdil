import 'package:flutter/material.dart';
import 'package:reicon_flutter/reicon_flutter.dart';

import '../theme/palette.dart';
import 'reicon_widget.dart';

/// Opens [child] as a bottom sheet (same pattern as the web modals on phones).
Future<T?> showAppSheet<T>(BuildContext context, Widget child) {
  final p = Palette.of(context);
  return showModalBottomSheet<T>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    // background comes from bottomSheetTheme so it follows a theme switch while the sheet is open
    barrierColor: p.scrim,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (_) => child,
  );
}

/// Sheet body: grabber, optional title, close button, scrollable content.
class SheetFrame extends StatelessWidget {
  final String? title;
  final Widget child;
  final bool scroll;

  const SheetFrame({
    super.key,
    this.title,
    required this.child,
    this.scroll = true,
  });

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    final maxH = MediaQuery.of(context).size.height * 0.9;
    final body = Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
      child: child,
    );
    return ConstrainedBox(
      constraints: BoxConstraints(maxHeight: maxH),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: double.infinity,
            child: Stack(
              alignment: Alignment.center,
              children: [
                Column(
                  children: [
                    const SizedBox(height: 10),
                    Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: p.line,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    SizedBox(height: title == null ? 44 : 14),
                    if (title != null)
                      Padding(
                        padding: const EdgeInsets.fromLTRB(48, 0, 48, 18),
                        child: Text(
                          title!,
                          textAlign: TextAlign.center,
                          style: inter(
                            18,
                            weight: FontWeight.w700,
                            color: p.ink,
                          ),
                        ),
                      ),
                  ],
                ),
                Positioned(
                  right: 10,
                  top: 14,
                  child: IconButton(
                    onPressed: () => Navigator.pop(context),
                    tooltip: 'Жабу',
                    icon: ReiconWidget(
                      Reicon.outline.xmark,
                      color: p.muted,
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Flexible(child: scroll ? SingleChildScrollView(child: body) : body),
        ],
      ),
    );
  }
}

/// Solid ink pill — the one primary action on a screen.
class PrimaryButton extends StatelessWidget {
  final String label;
  final Widget? icon;
  final VoidCallback? onPressed;

  const PrimaryButton({
    super.key,
    required this.label,
    this.icon,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    final enabled = onPressed != null;
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: Material(
        color: enabled ? p.ink : p.surface2,
        shape: const StadiumBorder(),
        child: InkWell(
          customBorder: const StadiumBorder(),
          onTap: onPressed,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[icon!, const SizedBox(width: 8)],
              Text(
                label,
                style: inter(
                  15,
                  weight: FontWeight.w600,
                  color: enabled ? p.onInk : p.muted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Outline pill — quiet secondary action.
class SecondaryButton extends StatelessWidget {
  final String label;
  final Widget? icon;
  final VoidCallback? onPressed;

  const SecondaryButton({
    super.key,
    required this.label,
    this.icon,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    return SizedBox(
      height: 46,
      child: Material(
        color: Colors.transparent,
        shape: StadiumBorder(side: BorderSide(color: p.line)),
        child: InkWell(
          customBorder: const StadiumBorder(),
          onTap: onPressed,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[icon!, const SizedBox(width: 8)],
              Flexible(
                child: Text(
                  label,
                  overflow: TextOverflow.ellipsis,
                  style: inter(14, weight: FontWeight.w600, color: p.ink),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Segmented pill control (4/5/6 әріп, theme, tabs).
class Segmented<T> extends StatelessWidget {
  final List<(T, String)> items;
  final T value;
  final ValueChanged<T> onChanged;
  final double maxWidth;

  const Segmented({
    super.key,
    required this.items,
    required this.value,
    required this.onChanged,
    this.maxWidth = 260,
  });

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: maxWidth),
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: p.surface,
          borderRadius: BorderRadius.circular(999),
        ),
        child: Row(
          children: items.map((it) {
            final sel = it.$1 == value;
            return Expanded(
              child: Semantics(
                selected: sel,
                button: true,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onChanged(it.$1),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    curve: Curves.easeOut,
                    height: 34,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: sel ? p.ink : Colors.transparent,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      it.$2,
                      style: inter(
                        13,
                        weight: FontWeight.w600,
                        color: sel ? p.onInk : p.muted,
                      ),
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

/// Row in a bordered list: round icon, title + hint, chevron.
class ActionRow extends StatelessWidget {
  final Widget icon;
  final String title;
  final String? hint;
  final VoidCallback? onTap;

  const ActionRow({
    super.key,
    required this.icon,
    required this.title,
    this.hint,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final p = Palette.of(context);
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: p.surface,
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              child: icon,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: inter(14, weight: FontWeight.w600, color: p.ink),
                  ),
                  if (hint != null)
                    Text(
                      hint!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: inter(12, color: p.muted),
                    ),
                ],
              ),
            ),
            ReiconWidget(Reicon.outline.chevronRight, color: p.muted, size: 18),
          ],
        ),
      ),
    );
  }
}

/// Toast in the app style (ink pill near the top).
void showAppToast(BuildContext context, String message) {
  final p = Palette.of(context);
  final messenger = ScaffoldMessenger.of(context);
  messenger.clearSnackBars();
  messenger.showSnackBar(
    SnackBar(
      content: Text(
        message,
        textAlign: TextAlign.center,
        style: inter(14, weight: FontWeight.w600, color: p.onInk),
      ),
      backgroundColor: p.ink,
      elevation: 0,
      duration: const Duration(milliseconds: 2200),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      margin: EdgeInsets.only(
        left: 40,
        right: 40,
        bottom: MediaQuery.of(context).size.height - 180,
      ),
    ),
  );
}
