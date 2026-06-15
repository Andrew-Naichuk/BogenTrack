import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'app_colors.dart';
import 'app_typography.dart';

abstract final class AppTheme {
  static final ThemeData light = _build(Brightness.light, AppColors.light);
  static final ThemeData dark = _build(Brightness.dark, AppColors.dark);

  static ThemeData _build(Brightness brightness, AppColors colors) {
    final textTheme = buildAppTextTheme(brightness, colors);
    final colorScheme = colors.toColorScheme(brightness);

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      textTheme: textTheme,
      scaffoldBackgroundColor: colors.surfaceBase,
      splashFactory: NoSplash.splashFactory,
      highlightColor: Colors.transparent,
      extensions: [colors],
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: CupertinoPageTransitionsBuilder(),
          TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
          TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
          TargetPlatform.linux: CupertinoPageTransitionsBuilder(),
          TargetPlatform.windows: CupertinoPageTransitionsBuilder(),
          TargetPlatform.fuchsia: CupertinoPageTransitionsBuilder(),
        },
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: colors.surface,
        foregroundColor: colors.onSurface,
        elevation: 0,
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: textTheme.titleMedium,
      ),
      cardTheme: CardThemeData(
        color: colors.surfaceElevated,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
        ),
      ),
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: colors.surfaceElevated,
        surfaceTintColor: Colors.transparent,
      ),
      dividerTheme: DividerThemeData(
        color: colors.borderSubtle,
        thickness: 0.5,
        space: 0,
      ),
      cupertinoOverrideTheme: CupertinoThemeData(
        primaryColor: colors.accent,
        scaffoldBackgroundColor: colors.surfaceBase,
        barBackgroundColor: colors.surface,
      ),
    );
  }

  static CupertinoThemeData cupertino(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;

    return CupertinoThemeData(
      primaryColor: colors.accent,
      scaffoldBackgroundColor: colors.surfaceBase,
      barBackgroundColor: colors.surface,
      textTheme: CupertinoTextThemeData(
        primaryColor: colors.onSurface,
        textStyle: textTheme.bodyLarge,
        actionTextStyle: textTheme.labelLarge?.copyWith(color: colors.accent),
        navTitleTextStyle: textTheme.titleMedium,
        navLargeTitleTextStyle: textTheme.displaySmall,
        tabLabelTextStyle: textTheme.labelMedium,
      ),
    );
  }
}
