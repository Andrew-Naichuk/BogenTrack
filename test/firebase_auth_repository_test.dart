import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:bogen_track/features/auth/data/firebase_auth_repository.dart';
import 'package:bogen_track/features/auth/domain/app_user.dart';

class MockFirebaseAuth extends Mock implements FirebaseAuth {}

class MockUser extends Mock implements User {}

void main() {
  late MockFirebaseAuth auth;
  late FirebaseAuthRepository repository;

  setUp(() {
    auth = MockFirebaseAuth();
    repository = FirebaseAuthRepository(auth: auth);
  });

  test('maps Firebase user stream to AppUser', () async {
    final user = MockUser();
    when(() => user.uid).thenReturn('uid-1');
    when(() => user.email).thenReturn('archer@example.com');
    when(() => auth.authStateChanges()).thenAnswer(
      (_) => Stream<User?>.fromIterable([null, user]),
    );

    final values = await repository.authStateChanges.take(2).toList();

    expect(values, [
      null,
      const AppUser(id: 'uid-1', email: 'archer@example.com'),
    ]);
  });

  test('delegates sign out to FirebaseAuth', () async {
    when(() => auth.signOut()).thenAnswer((_) async {});

    await repository.signOut();

    verify(() => auth.signOut()).called(1);
  });
}
