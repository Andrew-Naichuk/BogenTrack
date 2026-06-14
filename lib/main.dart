import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app.dart';
import 'core/errors/initialization_error_app.dart';
import 'features/auth/data/google_auth_service.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  Object? initError;
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    await initializeGoogleSignIn();
  } catch (error) {
    initError = error;
  }

  runApp(
    ProviderScope(
      child: initError == null
          ? const BogenTrackApp()
          : InitializationErrorApp(error: initError),
    ),
  );
}
