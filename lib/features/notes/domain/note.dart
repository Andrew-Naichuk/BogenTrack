/// A free-form note attached to a session or general training log.
class Note {
  const Note({
    required this.id,
    required this.userId,
    required this.content,
    required this.createdAt,
    this.sessionId,
    this.updatedAt,
  });

  final String id;
  final String userId;
  final String content;
  final DateTime createdAt;
  final String? sessionId;
  final DateTime? updatedAt;
}
