import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/score_text.dart';
import '../../domain/score_entry.dart';

class ScoreGrid extends StatelessWidget {
  const ScoreGrid({
    super.key,
    required this.scores,
    this.onCellTap,
    this.selectedArrow,
  });

  final List<ScoreEntry> scores;
  final void Function(int arrowNumber)? onCellTap;
  final int? selectedArrow;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;

    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surfaceElevated,
        border: Border.all(color: colors.borderSubtle, width: 0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.sm,
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text('Arrow', style: textTheme.labelMedium),
                ),
                Expanded(
                  child: Text(
                    'Score',
                    style: textTheme.labelMedium,
                    textAlign: TextAlign.end,
                  ),
                ),
              ],
            ),
          ),
          Divider(height: 0.5, color: colors.borderSubtle),
          ...scores.map((entry) {
            final isSelected = selectedArrow == entry.arrowNumber;
            final display = entry.label ?? '${entry.value}';
            final isHighlight = display == 'X' || entry.value == 10;

            return GestureDetector(
              onTap: onCellTap != null
                  ? () => onCellTap!(entry.arrowNumber)
                  : null,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: isSelected
                      ? colors.accent.withValues(alpha: 0.12)
                      : null,
                  border: Border(
                    bottom: BorderSide(color: colors.borderSubtle, width: 0.5),
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md,
                    vertical: AppSpacing.sm + 2,
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: ScoreText(
                          '${entry.arrowNumber}',
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                          color: colors.onSurfaceMuted,
                        ),
                      ),
                      Expanded(
                        child: ScoreText(
                          display,
                          fontSize: 17,
                          fontWeight: isHighlight ? FontWeight.w600 : FontWeight.w500,
                          color: isHighlight ? colors.accentGold : colors.onSurface,
                          textAlign: TextAlign.end,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
