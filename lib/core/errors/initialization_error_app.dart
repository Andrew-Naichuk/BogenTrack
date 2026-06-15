import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../theme/app_scroll_behavior.dart';
import '../theme/app_theme.dart';
import '../widgets/error_state_view.dart';

class InitializationErrorApp extends StatelessWidget {
  const InitializationErrorApp({super.key, required this.error});

  final Object error;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BogenTrack',
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.light,
      scrollBehavior: const AppScrollBehavior(),
      builder: (context, child) => CupertinoTheme(
        data: AppTheme.cupertino(context),
        child: child!,
      ),
      home: ErrorStateView(
        title: 'Failed to start BogenTrack',
        message: '$error',
        hint:
            'Check your Firebase configuration and network connection, '
            'then restart the app.',
      ),
    );
  }
}
