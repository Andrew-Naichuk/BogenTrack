import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:bogen_track/features/auth/presentation/sign_in_page.dart';
import 'package:bogen_track/features/auth/providers/auth_providers.dart';
import 'helpers/fake_auth_repository.dart';

void main() {
  testWidgets('shows validation errors when sign in is submitted empty', (
    WidgetTester tester,
  ) async {
    final repository = FakeAuthRepository();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          authRepositoryProvider.overrideWithValue(repository),
        ],
        child: MaterialApp.router(
          routerConfig: GoRouter(
            routes: [
              GoRoute(
                path: '/',
                builder: (context, state) => const SignInPage(),
              ),
            ],
          ),
        ),
      ),
    );

    await tester.tap(find.text('Sign in'));
    await tester.pumpAndSettle();

    expect(find.text('Enter your email'), findsOneWidget);
    expect(find.text('Enter your password'), findsOneWidget);
    expect(repository.signInAttempts, 0);

    await repository.dispose();
  });

  testWidgets('shows mapped Firebase error on failed sign in', (
    WidgetTester tester,
  ) async {
    final repository = FakeAuthRepository()
      ..signInError = FirebaseAuthException(
        code: 'user-not-found',
        message: 'test',
      );

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          authRepositoryProvider.overrideWithValue(repository),
        ],
        child: MaterialApp.router(
          routerConfig: GoRouter(
            routes: [
              GoRoute(
                path: '/',
                builder: (context, state) => const SignInPage(),
              ),
            ],
          ),
        ),
      ),
    );

    await tester.enterText(find.byType(TextFormField).at(0), 'archer@example.com');
    await tester.enterText(find.byType(TextFormField).at(1), 'password123');
    await tester.tap(find.text('Sign in'));
    await tester.pumpAndSettle();

    expect(find.text('No account found for that email.'), findsOneWidget);
    expect(repository.signInAttempts, 1);

    await repository.dispose();
  });
}
