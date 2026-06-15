import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/theme/app_colors.dart';
import 'core/theme/app_scroll_behavior.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/providers/auth_providers.dart';
import 'router/app_router.dart';

class BogenTrackApp extends ConsumerWidget {
  const BogenTrackApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateChangesProvider);
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'BogenTrack',
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.light,
      scrollBehavior: const AppScrollBehavior(),
      builder: (context, child) {
        Widget content = CupertinoTheme(
          data: AppTheme.cupertino(context),
          child: child!,
        );

        if (authState.isLoading) {
          final colors = AppColors.of(context);
          content = Stack(
            children: [
              content,
              Positioned.fill(
                child: ColoredBox(
                  color: colors.surfaceBase.withValues(alpha: 0.85),
                  child: const Center(child: CupertinoActivityIndicator()),
                ),
              ),
            ],
          );
        }

        return content;
      },
      routerConfig: router,
    );
  }
}
