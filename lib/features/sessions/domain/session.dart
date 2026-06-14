/// A training session (e.g. one visit to the range).
class Session {
  const Session({
    required this.id,
    required this.userId,
    required this.date,
    this.location,
    this.notes,
    this.equipmentConfigId,
  });

  final String id;
  final String userId;
  final DateTime date;
  final String? location;
  final String? notes;
  final String? equipmentConfigId;
}
