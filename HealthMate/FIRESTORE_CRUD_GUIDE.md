# Firestore CRUD Operations Guide - HealthMate

## 📋 Overview

Complete CRUD (Create, Read, Update, Delete) operations for managing vital records in Firestore.

## 🏗️ Database Structure

```
users/{userId}/vitals/{vitalId}
├── email: string (user's email for data segregation)
├── bloodPressure
│   ├── systolic: number
│   └── diastolic: number
├── heartRate: number
├── spO2: number
├── temperature: number
├── weight: number
├── timestamp: Timestamp
└── date: string (YYYY-MM-DD)
```

## ✅ CREATE Operations

### Create a new vital record

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

try {
  const vitalId = await createVital(vitalsData);
  console.log('Vital saved with ID:', vitalId);
} catch (error) {
  console.error('Error saving vital:', error);
}
```

**Returns:** `string` - The ID of the newly created vital record

---

## 📖 READ Operations

### Read all vitals for current user

```typescript
import { readAllVitals } from '@/services/vitalsService';

try {
  const vitals = await readAllVitals();
  console.log('All vitals:', vitals);
} catch (error) {
  console.error('Error fetching vitals:', error);
}
```

**Returns:** `Vital[]` - Array of all vital records (sorted by newest first)

---

### Read single vital by ID

```typescript
import { readVitalById } from '@/services/vitalsService';

try {
  const vital = await readVitalById('vitalId123');
  if (vital) {
    console.log('Vital found:', vital);
  } else {
    console.log('Vital not found');
  }
} catch (error) {
  console.error('Error fetching vital:', error);
}
```

**Returns:** `Vital | null` - Single vital record or null if not found

---

### Read vitals for last N days

```typescript
import { readVitalsForDays } from '@/services/vitalsService';

try {
  // Get vitals from last 7 days
  const vitals = await readVitalsForDays(7);
  console.log('Last 7 days vitals:', vitals);
} catch (error) {
  console.error('Error fetching vitals:', error);
}
```

**Returns:** `Vital[]` - Array of vitals from the last N days

---

### Read vitals for specific date range

```typescript
import { readVitalsForDateRange } from '@/services/vitalsService';

try {
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-31');
  
  const vitals = await readVitalsForDateRange(startDate, endDate);
  console.log('Vitals for January:', vitals);
} catch (error) {
  console.error('Error fetching vitals:', error);
}
```

**Returns:** `Vital[]` - Array of vitals within the date range

---

### Read vitals by email ID

```typescript
import { readVitalsByEmail } from '@/services/vitalsService';

try {
  const vitals = await readVitalsByEmail('user@example.com');
  console.log('Vitals for user@example.com:', vitals);
} catch (error) {
  console.error('Error fetching vitals by email:', error);
}
```

**Returns:** `Vital[]` - Array of vitals for the specified email

**Use Case:** Segregate and display data for specific users by email ID

---

## ✏️ UPDATE Operations

### Update a vital record

```typescript
import { updateVital } from '@/services/vitalsService';

try {
  await updateVital('vitalId123', {
    systolic: 125,
    diastolic: 85,
    heartRate: 75
  });
  console.log('Vital updated successfully');
} catch (error) {
  console.error('Error updating vital:', error);
}
```

**Parameters:**
- `vitalId`: string - ID of the vital to update
- `updatedData`: Partial object with fields to update

**Returns:** `void`

---

## 🗑️ DELETE Operations

### Delete a single vital record

```typescript
import { deleteVital } from '@/services/vitalsService';

try {
  await deleteVital('vitalId123');
  console.log('Vital deleted successfully');
} catch (error) {
  console.error('Error deleting vital:', error);
}
```

**Returns:** `void`

---

### Delete all vitals for current user (⚠️ Use with caution!)

```typescript
import { deleteAllVitals } from '@/services/vitalsService';

try {
  await deleteAllVitals();
  console.log('All vitals deleted');
} catch (error) {
  console.error('Error deleting vitals:', error);
}
```

**Returns:** `void`

---

## 📊 Analytics Operations

### Calculate average vitals

```typescript
import { readVitalsForDays, calculateAverageVitals } from '@/services/vitalsService';

try {
  const vitals = await readVitalsForDays(7);
  const averages = calculateAverageVitals(vitals);
  
  console.log('Average BP:', averages.bloodPressure); // { systolic: 120, diastolic: 80 }
  console.log('Average HR:', averages.heartRate); // 72
} catch (error) {
  console.error('Error calculating averages:', error);
}
```

**Returns:** Object with average values or null if no vitals

---

### Get vitals statistics (min, max, avg)

```typescript
import { readVitalsForDays, getVitalsStats } from '@/services/vitalsService';

try {
  const vitals = await readVitalsForDays(30);
  const stats = getVitalsStats(vitals);
  
  console.log('BP Stats:', stats.bloodPressure.systolic);
  // { min: 110, max: 140, avg: 125 }
} catch (error) {
  console.error('Error getting stats:', error);
}
```

**Returns:** Object with min, max, avg for each vital type

---

### Calculate trends (week-over-week)

```typescript
import { calculateTrends } from '@/services/vitalsService';

try {
  const trends = await calculateTrends();
  
  console.log('BP Trend:', trends.bloodPressure.systolic); // +5 (increased by 5)
  console.log('HR Trend:', trends.heartRate); // -2 (decreased by 2)
} catch (error) {
  console.error('Error calculating trends:', error);
}
```

**Returns:** Object with trend differences or null if insufficient data

---

## 🔒 Security Considerations

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /users/{userId}/vitals/{vitalId} {
    // Only allow users to read/write their own vitals
    allow read, write: if request.auth != null 
                      && request.auth.uid == userId;
  }
}
```

---

## 💡 Usage Examples

### Example 1: Display vitals history

```typescript
import { readVitalsForDays } from '@/services/vitalsService';

export function VitalsHistory() {
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const data = await readVitalsForDays(30);
        setVitals(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchVitals();
  }, []);

  return (
    <View>
      {vitals.map(vital => (
        <Text key={vital.id}>
          {vital.date}: BP {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
        </Text>
      ))}
    </View>
  );
}
```

---

### Example 2: Save and display vitals

```typescript
import { createVital, readAllVitals } from '@/services/vitalsService';

export function AddAndDisplayVitals() {
  const [vitals, setVitals] = useState([]);

  const handleSave = async (vitalsData) => {
    try {
      await createVital(vitalsData);
      const updated = await readAllVitals();
      setVitals(updated);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View>
      {/* Add vitals form */}
      {vitals.map(vital => (
        <Text key={vital.id}>{vital.date}</Text>
      ))}
    </View>
  );
}
```

---

### Example 3: Show health trends

```typescript
import { calculateTrends, readVitalsForDays } from '@/services/vitalsService';

export function HealthTrends() {
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await calculateTrends();
        setTrends(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchTrends();
  }, []);

  return (
    <View>
      {trends && (
        <>
          <Text>BP Trend: {trends.bloodPressure.systolic > 0 ? '↑' : '↓'}</Text>
          <Text>HR Trend: {trends.heartRate > 0 ? '↑' : '↓'}</Text>
        </>
      )}
    </View>
  );
}
```

---

## 🐛 Error Handling

All functions include error handling. Common errors:

- **"User not authenticated"** - User is not logged in
- **"Vital not found"** - Vital ID doesn't exist
- **Firestore errors** - Network or permission issues

---

## 📝 Notes

- All timestamps are stored as Firestore Timestamps
- Dates are stored as strings in YYYY-MM-DD format for easy querying
- All operations are user-specific (scoped to current user)
- Vitals are sorted by newest first by default
- Weight is optional in most operations

---

## 🚀 Next Steps

1. Implement charts using vitals data
2. Create PDF export functionality
3. Add data visualization for trends
4. Implement notifications for abnormal readings
5. Add data backup and export features
