import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../../core/theme/app_spacing.dart';

/// BogenTrack wordmark + target mark from Figma auth screens.
class AuthLogo extends StatelessWidget {
  const AuthLogo({super.key});

  static const _assetBase = 'assets/images/auth';

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: 128,
          height: 90,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Positioned(
                left: 28.33,
                top: 12.88,
                width: 24.63,
                height: 49.26,
                child: SvgPicture.asset('$_assetBase/ellipse7.svg'),
              ),
              Positioned(
                left: 35.9,
                top: 20.46,
                width: 17.05,
                height: 34.11,
                child: SvgPicture.asset('$_assetBase/ellipse8.svg'),
              ),
              Positioned(
                left: 45,
                top: 29.56,
                width: 7.96,
                height: 15.92,
                child: SvgPicture.asset('$_assetBase/ellipse9.svg'),
              ),
              Positioned(
                left: 60.92,
                top: 12.88,
                width: 37.89,
                height: 49.26,
                child: SvgPicture.asset('$_assetBase/b.svg'),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          'BOGENTRACK',
          style: textTheme.labelLarge?.copyWith(
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
      ],
    );
  }
}
