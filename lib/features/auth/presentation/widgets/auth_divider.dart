import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class AuthDivider extends StatelessWidget {
  const AuthDivider({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;
    final labelStyle = textTheme.labelMedium?.copyWith(
      color: colors.onSurfaceMuted,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.5,
    );

    return Row(
      children: [
        Expanded(child: Container(height: 1, color: colors.authInputBorder)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
          child: Text('OR', style: labelStyle),
        ),
        Expanded(child: Container(height: 1, color: colors.authInputBorder)),
      ],
    );
  }
}
