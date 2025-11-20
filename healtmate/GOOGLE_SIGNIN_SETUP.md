# Google Sign-In Setup Guide - TROUBLESHOOTING

## Current Issue: Google OAuth Not Working

### Quick Fixes to Try:

## 1. **Firebase Console Setup** (CRITICAL)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`healthmate-c2f60`)
3. Navigate to **Authentication** > **Sign-in method**
4. Click on **Google** provider
5. **ENABLE** Google Sign-In if not already enabled
6. **Add authorized domains**:
   - `localhost` (for web testing)
   - Your actual domain when deployed

## 2. **Web Client ID Verification**
Your current Web Client ID: `393640176006-u9ui5eclvcnig50murn4ltrdkjsvc3fk.apps.googleusercontent.com`

**Verify this is correct:**
1. Firebase Console > Project Settings > General
2. Scroll to "Your apps" section
3. Look for Web app configuration
4. Copy the **Web client ID** (not Android or iOS client ID)

## 3. **For Web Testing (localhost:8081)**
Add these domains to Firebase:
1. Firebase Console > Authentication > Settings > Authorized domains
2. Add: `localhost`
3. Add: `127.0.0.1`

## 4. **For Mobile Testing**
### Android:
1. Need `google-services.json` in `android/app/`
2. Need SHA-1 fingerprint added to Firebase
3. Get SHA-1 with: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`

### iOS:
1. Need `GoogleService-Info.plist` in iOS project
2. Need URL scheme in `Info.plist`

## 5. **Common Error Solutions**

### "DEVELOPER_ERROR"
- Wrong Web Client ID
- Missing SHA-1 fingerprint (Android)
- Wrong package name

### "Popup blocked" (Web)
- Browser blocking popups
- Need to allow popups for localhost

### "unauthorized_domain" (Web)
- Domain not added to Firebase authorized domains
- Add `localhost` to authorized domains

## 6. **Testing Steps**
1. **Web**: Test on `localhost:8081` with popup allowed
2. **Mobile**: Test on physical device (not simulator)
3. Check browser console for detailed errors
4. Check Firebase Console > Authentication > Users to see if sign-in attempts appear

## 7. **Debug Information**
Current configuration:
- Project ID: `healthmate-c2f60`
- Web Client ID: `393640176006-u9ui5eclvcnig50murn4ltrdkjsvc3fk.apps.googleusercontent.com`
- Auth Domain: `healthmate-c2f60.firebaseapp.com`

## 8. **Immediate Action Items**
1. ✅ Check if Google provider is ENABLED in Firebase Console
2. ✅ Add `localhost` to authorized domains
3. ✅ Verify Web Client ID is correct
4. ✅ Test on web with browser console open
5. ✅ For mobile: Add SHA-1 fingerprint to Firebase

## 9. **If Still Not Working**
Try this test:
1. Open browser console
2. Click Google Sign-In button
3. Check for error messages
4. Share the exact error message for further debugging

The implementation is correct - the issue is likely in Firebase configuration or domain authorization.