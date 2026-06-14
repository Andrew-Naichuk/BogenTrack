# BogenTrack
Mobile-first app for archery trainings results tracking and note keeping.
Aimed, first of all, on casual archers, providing minimalistic and clean experience to the point.

## Development

This is a [Flutter](https://flutter.dev/) project.

### Prerequisites

- Flutter SDK (tested with Flutter 3.44+)
- For Android: Android Studio / Android SDK
- For iOS: Xcode (macOS only)
- For Windows desktop: Visual Studio with C++ desktop development workload

### Getting started

```bash
flutter pub get
flutter run
```

Run on a specific platform:

```bash
flutter run -d windows
flutter run -d chrome
flutter run -d android
```

### Project layout

- `lib/` — Dart application code
- `lib/features/` — feature modules (auth, sessions, equipment, notes)
- `docs/ARCHITECTURE.md` — domain models and persistence plan
- `lib/firebase_options.dart` — Firebase platform configuration (generated)
- `android/`, `ios/`, `web/`, `windows/`, `linux/`, `macos/` — platform runners
- `test/` — widget and unit tests

### Firebase

Connected to the **bogentrack** Firebase project. The app initializes Firebase on startup via `firebase_core` and uses **Firebase Auth** with email/password and Google sign-in.

**Sign-in methods** (Firebase Console → Authentication → Sign-in method): Email/Password and Google should both be enabled.

For **Android** Google sign-in, add your debug/release SHA-1 fingerprints in Firebase project settings.

**CLI setup** (one-time):

```bash
npm install -g firebase-tools
firebase login
dart pub global activate flutterfire_cli
flutterfire configure --project=bogentrack
```

On Windows, ensure these are on your `PATH`:

- Flutter SDK `bin` (for `dart` / `flutter`)
- `%LOCALAPPDATA%\Pub\Cache\bin` (for `flutterfire`)

Re-run `flutterfire configure` after adding platforms or changing bundle IDs.

**Bundle IDs** (registered separately in Firebase per platform):

| Platform | Bundle / package ID |
|----------|---------------------|
| Android  | `uk.naich.bogen_track` |
| iOS/macOS | `uk.naich.bogenTrack` |

**Android release signing:** copy `android/key.properties.example` to `android/key.properties`, create a keystore, and fill in the values. Release builds are unsigned until `key.properties` exists.

### Quality checks

```bash
flutter analyze
flutter test
```

## License
<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://bogentrack.app">BogenTrack</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://naich.uk">Andrii Naichuk</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-SA 4.0</a></p>
