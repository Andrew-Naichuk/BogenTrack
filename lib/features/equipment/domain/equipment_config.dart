/// Bow, arrows, and sight configuration used during training.
class EquipmentConfig {
  const EquipmentConfig({
    required this.id,
    required this.userId,
    required this.name,
    this.bowType,
    this.drawWeight,
    this.arrowDetails,
    this.notes,
  });

  final String id;
  final String userId;
  final String name;
  final String? bowType;
  final double? drawWeight;
  final String? arrowDetails;
  final String? notes;
}
