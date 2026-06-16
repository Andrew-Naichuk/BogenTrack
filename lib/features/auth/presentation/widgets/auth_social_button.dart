import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_durations.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';

class AuthSocialButton extends StatefulWidget {
  const AuthSocialButton({
    super.key,
    required this.label,
    required this.icon,
    required this.onPressed,
  });

  final String label;
  final Widget icon;
  final VoidCallback? onPressed;

  @override
  State<AuthSocialButton> createState() => _AuthSocialButtonState();
}

class _AuthSocialButtonState extends State<AuthSocialButton> {
  bool _pressed = false;

  bool get _enabled => widget.onPressed != null;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;
    final labelStyle = textTheme.labelLarge?.copyWith(
      fontWeight: FontWeight.w600,
    );

    return GestureDetector(
      onTapDown: _enabled ? (_) => setState(() => _pressed = true) : null,
      onTapUp: _enabled ? (_) => setState(() => _pressed = false) : null,
      onTapCancel: _enabled ? () => setState(() => _pressed = false) : null,
      onTap: _enabled ? widget.onPressed : null,
      child: AnimatedOpacity(
        duration: appDuration(context, AppDurations.fast),
        opacity: _pressed ? 0.6 : 1,
        child: DecoratedBox(
          decoration: BoxDecoration(
            border: Border.all(color: colors.authInputBorder),
            borderRadius: BorderRadius.circular(AppRadius.authButton),
          ),
          child: SizedBox(
            width: double.infinity,
            height: 58,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                widget.icon,
                const SizedBox(width: AppSpacing.sm),
                Text(widget.label, style: labelStyle),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
