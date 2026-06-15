import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

class AuthErrorText extends StatelessWidget {
  const AuthErrorText({super.key, required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;

    return Text(
      message,
      style: textTheme.bodyMedium?.copyWith(color: colors.error),
    );
  }
}
