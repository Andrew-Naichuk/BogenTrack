import 'package:flutter/material.dart';

import 'auth_primary_button.dart';

class LoadingButton extends StatelessWidget {
  const LoadingButton({
    super.key,
    required this.label,
    required this.isLoading,
    required this.onPressed,
  });

  final String label;
  final bool isLoading;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AuthPrimaryButton(
      label: label,
      isLoading: isLoading,
      onPressed: onPressed,
    );
  }
}
