import 'package:firebase_auth/firebase_auth.dart';

class AppUser {
  const AppUser({required this.id, this.email});

  final String id;
  final String? email;

  String get displayName => email ?? id;

  factory AppUser.fromFirebase(User user) {
    return AppUser(id: user.uid, email: user.email);
  }
}
