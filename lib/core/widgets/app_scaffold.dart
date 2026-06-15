import 'package:flutter/cupertino.dart';

import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

/// Standard screen shell: Cupertino nav bar, safe area, optional scroll + padding.
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    this.title,
    this.navigationBar,
    this.trailing,
    this.leading,
    required this.body,
    this.scrollable = false,
    this.padding,
    this.centerBody = false,
    this.maxWidth = AppSpacing.contentMaxWidth,
  });

  final String? title;
  final ObstructingPreferredSizeWidget? navigationBar;
  final Widget? trailing;
  final Widget? leading;
  final Widget body;
  final bool scrollable;
  final EdgeInsetsGeometry? padding;
  final bool centerBody;
  final double maxWidth;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final effectivePadding = padding ?? const EdgeInsets.all(AppSpacing.lg);

    ObstructingPreferredSizeWidget? navBar = navigationBar;
    if (navBar == null && title != null) {
      navBar = CupertinoNavigationBar(
        middle: Text(title!),
        leading: leading,
        trailing: trailing,
        backgroundColor: colors.surface,
        border: Border(bottom: BorderSide(color: colors.borderSubtle, width: 0.5)),
      );
    }

    Widget content = body;
    if (maxWidth < double.infinity) {
      content = Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: content,
        ),
      );
    }

    if (scrollable) {
      content = SingleChildScrollView(
        padding: effectivePadding,
        child: content,
      );
    } else if (padding != null) {
      content = Padding(padding: effectivePadding, child: content);
    }

    if (centerBody && !scrollable) {
      content = Center(child: content);
    }

    return CupertinoPageScaffold(
      backgroundColor: colors.surfaceBase,
      navigationBar: navBar,
      child: SafeArea(child: content),
    );
  }
}
