# BogenTrack Design Language

Calm, editorial, content-first UI for an archery training tracker. The app should feel like **a quiet range to focus in** — composed, unhurried, warm. Restraint over density.

**Implementation:** theme tokens live in [`lib/core/theme/`](../lib/core/theme/). Shared widgets in [`lib/core/widgets/`](../lib/core/widgets/).

---

## Hard rules (non-negotiable)

1. **Identical on iOS and Android** — same fonts, colors, motion, and Cupertino widgets on both platforms.
2. **MaterialApp root** with `useMaterial3: true` for `ColorScheme`, `ThemeExtension`, and `TextTheme`.
3. **Cupertino interaction layer** — buttons, switches, pickers, sheets, segmented controls use Cupertino widgets on both platforms.
4. **Bundled fonts only** — `google_fonts` (Newsreader + Inter). Never rely on SF Pro / Roboto system fonts.
5. **No adaptive widgets** — never `Switch.adaptive`, `Slider.adaptive`, `showAdaptiveDialog`, or `Theme.of` platform branches.
6. **No Material ink ripple** — `NoSplash.splashFactory`; fade-on-press via `AppButton` or `CupertinoButton`.
7. **iOS-style motion everywhere** — `CupertinoPageTransitionsBuilder` for all platforms; `BouncingScrollPhysics` via `AppScrollBehavior`.
8. **Visual-only** — do not change scoring logic, domain models, or persistence in design passes.

---

## Decisions log

| Decision | Value |
|----------|-------|
| Primary accent | Dusk `#7E8BA3` — use sparingly, never large fills |
| X / 10 emphasis | Gold `#C7A86A` only |
| Default theme mode | Light (`ThemeMode.light`) |
| Display / headings font | Newsreader (serif) |
| UI / body font | Inter (sans) |
| Score numerals | Inter + `FontFeature.tabularFigures()` via `ScoreText` |
| `surfaceTintColor` | `Colors.transparent` on AppBar, Card, BottomSheet |

---

## Color tokens

### Light (paper)

| Token | Hex |
|-------|-----|
| `surfaceBase` | `#F6F2EA` |
| `surface` | `#FFFFFF` |
| `surfaceElevated` | `#FAF7F0` |
| `onSurface` | `#26242A` |
| `onSurfaceMuted` | `#5C5A55` |
| `onSurfaceFaint` | `#8A8780` |
| `borderSubtle` | `0x14000000` |
| `error` | `#B85C5C` |

### Dark

| Token | Hex |
|-------|-----|
| `surfaceBase` | `#16151A` |
| `surface` | `#211F26` |
| `surfaceElevated` | `#2A2830` |
| `onSurface` | `#ECEAE2` |
| `onSurfaceMuted` | `#A8A49C` |
| `onSurfaceFaint` | `#6E6A63` |
| `borderSubtle` | `0x0FFFFFFF` |
| `error` | `#C47272` |

Access via `AppColors.of(context)`. Prefer surface elevation over borders and shadows for separation. Never pure black or white.

---

## Typography scale

| Size | Role | Font |
|------|------|------|
| 52 | Hero display | Newsreader |
| 38 | Large display | Newsreader |
| 28 | Section display / large score | Newsreader or tabular Inter |
| 22 | Page heading | Newsreader |
| 20 | Title | Inter |
| 17 | Body | Inter, line-height ~1.6 |
| 15 | Labels, links | Inter |
| 13 | Captions, metadata | Inter, muted color |

**Score data** (arrow grid, running totals, averages): always tabular figures — use `ScoreText` or `Theme.of(context).textTheme.titleSmall`.

---

## Spacing

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64` — constants in `AppSpacing`.

- Screen padding: **24** (`AppSpacing.lg`)
- One primary idea per screen; generous outer padding even when inner grids are dense

---

## Radius

| Token | Value | Use |
|-------|-------|-----|
| `input` | 12 | Text fields |
| `button` | 13 | Buttons |
| `card` | 18 | Cards, panels |

---

## Motion

| Token | Value |
|-------|-------|
| Fast | 250ms |
| Normal | 350ms |
| Slow | 450ms |
| Curve | `Curves.easeOutCubic` |

Respect `MediaQuery.disableAnimationsOf(context)` — use `appDuration(context, …)`.

Score-entry feedback: subtle, not celebratory.

---

## Component catalog

| Widget | When to use |
|--------|-------------|
| `AppScaffold` | Every screen — nav bar, safe area, default padding |
| `AppCard` | Grouped content on elevated surface |
| `AppButton` | Primary (filled accent) and secondary (ghost) actions |
| `ScoreText` | **All** score, average, and total numerals |
| `SectionHeader` | Serif section title + optional muted subtitle |
| `ErrorStateView` | Boot / auth error states |

### Cupertino interactions (both platforms)

- Modals: `showCupertinoModalPopup`, `CupertinoActionSheet`
- Pickers: `CupertinoPicker` for score, distance, round
- Toggles: `CupertinoSwitch`
- Segmented choices: `CupertinoSlidingSegmentedControl`
- Style with `AppColors` — not default iOS blue

---

## Archery-specific surfaces

### Scorecard / end grid
- Calm neutral cells, tabular numerals, `borderSubtle` hairlines
- Ring values: subtle text/weight cues, not saturated cell fills
- X and 10: quiet `accentGold` emphasis

### Target face
- Authentic World Archery ring colors, desaturated ~10–15% toward warm neutral
- Calm surface background; arrow markers as small, precise, high-contrast dots

### Stats / trends
- Hero numbers in large serif; quiet sans labels beneath
- Charts: thin lines, muted accent, minimal or no gridlines

### Session history
- Editorial list — date in serif, generous row spacing

---

## Tone and microcopy

Calm, precise, unhurried. No hype, exclamation spam, or aggressive gamification.

German UI terms (when l10n ships): Passe (end), Pfeil (arrow), Ring, Runde (round), Auflage/Scheibe (target face), Training (session).

---

## Anti-patterns

- [ ] Inline `TextStyle(fontSize: …)` instead of `Theme.of(context).textTheme`
- [ ] `CupertinoColors.*` or hardcoded hex in widgets
- [ ] `Switch.adaptive`, `Slider.adaptive`, platform `if (Platform.is…)`
- [ ] `ColorScheme.fromSeed`
- [ ] Magic padding numbers instead of `AppSpacing`
- [ ] Material `ElevatedButton` / ink ripple
- [ ] System/default fonts
- [ ] Loud score celebration animations
- [ ] Dense full-screen spreadsheets without outer breathing room

When adding tokens or primitives, update this doc in the same PR.
