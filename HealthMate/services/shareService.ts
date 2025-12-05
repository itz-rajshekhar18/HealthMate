import { collection, addDoc, getDoc, doc, Timestamp, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../FirebaseConfig';
import { Vital } from './vitalsService';
import { generatePDFHTML } from './pdfService';

export interface SharedReport {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  vitals: Vital[];
  dateRange: number;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  htmlContent: string;
}

/**
 * Create a shareable report and store it in Firestore
 */
export const createShareableReport = async (
  vitals: Vital[],
  dateRange: number
): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('📝 Creating shareable report...');

    // Generate HTML content
    const htmlContent = generatePDFHTML(vitals, dateRange);

    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create report document
    const reportData = {
      userId: user.uid,
      userEmail: user.email || 'Unknown',
      userName: user.displayName || user.email?.split('@')[0] || 'User',
      dateRange,
      totalRecords: vitals.length,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt),
      htmlContent,
      // Store minimal vital data for preview
      vitalsPreview: vitals.slice(0, 10).map(v => ({
        timestamp: v.timestamp,
        bloodPressure: v.bloodPressure,
        heartRate: v.heartRate,
        spO2: v.spO2,
        temperature: v.temperature,
      })),
    };

    const docRef = await addDoc(collection(db, 'sharedReports'), reportData);
    console.log('✅ Shareable report created:', docRef.id);

    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating shareable report:', error);
    throw error;
  }
};

/**
 * Get a shared report by ID
 */
export const getSharedReport = async (reportId: string): Promise<SharedReport | null> => {
  try {
    console.log('📥 Fetching shared report:', reportId);

    const docRef = doc(db, 'sharedReports', reportId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log('⚠️ Report not found');
      return null;
    }

    const data = docSnap.data();

    // Check if report has expired
    const now = new Date();
    const expiresAt = data.expiresAt.toDate();
    if (now > expiresAt) {
      console.log('⚠️ Report has expired');
      return null;
    }

    console.log('✅ Shared report retrieved');

    return {
      id: docSnap.id,
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      vitals: data.vitalsPreview || [],
      dateRange: data.dateRange,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
      htmlContent: data.htmlContent,
    };
  } catch (error) {
    console.error('❌ Error fetching shared report:', error);
    throw error;
  }
};

// TODO: Replace with your actual deployed domain
const APP_DOMAIN = 'https://healthmates.onrender.com';

/**
 * Generate shareable URL for a report
 */
export const generateShareableURL = (reportId: string): string => {
  // Prefer the configured app domain if available
  if (APP_DOMAIN) {
    return `${APP_DOMAIN}/shared-report/${reportId}`;
  }
  
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/shared-report/${reportId}`;
  }
  
  return `https://https://healthmates.onrender.com/shared-report/${reportId}`;
};

/**
 * Get all shared reports for the current user
 */
export const getUserSharedReports = async (): Promise<SharedReport[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'sharedReports'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const reports: SharedReport[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        vitals: data.vitalsPreview || [],
        dateRange: data.dateRange,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        htmlContent: data.htmlContent,
      });
    });

    console.log(`✅ Fetched ${reports.length} shared reports for user`);
    return reports;
  } catch (error) {
    console.error('❌ Error fetching user shared reports:', error);
    throw error;
  }
};
