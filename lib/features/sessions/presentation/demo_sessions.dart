import '../domain/session.dart';

/// Placeholder data until [SessionRepository] is implemented.
final demoSessions = [
  Session(
    id: 'session-1',
    userId: 'demo',
    date: DateTime(2026, 6, 10),
    location: 'Indoor range',
  ),
  Session(
    id: 'session-2',
    userId: 'demo',
    date: DateTime(2026, 6, 8),
    location: 'Outdoor field',
  ),
  Session(
    id: 'session-3',
    userId: 'demo',
    date: DateTime(2026, 6, 3),
    location: 'Club practice',
  ),
];

String formatSessionDate(DateTime date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return '${months[date.month - 1]} ${date.day}, ${date.year}';
}

Session? findDemoSession(String id) {
  for (final session in demoSessions) {
    if (session.id == id) {
      return session;
    }
  }
  return null;
}
