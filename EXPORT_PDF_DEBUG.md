# Export PDF Debug Guide

## What I Fixed

1. **Added Debug Logging** - The export button now logs detailed information to the console
2. **Better Error Handling** - Shows specific error messages instead of generic ones
3. **Visual Feedback** - Shows a warning message if no data is available
4. **Fixed Timestamp Handling** - Made timestamp conversion more robust in PDF generation

## How to Test

### Step 1: Check Console Logs
Open your browser/app console and look for these logs when you click Export:
- 🔵 Export button clicked
- 📊 Preview data
- 📅 Date range
- 📥 Fetching vitals...
- ✅ Vitals fetched: X records
- 📄 Generating PDF...
- ✅ PDF generated successfully

### Step 2: Common Issues & Solutions

#### Issue: Button is Grayed Out
**Cause**: No vitals data available for the selected period
**Solution**: 
1. Go to "Add Vitals" tab
2. Add at least one vital record
3. Return to Export tab
4. The button should now be enabled

#### Issue: "No Data" Alert
**Cause**: No vitals found in the selected date range
**Solution**:
1. Try selecting a longer date range (e.g., "Last Year")
2. Or add vitals data first

#### Issue: Export Fails with Error
**Check Console Logs** for specific error message:
- If "Permission denied": Check file system permissions
- If "Sharing not available": Platform doesn't support sharing
- If "Firebase error": Check authentication and Firestore rules

### Step 3: Test on Different Platforms

#### Web Platform
- Should download an HTML file
- Check browser's download folder
- File name: `HealthMate_Report_[timestamp].html`

#### Mobile Platform (iOS/Android)
- Should open share dialog
- Can share via email, messaging apps, or save to files
- Requires expo-file-system and expo-sharing packages

## Expected Behavior

1. **On Page Load**:
   - Fetches vitals for last 30 days (default)
   - Shows preview with patient info and stats
   - Enables/disables export button based on data availability

2. **When Changing Date Range**:
   - Reloads preview automatically
   - Updates stats and record count
   - Re-evaluates button state

3. **When Clicking Export**:
   - Shows "Generating Report..." with spinner
   - Fetches fresh vitals data
   - Generates HTML/PDF report
   - Opens share dialog (mobile) or downloads file (web)
   - Shows success alert

## Troubleshooting Commands

### Check if vitals exist in Firestore
```javascript
// In browser console
import { readVitalsForDays } from './services/vitalsService';
const vitals = await readVitalsForDays(365);
console.log('Total vitals:', vitals.length);
```

### Test PDF generation directly
```javascript
// In browser console
import { generateAndSharePDF } from './services/pdfService';
import { readVitalsForDays } from './services/vitalsService';
const vitals = await readVitalsForDays(30);
await generateAndSharePDF(vitals, 30);
```

## What to Check in Console

Look for these specific logs to identify the issue:

1. **Preview Loading**:
   ```
   🔄 Loading preview for 30 days
   📊 Vitals loaded: X records
   ✅ Preview generated: {...}
   ```

2. **Export Process**:
   ```
   🔵 Export button clicked
   📊 Preview data: {...}
   📥 Fetching vitals...
   ✅ Vitals fetched: X records
   📄 Generating PDF...
   ✅ PDF generated successfully
   🔵 Export process completed
   ```

3. **Errors** (if any):
   ```
   ❌ Error exporting PDF: [error message]
   Error details: [stack trace]
   ```

## Next Steps

If the button still doesn't work:
1. Share the console logs with me
2. Check if you have any vitals data in your account
3. Try adding a test vital record first
4. Verify your Firebase authentication is working
