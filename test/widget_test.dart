import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:bogen_track/features/auth/domain/app_user.dart';
import 'package:bogen_track/features/auth/providers/auth_providers.dart';
import 'package:bogen_track/features/home/presentation/home_page.dart';
import 'helpers/fake_auth_repository.dart';

void main() {
  testWidgets('shows BogenTrack home screen', (WidgetTester tester) async {
    final repository = FakeAuthRepository(
      user: const AppUser(id: 'test-user', email: 'archer@example.com'),
    );
    repository.emitUser(const AppUser(id: 'test-user', email: 'archer@example.com'));

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          authRepositoryProvider.overrideWithValue(repository),
          authStateChangesProvider.overrideWith(
            (ref) => Stream.value(
              const AppUser(id: 'test-user', email: 'archer@example.com'),
            ),
          ),
        ],
        child: const MaterialApp(home: HomePage()),
      ),
    );

    expect(find.text('BogenTrack'), findsOneWidget);
    expect(
      find.text('Track your archery training results and notes.'),
      findsOneWidget,
    );
    expect(find.text('Signed in as archer@example.com'), findsOneWidget);

    await repository.dispose();
  });
}
