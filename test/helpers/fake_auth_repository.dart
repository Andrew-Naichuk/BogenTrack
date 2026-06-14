import 'dart:async';

import 'package:bogen_track/features/auth/domain/app_user.dart';
import 'package:bogen_track/features/auth/domain/auth_repository.dart';

class FakeAuthRepository implements AuthRepository {
  FakeAuthRepository({AppUser? user}) : _user = user;

  AppUser? _user;
  final _controller = StreamController<AppUser?>.broadcast();

  Object? signInError;
  int signInAttempts = 0;

  @override
  Stream<AppUser?> get authStateChanges => _controller.stream;

  void emitUser(AppUser? user) {
    _user = user;
    _controller.add(user);
  }

  @override
  Future<void> signInWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    signInAttempts++;
    if (signInError != null) {
      throw signInError!;
    }
    emitUser(AppUser(id: 'test-user', email: email));
  }

  @override
  Future<void> signUpWithEmailAndPassword({
    required String email,
    required String password,
  }) async {}

  @override
  Future<void> signInWithGoogle() async {}

  @override
  Future<void> signOut() async {
    emitUser(null);
  }

  @override
  Future<void> sendPasswordResetEmail(String email) async {}

  Future<void> dispose() => _controller.close();
}
