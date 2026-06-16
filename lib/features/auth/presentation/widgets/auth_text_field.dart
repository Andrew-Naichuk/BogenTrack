import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';

class AuthTextField extends StatefulWidget {
  const AuthTextField({
    super.key,
    required this.controller,
    required this.placeholder,
    this.keyboardType,
    this.obscureText = false,
    this.showVisibilityToggle = false,
    this.autofillHints,
    this.errorText,
    this.onSubmitted,
  });

  final TextEditingController controller;
  final String placeholder;
  final TextInputType? keyboardType;
  final bool obscureText;
  final bool showVisibilityToggle;
  final Iterable<String>? autofillHints;
  final String? errorText;
  final VoidCallback? onSubmitted;

  @override
  State<AuthTextField> createState() => _AuthTextFieldState();
}

class _AuthTextFieldState extends State<AuthTextField> {
  late bool _obscureText;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.obscureText;
  }

  @override
  void didUpdateWidget(AuthTextField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.obscureText != widget.obscureText && !widget.showVisibilityToggle) {
      _obscureText = widget.obscureText;
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        DecoratedBox(
          decoration: BoxDecoration(
            color: colors.authInputFill,
            border: Border.all(color: colors.authInputBorder),
            borderRadius: BorderRadius.circular(AppRadius.authInput),
          ),
          child: SizedBox(
            height: 58,
            child: Row(
              children: [
                Expanded(
                  child: CupertinoTextField(
                    controller: widget.controller,
                    placeholder: widget.placeholder,
                    keyboardType: widget.keyboardType,
                    obscureText: _obscureText,
                    autofillHints: widget.autofillHints,
                    onSubmitted:
                        widget.onSubmitted != null ? (_) => widget.onSubmitted!() : null,
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                    style: textTheme.bodyLarge,
                    placeholderStyle: textTheme.bodyLarge?.copyWith(
                      color: colors.onSurfaceMuted,
                    ),
                    decoration: null,
                  ),
                ),
                if (widget.showVisibilityToggle) ...[
                  CupertinoButton(
                    padding: const EdgeInsets.only(right: AppSpacing.md),
                    minimumSize: Size.zero,
                    onPressed: () => setState(() => _obscureText = !_obscureText),
                    child: _obscureText
                        ? SvgPicture.asset(
                            'assets/images/auth/eye_off.svg',
                            width: 20,
                            height: 20,
                            colorFilter: ColorFilter.mode(
                              colors.onSurfaceMuted,
                              BlendMode.srcIn,
                            ),
                          )
                        : Icon(
                            CupertinoIcons.eye,
                            size: 20,
                            color: colors.onSurfaceMuted,
                          ),
                  ),
                ],
              ],
            ),
          ),
        ),
        if (widget.errorText != null) ...[
          const SizedBox(height: AppSpacing.xxs + 2),
          Text(
            widget.errorText!,
            style: textTheme.labelMedium?.copyWith(color: colors.error),
          ),
        ],
      ],
    );
  }
}
