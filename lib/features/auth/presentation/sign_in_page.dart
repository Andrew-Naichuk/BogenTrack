import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/app_button.dart';
import '../data/google_auth_service.dart';
import '../domain/auth_repository.dart';
import '../providers/auth_providers.dart';
import 'auth_error_message.dart';
import 'widgets/auth_error_text.dart';
import 'widgets/auth_form_scaffold.dart';
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
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;
    final linkStyle = textTheme.labelLarge?.copyWith(color: colors.accent);

    return AuthFormScaffold(
      title: 'Sign in',
      heading: 'Welcome back',
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
          autofillHints: const [AutofillHints.password],
          errorText: _passwordError,
          onSubmitted: () => _signIn(repository),
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: AppSpacing.md),
          AuthErrorText(message: _errorMessage!),
        ],
        const SizedBox(height: AppSpacing.lg),
        LoadingButton(
          label: 'Sign in',
          isLoading: _isLoading,
          onPressed: () => _signIn(repository),
        ),
        const SizedBox(height: AppSpacing.lg),
        Row(
          children: [
            Expanded(
              child: Container(height: 0.5, color: colors.borderSubtle),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: Text('or', style: textTheme.labelMedium),
            ),
            Expanded(
              child: Container(height: 0.5, color: colors.borderSubtle),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.lg),
        AppButton(
          label: 'Continue with Google',
          variant: AppButtonVariant.secondary,
          isLoading: false,
          onPressed: _isLoading ? null : () => _signInWithGoogle(repository),
        ),
        const SizedBox(height: AppSpacing.sm),
        CupertinoButton(
          padding: EdgeInsets.zero,
          onPressed: _isLoading ? null : () => context.push('/forgot-password'),
          child: Text('Forgot password?', style: linkStyle),
        ),
        CupertinoButton(
          padding: EdgeInsets.zero,
          onPressed: _isLoading ? null : () => context.push('/sign-up'),
          child: Text('Create an account', style: linkStyle),
        ),
      ],
    );
  }
}
