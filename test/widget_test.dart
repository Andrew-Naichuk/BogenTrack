import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:bogen_track/home_page.dart';

void main() {
  testWidgets('shows BogenTrack home screen', (WidgetTester tester) async {
    final user = FakeUser(
      uid: 'test-user',
      email: 'archer@example.com',
    );

    await tester.pumpWidget(
      MaterialApp(home: HomePage(user: user)),
    );

    expect(find.text('BogenTrack'), findsOneWidget);
    expect(
      find.text('Track your archery training results and notes.'),
      findsOneWidget,
    );
    expect(find.text('Signed in as archer@example.com'), findsOneWidget);
  });
}

class FakeUser implements User {
  FakeUser({required this.uid, this.email});

  @override
  final String uid;

  @override
  final String? email;

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}
