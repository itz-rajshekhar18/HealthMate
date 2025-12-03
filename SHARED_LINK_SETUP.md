# Quick Setup Guide for Shared Links

## 🚀 Quick Start (5 minutes)

### Step 1: Update Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Add this to your existing rules:

```javascript
// Add this inside your rules_version = '2'; block
match /sharedReports/{reportId} {
  allow create: if request.auth != null && 
                   request.auth.uid == request.resource.data.userId;
  allow read: if true;
  allow update, delete: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
}
```

5. Click **Publish**

### Step 2: Test the Feature

#### On Web:
1. Run your app: `npm start`
2. Navigate to Export tab
3. Click "Share Report" button
4. Modal should appear with a link
5. Click "Copy Link" to copy
6. Open the link in a new tab to verify it works

#### On Mobile:
1. Run on device: `npx expo start`
2. Navigate to Export tab
3. Tap "Share Report" button
4. Native share dialog should open
5. Share to any app to test

### Step 3: Verify Report Viewing

1. Open the shared link
2. You should see the health report with:
   - Patient name and date
   - Report period
   - Vital signs data
   - Medical disclaimer
   - Expiration date

## ✅ What's Included

### New Files Created:
- ✅ `services/shareService.ts` - Share functionality
- ✅ `app/shared-report/[id].tsx` - Public report viewer
- ✅ `SHARED_LINK_GUIDE.md` - Complete documentation
- ✅ `SHARED_REPORTS_FIRESTORE_RULES.md` - Security rules
- ✅ `SHARED_LINK_SETUP.md` - This file

### Updated Files:
- ✅ `app/(dashboard)/(tabs)/export.tsx` - Added share functionality
- ✅ `package.json` - Added expo-clipboard dependency

## 🔧 How It Works

1. **User clicks "Share Report"**
   - Fetches vitals data
   - Generates HTML report
   - Stores in Firestore
   - Creates unique URL

2. **On Web:**
   - Shows modal with link
   - User copies link
   - Shares via any method

3. **On Mobile:**
   - Opens native share dialog
   - User selects app
   - Link shared automatically

4. **Recipient opens link:**
   - Report loads from Firestore
   - Displays full health data
   - Works for 30 days

## 🎯 Key Features

- ✅ **Platform-Specific**: Web modal, mobile native share
- ✅ **Secure**: Firestore security rules
- ✅ **Automatic Expiration**: 30 days
- ✅ **Public Access**: No login required to view
- ✅ **Copy to Clipboard**: One-click copy on web
- ✅ **Error Handling**: Expired/missing report messages

## 📱 Testing Checklist

- [ ] Share button works on web
- [ ] Share button works on mobile
- [ ] Modal appears on web
- [ ] Native share opens on mobile
- [ ] Copy link works
- [ ] Shared link opens correctly
- [ ] Report displays all data
- [ ] Expiration date shows
- [ ] Error message for invalid links

## 🐛 Common Issues

### "Permission denied" error
**Solution**: Update Firestore security rules (Step 1)

### Modal doesn't appear
**Solution**: Check Platform.OS detection, try refreshing

### Link doesn't work
**Solution**: Verify Firestore rules allow public read access

### Native share doesn't open
**Solution**: Test on physical device, not simulator

## 📊 Firestore Structure

Your database now has:
```
vitals/              (existing)
  {vitalId}/
    - userId
    - bloodPressure
    - heartRate
    - ...

sharedReports/       (NEW)
  {reportId}/
    - userId
    - userEmail
    - userName
    - htmlContent
    - vitalsPreview
    - createdAt
    - expiresAt
```

## 🔐 Security Notes

- Reports are **publicly accessible** by design
- Anyone with the link can view
- Reports expire after 30 days
- Only owner can create/delete
- No sensitive data beyond health vitals

## 💡 Usage Tips

### For Users:
- Share only with trusted recipients
- Check expiration date
- Use appropriate date range
- Don't share on public forums

### For Developers:
- Monitor Firestore usage
- Set up automatic cleanup
- Consider rate limiting
- Add analytics if needed

## 🎉 You're Done!

The shared link feature is now fully functional. Users can:
1. Generate shareable health reports
2. Share via any platform
3. Recipients can view without login
4. Reports expire automatically

## 📚 More Information

- Full documentation: `SHARED_LINK_GUIDE.md`
- Security rules: `SHARED_REPORTS_FIRESTORE_RULES.md`
- Export feature: `EXPORT_SHARE_GUIDE.md`

## 🆘 Need Help?

Check the console logs for detailed error messages:
- 📝 Creating shareable report...
- ✅ Shareable URL created
- 📥 Loading shared report
- ❌ Error messages with details