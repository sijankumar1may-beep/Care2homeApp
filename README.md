# Care2Home

A cross-platform mobile app for booking **travel care companion services** for elderly parents in the Delhi NCR region. Care2Home helps families arrange safe pickup and drop-off at railway stations, airports, and bus interchanges — with verified companions, live journey updates, and 24/7 support.

Built with **Expo**, **React Native**, and **Firebase**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Firebase Setup](#firebase-setup)
- [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [App Navigation](#app-navigation)
- [Data & Firebase Collections](#data--firebase-collections)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## Features

| Area | Description |
|------|-------------|
| **Authentication** | Phone number OTP login via Firebase Auth (India +91 by default) |
| **Home** | Service overview, trust highlights, and quick booking / WhatsApp contact |
| **Pricing** | Distance-based pricing for Auto and Car vehicles |
| **Service Locations** | Stations, airports, and bus interchanges served in Delhi NCR |
| **Book Service** | Upload travel ticket, enter parent details, auto-detect address via GPS |
| **My Bookings** | View active, upcoming, and completed orders from Firestore |
| **Profile** | View and edit user profile |
| **Drawer Menu** | Quick access to bookings, profile, about, contact, and logout |
| **Support** | In-app call and WhatsApp integration |

---

## Tech Stack

- **Framework:** [Expo SDK 54](https://docs.expo.dev/) + [React Native 0.81](https://reactnative.dev/)
- **Language:** TypeScript
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (file-based)
- **UI:** React Native Paper, Expo Vector Icons
- **Backend:** Firebase
  - Authentication (Phone OTP)
  - Cloud Firestore
  - Cloud Storage
  - Crashlytics
  - Cloud Messaging
- **Native modules:** `expo-location`, `expo-image-picker`, `expo-dev-client`
- **Build & deploy:** [EAS Build](https://docs.expo.dev/build/introduction/)

> **Note:** This app uses `@react-native-firebase` native modules. It **cannot run in Expo Go** — you need a [development build](#running-the-app).

---

## Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | 18+ (LTS recommended) | JavaScript runtime |
| npm or yarn | Latest | Package manager |
| [Android Studio](https://developer.android.com/studio) | Latest | Android emulator & SDK (required for local Android builds) |
| [Expo CLI / EAS CLI](https://docs.expo.dev/eas/) | Included in project | Builds and deployment |
| Firebase project | — | Auth, Firestore, Storage |
| Physical Android device or emulator | — | Testing (phone OTP works best on a real device) |

For iOS development you will also need a Mac with Xcode. The `ios/` folder is generated on first prebuild.

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Care2homeApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Place your Firebase Android config file at the project root:

```
Care2homeApp/
└── google-services.json   ← required
```

The file is referenced in `app.json` under `android.googleServicesFile`. The Android package name must match:

```
com.care2home
```

See [Firebase Setup](#firebase-setup) for full configuration steps.

### 4. Start developing

```bash
npm start
```

Then run on a device or emulator — see [Running the App](#running-the-app).

---

## Firebase Setup

Create a project in the [Firebase Console](https://console.firebase.google.com/) and enable the following services.

### Authentication

1. Go to **Authentication → Sign-in method**
2. Enable **Phone** provider
3. Add your test phone numbers under **Phone numbers for testing** during development (avoids SMS quota limits)

### Cloud Firestore

1. Go to **Firestore Database** and create a database
2. The app writes to an `Orders` collection when users book a service
3. Set appropriate security rules for production (example starter rules below)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Cloud Storage

1. Go to **Storage** and enable it
2. Ticket images are uploaded to `care2home/images/`
3. Example storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /care2home/images/{fileName} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Crashlytics & Messaging

These are configured via Expo plugins in `app.json`. No extra local setup is needed beyond having `google-services.json` in place.

### Android SHA fingerprints (required for Phone Auth)

For phone OTP to work on Android, add your app's SHA-1 and SHA-256 fingerprints in Firebase:

```bash
# Debug keystore (default for local development)
cd android
./gradlew signingReport
```

Copy the SHA-1 and SHA-256 from the debug variant and add them under **Project Settings → Your apps → Android app** in the Firebase Console.

---

## Running the App

Because this project uses native Firebase modules, you must use a **development build** rather than Expo Go.

### Option A — Run on Android (recommended for local dev)

With an emulator running or a device connected via USB:

```bash
npm run android
```

This compiles the native Android project and launches the app with the Expo dev client.

### Option B — Start Metro and open an existing dev build

If you already have a dev build installed:

```bash
npm start
```

Then press `a` for Android or scan the QR code with your dev build.

### Option C — Web (limited)

```bash
npm run web
```

> Web support is limited. Firebase native modules and phone auth are designed for mobile. Use Android/iOS for full functionality.

### Option D — EAS development build

For team members without Android Studio:

```bash
npx eas build --profile development --platform android
```

Install the resulting `.apk` on your device, then run `npm start` and connect to Metro.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo Metro bundler |
| `npm run android` | Build and run on Android emulator/device |
| `npm run ios` | Build and run on iOS simulator (macOS only) |
| `npm run web` | Start the app in a web browser |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Move starter code to `app-example/` and create a blank `app/` directory |

---

## Project Structure

```
Care2homeApp/
├── app/                          # Expo Router screens (file-based routing)
│   ├── _layout.tsx               # Root layout — AuthProvider + AuthGate
│   ├── (auth)/                   # Unauthenticated screens
│   │   ├── login.tsx             # Phone OTP login
│   │   ├── signup.tsx            # Sign up
│   │   └── resetpassword.tsx     # Password reset
│   ├── (drawer)/                 # Main app shell (drawer navigation)
│   │   ├── _layout.tsx           # Drawer layout
│   │   └── (tabs)/               # Bottom tab screens
│   │       ├── index.tsx         # Home
│   │       ├── pricing.tsx       # Pricing tiers
│   │       ├── servicelocations.tsx  # Service areas
│   │       └── bookservice.tsx   # Book a companion
│   ├── mybookings.tsx            # Order history
│   ├── profile.tsx               # User profile
│   ├── editprofile.tsx           # Edit profile
│   ├── about.tsx                 # About Care2Home
│   └── contact.tsx               # Contact form
├── auth/
│   └── AuthContext.tsx           # Firebase auth state provider
├── components/
│   ├── AuthGate.tsx              # Route guard (auth vs. public)
│   ├── customdrawercontent.tsx   # Side drawer menu
│   └── ...                       # Shared UI components
├── assets/images/                # App icons, splash, and images
├── android/                      # Native Android project (prebuild)
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build profiles
├── google-services.json          # Firebase Android config (not committed in some setups)
└── package.json
```

Path aliases are configured in `tsconfig.json` — use `@/` to import from the project root:

```typescript
import { AuthContext } from '@/auth/AuthContext';
```

---

## App Navigation

```
App Launch
    │
    ▼
AuthGate (checks Firebase auth state)
    │
    ├── Not logged in ──► (auth)/login  ──► Phone OTP verification
    │
    └── Logged in ──► (drawer)
                          │
                          └── (tabs)
                                ├── Home
                                ├── Pricing
                                ├── Service Locations
                                └── Book Service
                          │
                          ├── My Bookings
                          ├── Profile / Edit Profile
                          ├── About Us
                          ├── Contact Us
                          └── Logout
```

---

## Data & Firebase Collections

### `Orders` (Firestore)

Created when a user submits the Book Service form:

| Field | Type | Description |
|-------|------|-------------|
| `phone` | string | Parent's contact number |
| `email` | string | Optional email |
| `userAddress` | string | Pickup / drop-off address |
| `loggedUserId` | string | Authenticated user's phone number |
| `ImageUrl` | string | Download URL of uploaded ticket image |

### Storage

Ticket images are stored at:

```
care2home/images/ticket_<timestamp>.jpg
```

---

## Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/). Profiles are defined in `eas.json`:

| Profile | Use case |
|---------|----------|
| `development` | Dev client with hot reload |
| `preview` | Internal testing (APK/IPA) |
| `production` | Store release (auto-increments version) |

### Build commands

```bash
# Android production build
npx eas build --profile production --platform android

# Android preview (internal testing)
npx eas build --profile preview --platform android

# Submit to Google Play (after a production build)
npx eas submit --platform android
```

Make sure you are logged in to Expo (`npx eas login`) and that the EAS project ID in `app.json` matches your Expo account.

---

## Troubleshooting

### "Expo Go" doesn't work / native module errors

This app requires a development build. Run `npm run android` or install an EAS development build instead of using Expo Go.

### Phone OTP not received

- Confirm **Phone** auth is enabled in Firebase Console
- Add your SHA-1/SHA-256 fingerprints for the Android app
- Use Firebase **test phone numbers** during development
- Check you are on a real device (emulators may not receive SMS)

### `google-services.json` not found

Ensure the file exists at the project root and that `app.json` points to `./google-services.json`. After adding it, rebuild the native app:

```bash
npm run android
```

### Firestore permission denied

Review your Firestore security rules. During development you can use test mode, but switch to authenticated rules before production.

### Location / photo permissions

The Book Service screen requests location and photo library access. Grant permissions when prompted, or enable them manually in device Settings.

### Metro bundler cache issues

```bash
npx expo start --clear
```

---

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Firebase](https://rnfirebase.io/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

---

## License

Private project. All rights reserved.
