import 'package:flutter/material.dart';

import 'auth/auth_gate.dart';

class BogenTrackApp extends StatelessWidget {
  const BogenTrackApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BogenTrack',
      theme: ThemeData(
        colorScheme: .fromSeed(seedColor: const Color(0xFF2E7D32)),
        useMaterial3: true,
      ),
      home: const AuthGate(),
    );
  }
}
