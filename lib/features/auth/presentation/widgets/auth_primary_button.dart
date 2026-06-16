import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_durations.dart';
import '../../../../core/theme/app_radius.dart';

class AuthPrimaryButton extends StatefulWidget {
  const AuthPrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;

  @override
  State<AuthPrimaryButton> createState() => _AuthPrimaryButtonState();
}

class _AuthPrimaryButtonState extends State<AuthPrimaryButton> {
  bool _pressed = false;

  bool get _enabled => widget.onPressed != null && !widget.isLoading;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;
    final labelStyle = textTheme.labelLarge?.copyWith(
      color: colors.authOnPrimary,
      fontWeight: FontWeight.w700,
    );

    final child = widget.isLoading
        ? CupertinoActivityIndicator(color: colors.authOnPrimary)
        : Text(widget.label, style: labelStyle);

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
            color: colors.authPrimary,
            borderRadius: BorderRadius.circular(AppRadius.authButton),
          ),
          child: SizedBox(
            width: double.infinity,
            height: 58,
            child: Center(child: child),
          ),
        ),
      ),
    );
  }
}
