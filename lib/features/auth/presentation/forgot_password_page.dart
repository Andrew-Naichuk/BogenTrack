import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_providers.dart';
import 'auth_error_message.dart';
import 'widgets/auth_error_text.dart';
import 'widgets/auth_form_scaffold.dart';
import 'widgets/loading_button.dart';

class ForgotPasswordPage extends ConsumerStatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  ConsumerState<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends ConsumerState<ForgotPasswordPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;
  bool _emailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _sendResetEmail() async {
    if (!_formKey.currentState!.validate()) {
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
    return AuthFormScaffold(
      title: 'Reset password',
      heading: 'Forgot your password?',
      formKey: _formKey,
      children: [
        Text(
          'Enter your email and we will send you a reset link.',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 24),
        TextFormField(
          controller: _emailController,
          keyboardType: TextInputType.emailAddress,
          autofillHints: const [AutofillHints.email],
          decoration: const InputDecoration(
            labelText: 'Email',
            border: OutlineInputBorder(),
          ),
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return 'Enter your email';
            }
            return null;
          },
          onFieldSubmitted: (_) => _sendResetEmail(),
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: 16),
          AuthErrorText(message: _errorMessage!),
        ],
        if (_emailSent) ...[
          const SizedBox(height: 16),
          Text(
            'Password reset email sent. Check your inbox.',
            style: TextStyle(color: Theme.of(context).colorScheme.primary),
          ),
        ],
        const SizedBox(height: 24),
        LoadingButton(
          label: 'Send reset email',
          isLoading: _isLoading,
          onPressed: _sendResetEmail,
        ),
        const SizedBox(height: 12),
        TextButton(
          onPressed: _isLoading ? null : () => context.go('/sign-in'),
          child: const Text('Back to sign in'),
        ),
      ],
    );
  }
}
