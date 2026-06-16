import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

/// Muted prompt with a gold link action, e.g. "Don't have an account? Sign up".
class AuthPromptLink extends StatelessWidget {
  const AuthPromptLink({
    super.key,
    required this.prompt,
    required this.actionLabel,
    required this.onAction,
    this.enabled = true,
  });

  final String prompt;
  final String actionLabel;
  final VoidCallback onAction;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;
    final baseStyle = textTheme.bodyMedium?.copyWith(color: colors.onSurfaceMuted);
    final linkStyle = baseStyle?.copyWith(
      color: colors.authLink,
      fontWeight: FontWeight.w600,
    );

    return Text.rich(
      TextSpan(
        children: [
          TextSpan(text: prompt),
          TextSpan(
            text: actionLabel,
            style: linkStyle,
            recognizer: enabled
                ? (TapGestureRecognizer()..onTap = onAction)
                : null,
          ),
        ],
      ),
      textAlign: TextAlign.center,
      style: baseStyle,
    );
  }
}

/// Single gold link label, e.g. "Back to sign in".
class AuthTextLink extends StatelessWidget {
  const AuthTextLink({
    super.key,
    required this.label,
    required this.onPressed,
    this.enabled = true,
  });

  final String label;
  final VoidCallback onPressed;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;
    final style = textTheme.bodyMedium?.copyWith(
      color: colors.authLink,
      fontWeight: FontWeight.w600,
    );

    return CupertinoButton(
      padding: EdgeInsets.zero,
      onPressed: enabled ? onPressed : null,
      child: Text(label, style: style),
    );
  }
}
