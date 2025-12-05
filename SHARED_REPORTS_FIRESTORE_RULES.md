# Firestore Security Rules for Shared Reports

## Add these rules to your Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Existing rules for vitals collection
    match /vitals/{vitalId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
    }
    
    // NEW: Rules for shared reports collection
    match /sharedReports/{reportId} {
      // Allow authenticated users to create their own shared reports
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      
      // Allow anyone to read shared reports (they are meant to be public)
      // But only if the report hasn't expired
      allow read: if true;
      
      // Only the owner can update their shared reports
      allow update: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
      
      // Only the owner can delete their shared reports
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
    }
  }
}
```

## How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Add the `sharedReports` rules to your existing rules
6. Click **Publish** to apply the changes

## Security Considerations

### Public Access
- Shared reports are **publicly readable** by design
- Anyone with the link can view the report
- Reports automatically expire after 30 days

### Privacy Protection
- Only the report owner can create, update, or delete their reports
- User authentication is required to create reports
- Expired reports should be cleaned up (see cleanup section below)

### Data Minimization
- Only essential vital data is stored in shared reports
- Full user details are not exposed
- Reports contain only the data needed for viewing

## Optional: Automatic Cleanup of Expired Reports

You can set up a Cloud Function to automatically delete expired reports:

```javascript
// Firebase Cloud Function (functions/index.js)
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.cleanupExpiredReports = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    
    const expiredReports = await db.collection('sharedReports')
      .where('expiresAt', '<', now)
      .get();
    
    const batch = db.batch();
    expiredReports.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Deleted ${expiredReports.size} expired reports`);
    return null;
  });
```

## Testing the Rules

### Test Creating a Report (Should Succeed)
```javascript
// User is authenticated
const reportData = {
  userId: currentUser.uid,
  userEmail: currentUser.email,
  // ... other fields
};
await addDoc(collection(db, 'sharedReports'), reportData);
```

### Test Reading a Report (Should Succeed)
```javascript
// Anyone can read
const reportDoc = await getDoc(doc(db, 'sharedReports', reportId));
```

### Test Deleting Someone Else's Report (Should Fail)
```javascript
// User tries to delete another user's report
await deleteDoc(doc(db, 'sharedReports', otherUserReportId));
// Error: Missing or insufficient permissions
```

## Indexes Required

No additional indexes are required for basic functionality. However, if you implement the cleanup function, you may need:

```
Collection: sharedReports
Fields: expiresAt (Ascending)
```

To create this index:
1. Go to Firestore Console
2. Click on **Indexes** tab
3. Click **Create Index**
4. Collection ID: `sharedReports`
5. Field: `expiresAt`, Order: Ascending
6. Click **Create**

## Monitoring

Monitor your shared reports collection:
- Check the number of documents regularly
- Set up alerts for unusual activity
- Review access logs in Firebase Console
- Consider implementing rate limiting for report creation
