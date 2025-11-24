# Chart Service Guide

## 📊 Overview

The Chart Service provides backend logic for data visualization, health insights, and recommendations in the HealthMate app.

## 🏗️ Architecture

```
Frontend (chart.tsx)
        ↓
Chart Service (chartService.ts)
        ↓
Vitals Service (vitalsService.ts)
        ↓
Firestore Database
```

## 📁 File Structure

```
services/
├── chartService.ts      ← Chart logic & analytics
├── vitalsService.ts     ← CRUD operations
└── authService.ts       ← Authentication
```

## 🔧 Functions

### Data Fetching

#### `fetchCurrentUserVitals()`
Fetches vitals for the currently logged-in user.

```typescript
const vitals = await fetchCurrentUserVitals();
// Returns: Vital[] - All vitals for current user
```

**Features:**
- Automatically gets user email from Firebase Auth
- Fetches only user-specific data
- Logs fetch count for debugging

---

#### `filterVitalsByDateRange(vitals, days)`
Filters vitals by date range.

```typescript
const last30Days = filterVitalsByDateRange(vitals, 30);
// Returns: Vital[] - Filtered and sorted vitals
```

**Parameters:**
- `vitals`: Array of vital records
- `days`: Number of days to look back

---

### Chart Data Preparation

#### `prepareChartData(vitals, vitalType, maxPoints)`
Prepares data for chart visualization.

```typescript
const chartData = prepareChartData(vitals, 'bloodPressure', 7);
// Returns: ChartData with labels and datasets
```

**Parameters:**
- `vitals`: Array of vital records
- `vitalType`: 'bloodPressure' | 'heartRate' | 'spO2' | 'temperature'
- `maxPoints`: Maximum data points to display (default: 7)

**Returns:**
```typescript
{
  labels: string[],           // Date labels
  datasets: ChartDataset[],   // Data arrays
  legend?: string[]           // Legend labels (for BP)
}
```

---

#### `getAverageValueForVital(vitals, vitalType)`
Gets formatted average value for display.

```typescript
const avg = getAverageValueForVital(vitals, 'bloodPressure');
// Returns: "120/80" or "72" or "98%" or "98.6°F"
```

---

### Health Insights

#### `generateHealthInsights(vitals)`
Generates personalized health insights.

```typescript
const insights = generateHealthInsights(vitals);
// Returns: HealthInsight[]
```

**Insight Types:**
- **Success**: Healthy readings
- **Warning**: Elevated readings
- **Info**: General information

**Example Output:**
```typescript
[
  {
    type: 'success',
    icon: 'trending-up',
    title: 'Great Progress!',
    message: 'Your blood pressure is in the healthy range',
    color: '#10B981'
  }
]
```

**Insights Generated:**
- Blood pressure analysis
- Heart rate evaluation
- SpO₂ level assessment
- Tracking consistency feedback

---

### Recommendations

#### `generateRecommendations(vitals)`
Generates personalized health recommendations.

```typescript
const recommendations = generateRecommendations(vitals);
// Returns: string[]
```

**Example Output:**
```typescript
[
  'Consider monitoring BP at the same time daily for consistency',
  'Your readings are within healthy range - maintain current lifestyle',
  'Share these trends with your healthcare provider'
]
```

---

### Chart Titles

#### `getChartTitle(vitalType)`
Gets chart title based on vital type.

```typescript
const title = getChartTitle('bloodPressure');
// Returns: "Blood Pressure Trend"
```

---

#### `getChartSubtitle(vitalType)`
Gets chart subtitle based on vital type.

```typescript
const subtitle = getChartSubtitle('bloodPressure');
// Returns: "Systolic and Diastolic readings over time"
```

---

### Statistics

#### `getVitalsStatistics(vitals)`
Gets comprehensive statistics.

```typescript
const stats = getVitalsStatistics(vitals);
// Returns: { totalRecords, dateRange, averages }
```

**Example Output:**
```typescript
{
  totalRecords: 15,
  dateRange: "1/1/2024 - 1/15/2024",
  averages: {
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 72,
    spO2: 98,
    temperature: "98.6",
    weight: 150
  }
}
```

---

## 💡 Usage Examples

### Example 1: Fetch and Display Chart

```typescript
import { 
  fetchCurrentUserVitals, 
  prepareChartData 
} from '@/services/chartService';

const [vitals, setVitals] = useState([]);

useEffect(() => {
  const loadData = async () => {
    const data = await fetchCurrentUserVitals();
    setVitals(data);
  };
  loadData();
}, []);

const chartData = prepareChartData(vitals, 'bloodPressure', 7);
```

---

### Example 2: Show Health Insights

```typescript
import { generateHealthInsights } from '@/services/chartService';

const insights = generateHealthInsights(vitals);

return (
  <View>
    {insights.map((insight, index) => (
      <InsightCard key={index} insight={insight} />
    ))}
  </View>
);
```

---

### Example 3: Filter by Date Range

```typescript
import { 
  fetchCurrentUserVitals, 
  filterVitalsByDateRange 
} from '@/services/chartService';

const vitals = await fetchCurrentUserVitals();
const last7Days = filterVitalsByDateRange(vitals, 7);
const last30Days = filterVitalsByDateRange(vitals, 30);
```

---

## 🎯 Data Flow

```
User logs in
    ↓
fetchCurrentUserVitals()
    ↓
Gets email from auth.currentUser?.email
    ↓
Calls readVitalsByEmail(email)
    ↓
Firestore returns user-specific vitals
    ↓
filterVitalsByDateRange() filters data
    ↓
prepareChartData() formats for charts
    ↓
generateHealthInsights() analyzes data
    ↓
Display in UI
```

---

## 🔒 Security

- All functions use authenticated user's email
- No cross-user data access
- Firestore security rules enforce isolation
- Email automatically captured from Firebase Auth

---

## 📊 Chart Configuration

### Blood Pressure Chart
- **Type**: Dual-line chart
- **Colors**: 
  - Systolic: #4F46E5 (Blue)
  - Diastolic: #8B5CF6 (Purple)
- **Legend**: ['Systolic', 'Diastolic']

### Other Vitals
- **Type**: Single-line chart
- **Color**: #4F46E5 (Blue)
- **No legend**

---

## 🧪 Testing

```typescript
// Test data fetching
const vitals = await fetchCurrentUserVitals();
console.log('Fetched vitals:', vitals.length);

// Test filtering
const filtered = filterVitalsByDateRange(vitals, 7);
console.log('Last 7 days:', filtered.length);

// Test insights
const insights = generateHealthInsights(vitals);
console.log('Insights:', insights);
```

---

## 📝 Type Definitions

```typescript
type VitalType = 'bloodPressure' | 'heartRate' | 'spO2' | 'temperature';

interface HealthInsight {
  type: 'success' | 'warning' | 'info';
  icon: string;
  title: string;
  message: string;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  legend?: string[];
}
```

---

## 🚀 Benefits

| Benefit | Description |
|---------|-------------|
| **Separation of Concerns** | UI logic separate from business logic |
| **Reusability** | Functions can be used in multiple components |
| **Testability** | Easy to unit test backend logic |
| **Maintainability** | Centralized chart logic |
| **Scalability** | Easy to add new features |

---

## 📈 Future Enhancements

- [ ] Add more insight types
- [ ] Implement trend analysis
- [ ] Add predictive analytics
- [ ] Support custom date ranges
- [ ] Add export functionality
- [ ] Implement data caching

---

## 🐛 Debugging

Enable debug logs:
```typescript
console.log('Vitals fetched:', vitals.length);
console.log('Filtered vitals:', filteredVitals.length);
console.log('Chart data:', chartData);
console.log('Insights:', insights);
```

---

## 📞 Support

For issues with chart service:
- Check `chartService.ts` for implementation
- Review `vitalsService.ts` for data operations
- Verify Firebase Auth is working
- Check Firestore security rules
