import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { auth } from '../FirebaseConfig';

export interface Vital {
  id?: string;
  email: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  spO2: number;
  temperature: number;
  weight: number;
  timestamp: Timestamp;
  date: string;
}

// ============================================
// CREATE - Add new vital record
// ============================================
export const createVital = async (vitalsData: {
  systolic: string;
  diastolic: string;
  heartRate: string;
  spO2: string;
  temperature: string;
  weight: string;
}): Promise<string> => {
  try {
    const userId = auth.currentUser?.uid;
    const userEmail = auth.currentUser?.email;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    if (!userEmail) {
      throw new Error('User email not available');
    }

    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const vital: Vital = {
      email: userEmail,
      bloodPressure: {
        systolic: parseInt(vitalsData.systolic),
        diastolic: parseInt(vitalsData.diastolic),
      },
      heartRate: parseInt(vitalsData.heartRate),
      spO2: parseInt(vitalsData.spO2),
      temperature: parseFloat(vitalsData.temperature),
      weight: parseInt(vitalsData.weight),
      timestamp: Timestamp.now(),
      date: dateString,
    };

    const vitalsRef = collection(db, 'users', userId, 'vitals');
    const docRef = await addDoc(vitalsRef, vital);
    
    console.log('✅ Vital created with ID:', docRef.id, 'for email:', userEmail);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating vital:', error);
    throw error;
  }
};

// ============================================
// READ - Fetch vital records
// ============================================

// Read all vitals for a user
export const readAllVitals = async (): Promise<Vital[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const vitalsRef = collection(db, 'users', userId, 'vitals');
    const q = query(vitalsRef, orderBy('timestamp', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const vitals: Vital[] = [];
    
    querySnapshot.forEach((doc) => {
      vitals.push({
        id: doc.id,
        ...doc.data() as Vital,
      });
    });

    console.log('✅ Fetched all vitals:', vitals.length);
    return vitals;
  } catch (error) {
    console.error('❌ Error fetching all vitals:', error);
    throw error;
  }
};

// Read single vital by ID
export const readVitalById = async (vitalId: string): Promise<Vital | null> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const vitalRef = doc(db, 'users', userId, 'vitals', vitalId);
    const vitalSnap = await getDoc(vitalRef);

    if (vitalSnap.exists()) {
      console.log('✅ Fetched vital:', vitalId);
      return {
        id: vitalSnap.id,
        ...vitalSnap.data() as Vital,
      };
    } else {
      console.log('⚠️ Vital not found:', vitalId);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching vital by ID:', error);
    throw error;
  }
};

// Read vitals for last N days
export const readVitalsForDays = async (days: number): Promise<Vital[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startTimestamp = Timestamp.fromDate(startDate);

    const vitalsRef = collection(db, 'users', userId, 'vitals');
    const q = query(
      vitalsRef,
      where('timestamp', '>=', startTimestamp),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const vitals: Vital[] = [];

    querySnapshot.forEach((doc) => {
      vitals.push({
        id: doc.id,
        ...doc.data() as Vital,
      });
    });

    console.log(`✅ Fetched vitals for last ${days} days:`, vitals.length);
    return vitals;
  } catch (error) {
    console.error(`❌ Error fetching vitals for ${days} days:`, error);
    throw error;
  }
};

// Read vitals for specific date range
export const readVitalsForDateRange = async (startDate: Date, endDate: Date): Promise<Vital[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const vitalsRef = collection(db, 'users', userId, 'vitals');
    const q = query(
      vitalsRef,
      where('timestamp', '>=', startTimestamp),
      where('timestamp', '<=', endTimestamp),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const vitals: Vital[] = [];

    querySnapshot.forEach((doc) => {
      vitals.push({
        id: doc.id,
        ...doc.data() as Vital,
      });
    });

    console.log('✅ Fetched vitals for date range:', vitals.length);
    return vitals;
  } catch (error) {
    console.error('❌ Error fetching vitals for date range:', error);
    throw error;
  }
};

// Read vitals by email ID
export const readVitalsByEmail = async (email: string): Promise<Vital[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const vitalsRef = collection(db, 'users', userId, 'vitals');
    const q = query(
      vitalsRef,
      where('email', '==', email),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const vitals: Vital[] = [];

    querySnapshot.forEach((doc) => {
      vitals.push({
        id: doc.id,
        ...doc.data() as Vital,
      });
    });

    console.log(`✅ Fetched vitals for email ${email}:`, vitals.length);
    return vitals;
  } catch (error) {
    console.error('❌ Error fetching vitals by email:', error);
    throw error;
  }
};

// ============================================
// UPDATE - Modify vital record
// ============================================

export const updateVital = async (
  vitalId: string,
  updatedData: Partial<{
    systolic: number;
    diastolic: number;
    heartRate: number;
    spO2: number;
    temperature: number;
    weight: number;
  }>
): Promise<void> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const vitalRef = doc(db, 'users', userId, 'vitals', vitalId);
    
    // Build update object
    const updateObj: any = {};
    
    if (updatedData.systolic !== undefined || updatedData.diastolic !== undefined) {
      updateObj['bloodPressure.systolic'] = updatedData.systolic;
      updateObj['bloodPressure.diastolic'] = updatedData.diastolic;
    }
    if (updatedData.heartRate !== undefined) {
      updateObj['heartRate'] = updatedData.heartRate;
    }
    if (updatedData.spO2 !== undefined) {
      updateObj['spO2'] = updatedData.spO2;
    }
    if (updatedData.temperature !== undefined) {
      updateObj['temperature'] = updatedData.temperature;
    }
    if (updatedData.weight !== undefined) {
      updateObj['weight'] = updatedData.weight;
    }

    await updateDoc(vitalRef, updateObj);
    console.log('✅ Vital updated:', vitalId);
  } catch (error) {
    console.error('❌ Error updating vital:', error);
    throw error;
  }
};

// ============================================
// DELETE - Remove vital record
// ============================================

export const deleteVital = async (vitalId: string): Promise<void> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const vitalRef = doc(db, 'users', userId, 'vitals', vitalId);
    await deleteDoc(vitalRef);
    console.log('✅ Vital deleted:', vitalId);
  } catch (error) {
    console.error('❌ Error deleting vital:', error);
    throw error;
  }
};

// Delete all vitals for a user (use with caution!)
export const deleteAllVitals = async (): Promise<void> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const vitals = await readAllVitals();
    
    for (const vital of vitals) {
      if (vital.id) {
        await deleteVital(vital.id);
      }
    }
    
    console.log('✅ All vitals deleted');
  } catch (error) {
    console.error('❌ Error deleting all vitals:', error);
    throw error;
  }
};

// ============================================
// ANALYTICS - Calculate statistics
// ============================================

// Calculate average vitals
export const calculateAverageVitals = (vitals: Vital[]) => {
  if (vitals.length === 0) {
    return null;
  }

  const sum = vitals.reduce(
    (acc, vital) => ({
      systolic: acc.systolic + vital.bloodPressure.systolic,
      diastolic: acc.diastolic + vital.bloodPressure.diastolic,
      heartRate: acc.heartRate + vital.heartRate,
      spO2: acc.spO2 + vital.spO2,
      temperature: acc.temperature + vital.temperature,
      weight: acc.weight + vital.weight,
    }),
    { systolic: 0, diastolic: 0, heartRate: 0, spO2: 0, temperature: 0, weight: 0 }
  );

  return {
    bloodPressure: {
      systolic: Math.round(sum.systolic / vitals.length),
      diastolic: Math.round(sum.diastolic / vitals.length),
    },
    heartRate: Math.round(sum.heartRate / vitals.length),
    spO2: Math.round(sum.spO2 / vitals.length),
    temperature: (sum.temperature / vitals.length).toFixed(1),
    weight: Math.round(sum.weight / vitals.length),
  };
};

// Get vitals statistics (min, max, avg)
export const getVitalsStats = (vitals: Vital[]) => {
  if (vitals.length === 0) {
    return null;
  }

  const systolicValues = vitals.map(v => v.bloodPressure.systolic);
  const diastolicValues = vitals.map(v => v.bloodPressure.diastolic);
  const heartRateValues = vitals.map(v => v.heartRate);
  const spO2Values = vitals.map(v => v.spO2);
  const temperatureValues = vitals.map(v => v.temperature);
  const weightValues = vitals.map(v => v.weight);

  const getStats = (values: number[]) => ({
    min: Math.min(...values),
    max: Math.max(...values),
    avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
  });

  return {
    bloodPressure: {
      systolic: getStats(systolicValues),
      diastolic: getStats(diastolicValues),
    },
    heartRate: getStats(heartRateValues),
    spO2: getStats(spO2Values),
    temperature: {
      min: Math.min(...temperatureValues),
      max: Math.max(...temperatureValues),
      avg: (temperatureValues.reduce((a, b) => a + b, 0) / temperatureValues.length).toFixed(1),
    },
    weight: getStats(weightValues),
  };
};

// Calculate trends (comparing last week to previous week)
export const calculateTrends = async () => {
  try {
    const lastWeekVitals = await readVitalsForDays(7);
    const twoWeeksAgoVitals = await readVitalsForDays(14);
    
    // Filter vitals from 7-14 days ago
    const previousWeekVitals = twoWeeksAgoVitals.filter(vital => {
      const vitalDate = vital.timestamp.toDate();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return vitalDate < sevenDaysAgo;
    });

    const lastWeekAvg = calculateAverageVitals(lastWeekVitals);
    const previousWeekAvg = calculateAverageVitals(previousWeekVitals);

    if (!lastWeekAvg || !previousWeekAvg) {
      return null;
    }

    return {
      bloodPressure: {
        systolic: lastWeekAvg.bloodPressure.systolic - previousWeekAvg.bloodPressure.systolic,
        diastolic: lastWeekAvg.bloodPressure.diastolic - previousWeekAvg.bloodPressure.diastolic,
      },
      heartRate: lastWeekAvg.heartRate - previousWeekAvg.heartRate,
      spO2: lastWeekAvg.spO2 - previousWeekAvg.spO2,
      temperature: parseFloat(lastWeekAvg.temperature) - parseFloat(previousWeekAvg.temperature),
      weight: lastWeekAvg.weight - previousWeekAvg.weight,
    };
  } catch (error) {
    console.error('❌ Error calculating trends:', error);
    throw error;
  }
};