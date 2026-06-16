import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../providers/auth_providers.dart';
import 'auth_error_message.dart';
import 'widgets/auth_error_text.dart';
import 'widgets/auth_form_scaffold.dart';
import 'widgets/auth_prompt_link.dart';
import 'widgets/auth_text_field.dart';
import 'widgets/loading_button.dart';

class ForgotPasswordPage extends ConsumerStatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  ConsumerState<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends ConsumerState<ForgotPasswordPage> {
  final _emailController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;
  String? _emailError;
  bool _emailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  bool _validateFields() {
    final emailError = _emailController.text.trim().isEmpty
        ? 'Enter your email'
        : null;

    setState(() => _emailError = emailError);
    return emailError == null;
  }

  Future<void> _sendResetEmail() async {
    if (!_validateFields()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _emailSent = false;
    });

    final repository = ref.read(authRepositoryProvider);

    try {
      await repository.sendPasswordResetEmail(_emailController.text.trim());
      setState(() => _emailSent = true);
    } on FirebaseAuthException catch (error) {
      setState(() => _errorMessage = authErrorMessage(error));
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;

    return AuthFormScaffold(
      heading: 'Restore Password',
      subtitle: 'Enter your email to receive a reset link',
      children: [
        AuthTextField(
          controller: _emailController,
          placeholder: 'Email address',
          keyboardType: TextInputType.emailAddress,
          autofillHints: const [AutofillHints.email],
          errorText: _emailError,
          onSubmitted: _sendResetEmail,
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: AppSpacing.md),
          AuthErrorText(message: _errorMessage!),
        ],
        if (_emailSent) ...[
          const SizedBox(height: AppSpacing.md),
          Text(
            'Password reset email sent. Check your inbox.',
            textAlign: TextAlign.center,
            style: textTheme.bodyMedium?.copyWith(color: colors.authLink),
          ),
        ],
        const SizedBox(height: AppSpacing.xl),
        LoadingButton(
          label: 'Restore password',
          isLoading: _isLoading,
          onPressed: _sendResetEmail,
        ),
        const SizedBox(height: AppSpacing.authCtaLinkGap),
        AuthTextLink(
          label: 'Back to sign in',
          enabled: !_isLoading,
          onPressed: () => context.go('/sign-in'),
        ),
      ],
    );
  }
}
