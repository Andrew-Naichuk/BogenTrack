import 'package:flutter_test/flutter_test.dart';

import 'package:bogen_track/main.dart';

void main() {
  testWidgets('shows BogenTrack home screen', (WidgetTester tester) async {
    await tester.pumpWidget(const BogenTrackApp());

    expect(find.text('BogenTrack'), findsOneWidget);
    expect(
      find.text('Track your archery training results and notes.'),
      findsOneWidget,
    );
  });
}
