import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/app_scaffold.dart';
import '../../../core/widgets/score_text.dart';
import 'demo_sessions.dart';

class SessionsListPage extends StatelessWidget {
  const SessionsListPage({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;

    return AppScaffold(
      title: 'Sessions',
      maxWidth: double.infinity,
      trailing: CupertinoButton(
        padding: EdgeInsets.zero,
        onPressed: () => context.push('/sessions/new'),
        child: Icon(CupertinoIcons.add, color: colors.accent),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.lg),
        itemCount: demoSessions.length,
        separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.lg),
        itemBuilder: (context, index) {
          final session = demoSessions[index];
          return GestureDetector(
            onTap: () => context.push('/sessions/${session.id}'),
            behavior: HitTestBehavior.opaque,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  formatSessionDate(session.date),
                  style: textTheme.displaySmall?.copyWith(fontSize: 22),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  session.location ?? 'Training session',
                  style: textTheme.bodyMedium?.copyWith(
                    color: colors.onSurfaceMuted,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Row(
                  children: [
                    ScoreText(
                      '284',
                      fontSize: 15,
                      color: colors.onSurfaceFaint,
                    ),
                    Text(
                      ' total · 4 sets',
                      style: textTheme.labelMedium,
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
