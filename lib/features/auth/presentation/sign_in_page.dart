import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_spacing.dart';
import '../data/google_auth_service.dart';
import '../domain/auth_repository.dart';
import '../providers/auth_providers.dart';
import 'auth_error_message.dart';
import 'widgets/auth_divider.dart';
import 'widgets/auth_error_text.dart';
import 'widgets/auth_form_scaffold.dart';
import 'widgets/auth_prompt_link.dart';
import 'widgets/auth_social_button.dart';
import 'widgets/auth_text_field.dart';
import 'widgets/loading_button.dart';

class SignInPage extends ConsumerStatefulWidget {
  const SignInPage({super.key});

  @override
  ConsumerState<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends ConsumerState<SignInPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;
  String? _emailError;
  String? _passwordError;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  bool _validateFields() {
    final emailError = _emailController.text.trim().isEmpty
        ? 'Enter your email'
        : null;
    final passwordError =
        _passwordController.text.isEmpty ? 'Enter your password' : null;

    setState(() {
      _emailError = emailError;
      _passwordError = passwordError;
    });

    return emailError == null && passwordError == null;
  }

  Future<void> _signIn(AuthRepository repository) async {
    if (!_validateFields()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await repository.signInWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
    } on FirebaseAuthException catch (error) {
      setState(() => _errorMessage = authErrorMessage(error));
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _signInWithGoogle(AuthRepository repository) async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await repository.signInWithGoogle();
    } on FirebaseAuthException catch (error) {
      setState(() => _errorMessage = authErrorMessage(error));
    } catch (error) {
      if (!isGoogleSignInCancellation(error) && mounted) {
        setState(
          () => _errorMessage = 'Google sign-in failed. Please try again.',
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final repository = ref.watch(authRepositoryProvider);

    return AuthFormScaffold(
      heading: 'Welcome back',
      subtitle: 'Track your progress and master your form',
      children: [
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
          autofillHints: const [AutofillHints.password],
          errorText: _passwordError,
          onSubmitted: () => _signIn(repository),
        ),
        const SizedBox(height: AppSpacing.xs),
        Align(
          alignment: Alignment.centerRight,
          child: AuthTextLink(
            label: 'Forgot password?',
            enabled: !_isLoading,
            onPressed: () => context.push('/forgot-password'),
          ),
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: AppSpacing.md),
          AuthErrorText(message: _errorMessage!),
        ],
        const SizedBox(height: AppSpacing.xl),
        LoadingButton(
          label: 'Sign in',
          isLoading: _isLoading,
          onPressed: () => _signIn(repository),
        ),
        const SizedBox(height: AppSpacing.authCtaLinkGap),
        AuthPromptLink(
          prompt: "Don't have an account? ",
          actionLabel: 'Sign up',
          enabled: !_isLoading,
          onAction: () => context.push('/sign-up'),
        ),
        const SizedBox(height: AppSpacing.xxl),
        const AuthDivider(),
        const SizedBox(height: AppSpacing.xxl),
        AuthSocialButton(
          label: 'Continue with Google',
          icon: Image.asset(
            'assets/images/auth/google.png',
            width: 20,
            height: 20,
          ),
          onPressed: _isLoading ? null : () => _signInWithGoogle(repository),
        ),
      ],
    );
  }
}
