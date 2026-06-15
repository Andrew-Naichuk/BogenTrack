import 'package:flutter/material.dart';

@immutable
class AppColors extends ThemeExtension<AppColors> {
  const AppColors({
    required this.surfaceBase,
    required this.surface,
    required this.surfaceElevated,
    required this.onSurface,
    required this.onSurfaceMuted,
    required this.onSurfaceFaint,
    required this.borderSubtle,
    required this.accent,
    required this.accentGold,
    required this.error,
  });

  final Color surfaceBase;
  final Color surface;
  final Color surfaceElevated;
  final Color onSurface;
  final Color onSurfaceMuted;
  final Color onSurfaceFaint;
  final Color borderSubtle;
  final Color accent;
  final Color accentGold;
  final Color error;

  static const light = AppColors(
    surfaceBase: Color(0xFFF6F2EA),
    surface: Color(0xFFFFFFFF),
    surfaceElevated: Color(0xFFFAF7F0),
    onSurface: Color(0xFF26242A),
    onSurfaceMuted: Color(0xFF5C5A55),
    onSurfaceFaint: Color(0xFF8A8780),
    borderSubtle: Color(0x14000000),
    accent: Color(0xFF7E8BA3),
    accentGold: Color(0xFFC7A86A),
    error: Color(0xFFB85C5C),
  );

  static const dark = AppColors(
    surfaceBase: Color(0xFF16151A),
    surface: Color(0xFF211F26),
    surfaceElevated: Color(0xFF2A2830),
    onSurface: Color(0xFFECEAE2),
    onSurfaceMuted: Color(0xFFA8A49C),
    onSurfaceFaint: Color(0xFF6E6A63),
    borderSubtle: Color(0x0FFFFFFF),
    accent: Color(0xFF7E8BA3),
    accentGold: Color(0xFFC7A86A),
    error: Color(0xFFC47272),
  );

  static AppColors of(BuildContext context) {
    return Theme.of(context).extension<AppColors>() ?? light;
  }

  ColorScheme toColorScheme(Brightness brightness) {
    return ColorScheme(
      brightness: brightness,
      primary: accent,
      onPrimary: surface,
      secondary: accent,
      onSecondary: surface,
      error: error,
      onError: surface,
      surface: surface,
      onSurface: onSurface,
      outline: borderSubtle,
      surfaceTint: Colors.transparent,
    );
  }

  /// Soft card shadow — blur ~24, opacity ~0.18, no spread.
  List<BoxShadow> get cardShadow => [
        BoxShadow(
          color: onSurface.withValues(alpha: 0.18),
          blurRadius: 24,
          offset: const Offset(0, 4),
        ),
      ];

  @override
  AppColors copyWith({
    Color? surfaceBase,
    Color? surface,
    Color? surfaceElevated,
    Color? onSurface,
    Color? onSurfaceMuted,
    Color? onSurfaceFaint,
    Color? borderSubtle,
    Color? accent,
    Color? accentGold,
    Color? error,
  }) {
    return AppColors(
      surfaceBase: surfaceBase ?? this.surfaceBase,
      surface: surface ?? this.surface,
      surfaceElevated: surfaceElevated ?? this.surfaceElevated,
      onSurface: onSurface ?? this.onSurface,
      onSurfaceMuted: onSurfaceMuted ?? this.onSurfaceMuted,
      onSurfaceFaint: onSurfaceFaint ?? this.onSurfaceFaint,
      borderSubtle: borderSubtle ?? this.borderSubtle,
      accent: accent ?? this.accent,
      accentGold: accentGold ?? this.accentGold,
      error: error ?? this.error,
    );
  }

  @override
  AppColors lerp(ThemeExtension<AppColors>? other, double t) {
    if (other is! AppColors) {
      return this;
    }
    return AppColors(
      surfaceBase: Color.lerp(surfaceBase, other.surfaceBase, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      surfaceElevated: Color.lerp(surfaceElevated, other.surfaceElevated, t)!,
      onSurface: Color.lerp(onSurface, other.onSurface, t)!,
      onSurfaceMuted: Color.lerp(onSurfaceMuted, other.onSurfaceMuted, t)!,
      onSurfaceFaint: Color.lerp(onSurfaceFaint, other.onSurfaceFaint, t)!,
      borderSubtle: Color.lerp(borderSubtle, other.borderSubtle, t)!,
      accent: Color.lerp(accent, other.accent, t)!,
      accentGold: Color.lerp(accentGold, other.accentGold, t)!,
      error: Color.lerp(error, other.error, t)!,
    );
  }
}
