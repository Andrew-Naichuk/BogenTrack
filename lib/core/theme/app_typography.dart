import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

TextTheme buildAppTextTheme(Brightness brightness, AppColors colors) {
  TextStyle serifStyle({
    required double size,
    FontWeight weight = FontWeight.w400,
    double height = 1.35,
    Color? color,
  }) {
    return GoogleFonts.newsreader(
      fontSize: size,
      fontWeight: weight,
      height: height,
      color: color ?? colors.onSurface,
    );
  }

  TextStyle sansStyle({
    required double size,
    FontWeight weight = FontWeight.w400,
    double height = 1.6,
    Color? color,
  }) {
    return GoogleFonts.inter(
      fontSize: size,
      fontWeight: weight,
      height: height,
      color: color ?? colors.onSurface,
    );
  }

  TextStyle scoreStyle({
    required double size,
    FontWeight weight = FontWeight.w500,
    Color? color,
  }) {
    return GoogleFonts.inter(
      fontSize: size,
      fontWeight: weight,
      height: 1.2,
      color: color ?? colors.onSurface,
      fontFeatures: const [FontFeature.tabularFigures()],
    );
  }

  return TextTheme(
    displayLarge: serifStyle(size: 52, weight: FontWeight.w400, height: 1.25),
    displayMedium: serifStyle(size: 38, weight: FontWeight.w400, height: 1.3),
    displaySmall: serifStyle(size: 28, weight: FontWeight.w500, height: 1.35),
    headlineMedium: serifStyle(size: 22, weight: FontWeight.w600, height: 1.35),
    titleLarge: sansStyle(size: 20, weight: FontWeight.w500, height: 1.4),
    titleMedium: sansStyle(size: 17, weight: FontWeight.w500, height: 1.5),
    bodyLarge: sansStyle(size: 17, height: 1.6),
    bodyMedium: sansStyle(size: 15, height: 1.6),
    bodySmall: sansStyle(size: 13, height: 1.5, color: colors.onSurfaceMuted),
    labelLarge: sansStyle(size: 15, weight: FontWeight.w500, height: 1.4),
    labelMedium: sansStyle(size: 13, height: 1.4, color: colors.onSurfaceMuted),
    labelSmall: sansStyle(size: 13, height: 1.4, color: colors.onSurfaceFaint),
  ).copyWith(
    // Score numerals — use via ScoreText or these extension getters.
    headlineLarge: scoreStyle(size: 28, weight: FontWeight.w600),
    titleSmall: scoreStyle(size: 17, weight: FontWeight.w500),
  );
}
