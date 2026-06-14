import 'package:firebase_auth/firebase_auth.dart';

String authErrorMessage(FirebaseAuthException error) {
  return switch (error.code) {
    'invalid-email' => 'Enter a valid email address.',
    'user-disabled' => 'This account has been disabled.',
    'user-not-found' => 'No account found for that email.',
    'wrong-password' => 'Incorrect password.',
    'email-already-in-use' => 'An account already exists for that email.',
    'weak-password' => 'Choose a stronger password.',
    'too-many-requests' => 'Too many attempts. Try again later.',
    'network-request-failed' => 'Network error. Check your connection.',
    'account-exists-with-different-credential' =>
      'An account already exists with the same email using a different sign-in method.',
    'invalid-credential' => 'Sign-in failed. Please try again.',
    'popup-closed-by-user' => 'Sign-in was cancelled.',
    _ => 'Authentication failed. Please try again.',
  };
}
