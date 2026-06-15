import 'package:flutter/material.dart';

abstract final class AppDurations {
  static const Duration fast = Duration(milliseconds: 250);
  static const Duration normal = Duration(milliseconds: 350);
  static const Duration slow = Duration(milliseconds: 450);
  static const Curve curve = Curves.easeOutCubic;
}

Duration appDuration(BuildContext context, Duration normal) {
  return MediaQuery.disableAnimationsOf(context) ? Duration.zero : normal;
}
