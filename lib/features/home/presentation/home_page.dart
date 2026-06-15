import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_scaffold.dart';
import '../../../core/widgets/section_header.dart';
import '../../auth/providers/auth_providers.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateChangesProvider);
    final user = authState.valueOrNull;
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;

    return AppScaffold(
      title: 'BogenTrack',
      maxWidth: double.infinity,
      trailing: CupertinoButton(
        padding: EdgeInsets.zero,
        onPressed: () => _signOut(context, ref),
        child: Icon(CupertinoIcons.square_arrow_right, color: colors.onSurface),
      ),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SectionHeader(
              title: 'Your range',
              subtitle: user == null
                  ? 'Loading account...'
                  : 'Signed in as ${user.displayName}',
            ),
            Text(
              'Track your archery training with calm focus.',
              style: textTheme.bodyLarge?.copyWith(color: colors.onSurfaceMuted),
            ),
            const SizedBox(height: AppSpacing.xl),
            AppButton(
              label: 'Training sessions',
              onPressed: () => context.push('/sessions'),
            ),
            const SizedBox(height: AppSpacing.sm),
            AppButton(
              label: 'New session',
              variant: AppButtonVariant.secondary,
              onPressed: () => context.push('/sessions/new'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _signOut(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(authRepositoryProvider).signOut();
    } catch (error) {
      if (!context.mounted) {
        return;
      }
      await showCupertinoDialog<void>(
        context: context,
        builder: (context) => CupertinoAlertDialog(
          title: const Text('Sign out failed'),
          content: Text('$error'),
          actions: [
            CupertinoDialogAction(
              isDefaultAction: true,
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        ),
      );
    }
  }
}
