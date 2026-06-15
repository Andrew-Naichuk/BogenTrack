import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';

class AuthTextField extends StatelessWidget {
  const AuthTextField({
    super.key,
    required this.controller,
    required this.placeholder,
    this.keyboardType,
    this.obscureText = false,
    this.autofillHints,
    this.errorText,
    this.onSubmitted,
  });

  final TextEditingController controller;
  final String placeholder;
  final TextInputType? keyboardType;
  final bool obscureText;
  final Iterable<String>? autofillHints;
  final String? errorText;
  final VoidCallback? onSubmitted;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        CupertinoTextField(
          controller: controller,
          placeholder: placeholder,
          keyboardType: keyboardType,
          obscureText: obscureText,
          autofillHints: autofillHints,
          onSubmitted: onSubmitted != null ? (_) => onSubmitted!() : null,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.sm,
            vertical: 14,
          ),
          style: textTheme.bodyLarge,
          placeholderStyle: textTheme.bodyLarge?.copyWith(
            color: colors.onSurfaceFaint,
          ),
          decoration: BoxDecoration(
            color: colors.surfaceElevated,
            borderRadius: BorderRadius.circular(AppRadius.input),
          ),
        ),
        if (errorText != null) ...[
          const SizedBox(height: AppSpacing.xxs + 2),
          Text(
            errorText!,
            style: textTheme.labelMedium?.copyWith(color: colors.error),
          ),
        ],
      ],
    );
  }
}
