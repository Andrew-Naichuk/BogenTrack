import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../theme/app_scroll_behavior.dart';
import '../theme/app_theme.dart';

/// Wraps a widget in [MaterialApp] with the BogenTrack theme for widget tests.
Widget testApp({
  Widget? child,
  GoRouter? router,
  List<Override> overrides = const [],
}) {
  assert(router != null || child != null);

  if (router != null) {
    return ProviderScope(
      overrides: overrides,
      child: MaterialApp.router(
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        themeMode: ThemeMode.light,
        scrollBehavior: const AppScrollBehavior(),
        builder: (context, appChild) => CupertinoTheme(
          data: AppTheme.cupertino(context),
          child: appChild!,
        ),
        routerConfig: router,
      ),
    );
  }

  return ProviderScope(
    overrides: overrides,
    child: MaterialApp(
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.light,
      scrollBehavior: const AppScrollBehavior(),
      builder: (context, appChild) => CupertinoTheme(
        data: AppTheme.cupertino(context),
        child: appChild!,
      ),
      home: child,
    ),
  );
}
