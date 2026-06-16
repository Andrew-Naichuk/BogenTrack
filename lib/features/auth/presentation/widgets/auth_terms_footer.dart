import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

class AuthTermsFooter extends StatelessWidget {
  const AuthTermsFooter({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;
    final baseStyle = textTheme.labelMedium?.copyWith(
      color: colors.onSurfaceMuted,
      height: 1.5,
    );
    final linkStyle = baseStyle?.copyWith(
      color: colors.authLink,
      fontWeight: FontWeight.w700,
    );

    return Text.rich(
      TextSpan(
        children: [
          TextSpan(text: 'By creating an account, you agree to our\n'),
          TextSpan(text: 'Terms', style: linkStyle),
          const TextSpan(text: ' and '),
          TextSpan(text: 'Privacy Policy', style: linkStyle),
          const TextSpan(text: '.'),
        ],
      ),
      textAlign: TextAlign.center,
      style: baseStyle,
    );
  }
}
