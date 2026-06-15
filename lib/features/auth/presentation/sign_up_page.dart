import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../providers/auth_providers.dart';
import 'auth_error_message.dart';
import 'widgets/auth_error_text.dart';
import 'widgets/auth_form_scaffold.dart';
import 'widgets/auth_text_field.dart';
import 'widgets/loading_button.dart';

class SignUpPage extends ConsumerStatefulWidget {
  const SignUpPage({super.key});

  @override
  ConsumerState<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends ConsumerState<SignUpPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;
  String? _emailError;
  String? _passwordError;
  String? _confirmPasswordError;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  bool _validateFields() {
    final emailError = _emailController.text.trim().isEmpty
        ? 'Enter your email'
        : null;
    final passwordError = _passwordController.text.length < 8
        ? 'Password must be at least 8 characters'
        : null;
    final confirmPasswordError = _confirmPasswordController.text !=
            _passwordController.text
        ? 'Passwords do not match'
        : null;

    setState(() {
      _emailError = emailError;
      _passwordError = passwordError;
      _confirmPasswordError = confirmPasswordError;
    });

    return emailError == null &&
        passwordError == null &&
        confirmPasswordError == null;
  }

  Future<void> _signUp() async {
    if (!_validateFields()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final repository = ref.read(authRepositoryProvider);

    try {
      await repository.signUpWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
      if (mounted) {
        context.go('/');
      }
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
    final linkStyle = textTheme.labelLarge?.copyWith(color: colors.accent);

    return AuthFormScaffold(
      title: 'Create account',
      heading: 'Create your account',
      children: [
        AuthTextField(
          controller: _emailController,
          placeholder: 'Email',
          keyboardType: TextInputType.emailAddress,
          autofillHints: const [AutofillHints.email],
          errorText: _emailError,
        ),
        const SizedBox(height: AppSpacing.md),
        AuthTextField(
          controller: _passwordController,
          placeholder: 'Password',
          obscureText: true,
          autofillHints: const [AutofillHints.newPassword],
          errorText: _passwordError,
        ),
        const SizedBox(height: AppSpacing.md),
        AuthTextField(
          controller: _confirmPasswordController,
          placeholder: 'Confirm password',
          obscureText: true,
          autofillHints: const [AutofillHints.newPassword],
          errorText: _confirmPasswordError,
          onSubmitted: _signUp,
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: AppSpacing.md),
          AuthErrorText(message: _errorMessage!),
        ],
        const SizedBox(height: AppSpacing.lg),
        LoadingButton(
          label: 'Create account',
          isLoading: _isLoading,
          onPressed: _signUp,
        ),
        const SizedBox(height: AppSpacing.sm),
        CupertinoButton(
          padding: EdgeInsets.zero,
          onPressed: _isLoading ? null : () => context.go('/sign-in'),
          child: Text('Already have an account? Sign in', style: linkStyle),
        ),
      ],
    );
  }
}
