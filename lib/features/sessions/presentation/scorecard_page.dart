import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_scaffold.dart';
import '../../../core/widgets/score_text.dart';
import '../../../core/widgets/section_header.dart';
import '../domain/score_entry.dart';
import '../domain/training_set.dart';
import 'widgets/score_grid.dart';

/// Score entry for a training set. Uses local state until persistence is wired.
class ScorecardPage extends StatefulWidget {
  const ScorecardPage({super.key, required this.sessionId});

  final String sessionId;

  @override
  State<ScorecardPage> createState() => _ScorecardPageState();
}

class _ScorecardPageState extends State<ScorecardPage> {
  static const _scoreOptions = [
    'M',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'X',
  ];

  final List<ScoreEntry> _scores = List.generate(
    6,
    (index) => ScoreEntry(arrowNumber: index + 1, value: 0, label: '—'),
  );

  int _selectedArrow = 1;
  int _pickerIndex = 0;
  int _distanceIndex = 2;

  static const _distances = [18.0, 30.0, 50.0, 70.0, 90.0];

  void _applyScore(String label) {
    setState(() {
      final index = _selectedArrow - 1;
      final value = switch (label) {
        'M' => 0,
        'X' => 10,
        _ => int.tryParse(label) ?? 0,
      };
      _scores[index] = ScoreEntry(
        arrowNumber: _selectedArrow,
        value: value,
        label: label == '0' ? '—' : label,
      );
      if (_selectedArrow < _scores.length) {
        _selectedArrow++;
        _pickerIndex = 0;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final textTheme = Theme.of(context).textTheme;
    final set = TrainingSet(
      id: 'demo-set',
      sessionId: widget.sessionId,
      order: 1,
      scores: _scores,
      distanceMeters: _distances[_distanceIndex],
    );

    return AppScaffold(
      title: 'Scorecard',
      maxWidth: double.infinity,
      scrollable: true,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Set total', style: textTheme.labelMedium),
                    Text('${set.totalScore}', style: textTheme.displayMedium),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('Distance', style: textTheme.labelMedium),
                  SizedBox(
                    height: 100,
                    width: 80,
                    child: CupertinoPicker(
                      scrollController: FixedExtentScrollController(
                        initialItem: _distanceIndex,
                      ),
                      itemExtent: 32,
                      onSelectedItemChanged: (index) {
                        setState(() => _distanceIndex = index);
                      },
                      children: _distances
                          .map(
                            (d) => Center(
                              child: ScoreText(
                                '${d.toInt()}m',
                                fontSize: 15,
                              ),
                            ),
                          )
                          .toList(),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          SectionHeader(
            title: 'End ${_scores.length} arrows',
            subtitle: 'Tap a row, then pick a score',
          ),
          ScoreGrid(
            scores: _scores,
            selectedArrow: _selectedArrow,
            onCellTap: (arrow) {
              setState(() => _selectedArrow = arrow);
            },
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            'Arrow $_selectedArrow',
            style: textTheme.titleMedium,
            textAlign: TextAlign.center,
          ),
          SizedBox(
            height: 160,
            child: CupertinoPicker(
              scrollController: FixedExtentScrollController(
                initialItem: _pickerIndex,
              ),
              itemExtent: 40,
              onSelectedItemChanged: (index) => _pickerIndex = index,
              children: _scoreOptions
                  .map(
                    (s) => Center(
                      child: ScoreText(
                        s,
                        fontSize: 22,
                        fontWeight: s == 'X' || s == '10'
                            ? FontWeight.w600
                            : FontWeight.w500,
                        color: s == 'X' || s == '10'
                            ? colors.accentGold
                            : colors.onSurface,
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
          AppButton(
            label: 'Record score',
            onPressed: () => _applyScore(_scoreOptions[_pickerIndex]),
          ),
          const SizedBox(height: AppSpacing.sm),
          AppButton(
            label: 'Done',
            variant: AppButtonVariant.secondary,
            onPressed: () => context.pop(),
          ),
        ],
      ),
    );
  }
}
