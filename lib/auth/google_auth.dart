import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../firebase_options.dart';

const _webClientId =
    '673595653369-86g00eej8mgffkk0ek1fga1731ave0gm.apps.googleusercontent.com';

Future<void> initializeGoogleSignIn() async {
  if (kIsWeb || defaultTargetPlatform == TargetPlatform.windows) {
    return;
  }

  final options = DefaultFirebaseOptions.currentPlatform;
  await GoogleSignIn.instance.initialize(
    clientId: switch (defaultTargetPlatform) {
      TargetPlatform.iOS || TargetPlatform.macOS => options.iosClientId,
      _ => null,
    },
    serverClientId: _webClientId,
  );
}

Future<void> signInWithGoogle() async {
  if (kIsWeb || defaultTargetPlatform == TargetPlatform.windows) {
    await FirebaseAuth.instance.signInWithPopup(GoogleAuthProvider());
    return;
  }

  final googleUser = await GoogleSignIn.instance.authenticate();
  final googleAuth = googleUser.authentication;
  final credential = GoogleAuthProvider.credential(
    idToken: googleAuth.idToken,
  );
  await FirebaseAuth.instance.signInWithCredential(credential);
}

bool isGoogleSignInCancellation(Object error) {
  return error is GoogleSignInException &&
      error.code == GoogleSignInExceptionCode.canceled;
}
