# Export PDF - Testing & Troubleshooting Guide

## What I Fixed

1. ✅ **Replaced hardcoded Weight data** with real Temperature averages from Firebase
2. ✅ **Added detailed console logging** to track data flow
3. ✅ **Fixed Dashboard Export button** to navigate to Export tab
4. ✅ **All vital cards now show real Firebase data**:
   - Blood Pressure (average systolic/diastolic)
   - Heart Rate (average BPM)
   - Blood Oxygen (average SpO₂)
   - Temperature (average °F)

## How to Test

### Step 1: Check Console Logs

Open your browser console (F12) and look for these logs when you open the Export tab:

```
🔄 Loading preview for 30 days
📊 Vitals loaded: X records
📋 Sample vital: { bloodPressure: {...}, heartRate: ..., ... }
✅ Preview generated: {
  totalRecords: X,
  averages: {
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 72,
    spO2: 98,
    temperature: "98.6"
  },
  userName: "Your Name"
}
```

### Step 2: Verify Data Display

The Export page should show:
- **Patient Name**: Your display name or email
- **Report Date**: Today's date
- **Report Period**: Selected date range
- **Total Records**: Number of vitals in database
- **Average Values**: Calculated from your actual data

### Step 3: Test Different Date Ranges

Try selecting different periods:
- Last 7 Days
- Last 30 Days (default)
- Last 90 Days
- Last 6 Months
- Last Year

Each should recalculate averages based on that period.

## Expected Behavior

### If You Have Data:
✅ Averages display correctly
✅ Total records count shows
✅ Download PDF button is enabled (blue)
✅ Share Report button is enabled (green)
✅ Preview shows patient info and stats

### If You Have NO Data:
⚠️ Shows "No data available" message
⚠️ Buttons are disabled (gray)
⚠️ Orange warning appears: "No vitals data available for the selected period"

## Console Log Meanings

### Success Logs:
- `🔄 Loading preview for X days` - Started loading
- `📊 Vitals loaded: X records` - Successfully fetched from Firebase
- `📋 Sample vital: {...}` - Shows first vital record structure
- `✅ Preview generated: {...}` - Averages calculated successfully

### Error Logs:
- `❌ Error loading preview:` - Something went wrong
- `Error details:` - Specific error message
- Check if user is authenticated
- Check Firestore connection
- Check data structure

## Troubleshooting

### Problem: Shows "--" Instead of Numbers

**Possible Causes:**
1. No vitals data in Firebase for selected period
2. Data structure mismatch
3. Authentication issue

**Solutions:**
1. Add some vitals first using "Add Vitals" tab
2. Check console for error messages
3. Verify you're logged in
4. Try a longer date range (e.g., Last Year)

### Problem: "No vitals data available"

**Cause:** No records in Firebase for the selected period

**Solution:**
1. Go to "Add Vitals" tab
2. Add at least one vital record
3. Return to Export tab
4. Data should now appear

### Problem: Buttons Stay Disabled

**Cause:** `preview.totalRecords === 0`

**Solution:**
1. Check console logs for errors
2. Verify Firebase connection
3. Add vitals data
4. Refresh the page

### Problem: Wrong Averages Displayed

**Possible Issues:**
1. Data type mismatch (string vs number)
2. Calculation error
3. Firestore data structure issue

**Debug Steps:**
1. Check console log for "Sample vital"
2. Verify data structure matches:
```javascript
{
  bloodPressure: { systolic: 120, diastolic: 80 },
  heartRate: 72,
  spO2: 98,
  temperature: 98.6,
  weight: 150
}
```
3. Check if values are numbers, not strings

## Data Flow

1. **User opens Export tab**
   ↓
2. **loadPreview() called**
   ↓
3. **readVitalsForDays(dateRange)** - Fetches from Firebase
   ↓
4. **generateReportPreview(vitals, dateRange)** - Calculates averages
   ↓
5. **calculateAverageVitals(vitals)** - Math calculations
   ↓
6. **setPreview(previewData)** - Updates UI
   ↓
7. **Display averages in cards**

## Firestore Query

The app queries your vitals like this:

```javascript
// Path: users/{userId}/vitals
// Filter: timestamp >= (today - dateRange days)
// Order: timestamp descending
```

Make sure your vitals are stored in this structure:
```
users/
  {userId}/
    vitals/
      {vitalId}/
        - bloodPressure: { systolic: 120, diastolic: 80 }
        - heartRate: 72
        - spO2: 98
        - temperature: 98.6
        - weight: 150
        - timestamp: Firestore Timestamp
```

## Testing Checklist

- [ ] Open Export tab
- [ ] Check console logs appear
- [ ] Verify patient name displays
- [ ] Check total records count
- [ ] Verify Blood Pressure average shows
- [ ] Verify Heart Rate average shows
- [ ] Verify SpO₂ average shows
- [ ] Verify Temperature average shows
- [ ] Try different date ranges
- [ ] Test Download PDF button
- [ ] Test Share Report button
- [ ] Check with no data (should show warning)
- [ ] Check with data (should show averages)

## Quick Debug Commands

### Check if you have vitals data:
```javascript
// In browser console
import { readVitalsForDays } from './services/vitalsService';
const vitals = await readVitalsForDays(365);
console.log('Total vitals:', vitals.length);
console.log('Sample:', vitals[0]);
```

### Check average calculation:
```javascript
import { calculateAverageVitals } from './services/vitalsService';
const vitals = await readVitalsForDays(30);
const averages = calculateAverageVitals(vitals);
console.log('Averages:', averages);
```

### Check preview generation:
```javascript
import { generateReportPreview } from './services/pdfService';
const vitals = await readVitalsForDays(30);
const preview = generateReportPreview(vitals, 30);
console.log('Preview:', preview);
```

## What Should Work Now

✅ **Real Data Display**: All averages come from Firebase
✅ **Dynamic Calculations**: Changes with date range selection
✅ **Proper Error Handling**: Shows helpful messages
✅ **Debug Logging**: Easy to track issues
✅ **Temperature Card**: Shows real average instead of hardcoded weight
✅ **Dashboard Navigation**: Export PDF button works

## Next Steps

If data still doesn't appear:
1. Share the console logs with me
2. Check if vitals exist in Firebase Console
3. Verify Firestore security rules allow reading
4. Test adding a new vital and checking immediately
5. Try different date ranges

## Summary

The Export PDF feature now:
- Fetches real data from Firebase
- Calculates accurate averages
- Displays all 4 vital signs correctly
- Shows proper loading and error states
- Provides detailed console logging for debugging

All vital cards (Blood Pressure, Heart Rate, SpO₂, Temperature) now display actual averages calculated from your Firebase data for the selected date range.
