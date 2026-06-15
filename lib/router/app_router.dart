import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/widgets/error_state_view.dart';
import '../features/auth/presentation/forgot_password_page.dart';
import '../features/auth/presentation/sign_in_page.dart';
import '../features/auth/presentation/sign_up_page.dart';
import '../features/auth/providers/auth_providers.dart';
import '../features/home/presentation/home_page.dart';
import '../features/sessions/presentation/scorecard_page.dart';
import '../features/sessions/presentation/session_detail_page.dart';
import '../features/sessions/presentation/sessions_list_page.dart';
import 'go_router_refresh_stream.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateChangesProvider);
  final authRepository = ref.watch(authRepositoryProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    refreshListenable: GoRouterRefreshStream(authRepository.authStateChanges),
    redirect: (context, state) {
      if (authState.isLoading) {
        return null;
      }

      if (authState.hasError) {
        return state.matchedLocation == '/auth-error' ? null : '/auth-error';
      }

      final isLoggedIn = authState.valueOrNull != null;
      final location = state.matchedLocation;
      final isAuthRoute = location == '/sign-in' ||
          location == '/sign-up' ||
          location == '/forgot-password';

      if (!isLoggedIn && !isAuthRoute) {
        return '/sign-in';
      }

      if (isLoggedIn && isAuthRoute) {
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        path: '/sign-in',
        builder: (context, state) => const SignInPage(),
      ),
      GoRoute(
        path: '/sign-up',
        builder: (context, state) => const SignUpPage(),
      ),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) => const ForgotPasswordPage(),
      ),
      GoRoute(
        path: '/auth-error',
        builder: (context, state) => const AuthErrorPage(),
      ),
      GoRoute(
        path: '/sessions',
        builder: (context, state) => const SessionsListPage(),
      ),
      GoRoute(
        path: '/sessions/new',
        builder: (context, state) => const SessionDetailPage(isNew: true),
      ),
      GoRoute(
        path: '/sessions/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return SessionDetailPage(sessionId: id);
        },
        routes: [
          GoRoute(
            path: 'scorecard',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return ScorecardPage(sessionId: id);
            },
          ),
        ],
      ),
    ],
  );
});

class AuthErrorPage extends ConsumerWidget {
  const AuthErrorPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final error =
        ref.watch(authStateChangesProvider).error ??
        'Unknown authentication error';

    return ErrorStateView(
      title: 'Authentication error',
      message: '$error',
      actionLabel: 'Back to sign in',
      onAction: () => context.go('/sign-in'),
    );
  }
}
