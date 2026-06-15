import 'package:flutter_test/flutter_test.dart';

import 'package:bogen_track/core/testing/test_app.dart';
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
      testApp(
        overrides: [
          authRepositoryProvider.overrideWithValue(repository),
          authStateChangesProvider.overrideWith(
            (ref) => Stream.value(
              const AppUser(id: 'test-user', email: 'archer@example.com'),
            ),
          ),
        ],
        child: const HomePage(),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('BogenTrack'), findsOneWidget);
    expect(find.text('Your range'), findsOneWidget);
    expect(find.text('Signed in as archer@example.com'), findsOneWidget);

    await repository.dispose();
  });
}
