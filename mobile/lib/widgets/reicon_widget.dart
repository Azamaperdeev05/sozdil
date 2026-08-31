import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:reicon_flutter/reicon_flutter.dart';

class ReiconWidget extends StatelessWidget {
  final String pathData;
  final double size;
  final Color color;

  const ReiconWidget(
    this.pathData, {
    super.key,
    this.size = 22,
    this.color = Colors.white,
  });

  @override
  Widget build(BuildContext context) {
    final hex = '#${(color.toARGB32() & 0xFFFFFF).toRadixString(16).padLeft(6, '0')}';
    final svgMarkup = reiconSvg(pathData, size: size.round(), color: hex);

    return SvgPicture.string(
      svgMarkup,
      width: size,
      height: size,
      colorFilter: ColorFilter.mode(color, BlendMode.srcIn),
    );
  }
}
