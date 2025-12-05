# Google Sign-In Quick Setup for Mobile

## Current Status
✅ Code is ready for mobile Google Sign-In
⚠️ Needs configuration files and setup

## What I Fixed in the Code

1. **Enhanced Configuration**
   - Added platform-specific client ID support
   - Added iOS-specific configuration
   - Better error logging

2. **Improved Error Handling**
   - Detailed console logs for debugging
   - Better error messages for users
   - Multiple fallbacks for ID token retrieval

3. **Google Play Services Check**
   - Validates Google Play Services on Android
   - Shows update dialog if needed
   - Prevents crashes from missing services

## Quick Setup (5 Steps)

### Step 1: Get Your Client IDs

You need 3 client IDs from Firebase:

1. **Web Client ID** (you already have this in .env)
2. **iOS Client ID** (need to create iOS app in Firebase)
3. **Android Client ID** (need to create Android app in Firebase)

### Step 2: Create iOS App in Firebase

```
1. Go to Firebase Console → Project Settings
2. Click "Add app" → iOS
3. Bundle ID: com.yourcompany.healtmate
4. Download GoogleService-Info.plist
5. Place file in project root: healtmate/GoogleService-Info.plist
6. Copy the CLIENT_ID from the plist file
```

### Step 3: Create Android App in Firebase

```
1. Go to Firebase Console → Project Settings
2. Click "Add app" → Android
3. Package name: com.yourcompany.healtmate
4. Get SHA-1 fingerprint:
   
   Windows:
   keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
   
5. Paste SHA-1 in Firebase
6. Download google-services.json
7. Place file in project root: healtmate/google-services.json
```

### Step 4: Update .env File

Add these lines to your `.env` file:

```env
# Add these new lines (keep your existing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID)
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
```

### Step 5: Update app.json

Replace your current app.json with this:

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

## Build and Test

After setup, rebuild the app:

```bash
# Clear cache
npx expo start -c

# For iOS
npx expo run:ios

# For Android  
npx expo run:android
```

## Testing Checklist

### On Android:
- [ ] Google Play Services installed
- [ ] SHA-1 added to Firebase
- [ ] google-services.json in project root
- [ ] Package name matches Firebase
- [ ] Can tap "Sign in with Google"
- [ ] Google account picker appears
- [ ] Can select account
- [ ] Redirects to dashboard

### On iOS:
- [ ] GoogleService-Info.plist in project root
- [ ] Bundle ID matches Firebase
- [ ] Can tap "Sign in with Google"
- [ ] Google Sign-In screen appears
- [ ] Can enter credentials
- [ ] Redirects to dashboard

## Debug Logs

When you tap "Sign in with Google", check the console for:

```
✅ Success logs:
🔵 Starting Google Sign-In for android/ios
Configuring Google Sign-In for android/ios
✅ Google Sign-In configured successfully
Checking Google Play Services... (Android only)
✅ Google Play Services available (Android only)
Opening Google Sign-In dialog...
✅ Google Sign-In completed: { hasIdToken: true, user: 'email@gmail.com' }
Creating Firebase credential...
Signing in to Firebase...
✅ Firebase authentication successful: email@gmail.com

❌ Error logs (if something fails):
❌ Google Play Services error: [error details]
❌ No ID token received from Google Sign-In
❌ [Specific error message]
```

## Common Issues

### "Developer Error" (Android)
- SHA-1 fingerprint not added or incorrect
- Wait 5-10 minutes after adding SHA-1
- Package name doesn't match

### "Sign-in cancelled" (Error 12501)
- OAuth consent screen not configured
- App not added to test users
- Client ID mismatch

### "Google Play Services not available"
- Update Google Play Services on device
- Use device with Google Play (not emulator without Play)

## Files You Need

After setup, your project should have:
```
healtmate/
├── .env (with all 3 client IDs)
├── app.json (updated with Google plugin)
├── GoogleService-Info.plist (iOS)
├── google-services.json (Android)
└── services/authService.ts (already updated)
```

## What's Already Done

✅ authService.ts updated with mobile support
✅ Platform detection working
✅ Error handling improved
✅ Logging added for debugging
✅ Multiple ID token retrieval methods
✅ Google Play Services check

## What You Need to Do

1. Create iOS app in Firebase
2. Create Android app in Firebase
3. Download config files
4. Update .env with client IDs
5. Update app.json
6. Rebuild app

## Need Help?

If you get stuck:
1. Check console logs for specific errors
2. Verify all client IDs are correct
3. Ensure config files are in correct location
4. Try clearing cache: `npx expo start -c`
5. Rebuild from scratch: `npx expo run:android` or `npx expo run:ios`

The code is ready - just needs the Firebase configuration!
