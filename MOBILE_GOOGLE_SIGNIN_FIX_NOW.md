# Fix Google Sign-In on Mobile - Action Required

## Current Issue

You're seeing this error on mobile:
```
"Google Sign-In is not available on this platform. Please use email/password authentication."
```

## Why This Happens

The `@react-native-google-signin/google-signin` package is installed, but it needs:
1. Firebase iOS/Android app configuration
2. Google Services files (plist/json)
3. App rebuild with native code

## Quick Fix (Choose One)

### Option 1: Use Email/Password (Works Now)
For immediate testing, use email/password authentication:
- Email: test@example.com
- Password: password123

### Option 2: Set Up Google Sign-In (30 minutes)

Follow these steps to enable Google Sign-In on mobile:

#### Step 1: Firebase Console Setup

**For Android:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click "Add app" → Android
4. Package name: `com.yourcompany.healtmate`
5. Get SHA-1 fingerprint:
   ```bash
   keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
   ```
6. Paste SHA-1 in Firebase
7. Download `google-services.json`
8. Place in project root: `healtmate/google-services.json`

**For iOS:**
1. In Firebase Console, click "Add app" → iOS
2. Bundle ID: `com.yourcompany.healtmate`
3. Download `GoogleService-Info.plist`
4. Place in project root: `healtmate/GoogleService-Info.plist`

#### Step 2: Update .env

Add these lines to your `.env` file:

```env
# Keep your existing web client ID
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-existing-web-id.apps.googleusercontent.com

# Add these new ones
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
```

Find the client IDs in:
- iOS: Inside `GoogleService-Info.plist` → `CLIENT_ID`
- Android: Auto-generated in Firebase Console

#### Step 3: Update app.json

Replace your `app.json` with this:

```json
{
  "expo": {
    "name": "healtmate",
    "slug": "healtmate",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "healtmate",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.healtmate",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "package": "com.yourcompany.healtmate",
      "googleServicesFile": "./google-services.json",
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "@react-native-google-signin/google-signin"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
```

#### Step 4: Rebuild App

After adding the files and updating configs:

```bash
# Clear cache
npx expo start -c

# Rebuild for Android
npx expo run:android

# Or rebuild for iOS
npx expo run:ios
```

## What I Fixed in the Code

✅ Better error detection
✅ Clearer error messages
✅ Detailed logging for debugging
✅ Proper module availability checking

## New Error Message

Now when Google Sign-In isn't configured, you'll see:
```
"Google Sign-In is not configured for mobile yet. Please:

1. Set up Firebase iOS/Android apps
2. Add GoogleService files
3. Rebuild the app

For now, please use email/password authentication."
```

## Debug Logs

Check your console for these logs:

**If module loads successfully:**
```
✅ Google Sign-In module loaded successfully
🔧 Configuring Google Sign-In for android
Using client ID: Found
✅ Google Sign-In configured successfully
```

**If module fails to load:**
```
❌ Failed to load Google Sign-In module: [error]
⚠️ Skipping Google Sign-In configuration: { available: false, ... }
```

## Testing

After setup, test by:
1. Tap "Continue with Google"
2. Should open Google account picker
3. Select account
4. Should redirect to dashboard

## Files Needed

After setup, you should have:
```
healtmate/
├── .env (with all 3 client IDs)
├── app.json (with Google plugin)
├── GoogleService-Info.plist (iOS)
├── google-services.json (Android)
└── services/authService.ts (✅ Already fixed)
```

## Still Having Issues?

1. Check console logs for specific errors
2. Verify all client IDs are correct
3. Ensure config files are in project root
4. Try clearing cache: `npx expo start -c`
5. Rebuild completely: `npx expo run:android`

## For Now

Use email/password authentication while you set up Google Sign-In:
- Works immediately
- No configuration needed
- Can switch to Google later

The app is fully functional with email/password authentication!
