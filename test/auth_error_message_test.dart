import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:bogen_track/features/auth/presentation/auth_error_message.dart';

void main() {
  group('authErrorMessage', () {
    test('maps known Firebase error codes', () {
      expect(
        authErrorMessage(_exception('invalid-email')),
        'Enter a valid email address.',
      );
      expect(
        authErrorMessage(_exception('user-not-found')),
        'No account found for that email.',
      );
      expect(
        authErrorMessage(_exception('wrong-password')),
        'Incorrect password.',
      );
      expect(
        authErrorMessage(_exception('email-already-in-use')),
        'An account already exists for that email.',
      );
      expect(
        authErrorMessage(_exception('network-request-failed')),
        'Network error. Check your connection.',
      );
    });

    test('returns fallback for unknown codes', () {
      expect(
        authErrorMessage(_exception('some-unknown-code')),
        'Authentication failed. Please try again.',
      );
    });
  });
}

FirebaseAuthException _exception(String code) {
  return FirebaseAuthException(code: code, message: 'test');
}
