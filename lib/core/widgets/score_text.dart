import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_colors.dart';

/// Tabular numerals for scores, averages, and totals.
class ScoreText extends StatelessWidget {
  const ScoreText(
    this.value, {
    super.key,
    this.style,
    this.fontSize = 17,
    this.fontWeight = FontWeight.w500,
    this.color,
    this.textAlign,
  });

  final String value;
  final TextStyle? style;
  final double fontSize;
  final FontWeight fontWeight;
  final Color? color;
  final TextAlign? textAlign;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final effectiveStyle = style ??
        GoogleFonts.inter(
          fontSize: fontSize,
          fontWeight: fontWeight,
          height: 1.2,
          color: color ?? colors.onSurface,
          fontFeatures: const [FontFeature.tabularFigures()],
        );

    return Text(value, style: effectiveStyle, textAlign: textAlign);
  }
}
