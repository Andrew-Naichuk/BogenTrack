import 'score_entry.dart';

/// A set of arrows shot during a session (e.g. 3 or 6 arrows).
class TrainingSet {
  const TrainingSet({
    required this.id,
    required this.sessionId,
    required this.order,
    required this.scores,
    this.distanceMeters,
    this.targetFace,
  });

  final String id;
  final String sessionId;
  final int order;
  final List<ScoreEntry> scores;
  final double? distanceMeters;
  final String? targetFace;

  int get totalScore => scores.fold(0, (sum, entry) => sum + entry.value);
}
