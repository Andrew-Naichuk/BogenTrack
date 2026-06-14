import 'equipment_config.dart';

abstract class EquipmentRepository {
  Stream<List<EquipmentConfig>> watchConfigs(String userId);

  Future<void> saveConfig(EquipmentConfig config);

  Future<void> deleteConfig(String configId);
}
