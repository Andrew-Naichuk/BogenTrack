/// A single arrow score within a training set.
class ScoreEntry {
  const ScoreEntry({
    required this.arrowNumber,
    required this.value,
    this.label,
  });

  final int arrowNumber;
  final int value;
  final String? label;
}
