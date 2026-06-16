import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_spacing.dart';
import '../providers/auth_providers.dart';
import 'auth_error_message.dart';
import 'widgets/auth_error_text.dart';
import 'widgets/auth_form_scaffold.dart';
import 'widgets/auth_prompt_link.dart';
import 'widgets/auth_terms_footer.dart';
import 'widgets/auth_text_field.dart';
import 'widgets/loading_button.dart';

class SignUpPage extends ConsumerStatefulWidget {
  const SignUpPage({super.key});

  @override
  ConsumerState<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends ConsumerState<SignUpPage> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;
  String? _nameError;
  String? _emailError;
  String? _passwordError;
  String? _confirmPasswordError;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  bool _validateFields() {
    final nameError =
        _nameController.text.trim().isEmpty ? 'Enter your name' : null;
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
      _nameError = nameError;
      _emailError = emailError;
      _passwordError = passwordError;
      _confirmPasswordError = confirmPasswordError;
    });

    return nameError == null &&
        emailError == null &&
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
    return AuthFormScaffold(
      heading: 'Begin your journey',
      subtitle: 'Join a community of focused archers',
      children: [
        AuthTextField(
          controller: _nameController,
          placeholder: 'Your name',
          autofillHints: const [AutofillHints.name],
          errorText: _nameError,
        ),
        const SizedBox(height: AppSpacing.sm),
        AuthTextField(
          controller: _emailController,
          placeholder: 'Email address',
          keyboardType: TextInputType.emailAddress,
          autofillHints: const [AutofillHints.email],
          errorText: _emailError,
        ),
        const SizedBox(height: AppSpacing.sm),
        AuthTextField(
          controller: _passwordController,
          placeholder: 'Password',
          obscureText: true,
          showVisibilityToggle: true,
          autofillHints: const [AutofillHints.newPassword],
          errorText: _passwordError,
        ),
        const SizedBox(height: AppSpacing.sm),
        AuthTextField(
          controller: _confirmPasswordController,
          placeholder: 'Confirm password',
          obscureText: true,
          showVisibilityToggle: true,
          autofillHints: const [AutofillHints.newPassword],
          errorText: _confirmPasswordError,
          onSubmitted: _signUp,
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: AppSpacing.md),
          AuthErrorText(message: _errorMessage!),
        ],
        const SizedBox(height: AppSpacing.xl),
        LoadingButton(
          label: 'Create account',
          isLoading: _isLoading,
          onPressed: _signUp,
        ),
        const SizedBox(height: AppSpacing.authCtaLinkGap),
        AuthPromptLink(
          prompt: 'Already have an account? ',
          actionLabel: 'Sign in',
          enabled: !_isLoading,
          onAction: () => context.go('/sign-in'),
        ),
        const SizedBox(height: AppSpacing.xxl),
        const AuthTermsFooter(),
      ],
    );
  }
}
