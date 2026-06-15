import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import 'app_button.dart';
import 'app_scaffold.dart';

class ErrorStateView extends StatelessWidget {
  const ErrorStateView({
    super.key,
    required this.title,
    required this.message,
    this.hint,
    this.actionLabel,
    this.onAction,
    this.icon = CupertinoIcons.exclamationmark_circle,
  });

  final String title;
  final String message;
  final String? hint;
  final String? actionLabel;
  final VoidCallback? onAction;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;

    return AppScaffold(
      centerBody: true,
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 48, color: colors.error),
          const SizedBox(height: AppSpacing.md),
          Text(
            title,
            style: textTheme.headlineMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            message,
            style: textTheme.bodyLarge,
            textAlign: TextAlign.center,
          ),
          if (hint != null) ...[
            const SizedBox(height: AppSpacing.lg),
            Text(
              hint!,
              style: textTheme.bodyMedium?.copyWith(color: colors.onSurfaceMuted),
              textAlign: TextAlign.center,
            ),
          ],
          if (actionLabel != null && onAction != null) ...[
            const SizedBox(height: AppSpacing.lg),
            AppButton(label: actionLabel!, onPressed: onAction),
          ],
        ],
      ),
    );
  }
}
