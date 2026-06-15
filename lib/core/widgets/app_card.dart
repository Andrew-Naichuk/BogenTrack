import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/app_radius.dart';

class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.showShadow = false,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final bool showShadow;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);

    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surfaceElevated,
        borderRadius: BorderRadius.circular(AppRadius.card),
        boxShadow: showShadow ? colors.cardShadow : null,
      ),
      child: Padding(padding: padding, child: child),
    );
  }
}
