# Shared Link Feature - Complete Guide

## Overview

The shared link feature allows users to generate shareable URLs for their health reports. These links can be shared with doctors, family members, or anyone who needs to view the health data.

## How It Works

### 1. Creating a Shareable Link

When a user clicks "Share Report":

1. **Data Collection**: Fetches vitals for the selected date range
2. **Report Generation**: Creates HTML report with all health data
3. **Database Storage**: Stores report in Firestore `sharedReports` collection
4. **Link Generation**: Creates unique URL with report ID
5. **Platform-Specific Sharing**:
   - **Web**: Shows modal with copyable link
   - **Mobile**: Opens native share dialog with link

### 2. Report Storage

Each shared report contains:
```typescript
{
  userId: string;           // Owner's user ID
  userEmail: string;        // Owner's email
  userName: string;         // Owner's display name
  dateRange: number;        // Report period (days)
  totalRecords: number;     // Number of vital records
  createdAt: Timestamp;     // Creation timestamp
  expiresAt: Timestamp;     // Expiration (30 days)
  htmlContent: string;      // Full HTML report
  vitalsPreview: Array;     // First 10 vital records
}
```

### 3. Accessing Shared Reports

Anyone with the link can view the report:
- URL format: `https://your-app.com/shared-report/{reportId}`
- No authentication required
- Works until expiration date (30 days)
- Displays full health report with vitals data

## User Flow

### Creating and Sharing (Web)

1. User navigates to Export tab
2. Selects date range (7, 30, 90, 180, or 365 days)
3. Clicks "Share Report" button
4. System generates report and stores in database
5. Modal appears with shareable link
6. User clicks "Copy Link" to copy to clipboard
7. User shares link via email, messaging, etc.

### Creating and Sharing (Mobile)

1. User navigates to Export tab
2. Selects date range
3. Taps "Share Report" button
4. System generates report and stores in database
5. Native share dialog opens
6. User selects app to share (WhatsApp, Email, SMS, etc.)
7. Link is shared with selected contact

### Viewing Shared Report

1. Recipient receives link
2. Opens link in browser or app
3. Report loads from Firestore
4. Full health report displays with:
   - Patient information
   - Vital signs summary
   - Recent vitals data
   - Medical disclaimer
   - Expiration date

## Technical Implementation

### Services

**shareService.ts**
- `createShareableReport()` - Creates and stores report
- `getSharedReport()` - Retrieves report by ID
- `generateShareableURL()` - Generates shareable URL

**pdfService.ts**
- `generatePDFHTML()` - Creates HTML report content

### Components

**export.tsx**
- Share button with platform detection
- Modal for web link display
- Native share integration for mobile

**shared-report/[id].tsx**
- Public report viewer page
- Handles expired/missing reports
- Renders HTML on web, formatted view on mobile

## Security & Privacy

### Access Control
- ✅ Anyone with link can view (by design)
- ✅ Reports expire after 30 days
- ✅ Only owner can create/delete reports
- ✅ No authentication required to view

### Data Protection
- Only selected date range data is shared
- User can control what period to share
- Reports are stored securely in Firestore
- Automatic expiration prevents indefinite access

### Privacy Considerations
- Shared reports are **public** - anyone with link can view
- Users should only share links with trusted recipients
- Consider adding password protection (future enhancement)
- No sensitive personal information beyond health vitals

## Firestore Setup

### Required Collection
```
sharedReports/
  {reportId}/
    - userId
    - userEmail
    - userName
    - dateRange
    - totalRecords
    - createdAt
    - expiresAt
    - htmlContent
    - vitalsPreview[]
```

### Security Rules
See `SHARED_REPORTS_FIRESTORE_RULES.md` for complete rules.

Key rules:
- Authenticated users can create their own reports
- Anyone can read any report (public by design)
- Only owner can update/delete their reports

## URL Structure

### Shareable Link Format
```
https://your-app-domain.com/shared-report/{reportId}
```

Example:
```
https://healthmate.app/shared-report/abc123xyz789
```

### Dynamic Route
- Route: `app/shared-report/[id].tsx`
- Parameter: `id` (report ID from Firestore)
- Accessible without authentication

## Features

### Current Features
✅ Generate shareable links
✅ Store reports in Firestore
✅ 30-day automatic expiration
✅ Web modal with copy button
✅ Mobile native share dialog
✅ Public report viewer page
✅ HTML rendering on web
✅ Formatted view on mobile
✅ Expiration checking
✅ Error handling for missing reports

### Future Enhancements
🔮 Password protection for reports
🔮 Custom expiration dates
🔮 Report analytics (view count)
🔮 Revoke access before expiration
🔮 Email notification when shared
🔮 QR code generation
🔮 Download PDF from shared link
🔮 Print-friendly view

## Testing

### Test Scenarios

1. **Create Shared Link (Web)**
   - Click Share Report
   - Verify modal appears
   - Check link format
   - Copy link and verify clipboard

2. **Create Shared Link (Mobile)**
   - Tap Share Report
   - Verify native dialog opens
   - Check link in share message
   - Share to test app

3. **View Shared Report**
   - Open shared link in browser
   - Verify report displays correctly
   - Check all data is present
   - Verify expiration date shown

4. **Expired Report**
   - Manually set expiresAt to past date
   - Open link
   - Verify "Report expired" message

5. **Invalid Report ID**
   - Open link with fake ID
   - Verify "Report not found" message

## Troubleshooting

### Link Not Working
- Check Firestore rules are applied
- Verify report exists in database
- Check report hasn't expired
- Ensure network connectivity

### Modal Not Appearing (Web)
- Check Platform.OS detection
- Verify state management
- Check console for errors

### Native Share Not Opening (Mobile)
- Verify Share API is available
- Check device permissions
- Test on physical device (not simulator)

### Report Not Loading
- Check Firestore connection
- Verify report ID is correct
- Check browser console for errors
- Ensure Firestore rules allow read access

## Best Practices

### For Users
- Only share links with trusted recipients
- Be aware reports are publicly accessible
- Check expiration date before sharing
- Use appropriate date range for context

### For Developers
- Implement rate limiting for report creation
- Monitor Firestore usage and costs
- Set up automatic cleanup of expired reports
- Consider adding analytics
- Implement error tracking
- Add loading states for better UX

## Cost Considerations

### Firestore Usage
- Each report creation: 1 write
- Each report view: 1 read
- Storage: ~50KB per report (HTML content)
- Automatic cleanup reduces storage costs

### Optimization Tips
- Limit report creation frequency
- Implement caching for frequently accessed reports
- Clean up expired reports regularly
- Consider compression for HTML content

## Support

If you encounter issues:
1. Check console logs for errors
2. Verify Firestore rules are correct
3. Test with different date ranges
4. Try on different devices/browsers
5. Check network connectivity
6. Review Firebase Console for errors