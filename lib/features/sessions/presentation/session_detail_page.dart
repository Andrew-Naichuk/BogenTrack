import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_scaffold.dart';
import '../../../core/widgets/score_text.dart';
import '../../../core/widgets/section_header.dart';
import '../domain/session.dart';
import 'demo_sessions.dart';

class SessionDetailPage extends StatelessWidget {
  const SessionDetailPage({
    super.key,
    this.sessionId,
    this.isNew = false,
  });

  final String? sessionId;
  final bool isNew;

  Session _resolveSession() {
    if (isNew) {
      return Session(
        id: 'new-session',
        userId: 'demo',
        date: DateTime.now(),
      );
    }
    return findDemoSession(sessionId!) ?? demoSessions.first;
  }

  @override
  Widget build(BuildContext context) {
    final session = _resolveSession();
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;
    final effectiveId = isNew ? 'new-session' : session.id;

    return AppScaffold(
      title: isNew ? 'New session' : 'Session',
      maxWidth: double.infinity,
      scrollable: true,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SectionHeader(
            title: isNew ? 'Today' : formatSessionDate(session.date),
            subtitle: session.location ?? 'Add location when saving',
          ),
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Session average', style: textTheme.labelMedium),
                const SizedBox(height: AppSpacing.xs),
                Text('71', style: textTheme.displayMedium),
                const SizedBox(height: AppSpacing.md),
                Text(
                  'Personal best this month',
                  style: textTheme.bodySmall,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          Text('Sets', style: textTheme.titleMedium),
          const SizedBox(height: AppSpacing.sm),
          AppCard(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.sm,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Set 1 · 18m', style: textTheme.bodyMedium),
                const ScoreText('58', fontSize: 17),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          AppCard(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.sm,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Set 2 · 18m', style: textTheme.bodyMedium),
                ScoreText(
                  '—',
                  fontSize: 17,
                  color: colors.onSurfaceFaint,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          AppButton(
            label: 'Add set',
            onPressed: () => context.push('/sessions/$effectiveId/scorecard'),
          ),
        ],
      ),
    );
  }
}
