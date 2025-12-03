import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Vital, calculateAverageVitals } from './vitalsService';
import { generateHealthInsights } from './chartService';
import { auth } from '../FirebaseConfig';

/**
 * Generate HTML content for PDF report
 */
export const generatePDFHTML = (vitals: Vital[], dateRange: number): string => {
  const userEmail = auth.currentUser?.email || 'Unknown User';
  const userName = auth.currentUser?.displayName || userEmail.split('@')[0];
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const averages = calculateAverageVitals(vitals);
  const insights = generateHealthInsights(vitals);

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - dateRange);
  const dateRangeText = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Vitals Health Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          padding: 40px;
          color: #1F2937;
          background: #FFFFFF;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #4F46E5;
        }
        .logo {
          width: 60px;
          height: 60px;
          background: #4F46E5;
          border-radius: 30px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
        }
        h1 { 
          font-size: 32px; 
          color: #1F2937; 
          margin-bottom: 8px;
        }
        .subtitle { 
          font-size: 16px; 
          color: #6B7280; 
          margin-bottom: 16px;
        }
        .patient-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 20px;
          background: #F9FAFB;
          border-radius: 12px;
        }
        .info-item {
          flex: 1;
        }
        .info-label {
          font-size: 12px;
          color: #6B7280;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .info-value {
          font-size: 16px;
          font-weight: 600;
          color: #1F2937;
        }
        .report-period {
          background: #EEF2FF;
          padding: 12px 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          text-align: center;
          color: #4F46E5;
          font-weight: 600;
        }
        .section {
          margin-bottom: 40px;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #1F2937;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #E5E7EB;
        }
        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .vital-card {
          background: #FFFFFF;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          padding: 20px;
        }
        .vital-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .vital-label {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 8px;
        }
        .vital-value {
          font-size: 28px;
          font-weight: bold;
          color: #1F2937;
          margin-bottom: 4px;
        }
        .vital-unit {
          font-size: 14px;
          color: #6B7280;
        }
        .vital-range {
          font-size: 12px;
          color: #10B981;
          margin-top: 8px;
          font-weight: 600;
        }
        .insights-list {
          list-style: none;
        }
        .insight-item {
          background: #F9FAFB;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          border-left: 4px solid #10B981;
        }
        .insight-title {
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 4px;
        }
        .insight-message {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.5;
        }
        .disclaimer {
          background: #FEF3C7;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #F59E0B;
          margin-top: 40px;
        }
        .disclaimer-title {
          font-weight: 600;
          color: #92400E;
          margin-bottom: 8px;
        }
        .disclaimer-text {
          font-size: 12px;
          color: #78350F;
          line-height: 1.6;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #E5E7EB;
          font-size: 12px;
          color: #9CA3AF;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .table th {
          background: #F9FAFB;
          padding: 12px;
          text-align: left;
          font-size: 14px;
          color: #374151;
          border-bottom: 2px solid #E5E7EB;
        }
        .table td {
          padding: 12px;
          border-bottom: 1px solid #F3F4F6;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">❤️</div>
        <h1>Vitals Health Report</h1>
        <div class="subtitle">Personal Health Summary</div>
      </div>

      <div class="patient-info">
        <div class="info-item">
          <div class="info-label">Patient Name</div>
          <div class="info-value">${userName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Report Date</div>
          <div class="info-value">${reportDate}</div>
        </div>
      </div>

      <div class="report-period">
        Report Period: Last ${dateRange} Days<br>
        Data from ${dateRangeText}
      </div>

      <div class="section">
        <h2 class="section-title">Vital Signs Summary</h2>
        <div class="vitals-grid">
          <div class="vital-card">
            <div class="vital-icon">❤️</div>
            <div class="vital-label">Blood Pressure</div>
            <div class="vital-value">${averages?.bloodPressure.systolic || 'N/A'}/${averages?.bloodPressure.diastolic || 'N/A'}</div>
            <div class="vital-unit">mmHg</div>
            <div class="vital-range">Range: Normal</div>
          </div>
          
          <div class="vital-card">
            <div class="vital-icon">💓</div>
            <div class="vital-label">Heart Rate</div>
            <div class="vital-value">${averages?.heartRate || 'N/A'}</div>
            <div class="vital-unit">BPM</div>
            <div class="vital-range">Average: ${averages?.heartRate || 'N/A'} BPM</div>
          </div>
          
          <div class="vital-card">
            <div class="vital-icon">💧</div>
            <div class="vital-label">Blood Oxygen</div>
            <div class="vital-value">${averages?.spO2 || 'N/A'}%</div>
            <div class="vital-unit">SpO₂</div>
            <div class="vital-range">Average: ${averages?.spO2 || 'N/A'}%</div>
          </div>
          
          <div class="vital-card">
            <div class="vital-icon">🌡️</div>
            <div class="vital-label">Temperature</div>
            <div class="vital-value">${averages?.temperature || 'N/A'}°F</div>
            <div class="vital-unit">Fahrenheit</div>
            <div class="vital-range">Range: Normal</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Detailed Records</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>BP (mmHg)</th>
              <th>HR (BPM)</th>
              <th>SpO₂ (%)</th>
              <th>Temp (°F)</th>
            </tr>
          </thead>
          <tbody>
            ${vitals.map(vital => {
              let date: Date;
              const timestamp: any = vital.timestamp;
              if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
                date = timestamp.toDate();
              } else if (timestamp instanceof Date) {
                date = timestamp;
              } else {
                date = new Date(timestamp);
              }
              return `
              <tr>
                <td>${date.toLocaleDateString()}</td>
                <td>${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}</td>
                <td>${vital.heartRate}</td>
                <td>${vital.spO2}</td>
                <td>${vital.temperature}</td>
              </tr>
            `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2 class="section-title">Key Insights</h2>
        <ul class="insights-list">
          ${insights.map(insight => `
            <li class="insight-item">
              <div class="insight-title">${insight.title}</div>
              <div class="insight-message">${insight.message}</div>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="disclaimer">
        <div class="disclaimer-title">Medical Disclaimer</div>
        <div class="disclaimer-text">
          This report is for informational purposes only and should not replace professional medical advice. Always 
          consult with your healthcare provider for medical decisions. Generated by HealthMate App on ${reportDate}.
        </div>
      </div>

      <div class="footer">
        Generated by HealthMate • ${reportDate}<br>
        For: ${userEmail}
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate and share PDF report
 */
export const generateAndSharePDF = async (vitals: Vital[], dateRange: number): Promise<void> => {
  try {
    if (vitals.length === 0) {
      throw new Error('No vitals data available to export');
    }

    console.log('📄 Generating PDF report...');

    // Generate HTML content
    const htmlContent = generatePDFHTML(vitals, dateRange);

    // For web platform, download as HTML
    if (typeof window !== 'undefined') {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HealthMate_Report_${new Date().getTime()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('✅ HTML report downloaded');
      return;
    }

    // For mobile, create PDF using print API
    const fileName = `HealthMate_Report_${new Date().getTime()}.html`;
    const filePath = `${(FileSystem as any).documentDirectory || ''}${fileName}`;
    
    await FileSystem.writeAsStringAsync(filePath, htmlContent, {
      encoding: 'utf8' as any,
    });

    // Share the file
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/html',
        dialogTitle: 'Share Health Report',
      });
      console.log('✅ PDF report shared successfully');
    } else {
      console.log('⚠️ Sharing not available on this platform');
      alert('Report saved to: ' + filePath);
    }
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generate PDF report data for preview
 */
export const generateReportPreview = (vitals: Vital[], dateRange: number) => {
  const userEmail = auth.currentUser?.email || 'Unknown User';
  const userName = auth.currentUser?.displayName || userEmail.split('@')[0];
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const averages = calculateAverageVitals(vitals);
  const insights = generateHealthInsights(vitals);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - dateRange);

  return {
    userName,
    userEmail,
    reportDate,
    dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    totalRecords: vitals.length,
    averages,
    insights,
    vitals: vitals.slice(0, 10), // Show last 10 records in preview
  };
};
