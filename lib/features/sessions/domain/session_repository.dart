import '../domain/session.dart';
import '../domain/training_set.dart';

/// Persistence contract for archery training data.
abstract class SessionRepository {
  Stream<List<Session>> watchSessions(String userId);

  Future<Session?> getSession(String sessionId);

  Future<void> saveSession(Session session);

  Future<void> deleteSession(String sessionId);

  Stream<List<TrainingSet>> watchSets(String sessionId);

  Future<void> saveSet(TrainingSet trainingSet);

  Future<void> deleteSet(String setId);
}
