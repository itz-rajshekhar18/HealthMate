# Email-Based Data Segregation Guide

## 📧 Overview

Email ID is now included in every vital record for easy data segregation and user identification.

## 🏗️ Updated Database Structure

```
users/{userId}/vitals/{vitalId}
{
  email: "user@example.com",           // ← NEW: User's email
  bloodPressure: {
    systolic: 120,
    diastolic: 80
  },
  heartRate: 72,
  spO2: 98,
  temperature: 98.6,
  weight: 150,
  timestamp: Timestamp,
  date: "2024-01-15"
}
```

## ✨ New Features

### 1. Email Automatically Captured

When saving vitals, the user's email is automatically included:

```typescript
import { createVital } from '@/services/vitalsService';

const vitalsData = {
  systolic: '120',
  diastolic: '80',
  heartRate: '72',
  spO2: '98',
  temperature: '98.6',
  weight: '150'
};

// Email is automatically added from auth.currentUser?.email
await createVital(vitalsData);
```

### 2. Fetch Vitals by Email

New function to retrieve vitals for a specific user by email:

```typescript
import { readVitalsByEmail } from '@/services/vitalsService';

// Get all vitals for a specific email
const vitals = await readVitalsByEmail('user@example.com');

// Use for charts and trends
vitals.forEach(vital => {
  console.log(`${vital.date}: BP ${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}`);
});
```

## 🎯 Use Cases

### Use Case 1: Display User's Health Charts

```typescript
import { readVitalsByEmail } from '@/services/vitalsService';

export function HealthCharts() {
  const [vitals, setVitals] = useState([]);
  const userEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchData = async () => {
      if (userEmail) {
        const data = await readVitalsByEmail(userEmail);
        setVitals(data);
      }
    };
    fetchData();
  }, [userEmail]);

  return (
    <View>
      {vitals.map(vital => (
        <Text key={vital.id}>
          {vital.email}: {vital.date} - BP {vital.bloodPressure.systolic}
        </Text>
      ))}
    </View>
  );
}
```

### Use Case 2: Generate PDF Report by Email

```typescript
import { readVitalsByEmail } from '@/services/vitalsService';

export async function generatePDFReport(email: string) {
  const vitals = await readVitalsByEmail(email);
  
  // Create PDF with vitals data
  const pdfContent = vitals.map(vital => 
    `${vital.date}: BP ${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}, HR ${vital.heartRate}`
  ).join('\n');
  
  // Export to PDF
  return pdfContent;
}
```

### Use Case 3: Calculate Trends by Email

```typescript
import { readVitalsByEmail, calculateAverageVitals } from '@/services/vitalsService';

export async function getUserTrends(email: string) {
  const vitals = await readVitalsByEmail(email);
  const averages = calculateAverageVitals(vitals);
  
  return {
    email,
    averageBP: averages.bloodPressure,
    averageHR: averages.heartRate,
    totalRecords: vitals.length
  };
}
```

## 🔍 Data Segregation Benefits

| Benefit | Description |
|---------|-------------|
| **User Identification** | Easily identify which user owns each vital record |
| **Multi-User Support** | Support multiple users in the same database |
| **Audit Trail** | Track which email recorded each vital |
| **Data Export** | Export vitals by email for reports |
| **Analytics** | Analyze trends per user email |
| **Sharing** | Share vitals with doctors using email |

## 📊 Example Firestore Data

```json
{
  "users": {
    "userId123": {
      "vitals": {
        "vital001": {
          "email": "john@example.com",
          "bloodPressure": { "systolic": 120, "diastolic": 80 },
          "heartRate": 72,
          "spO2": 98,
          "temperature": 98.6,
          "weight": 150,
          "timestamp": "2024-01-15T10:30:00Z",
          "date": "2024-01-15"
        },
        "vital002": {
          "email": "john@example.com",
          "bloodPressure": { "systolic": 125, "diastolic": 82 },
          "heartRate": 75,
          "spO2": 97,
          "temperature": 98.7,
          "weight": 151,
          "timestamp": "2024-01-16T10:30:00Z",
          "date": "2024-01-16"
        }
      }
    }
  }
}
```

## 🔒 Security Considerations

Email is stored with each vital for:
- ✅ User identification
- ✅ Data segregation
- ✅ Audit purposes
- ✅ Report generation

**Security Rules** ensure only the user can access their own vitals:

```javascript
match /users/{userId}/vitals/{vitalId} {
  allow read, write: if request.auth != null 
                    && request.auth.uid == userId;
}
```

## 📝 API Reference

### New Function: `readVitalsByEmail()`

```typescript
readVitalsByEmail(email: string): Promise<Vital[]>
```

**Parameters:**
- `email` (string) - User's email address

**Returns:**
- `Vital[]` - Array of vital records for that email

**Example:**
```typescript
const vitals = await readVitalsByEmail('user@example.com');
```

## 🚀 Implementation Checklist

- ✅ Email field added to Vital interface
- ✅ Email automatically captured on save
- ✅ New `readVitalsByEmail()` function created
- ✅ Firestore guide updated
- ✅ Security rules in place
- ✅ Ready for charts and PDF export

## 💡 Next Steps

1. **Charts**: Use `readVitalsByEmail()` to fetch data for charts
2. **Trends**: Calculate trends using email-segregated data
3. **PDF Export**: Generate reports by email
4. **Sharing**: Share vitals with doctors using email
5. **Analytics**: Analyze health data per user

---

## 📞 Support

For questions about email segregation:
- Check `FIRESTORE_CRUD_GUIDE.md` for CRUD operations
- Review `vitalsService.ts` for implementation details
- Test with `readVitalsByEmail()` function
