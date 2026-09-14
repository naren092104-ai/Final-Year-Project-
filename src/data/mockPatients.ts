import { Patient, Alert, ClinicalRecommendation, AgentInfo, AuditLogEntry, HospitalAnalytics } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PT-10023',
    patientId: 'PT-10023',
    name: 'Ramesh Kumar',
    age: 62,
    gender: 'Male',
    room: 'ICU - Bed 05',
    ward: 'ICU',
    diagnosis: 'Pneumonia with Hypoxemia',
    admissionDate: '10 Sep 2026',
    attendingPhysician: 'Dr. S. Mehta',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'CRITICAL',
    riskScore: 78,
    trend: 'Deteriorating',
    lastUpdated: 'Just now (11:13 AM)',
    vitals: {
      heartRate: {
        value: 112,
        unit: 'bpm',
        normalRange: '60–100',
        status: 'high',
        trend: 'increasing',
        lastUpdated: '11:13 AM',
        history: [
          { time: '04:00', value: 88 },
          { time: '06:00', value: 92 },
          { time: '08:00', value: 96 },
          { time: '10:00', value: 104 },
          { time: '11:00', value: 112 },
        ]
      },
      temperature: {
        value: 38.1,
        unit: '°C',
        normalRange: '36.5–37.5',
        status: 'high',
        trend: 'increasing',
        lastUpdated: '11:12 AM',
        history: [
          { time: '04:00', value: 37.2 },
          { time: '06:00', value: 37.4 },
          { time: '08:00', value: 37.8 },
          { time: '10:00', value: 37.9 },
          { time: '11:00', value: 38.1 },
        ]
      },
      respiratoryRate: {
        value: 28,
        unit: '/min',
        normalRange: '12–20',
        status: 'high',
        trend: 'increasing',
        lastUpdated: '11:13 AM',
        history: [
          { time: '04:00', value: 18 },
          { time: '06:00', value: 20 },
          { time: '08:00', value: 22 },
          { time: '10:00', value: 25 },
          { time: '11:00', value: 28 },
        ]
      },
      spO2: {
        value: 86,
        unit: '%',
        normalRange: '95–100',
        status: 'critical-low',
        trend: 'decreasing',
        lastUpdated: '11:13 AM',
        history: [
          { time: '04:00', value: 96 },
          { time: '06:00', value: 94 },
          { time: '08:00', value: 92 },
          { time: '10:00', value: 89 },
          { time: '11:00', value: 86 },
        ]
      },
      bloodPressure: {
        value: '138/86',
        systolic: 138,
        diastolic: 86,
        unit: 'mmHg',
        normalRange: '< 120/80',
        status: 'high',
        trend: 'fluctuating',
        lastUpdated: '11:10 AM',
        history: [
          { time: '04:00', value: 124 },
          { time: '06:00', value: 128 },
          { time: '08:00', value: 134 },
          { time: '10:00', value: 138 },
          { time: '11:00', value: 138 },
        ]
      },
      glucose: {
        value: 142,
        unit: 'mg/dL',
        normalRange: '70–140',
        status: 'high',
        trend: 'stable',
        lastUpdated: '08:30 AM',
        history: [
          { time: '04:00', value: 135 },
          { time: '08:00', value: 142 }
        ]
      }
    },
    medicalHistory: [
      'Type 2 Diabetes Mellitus (8 years)',
      'Chronic Obstructive Pulmonary Disease (COPD Stage II)',
      'Mild Hypertension',
      'Previous Community-Acquired Pneumonia (2024)'
    ],
    medications: [
      { id: 'm1', name: 'Ceftriaxone IV', dosage: '1g', frequency: 'Q12H', route: 'IV Infusion', status: 'active' },
      { id: 'm2', name: 'Azithromycin', dosage: '500mg', frequency: 'Daily', route: 'Oral', status: 'active' },
      { id: 'm3', name: 'Salbutamol Nebulization', dosage: '2.5mg', frequency: 'Q4H PRN', route: 'Inhalation', status: 'active' },
      { id: 'm4', name: 'Metformin', dosage: '500mg', frequency: 'BID (Held)', route: 'Oral', status: 'paused' },
    ],
    allergies: ['Penicillin (Moderate rash)', 'Sulfa drugs (Mild nausea)'],
    recentLabs: [
      { id: 'l1', name: 'Arterial Blood Gas (PaO2)', value: '64', unit: 'mmHg', normalRange: '80–100', status: 'critical', date: '14 Sep 10:30 AM' },
      { id: 'l2', name: 'C-Reactive Protein (CRP)', value: '84', unit: 'mg/L', normalRange: '< 5.0', status: 'critical', date: '14 Sep 08:00 AM' },
      { id: 'l3', name: 'White Blood Cell (WBC)', value: '16.4', unit: 'x10^9/L', normalRange: '4.0–11.0', status: 'abnormal', date: '14 Sep 08:00 AM' },
      { id: 'l4', name: 'Serum Lactate', value: '2.4', unit: 'mmol/L', normalRange: '0.5–2.0', status: 'abnormal', date: '14 Sep 10:30 AM' },
      { id: 'l5', name: 'Serum Creatinine', value: '1.2', unit: 'mg/dL', normalRange: '0.7–1.3', status: 'normal', date: '14 Sep 08:00 AM' },
    ],
    digitalTwin: {
      patientId: 'PT-10023',
      lastSynchronized: '14 Sep 2026 11:13:02 AM',
      dataFreshnessMs: 18,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Bedside Telemetry Monitor #ICU-05', 'Pulse Oximeter Transducer', 'Electronic Health Record', 'Laboratory LIS Stream'],
      physiologicalState: {} as any, // populated at runtime
      organSystems: [
        { system: 'respiratory', name: 'Respiratory System', status: 'CRITICAL', score: 88, keyMetrics: 'SpO₂ 86% (↓), RR 28/min (↑), PaO₂ 64mmHg', clinicalNote: 'Severe ventilation-perfusion mismatch secondary to lobar pneumonia infiltrates.' },
        { system: 'cardiovascular', name: 'Cardiovascular System', status: 'HIGH', score: 72, keyMetrics: 'HR 112 bpm (Sinus Tachycardia), BP 138/86 mmHg', clinicalNote: 'Compensatory tachycardia to maintain tissue oxygenation in hypoxemic state.' },
        { system: 'thermoregulatory', name: 'Thermoregulation', status: 'HIGH', score: 68, keyMetrics: 'Core Temp 38.1°C (Febrile spike)', clinicalNote: 'Active inflammatory response to systemic bacterial burden.' },
        { system: 'metabolic', name: 'Metabolic & Acid-Base', status: 'MEDIUM', score: 45, keyMetrics: 'Lactate 2.4 mmol/L, Glucose 142 mg/dL', clinicalNote: 'Mild hyperlactatemia indicating borderline anaerobic tissue perfusion.' },
        { system: 'renal', name: 'Renal Function', status: 'STABLE', score: 20, keyMetrics: 'Urine Output: 45 mL/hr, Creatinine 1.2 mg/dL', clinicalNote: 'Preserved glomerular filtration with adequate intravascular hydration.' },
        { system: 'neurological', name: 'Central Nervous System', status: 'STABLE', score: 15, keyMetrics: 'GCS 15, Alert, anxious due to air hunger', clinicalNote: 'No focal neuro deficits; mild hypoxemic agitation noted.' },
      ],
      stateDeltas: [
        { parameter: 'SpO₂ Saturation', previousValue: '94%', currentValue: '86%', changeType: 'worsened', timestamp: '11:13 AM' },
        { parameter: 'Respiratory Rate', previousValue: '22 /min', currentValue: '28 /min', changeType: 'worsened', timestamp: '11:13 AM' },
        { parameter: 'Heart Rate', previousValue: '96 bpm', currentValue: '112 bpm', changeType: 'worsened', timestamp: '11:13 AM' },
        { parameter: 'Core Temperature', previousValue: '37.8 °C', currentValue: '38.1 °C', changeType: 'worsened', timestamp: '11:12 AM' },
        { parameter: 'Risk Level', previousValue: 'MEDIUM', currentValue: 'CRITICAL', changeType: 'worsened', timestamp: '11:13 AM' },
      ],
      twinTimeline: [
        { timestamp: '11:13:08 AM', event: 'AI Explanation Agent synthesized clinical rationale and prioritized 5 action guidelines.', source: 'Explanation Agent', impact: 'high' },
        { timestamp: '11:13:06 AM', event: 'Escalation Agent upgraded alert severity to CRITICAL (Immediate Review Required).', source: 'Escalation Agent', impact: 'high' },
        { timestamp: '11:13:05 AM', event: 'Prediction Agent estimated 78% probability of acute respiratory failure within 4-6h.', source: 'Prediction Agent', impact: 'high' },
        { timestamp: '11:13:04 AM', event: 'Monitoring Agent detected threshold breach: SpO₂ dropped < 88% with tachypnea 28/min.', source: 'Monitoring Agent', impact: 'high' },
        { timestamp: '10:00:00 AM', event: 'Routine morning vital batch ingested from ICU bedside gateway.', source: 'Telemetry Gateway', impact: 'low' },
      ]
    },
    patientContext: {
      consciousState: 'Conscious and responsive',
      oxygenSupport: 'On oxygen support (2 L/min via Nasal Cannula)',
      urineOutput: 'Urine output: Adequate (45 mL/hr)',
      distressLevel: 'Mild tachypneic distress'
    },
    events: [
      { id: 'e1', time: '11:13 AM', description: 'Critical alert generated: High risk of respiratory deterioration', category: 'agent_alert' },
      { id: 'e2', time: '10:30 AM', description: 'ABG collected: PaO2 64 mmHg, PaCO2 42 mmHg', category: 'vital_change' },
      { id: 'e3', time: '08:00 AM', description: 'Morning rounds by Dr. S. Mehta: Patient noted to have coarse crackles at right base', category: 'clinical_review' },
      { id: 'e4', time: '10 Sep 2026', description: 'Admitted to ICU Bed 05 from Emergency with acute community acquired pneumonia', category: 'admission' }
    ]
  },
  {
    id: 'PT-10024',
    patientId: 'PT-10024',
    name: 'Elena Rostova',
    age: 48,
    gender: 'Female',
    room: 'ICU - Bed 02',
    ward: 'ICU',
    diagnosis: 'Post-Surgical Sepsis / Peritonitis',
    admissionDate: '12 Sep 2026',
    attendingPhysician: 'Dr. N. D',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'CRITICAL',
    riskScore: 84,
    trend: 'Deteriorating',
    lastUpdated: '2 mins ago',
    vitals: {
      heartRate: {
        value: 124,
        unit: 'bpm',
        normalRange: '60–100',
        status: 'critical-high',
        trend: 'increasing',
        lastUpdated: '11:10 AM',
        history: [{ time: '06:00', value: 95 }, { time: '08:00', value: 108 }, { time: '10:00', value: 118 }, { time: '11:00', value: 124 }]
      },
      temperature: {
        value: 39.2,
        unit: '°C',
        normalRange: '36.5–37.5',
        status: 'critical-high',
        trend: 'increasing',
        lastUpdated: '11:05 AM',
        history: [{ time: '06:00', value: 38.0 }, { time: '08:00', value: 38.6 }, { time: '10:00', value: 39.0 }, { time: '11:00', value: 39.2 }]
      },
      respiratoryRate: {
        value: 26,
        unit: '/min',
        normalRange: '12–20',
        status: 'high',
        trend: 'increasing',
        lastUpdated: '11:10 AM',
        history: [{ time: '06:00', value: 18 }, { time: '08:00', value: 22 }, { time: '10:00', value: 24 }, { time: '11:00', value: 26 }]
      },
      spO2: {
        value: 93,
        unit: '%',
        normalRange: '95–100',
        status: 'low',
        trend: 'decreasing',
        lastUpdated: '11:10 AM',
        history: [{ time: '06:00', value: 98 }, { time: '08:00', value: 96 }, { time: '10:00', value: 94 }, { time: '11:00', value: 93 }]
      },
      bloodPressure: {
        value: '88/54',
        systolic: 88,
        diastolic: 54,
        unit: 'mmHg',
        normalRange: '< 120/80',
        status: 'critical-low',
        trend: 'decreasing',
        lastUpdated: '11:08 AM',
        history: [{ time: '06:00', value: 115 }, { time: '08:00', value: 102 }, { time: '10:00', value: 92 }, { time: '11:00', value: 88 }]
      },
      glucose: {
        value: 168,
        unit: 'mg/dL',
        normalRange: '70–140',
        status: 'high',
        trend: 'increasing',
        lastUpdated: '09:00 AM',
        history: [{ time: '06:00', value: 140 }, { time: '09:00', value: 168 }]
      }
    },
    medicalHistory: ['Laparoscopic Appendectomy (48h ago)', 'Hypothyroidism'],
    medications: [
      { id: 'm21', name: 'Norepinephrine Infusion', dosage: '0.08 mcg/kg/min', frequency: 'Continuous', route: 'Central Line', status: 'active' },
      { id: 'm22', name: 'Meropenem IV', dosage: '1g', frequency: 'Q8H', route: 'IV', status: 'active' },
      { id: 'm23', name: 'Normal Saline 0.9%', dosage: '1000 mL bolus', frequency: 'Stat', route: 'IV', status: 'active' },
    ],
    allergies: ['Latex'],
    recentLabs: [
      { id: 'l21', name: 'Serum Lactate', value: '3.8', unit: 'mmol/L', normalRange: '0.5–2.0', status: 'critical', date: '14 Sep 10:45 AM' },
      { id: 'l22', name: 'Procalcitonin', value: '14.2', unit: 'ng/mL', normalRange: '< 0.5', status: 'critical', date: '14 Sep 08:30 AM' },
      { id: 'l23', name: 'WBC Count', value: '22.1', unit: 'x10^9/L', normalRange: '4.0–11.0', status: 'critical', date: '14 Sep 08:30 AM' },
    ],
    digitalTwin: {
      patientId: 'PT-10024',
      lastSynchronized: '14 Sep 2026 11:11:15 AM',
      dataFreshnessMs: 14,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Bedside Monitor #ICU-02', 'Arterial Line Sensor', 'IV Smart Pump'],
      physiologicalState: {} as any,
      organSystems: [
        { system: 'cardiovascular', name: 'Cardiovascular System', status: 'CRITICAL', score: 92, keyMetrics: 'MAP 65 mmHg, HR 124 bpm, Lactate 3.8', clinicalNote: 'Septic vasodilatory shock refractory to initial 30 mL/kg fluid bolus.' },
        { system: 'thermoregulatory', name: 'Thermoregulation', status: 'CRITICAL', score: 90, keyMetrics: '39.2°C (Hyperpyrexia)', clinicalNote: 'Severe hyperpyrexic cytokine surge.' },
        { system: 'renal', name: 'Renal System', status: 'HIGH', score: 65, keyMetrics: 'Oliguria < 20 mL/hr', clinicalNote: 'Acute pre-renal hypoperfusion.' },
        { system: 'respiratory', name: 'Respiratory System', status: 'MEDIUM', score: 50, keyMetrics: 'RR 26/min, SpO₂ 93%', clinicalNote: 'Compensatory tachypnea for metabolic acidosis.' },
        { system: 'metabolic', name: 'Metabolic & Acid-Base', status: 'HIGH', score: 75, keyMetrics: 'Lactate 3.8 mmol/L, pH 7.28', clinicalNote: 'Lactic metabolic acidosis.' },
        { system: 'neurological', name: 'Central Nervous System', status: 'MEDIUM', score: 40, keyMetrics: 'GCS 13, Lethargic', clinicalNote: 'Early sepsis-associated encephalopathy.' }
      ],
      stateDeltas: [
        { parameter: 'Systolic BP', previousValue: '102 mmHg', currentValue: '88 mmHg', changeType: 'worsened', timestamp: '11:08 AM' },
        { parameter: 'Heart Rate', previousValue: '108 bpm', currentValue: '124 bpm', changeType: 'worsened', timestamp: '11:10 AM' },
        { parameter: 'Serum Lactate', previousValue: '2.1 mmol/L', currentValue: '3.8 mmol/L', changeType: 'worsened', timestamp: '10:45 AM' },
      ],
      twinTimeline: [
        { timestamp: '11:10:00 AM', event: 'Escalation Agent triggered CODE SEPSIS PROTOCOL alert.', source: 'Escalation Agent', impact: 'high' },
        { timestamp: '10:45:00 AM', event: 'Lactate elevation above 3.5 threshold detected.', source: 'Monitoring Agent', impact: 'high' }
      ]
    },
    patientContext: {
      consciousState: 'Lethargic but arousable',
      oxygenSupport: 'High Flow Cannula (40% FiO2)',
      urineOutput: 'Oliguric (18 mL/hr)',
      distressLevel: 'Moderate distress, diaphoretic'
    },
    events: [
      { id: 'e21', time: '11:10 AM', description: 'Critical alert: Septic shock progression with hypotension', category: 'agent_alert' },
      { id: 'e22', time: '10:45 AM', description: 'Stat Lactate 3.8 mmol/L reported', category: 'vital_change' },
    ]
  },
  {
    id: 'PT-10025',
    patientId: 'PT-10025',
    name: 'Arthur Pendelton',
    age: 74,
    gender: 'Male',
    room: 'Cardiology - Bed 12',
    ward: 'Cardiology',
    diagnosis: 'Acute Decompensated Heart Failure (NYHA IV)',
    admissionDate: '13 Sep 2026',
    attendingPhysician: 'Dr. C. Lin',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'HIGH',
    riskScore: 68,
    trend: 'Deteriorating',
    lastUpdated: '5 mins ago',
    vitals: {
      heartRate: {
        value: 104,
        unit: 'bpm',
        normalRange: '60–100',
        status: 'high',
        trend: 'increasing',
        lastUpdated: '11:08 AM',
        history: [{ time: '06:00', value: 88 }, { time: '08:00', value: 94 }, { time: '10:00', value: 100 }, { time: '11:00', value: 104 }]
      },
      temperature: {
        value: 36.8,
        unit: '°C',
        normalRange: '36.5–37.5',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 36.7 }, { time: '08:00', value: 36.8 }, { time: '11:00', value: 36.8 }]
      },
      respiratoryRate: {
        value: 24,
        unit: '/min',
        normalRange: '12–20',
        status: 'high',
        trend: 'increasing',
        lastUpdated: '11:08 AM',
        history: [{ time: '06:00', value: 18 }, { time: '08:00', value: 20 }, { time: '10:00', value: 22 }, { time: '11:00', value: 24 }]
      },
      spO2: {
        value: 91,
        unit: '%',
        normalRange: '95–100',
        status: 'low',
        trend: 'decreasing',
        lastUpdated: '11:08 AM',
        history: [{ time: '06:00', value: 95 }, { time: '08:00', value: 93 }, { time: '10:00', value: 92 }, { time: '11:00', value: 91 }]
      },
      bloodPressure: {
        value: '164/98',
        systolic: 164,
        diastolic: 98,
        unit: 'mmHg',
        normalRange: '< 120/80',
        status: 'critical-high',
        trend: 'increasing',
        lastUpdated: '11:05 AM',
        history: [{ time: '06:00', value: 142 }, { time: '08:00', value: 150 }, { time: '10:00', value: 158 }, { time: '11:00', value: 164 }]
      }
    },
    medicalHistory: ['Ischemic Cardiomyopathy (EF 28%)', 'Atrial Fibrillation', 'CKD Stage 3a'],
    medications: [
      { id: 'm31', name: 'Furosemide IV Bolus', dosage: '80mg', frequency: 'BID', route: 'IV', status: 'active' },
      { id: 'm32', name: 'Nitroglycerin Infusion', dosage: '20 mcg/min', frequency: 'Titrated', route: 'IV', status: 'active' },
      { id: 'm33', name: 'Bisoprolol', dosage: '2.5mg', frequency: 'Daily (Held)', route: 'Oral', status: 'paused' },
    ],
    allergies: ['ACE Inhibitors (Severe angioedema)'],
    recentLabs: [
      { id: 'l31', name: 'NT-proBNP', value: '8,420', unit: 'pg/mL', normalRange: '< 300', status: 'critical', date: '14 Sep 09:00 AM' },
      { id: 'l32', name: 'Troponin I', value: '0.04', unit: 'ng/mL', normalRange: '< 0.03', status: 'abnormal', date: '14 Sep 09:00 AM' },
    ],
    digitalTwin: {
      patientId: 'PT-10025',
      lastSynchronized: '14 Sep 2026 11:08:30 AM',
      dataFreshnessMs: 22,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Telemetry #CARD-12', 'Continuous NIBP'],
      physiologicalState: {} as any,
      organSystems: [
        { system: 'cardiovascular', name: 'Cardiovascular System', status: 'HIGH', score: 76, keyMetrics: 'BP 164/98, NT-proBNP 8,420, S3 gallop', clinicalNote: 'Acute afterload mismatch and pulmonary venous congestion.' },
        { system: 'respiratory', name: 'Respiratory System', status: 'HIGH', score: 70, keyMetrics: 'SpO₂ 91%, Bilateral basal rales', clinicalNote: 'Cardiogenic pulmonary edema.' },
        { system: 'renal', name: 'Renal System', status: 'MEDIUM', score: 45, keyMetrics: 'BUN/Cr ratio 24', clinicalNote: 'Cardiorenal syndrome Type 1.' },
      ],
      stateDeltas: [
        { parameter: 'Systolic BP', previousValue: '150 mmHg', currentValue: '164 mmHg', changeType: 'worsened', timestamp: '11:05 AM' },
        { parameter: 'SpO₂', previousValue: '93%', currentValue: '91%', changeType: 'worsened', timestamp: '11:08 AM' }
      ],
      twinTimeline: [
        { timestamp: '11:08 AM', event: 'Prediction Agent flagged 68% risk of flash pulmonary edema.', source: 'Prediction Agent', impact: 'high' }
      ]
    },
    patientContext: {
      consciousState: 'Alert, orthopneic',
      oxygenSupport: '4 L/min via Venturi Mask',
      urineOutput: 'Moderate post-diuretic (60 mL/hr)',
      distressLevel: 'Moderate dyspnea when flat'
    },
    events: [
      { id: 'e31', time: '11:08 AM', description: 'Elevated pulmonary congestion risk flagged by AI', category: 'agent_alert' }
    ]
  },
  {
    id: 'PT-10026',
    patientId: 'PT-10026',
    name: 'Sarah Jenkins',
    age: 34,
    gender: 'Female',
    room: 'Pulmonology - Bed 04',
    ward: 'Pulmonology',
    diagnosis: 'Acute Severe Asthma Exacerbation',
    admissionDate: '13 Sep 2026',
    attendingPhysician: 'Dr. S. Mehta',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'HIGH',
    riskScore: 64,
    trend: 'Improving',
    lastUpdated: '10 mins ago',
    vitals: {
      heartRate: {
        value: 98,
        unit: 'bpm',
        normalRange: '60–100',
        status: 'normal',
        trend: 'decreasing',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 118 }, { time: '08:00', value: 108 }, { time: '10:00', value: 102 }, { time: '11:00', value: 98 }]
      },
      temperature: {
        value: 37.1,
        unit: '°C',
        normalRange: '36.5–37.5',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 37.0 }, { time: '11:00', value: 37.1 }]
      },
      respiratoryRate: {
        value: 21,
        unit: '/min',
        normalRange: '12–20',
        status: 'high',
        trend: 'decreasing',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 30 }, { time: '08:00', value: 26 }, { time: '10:00', value: 23 }, { time: '11:00', value: 21 }]
      },
      spO2: {
        value: 95,
        unit: '%',
        normalRange: '95–100',
        status: 'normal',
        trend: 'increasing',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 89 }, { time: '08:00', value: 92 }, { time: '10:00', value: 94 }, { time: '11:00', value: 95 }]
      },
      bloodPressure: {
        value: '122/78',
        systolic: 122,
        diastolic: 78,
        unit: 'mmHg',
        normalRange: '< 120/80',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 136 }, { time: '11:00', value: 122 }]
      }
    },
    medicalHistory: ['Brittle Asthma (diagnosed age 12)', 'Allergic Rhinitis'],
    medications: [
      { id: 'm41', name: 'Methylprednisolone IV', dosage: '40mg', frequency: 'Q12H', route: 'IV', status: 'active' },
      { id: 'm42', name: 'Ipratropium + Albuterol Neb', dosage: '0.5/2.5mg', frequency: 'Q4H', route: 'Inhaled', status: 'active' },
      { id: 'm43', name: 'Magnesium Sulfate IV', dosage: '2g', frequency: 'Single dose completed', route: 'IV', status: 'completed' },
    ],
    allergies: ['Aspirin (Bronchospasm / Samter Triad)', 'NSAIDs'],
    recentLabs: [
      { id: 'l41', name: 'Peak Expiratory Flow (PEF)', value: '310', unit: 'L/min', normalRange: '450–550', status: 'abnormal', date: '14 Sep 10:00 AM' }
    ],
    digitalTwin: {
      patientId: 'PT-10026',
      lastSynchronized: '14 Sep 2026 11:00:00 AM',
      dataFreshnessMs: 35,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Bedside Monitor', 'Spirometer Link'],
      physiologicalState: {} as any,
      organSystems: [
        { system: 'respiratory', name: 'Respiratory System', status: 'HIGH', score: 62, keyMetrics: 'PEF 310 L/min, SpO₂ 95% on 2L', clinicalNote: 'Post-bronchodilator improvement; expiratory wheezing resolving.' },
        { system: 'cardiovascular', name: 'Cardiovascular System', status: 'STABLE', score: 25, keyMetrics: 'HR 98 bpm', clinicalNote: 'Tachycardia from beta-agonist therapy diminishing.' }
      ],
      stateDeltas: [
        { parameter: 'SpO₂', previousValue: '92%', currentValue: '95%', changeType: 'improved', timestamp: '11:00 AM' },
        { parameter: 'Respiratory Rate', previousValue: '26 /min', currentValue: '21 /min', changeType: 'improved', timestamp: '11:00 AM' }
      ],
      twinTimeline: [
        { timestamp: '11:00 AM', event: 'Monitoring Agent detected significant clinical improvement post-nebulization.', source: 'Monitoring Agent', impact: 'medium' }
      ]
    },
    patientContext: {
      consciousState: 'Conscious, speaking in full sentences',
      oxygenSupport: 'Nasal Cannula 2 L/min',
      urineOutput: 'Normal',
      distressLevel: 'Minimal distress'
    },
    events: [
      { id: 'e41', time: '11:00 AM', description: 'Patient responding well to IV steroids and bronchodilators', category: 'clinical_review' }
    ]
  },
  {
    id: 'PT-10027',
    patientId: 'PT-10027',
    name: 'Marcus Vance',
    age: 57,
    gender: 'Male',
    room: 'ICU - Bed 01',
    ward: 'ICU',
    diagnosis: 'Acute Coronary Syndrome (NSTEMI) / Post-PCI',
    admissionDate: '12 Sep 2026',
    attendingPhysician: 'Dr. C. Lin',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'MEDIUM',
    riskScore: 48,
    trend: 'Stable',
    lastUpdated: '12 mins ago',
    vitals: {
      heartRate: {
        value: 74,
        unit: 'bpm',
        normalRange: '60–100',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 76 }, { time: '08:00', value: 72 }, { time: '11:00', value: 74 }]
      },
      temperature: {
        value: 36.6,
        unit: '°C',
        normalRange: '36.5–37.5',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 36.6 }, { time: '11:00', value: 36.6 }]
      },
      respiratoryRate: {
        value: 16,
        unit: '/min',
        normalRange: '12–20',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 16 }, { time: '11:00', value: 16 }]
      },
      spO2: {
        value: 98,
        unit: '%',
        normalRange: '95–100',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 98 }, { time: '11:00', value: 98 }]
      },
      bloodPressure: {
        value: '126/82',
        systolic: 126,
        diastolic: 82,
        unit: 'mmHg',
        normalRange: '< 120/80',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '11:00 AM',
        history: [{ time: '06:00', value: 130 }, { time: '11:00', value: 126 }]
      }
    },
    medicalHistory: ['Hyperlipidemia', 'Smoking (30 pack-years, quit 2025)'],
    medications: [
      { id: 'm51', name: 'Ticagrelor', dosage: '90mg', frequency: 'BID', route: 'Oral', status: 'active' },
      { id: 'm52', name: 'Aspirin', dosage: '81mg', frequency: 'Daily', route: 'Oral', status: 'active' },
      { id: 'm53', name: 'Atorvastatin', dosage: '80mg', frequency: 'QHS', route: 'Oral', status: 'active' },
      { id: 'm54', name: 'Metoprolol Succinate', dosage: '25mg', frequency: 'Daily', route: 'Oral', status: 'active' },
    ],
    allergies: ['No known drug allergies'],
    recentLabs: [
      { id: 'l51', name: 'Troponin T (Peak)', value: '0.45', unit: 'ng/mL', normalRange: '< 0.01', status: 'abnormal', date: '13 Sep 18:00' },
      { id: 'l52', name: 'Troponin T (Current)', value: '0.12', unit: 'ng/mL', normalRange: '< 0.01', status: 'abnormal', date: '14 Sep 06:00 AM' }
    ],
    digitalTwin: {
      patientId: 'PT-10027',
      lastSynchronized: '14 Sep 2026 11:00:00 AM',
      dataFreshnessMs: 28,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['12-Lead Holter ECG', 'Bedside Monitor #ICU-01'],
      physiologicalState: {} as any,
      organSystems: [
        { system: 'cardiovascular', name: 'Cardiovascular System', status: 'MEDIUM', score: 48, keyMetrics: 'Normal sinus rhythm, DES stent in LAD patent', clinicalNote: 'Hemodynamically stable post-stenting. Troponin downtrending.' }
      ],
      stateDeltas: [
        { parameter: 'Troponin T', previousValue: '0.45 ng/mL', currentValue: '0.12 ng/mL', changeType: 'improved', timestamp: '06:00 AM' }
      ],
      twinTimeline: [
        { timestamp: '11:00 AM', event: 'Digital Twin state verified: Post-PCI stabilization on track.', source: 'Monitoring Agent', impact: 'low' }
      ]
    },
    patientContext: {
      consciousState: 'Alert, pain-free',
      oxygenSupport: 'Room air',
      urineOutput: 'Adequate',
      distressLevel: 'No distress'
    },
    events: [
      { id: 'e51', time: '11:00 AM', description: 'Patient scheduled for step-down to Cardiology telemetry floor', category: 'clinical_review' }
    ]
  },
  {
    id: 'PT-10028',
    patientId: 'PT-10028',
    name: 'Fatima Al-Mansoor',
    age: 29,
    gender: 'Female',
    room: 'General Ward - Room 302',
    ward: 'General Ward',
    diagnosis: 'Post-Cesarean Section Day 2',
    admissionDate: '12 Sep 2026',
    attendingPhysician: 'Dr. N. D',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'STABLE',
    riskScore: 12,
    trend: 'Stable',
    lastUpdated: '15 mins ago',
    vitals: {
      heartRate: {
        value: 68,
        unit: 'bpm',
        normalRange: '60–100',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '10:55 AM',
        history: [{ time: '06:00', value: 70 }, { time: '10:55', value: 68 }]
      },
      temperature: {
        value: 36.7,
        unit: '°C',
        normalRange: '36.5–37.5',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '10:55 AM',
        history: [{ time: '06:00', value: 36.6 }, { time: '10:55', value: 36.7 }]
      },
      respiratoryRate: {
        value: 15,
        unit: '/min',
        normalRange: '12–20',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '10:55 AM',
        history: [{ time: '06:00', value: 14 }, { time: '10:55', value: 15 }]
      },
      spO2: {
        value: 99,
        unit: '%',
        normalRange: '95–100',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '10:55 AM',
        history: [{ time: '06:00', value: 99 }, { time: '10:55', value: 99 }]
      },
      bloodPressure: {
        value: '114/72',
        systolic: 114,
        diastolic: 72,
        unit: 'mmHg',
        normalRange: '< 120/80',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '10:55 AM',
        history: [{ time: '06:00', value: 118 }, { time: '10:55', value: 114 }]
      }
    },
    medicalHistory: ['Primigravida, Elective C-section'],
    medications: [
      { id: 'm61', name: 'Acetaminophen', dosage: '1000mg', frequency: 'Q6H PRN', route: 'Oral', status: 'active' },
      { id: 'm62', name: 'Ibuprofen', dosage: '400mg', frequency: 'Q8H PRN', route: 'Oral', status: 'active' },
    ],
    allergies: ['No known allergies'],
    recentLabs: [
      { id: 'l61', name: 'Hemoglobin', value: '11.8', unit: 'g/dL', normalRange: '12.0–15.5', status: 'normal', date: '13 Sep 08:00 AM' }
    ],
    digitalTwin: {
      patientId: 'PT-10028',
      lastSynchronized: '14 Sep 2026 10:55:00 AM',
      dataFreshnessMs: 42,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Wearable Patient Tag #GW-302'],
      physiologicalState: {} as any,
      organSystems: [
        { system: 'cardiovascular', name: 'Cardiovascular System', status: 'STABLE', score: 10, keyMetrics: 'BP 114/72, HR 68', clinicalNote: 'Euvolemic, stable.' }
      ],
      stateDeltas: [],
      twinTimeline: [
        { timestamp: '10:55 AM', event: 'Routine vital spot-check: All metrics within target baseline.', source: 'Wearable Sync', impact: 'low' }
      ]
    },
    patientContext: {
      consciousState: 'Alert, ambulating well',
      oxygenSupport: 'Room air',
      urineOutput: 'Normal',
      distressLevel: 'Mild surgical incision tenderness, well controlled'
    },
    events: [
      { id: 'e61', time: '10:55 AM', description: 'Patient meeting all discharge criteria for tomorrow', category: 'clinical_review' }
    ]
  },
  {
    id: 'PT-10029',
    patientId: 'PT-10029',
    name: 'David Chen',
    age: 51,
    gender: 'Male',
    room: 'Emergency - Bay 03',
    ward: 'Emergency',
    diagnosis: 'Diabetic Ketoacidosis (DKA)',
    admissionDate: '14 Sep 2026',
    attendingPhysician: 'Dr. N. D',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'HIGH',
    riskScore: 71,
    trend: 'Deteriorating',
    lastUpdated: '8 mins ago',
    vitals: {
      heartRate: {
        value: 116,
        unit: 'bpm',
        normalRange: '60–100',
        status: 'high',
        trend: 'increasing',
        lastUpdated: '11:02 AM',
        history: [{ time: '08:00', value: 102 }, { time: '09:30', value: 110 }, { time: '11:00', value: 116 }]
      },
      temperature: {
        value: 37.3,
        unit: '°C',
        normalRange: '36.5–37.5',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '11:00 AM',
        history: [{ time: '08:00', value: 37.2 }, { time: '11:00', value: 37.3 }]
      },
      respiratoryRate: {
        value: 29,
        unit: '/min',
        normalRange: '12–20',
        status: 'critical-high',
        trend: 'increasing',
        lastUpdated: '11:02 AM',
        history: [{ time: '08:00', value: 22 }, { time: '09:30', value: 26 }, { time: '11:00', value: 29 }]
      },
      spO2: {
        value: 97,
        unit: '%',
        normalRange: '95–100',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '11:02 AM',
        history: [{ time: '08:00', value: 98 }, { time: '11:00', value: 97 }]
      },
      bloodPressure: {
        value: '104/64',
        systolic: 104,
        diastolic: 64,
        unit: 'mmHg',
        normalRange: '< 120/80',
        status: 'low',
        trend: 'decreasing',
        lastUpdated: '11:02 AM',
        history: [{ time: '08:00', value: 118 }, { time: '11:00', value: 104 }]
      },
      glucose: {
        value: 480,
        unit: 'mg/dL',
        normalRange: '70–140',
        status: 'critical-high',
        trend: 'increasing',
        lastUpdated: '10:45 AM',
        history: [{ time: '08:00', value: 420 }, { time: '10:45', value: 480 }]
      }
    },
    medicalHistory: ['Type 1 Diabetes Mellitus', 'Prior DKA admission (2023)'],
    medications: [
      { id: 'm71', name: 'Regular Insulin IV Infusion', dosage: '0.1 units/kg/hr', frequency: 'Continuous', route: 'IV', status: 'active' },
      { id: 'm72', name: '0.9% Normal Saline', dosage: '1000 mL/hr', frequency: 'Continuous', route: 'IV', status: 'active' },
      { id: 'm73', name: 'Potassium Chloride', dosage: '20 mEq/L', frequency: 'In IVF', route: 'IV', status: 'active' },
    ],
    allergies: ['No known allergies'],
    recentLabs: [
      { id: 'l71', name: 'Venous Blood Gas (pH)', value: '7.14', unit: '', normalRange: '7.35–7.45', status: 'critical', date: '14 Sep 10:45 AM' },
      { id: 'l72', name: 'Serum Beta-Hydroxybutyrate', value: '5.8', unit: 'mmol/L', normalRange: '< 0.5', status: 'critical', date: '14 Sep 10:45 AM' },
      { id: 'l73', name: 'Anion Gap', value: '26', unit: 'mEq/L', normalRange: '4–12', status: 'critical', date: '14 Sep 10:45 AM' },
    ],
    digitalTwin: {
      patientId: 'PT-10029',
      lastSynchronized: '14 Sep 2026 11:02:00 AM',
      dataFreshnessMs: 16,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Emergency Bedside Monitor #ED-03', 'Continuous Glucose Stream'],
      physiologicalState: {} as any,
      organSystems: [
        { system: 'metabolic', name: 'Metabolic & Endocrine', status: 'CRITICAL', score: 94, keyMetrics: 'Glucose 480 mg/dL, Anion Gap 26, pH 7.14', clinicalNote: 'Severe ketoacidosis with high anion gap.' },
        { system: 'respiratory', name: 'Respiratory System', status: 'HIGH', score: 72, keyMetrics: 'RR 29/min (Kussmaul breathing)', clinicalNote: 'Deep, rapid respiratory compensation for metabolic acidosis.' }
      ],
      stateDeltas: [
        { parameter: 'Blood Glucose', previousValue: '420 mg/dL', currentValue: '480 mg/dL', changeType: 'worsened', timestamp: '10:45 AM' },
        { parameter: 'Respiratory Rate', previousValue: '22 /min', currentValue: '29 /min', changeType: 'worsened', timestamp: '11:02 AM' }
      ],
      twinTimeline: [
        { timestamp: '11:02 AM', event: 'Monitoring Agent detected Kussmaul tachypneic pattern (RR 29/min).', source: 'Monitoring Agent', impact: 'high' }
      ]
    },
    patientContext: {
      consciousState: 'Lethargic, fruity breath odor noted',
      oxygenSupport: 'Room air',
      urineOutput: 'Polyuric (> 120 mL/hr)',
      distressLevel: 'Dehydrated, tachypneic'
    },
    events: [
      { id: 'e71', time: '11:02 AM', description: 'DKA protocol initiated; insulin drip adjusted', category: 'agent_alert' }
    ]
  },
  {
    id: 'PT-10030',
    patientId: 'PT-10030',
    name: 'Eleanor Higgins',
    age: 81,
    gender: 'Female',
    room: 'Surgical ICU - Bed 03',
    ward: 'Surgical ICU',
    diagnosis: 'Post-Operative Hip Replacement / Delirium',
    admissionDate: '13 Sep 2026',
    attendingPhysician: 'Dr. S. Mehta',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'MEDIUM',
    riskScore: 42,
    trend: 'Stable',
    lastUpdated: '18 mins ago',
    vitals: {
      heartRate: {
        value: 82,
        unit: 'bpm',
        normalRange: '60–100',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '10:50 AM',
        history: [{ time: '06:00', value: 80 }, { time: '10:50', value: 82 }]
      },
      temperature: {
        value: 37.0,
        unit: '°C',
        normalRange: '36.5–37.5',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '10:50 AM',
        history: [{ time: '06:00', value: 36.9 }, { time: '10:50', value: 37.0 }]
      },
      respiratoryRate: {
        value: 17,
        unit: '/min',
        normalRange: '12–20',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '10:50 AM',
        history: [{ time: '06:00', value: 16 }, { time: '10:50', value: 17 }]
      },
      spO2: {
        value: 96,
        unit: '%',
        normalRange: '95–100',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '10:50 AM',
        history: [{ time: '06:00', value: 96 }, { time: '10:50', value: 96 }]
      },
      bloodPressure: {
        value: '132/76',
        systolic: 132,
        diastolic: 76,
        unit: 'mmHg',
        normalRange: '< 120/80',
        status: 'normal',
        trend: 'stable',
        lastUpdated: '10:50 AM',
        history: [{ time: '06:00', value: 135 }, { time: '10:50', value: 132 }]
      }
    },
    medicalHistory: ['Osteoarthritis', 'Mild Cognitive Impairment'],
    medications: [
      { id: 'm81', name: 'Enoxaparin', dosage: '40mg', frequency: 'SubQ Daily', route: 'SubQ', status: 'active' },
      { id: 'm82', name: 'Oxycodone', dosage: '5mg', frequency: 'Q4H PRN', route: 'Oral', status: 'active' },
    ],
    allergies: ['Codeine (Nausea/vomiting)'],
    recentLabs: [
      { id: 'l81', name: 'Hemoglobin', value: '10.2', unit: 'g/dL', normalRange: '12.0–15.5', status: 'abnormal', date: '14 Sep 06:00 AM' }
    ],
    digitalTwin: {
      patientId: 'PT-10030',
      lastSynchronized: '14 Sep 2026 10:50:00 AM',
      dataFreshnessMs: 50,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['SICU Monitor #03'],
      physiologicalState: {} as any,
      organSystems: [
        { system: 'neurological', name: 'Neurological System', status: 'MEDIUM', score: 45, keyMetrics: 'CAM-ICU Positive (Fluctuating attention)', clinicalNote: 'Post-op hypoactive delirium secondary to opioid analgesia.' }
      ],
      stateDeltas: [],
      twinTimeline: [
        { timestamp: '10:50 AM', event: 'Digital Twin CAM-ICU scoring updated: Mild delirium screen positive.', source: 'Monitoring Agent', impact: 'medium' }
      ]
    },
    patientContext: {
      consciousState: 'Confused to time, oriented to person',
      oxygenSupport: 'Room air',
      urineOutput: 'Adequate via Foley catheter',
      distressLevel: 'Restless, attempting to pull line'
    },
    events: [
      { id: 'e81', time: '10:50 AM', description: 'Delirium non-pharmacological precautions enacted', category: 'clinical_review' }
    ]
  },
  // Additional 8 patients for total 16
  {
    id: 'PT-10031',
    patientId: 'PT-10031',
    name: 'Robert Thorne',
    age: 65,
    gender: 'Male',
    room: 'ICU - Bed 06',
    ward: 'ICU',
    diagnosis: 'Acute Respiratory Distress Syndrome (ARDS)',
    admissionDate: '11 Sep 2026',
    attendingPhysician: 'Dr. S. Mehta',
    riskLevel: 'CRITICAL',
    riskScore: 89,
    trend: 'Deteriorating',
    lastUpdated: '4 mins ago',
    vitals: {
      heartRate: { value: 118, unit: 'bpm', normalRange: '60–100', status: 'high', trend: 'increasing', lastUpdated: '11:09 AM', history: [{ time: '08:00', value: 105 }, { time: '11:00', value: 118 }] },
      temperature: { value: 38.4, unit: '°C', normalRange: '36.5–37.5', status: 'high', trend: 'increasing', lastUpdated: '11:09 AM', history: [{ time: '08:00', value: 37.9 }, { time: '11:00', value: 38.4 }] },
      respiratoryRate: { value: 32, unit: '/min', normalRange: '12–20', status: 'critical-high', trend: 'increasing', lastUpdated: '11:09 AM', history: [{ time: '08:00', value: 26 }, { time: '11:00', value: 32 }] },
      spO2: { value: 85, unit: '%', normalRange: '95–100', status: 'critical-low', trend: 'decreasing', lastUpdated: '11:09 AM', history: [{ time: '08:00', value: 91 }, { time: '11:00', value: 85 }] },
      bloodPressure: { value: '102/60', systolic: 102, diastolic: 60, unit: 'mmHg', normalRange: '< 120/80', status: 'low', trend: 'decreasing', lastUpdated: '11:09 AM', history: [{ time: '08:00', value: 115 }, { time: '11:00', value: 102 }] }
    },
    medicalHistory: ['Severe Viral Pneumonia', 'Hypertension'],
    medications: [{ id: 'm91', name: 'Cisatracurium Infusion', dosage: '2 mcg/kg/min', frequency: 'Continuous', route: 'IV', status: 'active' }],
    allergies: ['None'],
    recentLabs: [{ id: 'l91', name: 'PaO2/FiO2 Ratio', value: '118', unit: 'mmHg', normalRange: '> 300', status: 'critical', date: '14 Sep 10:30 AM' }],
    digitalTwin: {
      patientId: 'PT-10031',
      lastSynchronized: '14 Sep 2026 11:09:00 AM',
      dataFreshnessMs: 12,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Mechanical Ventilator Stream', 'Arterial Line'],
      physiologicalState: {} as any,
      organSystems: [{ system: 'respiratory', name: 'Respiratory System', status: 'CRITICAL', score: 96, keyMetrics: 'P/F Ratio 118, SpO₂ 85%', clinicalNote: 'Moderate-to-Severe ARDS with refractory hypoxemia.' }],
      stateDeltas: [{ parameter: 'SpO₂', previousValue: '91%', currentValue: '85%', changeType: 'worsened', timestamp: '11:09 AM' }],
      twinTimeline: [{ timestamp: '11:09 AM', event: 'Escalation Agent recommended Prone Positioning Evaluation.', source: 'Escalation Agent', impact: 'high' }]
    },
    patientContext: { consciousState: 'Intubated & sedated (RASS -4)', oxygenSupport: 'Mechanical Ventilator (FiO2 70%, PEEP 14)', urineOutput: 'Adequate', distressLevel: 'Synchronized with ventilator' },
    events: [{ id: 'e91', time: '11:09 AM', description: 'PaO2/FiO2 critical threshold breach', category: 'agent_alert' }]
  },
  {
    id: 'PT-10032',
    patientId: 'PT-10032',
    name: 'Aisha Patel',
    age: 41,
    gender: 'Female',
    room: 'General Ward - Room 108',
    ward: 'General Ward',
    diagnosis: 'Acute Pyelonephritis (Resolving)',
    admissionDate: '13 Sep 2026',
    attendingPhysician: 'Dr. N. D',
    riskLevel: 'STABLE',
    riskScore: 18,
    trend: 'Improving',
    lastUpdated: '20 mins ago',
    vitals: {
      heartRate: { value: 72, unit: 'bpm', normalRange: '60–100', status: 'normal', trend: 'stable', lastUpdated: '10:40 AM', history: [{ time: '06:00', value: 75 }, { time: '10:40', value: 72 }] },
      temperature: { value: 37.0, unit: '°C', normalRange: '36.5–37.5', status: 'normal', trend: 'decreasing', lastUpdated: '10:40 AM', history: [{ time: '06:00', value: 37.8 }, { time: '10:40', value: 37.0 }] },
      respiratoryRate: { value: 16, unit: '/min', normalRange: '12–20', status: 'normal', trend: 'stable', lastUpdated: '10:40 AM', history: [{ time: '06:00', value: 16 }, { time: '10:40', value: 16 }] },
      spO2: { value: 99, unit: '%', normalRange: '95–100', status: 'normal', trend: 'stable', lastUpdated: '10:40 AM', history: [{ time: '06:00', value: 99 }, { time: '10:40', value: 99 }] },
      bloodPressure: { value: '118/76', systolic: 118, diastolic: 76, unit: 'mmHg', normalRange: '< 120/80', status: 'normal', trend: 'stable', lastUpdated: '10:40 AM', history: [{ time: '06:00', value: 120 }, { time: '10:40', value: 118 }] }
    },
    medicalHistory: ['Recurrent UTI'],
    medications: [{ id: 'm101', name: 'Ceftriaxone IV', dosage: '1g', frequency: 'Daily', route: 'IV', status: 'active' }],
    allergies: ['Ciprofloxacin'],
    recentLabs: [{ id: 'l101', name: 'WBC', value: '9.2', unit: 'x10^9/L', normalRange: '4.0–11.0', status: 'normal', date: '14 Sep 07:00 AM' }],
    digitalTwin: {
      patientId: 'PT-10032',
      lastSynchronized: '14 Sep 2026 10:40:00 AM',
      dataFreshnessMs: 55,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Ward Sensor Network'],
      physiologicalState: {} as any,
      organSystems: [{ system: 'renal', name: 'Renal & Urinary', status: 'STABLE', score: 18, keyMetrics: 'Afebrile, flank pain improved', clinicalNote: 'Responding well to targeted antibiotic therapy.' }],
      stateDeltas: [],
      twinTimeline: [{ timestamp: '10:40 AM', event: 'Afebrile status sustained for 18 hours.', source: 'Monitoring Agent', impact: 'low' }]
    },
    patientContext: { consciousState: 'Alert, eating well', oxygenSupport: 'Room air', urineOutput: 'Normal', distressLevel: 'None' },
    events: [{ id: 'e101', time: '10:40 AM', description: 'Transition to oral antibiotics approved', category: 'clinical_review' }]
  },
  {
    id: 'PT-10033',
    patientId: 'PT-10033',
    name: 'Carlos Mendoza',
    age: 59,
    gender: 'Male',
    room: 'Cardiology - Bed 08',
    ward: 'Cardiology',
    diagnosis: 'Hypertensive Urgency / Post-Ischemic Stroke',
    admissionDate: '13 Sep 2026',
    attendingPhysician: 'Dr. C. Lin',
    riskLevel: 'MEDIUM',
    riskScore: 52,
    trend: 'Stable',
    lastUpdated: '14 mins ago',
    vitals: {
      heartRate: { value: 76, unit: 'bpm', normalRange: '60–100', status: 'normal', trend: 'stable', lastUpdated: '10:52 AM', history: [{ time: '06:00', value: 78 }, { time: '10:52', value: 76 }] },
      temperature: { value: 36.8, unit: '°C', normalRange: '36.5–37.5', status: 'normal', trend: 'stable', lastUpdated: '10:52 AM', history: [{ time: '06:00', value: 36.8 }, { time: '10:52', value: 36.8 }] },
      respiratoryRate: { value: 16, unit: '/min', normalRange: '12–20', status: 'normal', trend: 'stable', lastUpdated: '10:52 AM', history: [{ time: '06:00', value: 16 }, { time: '10:52', value: 16 }] },
      spO2: { value: 97, unit: '%', normalRange: '95–100', status: 'normal', trend: 'stable', lastUpdated: '10:52 AM', history: [{ time: '06:00', value: 97 }, { time: '10:52', value: 97 }] },
      bloodPressure: { value: '158/94', systolic: 158, diastolic: 94, unit: 'mmHg', normalRange: '< 120/80', status: 'high', trend: 'decreasing', lastUpdated: '10:52 AM', history: [{ time: '06:00', value: 185 }, { time: '08:00', value: 170 }, { time: '10:52', value: 158 }] }
    },
    medicalHistory: ['Essential Hypertension (15 years)', 'Ischemic Stroke (2025, minor left arm weakness)'],
    medications: [{ id: 'm111', name: 'Labetalol IV', dosage: '10mg', frequency: 'Q4H PRN', route: 'IV', status: 'active' }],
    allergies: ['None'],
    recentLabs: [{ id: 'l111', name: 'Serum Creatinine', value: '1.1', unit: 'mg/dL', normalRange: '0.7–1.3', status: 'normal', date: '14 Sep 08:00 AM' }],
    digitalTwin: {
      patientId: 'PT-10033',
      lastSynchronized: '14 Sep 2026 10:52:00 AM',
      dataFreshnessMs: 30,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Automated NIBP Telemetry'],
      physiologicalState: {} as any,
      organSystems: [{ system: 'cardiovascular', name: 'Cardiovascular System', status: 'MEDIUM', score: 54, keyMetrics: 'BP 158/94 (controlled decline)', clinicalNote: 'Targeting gradual BP lowering to prevent cerebral hypoperfusion.' }],
      stateDeltas: [{ parameter: 'Systolic BP', previousValue: '185 mmHg', currentValue: '158 mmHg', changeType: 'improved', timestamp: '10:52 AM' }],
      twinTimeline: [{ timestamp: '10:52 AM', event: 'Blood pressure within safe therapeutic post-stroke window.', source: 'Monitoring Agent', impact: 'low' }]
    },
    patientContext: { consciousState: 'Alert, mild residual left pronator drift', oxygenSupport: 'Room air', urineOutput: 'Adequate', distressLevel: 'None' },
    events: [{ id: 'e111', time: '10:52 AM', description: 'BP titrating smoothly towards target < 160/90', category: 'vital_change' }]
  },
  {
    id: 'PT-10034',
    patientId: 'PT-10034',
    name: 'Grace Hopper-Smith',
    age: 78,
    gender: 'Female',
    room: 'Pulmonology - Bed 02',
    ward: 'Pulmonology',
    diagnosis: 'COPD Exacerbation / Chronic Hypercapnia',
    admissionDate: '12 Sep 2026',
    attendingPhysician: 'Dr. S. Mehta',
    riskLevel: 'HIGH',
    riskScore: 66,
    trend: 'Deteriorating',
    lastUpdated: '6 mins ago',
    vitals: {
      heartRate: { value: 102, unit: 'bpm', normalRange: '60–100', status: 'high', trend: 'increasing', lastUpdated: '11:06 AM', history: [{ time: '08:00', value: 92 }, { time: '11:00', value: 102 }] },
      temperature: { value: 37.6, unit: '°C', normalRange: '36.5–37.5', status: 'high', trend: 'increasing', lastUpdated: '11:06 AM', history: [{ time: '08:00', value: 37.1 }, { time: '11:00', value: 37.6 }] },
      respiratoryRate: { value: 25, unit: '/min', normalRange: '12–20', status: 'high', trend: 'increasing', lastUpdated: '11:06 AM', history: [{ time: '08:00', value: 20 }, { time: '11:00', value: 25 }] },
      spO2: { value: 88, unit: '%', normalRange: '88–92 (COPD Target)', status: 'low', trend: 'decreasing', lastUpdated: '11:06 AM', history: [{ time: '08:00', value: 91 }, { time: '11:00', value: 88 }] },
      bloodPressure: { value: '144/88', systolic: 144, diastolic: 88, unit: 'mmHg', normalRange: '< 120/80', status: 'high', trend: 'stable', lastUpdated: '11:06 AM', history: [{ time: '08:00', value: 140 }, { time: '11:00', value: 144 }] }
    },
    medicalHistory: ['Severe Emphysema (GOLD 4)', 'Cor Pulmonale', 'Home Oxygen 2L'],
    medications: [{ id: 'm121', name: 'Prednisone', dosage: '40mg', frequency: 'Daily', route: 'Oral', status: 'active' }, { id: 'm122', name: 'BiPAP Support', dosage: 'IPAP 14 / EPAP 6', frequency: 'Nocturnal & PRN', route: 'NIV', status: 'active' }],
    allergies: ['Sulfa drugs'],
    recentLabs: [{ id: 'l121', name: 'PaCO2', value: '58', unit: 'mmHg', normalRange: '35–45', status: 'critical', date: '14 Sep 09:30 AM' }],
    digitalTwin: {
      patientId: 'PT-10034',
      lastSynchronized: '14 Sep 2026 11:06:00 AM',
      dataFreshnessMs: 20,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['NIV Device Stream', 'Pulse Oximeter'],
      physiologicalState: {} as any,
      organSystems: [{ system: 'respiratory', name: 'Respiratory System', status: 'HIGH', score: 78, keyMetrics: 'PaCO2 58, RR 25/min, SpO₂ 88%', clinicalNote: 'Respiratory muscle fatigue developing with worsening CO2 retention.' }],
      stateDeltas: [{ parameter: 'PaCO2', previousValue: '51 mmHg', currentValue: '58 mmHg', changeType: 'worsened', timestamp: '09:30 AM' }],
      twinTimeline: [{ timestamp: '11:06 AM', event: 'Prediction Agent recommended daytime BiPAP escalation.', source: 'Prediction Agent', impact: 'high' }]
    },
    patientContext: { consciousState: 'Somnolent, arousable to voice', oxygenSupport: 'Venturi Mask 28%', urineOutput: 'Adequate', distressLevel: 'Pursed-lip breathing' },
    events: [{ id: 'e121', time: '11:06 AM', description: 'BiPAP therapy duration extended by Dr. S. Mehta', category: 'clinical_review' }]
  },
  {
    id: 'PT-10035',
    patientId: 'PT-10035',
    name: 'Jonathan Miller',
    age: 44,
    gender: 'Male',
    room: 'General Ward - Room 204',
    ward: 'General Ward',
    diagnosis: 'Acute Uncomplicated Pancreatitis',
    admissionDate: '13 Sep 2026',
    attendingPhysician: 'Dr. N. D',
    riskLevel: 'STABLE',
    riskScore: 22,
    trend: 'Improving',
    lastUpdated: '25 mins ago',
    vitals: {
      heartRate: { value: 78, unit: 'bpm', normalRange: '60–100', status: 'normal', trend: 'stable', lastUpdated: '10:35 AM', history: [{ time: '06:00', value: 84 }, { time: '10:35', value: 78 }] },
      temperature: { value: 36.9, unit: '°C', normalRange: '36.5–37.5', status: 'normal', trend: 'stable', lastUpdated: '10:35 AM', history: [{ time: '06:00', value: 37.1 }, { time: '10:35', value: 36.9 }] },
      respiratoryRate: { value: 16, unit: '/min', normalRange: '12–20', status: 'normal', trend: 'stable', lastUpdated: '10:35 AM', history: [{ time: '06:00', value: 16 }, { time: '10:35', value: 16 }] },
      spO2: { value: 98, unit: '%', normalRange: '95–100', status: 'normal', trend: 'stable', lastUpdated: '10:35 AM', history: [{ time: '06:00', value: 98 }, { time: '10:35', value: 98 }] },
      bloodPressure: { value: '124/80', systolic: 124, diastolic: 80, unit: 'mmHg', normalRange: '< 120/80', status: 'normal', trend: 'stable', lastUpdated: '10:35 AM', history: [{ time: '06:00', value: 128 }, { time: '10:35', value: 124 }] }
    },
    medicalHistory: ['Gallstone Disease', 'Mild Hypertriglyceridemia'],
    medications: [{ id: 'm131', name: 'Lactated Ringers', dosage: '150 mL/hr', frequency: 'Continuous', route: 'IV', status: 'active' }],
    allergies: ['None'],
    recentLabs: [{ id: 'l131', name: 'Serum Lipase', value: '420', unit: 'U/L', normalRange: '10–140', status: 'abnormal', date: '14 Sep 07:30 AM' }],
    digitalTwin: {
      patientId: 'PT-10035',
      lastSynchronized: '14 Sep 2026 10:35:00 AM',
      dataFreshnessMs: 60,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Ward Sensor #204'],
      physiologicalState: {} as any,
      organSystems: [{ system: 'metabolic', name: 'Gastrointestinal & Hepatic', status: 'STABLE', score: 25, keyMetrics: 'Lipase down from 1,200 to 420 U/L', clinicalNote: 'Abdominal pain significantly decreased; oral clear liquids tolerated.' }],
      stateDeltas: [],
      twinTimeline: [{ timestamp: '10:35 AM', event: 'Pain score dropped from 7/10 to 2/10.', source: 'Monitoring Agent', impact: 'low' }]
    },
    patientContext: { consciousState: 'Alert, resting comfortably', oxygenSupport: 'Room air', urineOutput: 'Adequate', distressLevel: 'Minimal tenderness' },
    events: [{ id: 'e131', time: '10:35 AM', description: 'Advanced to low-fat soft diet', category: 'clinical_review' }]
  },
  {
    id: 'PT-10036',
    patientId: 'PT-10036',
    name: 'Emily Watson',
    age: 26,
    gender: 'Female',
    room: 'Emergency - Bay 06',
    ward: 'Emergency',
    diagnosis: 'Severe Anaphylactic Reaction (Post-Epi Recovery)',
    admissionDate: '14 Sep 2026',
    attendingPhysician: 'Dr. N. D',
    riskLevel: 'MEDIUM',
    riskScore: 40,
    trend: 'Improving',
    lastUpdated: '16 mins ago',
    vitals: {
      heartRate: { value: 92, unit: 'bpm', normalRange: '60–100', status: 'normal', trend: 'decreasing', lastUpdated: '10:44 AM', history: [{ time: '09:00', value: 135 }, { time: '10:00', value: 104 }, { time: '10:44', value: 92 }] },
      temperature: { value: 36.8, unit: '°C', normalRange: '36.5–37.5', status: 'normal', trend: 'stable', lastUpdated: '10:44 AM', history: [{ time: '09:00', value: 36.8 }, { time: '10:44', value: 36.8 }] },
      respiratoryRate: { value: 18, unit: '/min', normalRange: '12–20', status: 'normal', trend: 'decreasing', lastUpdated: '10:44 AM', history: [{ time: '09:00', value: 28 }, { time: '10:00', value: 22 }, { time: '10:44', value: 18 }] },
      spO2: { value: 98, unit: '%', normalRange: '95–100', status: 'normal', trend: 'increasing', lastUpdated: '10:44 AM', history: [{ time: '09:00', value: 89 }, { time: '10:00', value: 96 }, { time: '10:44', value: 98 }] },
      bloodPressure: { value: '118/74', systolic: 118, diastolic: 74, unit: 'mmHg', normalRange: '< 120/80', status: 'normal', trend: 'increasing', lastUpdated: '10:44 AM', history: [{ time: '09:00', value: 78 }, { time: '10:00', value: 106 }, { time: '10:44', value: 118 }] }
    },
    medicalHistory: ['Peanut Allergy', 'Atopic Dermatitis'],
    medications: [{ id: 'm141', name: 'Epinephrine IM 0.3mg', dosage: '0.3mg', frequency: 'Given in ED', route: 'IM', status: 'completed' }, { id: 'm142', name: 'Diphenhydramine IV', dosage: '50mg', frequency: 'Stat', route: 'IV', status: 'completed' }],
    allergies: ['Peanuts (Severe anaphylaxis)', 'Tree nuts'],
    recentLabs: [],
    digitalTwin: {
      patientId: 'PT-10036',
      lastSynchronized: '14 Sep 2026 10:44:00 AM',
      dataFreshnessMs: 24,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['ED Monitor #06'],
      physiologicalState: {} as any,
      organSystems: [{ system: 'respiratory', name: 'Airway & Respiratory', status: 'STABLE', score: 20, keyMetrics: 'Stridor resolved, SpO₂ 98%', clinicalNote: 'Laryngeal edema resolved post-epinephrine.' }],
      stateDeltas: [{ parameter: 'BP', previousValue: '78/46 mmHg', currentValue: '118/74 mmHg', changeType: 'improved', timestamp: '10:44 AM' }],
      twinTimeline: [{ timestamp: '10:44 AM', event: '4-hour biphasic reaction surveillance clock active.', source: 'Monitoring Agent', impact: 'medium' }]
    },
    patientContext: { consciousState: 'Alert, oriented, speaking clearly', oxygenSupport: 'Room air', urineOutput: 'Normal', distressLevel: 'Urticaria fading' },
    events: [{ id: 'e141', time: '10:44 AM', description: 'Under 4-hour biphasic anaphylaxis observation in ED', category: 'clinical_review' }]
  },
  {
    id: 'PT-10037',
    patientId: 'PT-10037',
    name: 'Samuel Osei',
    age: 63,
    gender: 'Male',
    room: 'General Ward - Room 310',
    ward: 'General Ward',
    diagnosis: 'Cellulitis of Left Lower Extremity',
    admissionDate: '13 Sep 2026',
    attendingPhysician: 'Dr. N. D',
    riskLevel: 'STABLE',
    riskScore: 15,
    trend: 'Stable',
    lastUpdated: '30 mins ago',
    vitals: {
      heartRate: { value: 70, unit: 'bpm', normalRange: '60–100', status: 'normal', trend: 'stable', lastUpdated: '10:30 AM', history: [{ time: '06:00', value: 72 }, { time: '10:30', value: 70 }] },
      temperature: { value: 37.1, unit: '°C', normalRange: '36.5–37.5', status: 'normal', trend: 'stable', lastUpdated: '10:30 AM', history: [{ time: '06:00', value: 37.3 }, { time: '10:30', value: 37.1 }] },
      respiratoryRate: { value: 15, unit: '/min', normalRange: '12–20', status: 'normal', trend: 'stable', lastUpdated: '10:30 AM', history: [{ time: '06:00', value: 15 }, { time: '10:30', value: 15 }] },
      spO2: { value: 99, unit: '%', normalRange: '95–100', status: 'normal', trend: 'stable', lastUpdated: '10:30 AM', history: [{ time: '06:00', value: 99 }, { time: '10:30', value: 99 }] },
      bloodPressure: { value: '120/78', systolic: 120, diastolic: 78, unit: 'mmHg', normalRange: '< 120/80', status: 'normal', trend: 'stable', lastUpdated: '10:30 AM', history: [{ time: '06:00', value: 122 }, { time: '10:30', value: 120 }] }
    },
    medicalHistory: ['Venous Stasis Disease'],
    medications: [{ id: 'm151', name: 'Cefazolin IV', dosage: '1g', frequency: 'Q8H', route: 'IV', status: 'active' }],
    allergies: ['None'],
    recentLabs: [{ id: 'l151', name: 'WBC', value: '8.4', unit: 'x10^9/L', normalRange: '4.0–11.0', status: 'normal', date: '14 Sep 06:30 AM' }],
    digitalTwin: {
      patientId: 'PT-10037',
      lastSynchronized: '14 Sep 2026 10:30:00 AM',
      dataFreshnessMs: 70,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Ward Sensor Network'],
      physiologicalState: {} as any,
      organSystems: [{ system: 'thermoregulatory', name: 'Integumentary & Immune', status: 'STABLE', score: 15, keyMetrics: 'Erythema demarcated, margins receding', clinicalNote: 'Localized infection responding to 1st gen cephalosporin.' }],
      stateDeltas: [],
      twinTimeline: [{ timestamp: '10:30 AM', event: 'Cellulitis boundary marked with marker; no spreading.', source: 'Monitoring Agent', impact: 'low' }]
    },
    patientContext: { consciousState: 'Alert, resting in bed with leg elevated', oxygenSupport: 'Room air', urineOutput: 'Normal', distressLevel: 'Mild localized ache' },
    events: [{ id: 'e151', time: '10:30 AM', description: 'Wound dressing changed by Nurse Sarah', category: 'clinical_review' }]
  },
  {
    id: 'PT-10038',
    patientId: 'PT-10038',
    name: 'Clara Oswald-Bennett',
    age: 70,
    gender: 'Female',
    room: 'General Ward - Room 215',
    ward: 'General Ward',
    diagnosis: 'Acute Gastroenteritis / Moderate Dehydration',
    admissionDate: '13 Sep 2026',
    attendingPhysician: 'Dr. N. D',
    riskLevel: 'STABLE',
    riskScore: 24,
    trend: 'Improving',
    lastUpdated: '35 mins ago',
    vitals: {
      heartRate: { value: 74, unit: 'bpm', normalRange: '60–100', status: 'normal', trend: 'stable', lastUpdated: '10:25 AM', history: [{ time: '06:00', value: 88 }, { time: '10:25', value: 74 }] },
      temperature: { value: 36.9, unit: '°C', normalRange: '36.5–37.5', status: 'normal', trend: 'stable', lastUpdated: '10:25 AM', history: [{ time: '06:00', value: 37.2 }, { time: '10:25', value: 36.9 }] },
      respiratoryRate: { value: 16, unit: '/min', normalRange: '12–20', status: 'normal', trend: 'stable', lastUpdated: '10:25 AM', history: [{ time: '06:00', value: 16 }, { time: '10:25', value: 16 }] },
      spO2: { value: 98, unit: '%', normalRange: '95–100', status: 'normal', trend: 'stable', lastUpdated: '10:25 AM', history: [{ time: '06:00', value: 98 }, { time: '10:25', value: 98 }] },
      bloodPressure: { value: '116/74', systolic: 116, diastolic: 74, unit: 'mmHg', normalRange: '< 120/80', status: 'normal', trend: 'stable', lastUpdated: '10:25 AM', history: [{ time: '06:00', value: 104 }, { time: '10:25', value: 116 }] }
    },
    medicalHistory: ['Osteoporosis'],
    medications: [{ id: 'm161', name: 'Ondansetron', dosage: '4mg', frequency: 'Q8H PRN', route: 'Oral', status: 'active' }],
    allergies: ['None'],
    recentLabs: [{ id: 'l161', name: 'Potassium', value: '4.1', unit: 'mEq/L', normalRange: '3.5–5.0', status: 'normal', date: '14 Sep 08:00 AM' }],
    digitalTwin: {
      patientId: 'PT-10038',
      lastSynchronized: '14 Sep 2026 10:25:00 AM',
      dataFreshnessMs: 80,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Ward Sensor Network'],
      physiologicalState: {} as any,
      organSystems: [{ system: 'renal', name: 'Fluid & Electrolyte Balance', status: 'STABLE', score: 20, keyMetrics: 'Electrolytes normalized, BP restored', clinicalNote: 'Oral hydration plan succeeding; no emesis in 12h.' }],
      stateDeltas: [],
      twinTimeline: [{ timestamp: '10:25 AM', event: 'IV fluids discontinued in favor of oral rehydration.', source: 'Monitoring Agent', impact: 'low' }]
    },
    patientContext: { consciousState: 'Alert, cheerful', oxygenSupport: 'Room air', urineOutput: 'Adequate', distressLevel: 'None' },
    events: [{ id: 'e161', time: '10:25 AM', description: 'Patient anticipating discharge this afternoon', category: 'clinical_review' }]
  }
];

// Enrich physiological state in Digital Twin
INITIAL_PATIENTS.forEach(p => {
  p.digitalTwin.physiologicalState = p.vitals;
});

export const INITIAL_AGENTS: AgentInfo[] = [
  {
    id: 'MONITORING',
    name: 'Monitoring Agent',
    title: 'Physiological State & Anomaly Detector',
    purpose: 'Continuously analyzes the patient’s real-time telemetry, vital signs stream, and physiological digital twin state to detect multi-parameter abnormalities and threshold shifts.',
    status: 'ACTIVE',
    tasks: ['Continuous Telemetry Ingestion', 'Abnormality Detection & Pattern Matching', 'Digital Twin State Synchronization', 'Baseline Variance Scoring'],
    lastExecutionTime: '11:13:04 AM',
    inferenceLatencyMs: 14,
    processedEventsToday: 14280
  },
  {
    id: 'PREDICTION',
    name: 'Prediction Agent',
    title: 'Clinical Deterioration & Risk Forecaster',
    purpose: 'Calculates multi-hour deterioration trajectories and predicts impending adverse clinical events (Respiratory Failure, Sepsis, Shock, Arrhythmia) using longitudinal trend ML models.',
    status: 'ACTIVE',
    tasks: ['Multi-horizon Deterioration Risk Prediction', 'Time-series Vital Trend Trajectory Analysis', 'Organ Failure Probability Estimation', 'Feature Importance Attribution'],
    lastExecutionTime: '11:13:05 AM',
    inferenceLatencyMs: 28,
    processedEventsToday: 8940
  },
  {
    id: 'ESCALATION',
    name: 'Escalation Agent',
    title: 'Alert Prioritization & Severity Triage',
    purpose: 'Evaluates clinical urgency, filters alert fatigue noise, classifies alert severity (Critical, High, Medium, Low), and assigns rapid response team routing.',
    status: 'ACTIVE',
    tasks: ['Severity Triage & Multi-Tier Classification', 'Alert Noise & Fatigue Suppression', 'Clinical Team Routing (ICU, Code Blue, Rapid Response)', 'Urgency Escalation Protocols'],
    lastExecutionTime: '11:13:06 AM',
    inferenceLatencyMs: 9,
    processedEventsToday: 3410
  },
  {
    id: 'EXPLANATION',
    name: 'Explanation Agent',
    title: 'Explainable AI & Clinical Decision Support',
    purpose: 'Synthesizes transparent clinical rationales, highlights top contributing biomarkers/factors, and maps evidence-based guideline recommendations for clinician validation.',
    status: 'ACTIVE',
    tasks: ['Clinical Rationale Synthesis (XAI)', 'Contributing Biomarker Attribution (SHAP/LIME)', 'Evidence-Based Guideline Citation (Surviving Sepsis, ATS, AHA)', 'Structured Clinician Recommendation Generation'],
    lastExecutionTime: '11:13:08 AM',
    inferenceLatencyMs: 45,
    processedEventsToday: 1820
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt-001',
    alertCode: 'ALT-20260914-001',
    patientId: 'PT-10023',
    patientName: 'Ramesh Kumar',
    patientAge: 62,
    patientGender: 'Male',
    ward: 'ICU',
    room: 'ICU - Bed 05',
    priority: 'HIGH PRIORITY',
    severity: 'CRITICAL',
    title: 'Critical Alert Detected — Patient condition requires immediate attention',
    detectedAt: '14 Sep 2026 11:12 AM',
    triggerEvent: 'Respiratory Deterioration',
    triggerParameters: [
      { parameter: 'SpO₂', currentValue: '86 %', normalRange: '95 – 100', status: 'High Risk' },
      { parameter: 'Respiratory Rate', currentValue: '28 /min', normalRange: '12 – 20', status: 'High' },
      { parameter: 'Heart Rate', currentValue: '112 bpm', normalRange: '60 – 100', status: 'High' },
      { parameter: 'Temperature', currentValue: '38.1 °C', normalRange: '36.5 – 37.5', status: 'High' }
    ],
    clinicalContext: 'Significant drop in oxygen saturation with increased respiratory rate. Patient may be at risk of respiratory failure secondary to worsening pneumonia infiltrates.',
    detectedBy: ['Monitoring Agent', 'Prediction Agent', 'Escalation Agent'],
    status: 'ACTIVE',
    assignedTeam: 'ICU Team'
  },
  {
    id: 'alt-002',
    alertCode: 'ALT-20260914-002',
    patientId: 'PT-10024',
    patientName: 'Elena Rostova',
    patientAge: 48,
    patientGender: 'Female',
    ward: 'ICU',
    room: 'ICU - Bed 02',
    priority: 'CRITICAL',
    severity: 'CRITICAL',
    title: 'Severe Sepsis Alert — Refractory Hypotension & Hyperlactatemia',
    detectedAt: '14 Sep 2026 11:10 AM',
    triggerEvent: 'Septic Shock Progression',
    triggerParameters: [
      { parameter: 'Blood Pressure', currentValue: '88/54 mmHg', normalRange: '< 120/80', status: 'Critical' },
      { parameter: 'Serum Lactate', currentValue: '3.8 mmol/L', normalRange: '0.5 – 2.0', status: 'Critical' },
      { parameter: 'Heart Rate', currentValue: '124 bpm', normalRange: '60 – 100', status: 'Critical' },
      { parameter: 'Core Temp', currentValue: '39.2 °C', normalRange: '36.5 – 37.5', status: 'High' }
    ],
    clinicalContext: 'MAP dropped below 65 mmHg despite initial fluid bolus. Rising serum lactate (3.8) suggests inadequate tissue microvascular perfusion.',
    detectedBy: ['Monitoring Agent', 'Escalation Agent'],
    status: 'ACTIVE',
    assignedTeam: 'ICU Rapid Response'
  },
  {
    id: 'alt-003',
    alertCode: 'ALT-20260914-003',
    patientId: 'PT-10025',
    patientName: 'Arthur Pendelton',
    patientAge: 74,
    patientGender: 'Male',
    ward: 'Cardiology',
    room: 'Cardiology - Bed 12',
    priority: 'HIGH PRIORITY',
    severity: 'HIGH',
    title: 'Acute Pulmonary Venous Congestion Risk Detected',
    detectedAt: '14 Sep 2026 11:08 AM',
    triggerEvent: 'Decompensated Heart Failure',
    triggerParameters: [
      { parameter: 'Blood Pressure', currentValue: '164/98 mmHg', normalRange: '< 120/80', status: 'High' },
      { parameter: 'SpO₂', currentValue: '91 %', normalRange: '95 – 100', status: 'Low Risk' },
      { parameter: 'Respiratory Rate', currentValue: '24 /min', normalRange: '12 – 20', status: 'High' }
    ],
    clinicalContext: 'Acute afterload mismatch with elevated systemic vascular resistance causing rapid pulmonary capillary wedge pressure spike.',
    detectedBy: ['Prediction Agent', 'Monitoring Agent'],
    status: 'ACTIVE',
    assignedTeam: 'Cardiology Team'
  },
  {
    id: 'alt-004',
    alertCode: 'ALT-20260914-004',
    patientId: 'PT-10029',
    patientName: 'David Chen',
    patientAge: 51,
    patientGender: 'Male',
    ward: 'Emergency',
    room: 'Emergency - Bay 03',
    priority: 'HIGH PRIORITY',
    severity: 'HIGH',
    title: 'Severe Metabolic Acidosis with Kussmaul Respiration Pattern',
    detectedAt: '14 Sep 2026 11:02 AM',
    triggerEvent: 'DKA Hyperventilation Pattern',
    triggerParameters: [
      { parameter: 'Respiratory Rate', currentValue: '29 /min', normalRange: '12 – 20', status: 'Critical' },
      { parameter: 'Blood Glucose', currentValue: '480 mg/dL', normalRange: '70 – 140', status: 'Critical' },
      { parameter: 'Venous pH', currentValue: '7.14', normalRange: '7.35 – 7.45', status: 'Critical' }
    ],
    clinicalContext: 'Deep rapid breathing detected on chest impedance telemetry correlating with uncompensated diabetic ketoacidosis.',
    detectedBy: ['Monitoring Agent', 'Prediction Agent'],
    status: 'ACKNOWLEDGED',
    assignedTeam: 'Emergency Resuscitation Team',
    acknowledgedBy: 'Dr. N. D',
    acknowledgedAt: '11:05 AM'
  }
];

export const INITIAL_RECOMMENDATIONS: ClinicalRecommendation[] = [
  {
    id: 'rec-001',
    alertId: 'alt-001',
    patientId: 'PT-10023',
    patientName: 'Ramesh Kumar',
    patientAge: 62,
    patientGender: 'Male',
    room: 'ICU - Bed 05',
    ward: 'ICU',
    predictionTime: '14 Sep 2026 11:13 AM',
    dataSource: 'Digital Twin (Real-time)',
    modelInfo: 'Critical Event Prediction Model (v1.0)',
    predictedRiskTitle: 'High Risk of Respiratory Failure',
    riskProbability: 78,
    riskLevel: 'CRITICAL',
    topPredictedEvents: [
      { name: 'Respiratory Failure', probability: 78, timeframe: 'Within 2–4 hours', confidence: 0.91 },
      { name: 'Sepsis / Severe Hypoxemia', probability: 42, timeframe: 'Within 6–12 hours', confidence: 0.84 },
      { name: 'Septic Shock', probability: 28, timeframe: 'Within 12–24 hours', confidence: 0.76 },
    ],
    keyContributingFactors: [
      { factor: 'Decreasing SpO₂ trend (96% → 86%)', impactScore: 38, category: 'vital', iconType: 'lungs' },
      { factor: 'Increasing respiratory rate (18 → 28 /min)', impactScore: 24, category: 'vital', iconType: 'lungs' },
      { factor: 'Elevated heart rate (88 → 112 bpm)', impactScore: 16, category: 'vital', iconType: 'heart' },
      { factor: 'Rising temperature (37.2 → 38.1 °C)', impactScore: 11, category: 'vital', iconType: 'temp' },
      { factor: 'History of pneumonia & COPD Stage II', impactScore: 7, category: 'history', iconType: 'history' },
      { factor: 'Age > 60 years (62y)', impactScore: 4, category: 'demographic', iconType: 'user' },
    ],
    modelExplanation: 'The model identified a high risk of respiratory failure due to a combination of decreasing oxygen saturation, increased respiratory rate, elevated heart rate, and rising temperature. These patterns are consistent with early signs of respiratory deterioration in patients with pneumonia.',
    recommendedActions: [
      { order: 1, action: 'Increase oxygen support and monitor SpO₂ closely (e.g. titrate to High Flow Nasal Cannula or 6L via mask to target SpO₂ > 92%)', category: 'oxygen', rationale: 'Immediate mitigation of arterial hypoxemia to avoid organ hypoxia.' },
      { order: 2, action: 'Consider arterial blood gas (ABG) analysis to assess PaO2/PaCO2 and alveolar-arterial gradient', category: 'lab', rationale: 'Quantify exact gas exchange deficit and rule out acute respiratory acidosis.' },
      { order: 3, action: 'Review current antibiotic therapy and sputum gram stain cultures', category: 'medication', rationale: 'Verify antimicrobial coverage for refractory bacterial pneumonia strains.' },
      { order: 4, action: 'Notify ICU team for further assessment and bedside airway evaluation', category: 'team', rationale: 'Early mobilization of critical care intensivist team prior to acute decompensation.' },
      { order: 5, action: 'Continue close monitoring of vital signs (set high-frequency telemetry at 1-min intervals)', category: 'monitoring', rationale: 'Rapid detection of any further refractory trajectory.' },
    ],
    clinicalGuidelinesReference: 'Recommendations based on sepsis and respiratory failure guidelines (e.g., Surviving Sepsis Campaign, American Thoracic Society / ATS Guidelines).',
    status: 'PENDING_REVIEW'
  },
  {
    id: 'rec-002',
    alertId: 'alt-002',
    patientId: 'PT-10024',
    patientName: 'Elena Rostova',
    patientAge: 48,
    patientGender: 'Female',
    room: 'ICU - Bed 02',
    ward: 'ICU',
    predictionTime: '14 Sep 2026 11:10 AM',
    dataSource: 'Digital Twin (Real-time)',
    modelInfo: 'Critical Event Prediction Model (v1.0)',
    predictedRiskTitle: 'Critical Risk of Refractory Septic Shock',
    riskProbability: 86,
    riskLevel: 'CRITICAL',
    topPredictedEvents: [
      { name: 'Septic Shock Progression', probability: 86, timeframe: 'Immediate (1–2h)', confidence: 0.94 },
      { name: 'Multi-Organ Dysfunction (MODS)', probability: 64, timeframe: 'Within 6–12h', confidence: 0.88 },
      { name: 'Acute Kidney Injury (Stage 3)', probability: 52, timeframe: 'Within 4–8h', confidence: 0.82 },
    ],
    keyContributingFactors: [
      { factor: 'Mean Arterial Pressure (MAP) < 65 mmHg (BP 88/54)', impactScore: 35, category: 'vital', iconType: 'heart' },
      { factor: 'Elevated Serum Lactate (3.8 mmol/L)', impactScore: 28, category: 'lab', iconType: 'lab' },
      { factor: 'Hyperpyrexia (Core Temp 39.2 °C)', impactScore: 18, category: 'vital', iconType: 'temp' },
      { factor: 'Tachycardia (124 bpm)', impactScore: 12, category: 'vital', iconType: 'heart' },
      { factor: 'Recent abdominal peritonitis surgery', impactScore: 7, category: 'history', iconType: 'history' },
    ],
    modelExplanation: 'Combination of persistent hypotension (MAP 65 mmHg), hyperlactatemia (3.8 mmol/L), and severe hyperthermia satisfies criteria for Septic Shock. Immediate hemodynamic escalation is warranted.',
    recommendedActions: [
      { order: 1, action: 'Titrate Norepinephrine infusion to maintain Mean Arterial Pressure (MAP) ≥ 65 mmHg', category: 'medication', rationale: 'First-line vasopressor support per Surviving Sepsis Campaign.' },
      { order: 2, action: 'Repeat serum lactate measurement within 2 hours to evaluate clearance trajectory', category: 'lab', rationale: 'Lactate clearance > 10% is a benchmark for resuscitation adequacy.' },
      { order: 3, action: 'Obtain repeat blood cultures and confirm broad-spectrum carbapenem infusion timing', category: 'medication', rationale: 'Source control verification.' },
      { order: 4, action: 'Insert arterial catheter for continuous beat-to-beat pressure monitoring', category: 'monitoring', rationale: 'Accurate titration of inotropes/vasopressors.' },
    ],
    clinicalGuidelinesReference: 'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021.',
    status: 'PENDING_REVIEW'
  },
  {
    id: 'rec-003',
    alertId: 'alt-003',
    patientId: 'PT-10025',
    patientName: 'Arthur Pendelton',
    patientAge: 74,
    patientGender: 'Male',
    room: 'Cardiology - Bed 12',
    ward: 'Cardiology',
    predictionTime: '14 Sep 2026 11:08 AM',
    dataSource: 'Digital Twin (Real-time)',
    modelInfo: 'Critical Event Prediction Model (v1.0)',
    predictedRiskTitle: 'High Risk of Acute Pulmonary Edema',
    riskProbability: 68,
    riskLevel: 'HIGH',
    topPredictedEvents: [
      { name: 'Acute Pulmonary Congestion', probability: 68, timeframe: 'Within 2–4h', confidence: 0.86 },
      { name: 'Hypoxemic Respiratory Decompensation', probability: 48, timeframe: 'Within 6h', confidence: 0.79 },
    ],
    keyContributingFactors: [
      { factor: 'Severe Systolic Hypertension (164/98 mmHg)', impactScore: 32, category: 'vital', iconType: 'heart' },
      { factor: 'Markedly Elevated NT-proBNP (8,420 pg/mL)', impactScore: 30, category: 'lab', iconType: 'lab' },
      { factor: 'Decreasing SpO₂ (91% on room air)', impactScore: 22, category: 'vital', iconType: 'lungs' },
      { factor: 'Known Reduced Ejection Fraction (28%)', impactScore: 16, category: 'history', iconType: 'history' },
    ],
    modelExplanation: 'Significant afterload elevation in the setting of severely reduced left ventricular systolic function has induced retrograde pulmonary capillary hypertension.',
    recommendedActions: [
      { order: 1, action: 'Initiate or uptitrate IV Nitroglycerin infusion to reduce systemic afterload', category: 'medication', rationale: 'Vasodilator therapy reduces left ventricular end-diastolic pressure.' },
      { order: 2, action: 'Administer IV Furosemide bolus (80mg IV stat)', category: 'medication', rationale: 'Rapid venodilation and subsequent diuresis.' },
      { order: 3, action: 'Position patient strictly upright (High Fowler’s position)', category: 'other', rationale: 'Decreases venous return and eases diaphragmatic excursion.' },
      { order: 4, action: 'Apply supplemental oxygen via Venturi mask targeting SpO₂ 94–98%', category: 'oxygen', rationale: 'Prevent myocardial hypoxemia.' },
    ],
    clinicalGuidelinesReference: '2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure.',
    status: 'ACCEPTED',
    reviewedBy: 'Dr. C. Lin',
    reviewedAt: '11:15 AM',
    clinicianNotes: 'IV Nitroglycerin started at 20 mcg/min. Furosemide 80mg IV administered. Patient placed upright.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-101',
    timestamp: '14 Sep 2026 11:13:08 AM',
    patientId: 'PT-10023',
    patientName: 'Ramesh Kumar',
    agent: 'Explanation Agent',
    event: 'AI Clinical Rationale & Recommendation Synthesized',
    inputSummary: 'Prediction results (78% respiratory risk), Digital Twin physiological delta snapshot',
    outputSummary: '5 Prioritized clinical actions generated with ATS/Sepsis guidelines citation',
    risk: 'CRITICAL',
    user: 'Agent Orchestrator',
    ipAddress: 'internal-cluster-svc-01'
  },
  {
    id: 'aud-102',
    timestamp: '14 Sep 2026 11:13:06 AM',
    patientId: 'PT-10023',
    patientName: 'Ramesh Kumar',
    agent: 'Escalation Agent',
    event: 'Alert Severity Upgraded to CRITICAL',
    inputSummary: 'Predicted event: Respiratory Failure (78% prob), current SpO2 86%',
    outputSummary: 'Dispatched alert ALT-20260914-001 to ICU On-Duty Team',
    risk: 'CRITICAL',
    user: 'Agent Orchestrator',
    ipAddress: 'internal-cluster-svc-01'
  },
  {
    id: 'aud-103',
    timestamp: '14 Sep 2026 11:13:05 AM',
    patientId: 'PT-10023',
    patientName: 'Ramesh Kumar',
    agent: 'Prediction Agent',
    event: 'Risk Score Calculated: 78% (CRITICAL)',
    inputSummary: 'SpO2 trajectory (96->86%), Tachypnea (28/min), Sinus Tachycardia (112 bpm)',
    outputSummary: 'Top event: Acute Respiratory Failure (0.78 prob in 2-4h window)',
    risk: 'CRITICAL',
    user: 'Agent Orchestrator',
    ipAddress: 'internal-cluster-svc-01'
  },
  {
    id: 'aud-104',
    timestamp: '14 Sep 2026 11:13:04 AM',
    patientId: 'PT-10023',
    patientName: 'Ramesh Kumar',
    agent: 'Monitoring Agent',
    event: 'Vital Threshold Breach Detected',
    inputSummary: 'SpO2 86% (<92% critical floor), RR 28/min (>20/min ceiling)',
    outputSummary: 'Flagged anomaly event; triggered Digital Twin delta state transition',
    risk: 'CRITICAL',
    user: 'Agent Orchestrator',
    ipAddress: 'internal-cluster-svc-01'
  },
  {
    id: 'aud-105',
    timestamp: '14 Sep 2026 11:15:20 AM',
    patientId: 'PT-10025',
    patientName: 'Arthur Pendelton',
    agent: 'Clinician Reviewer',
    event: 'Clinical Recommendation ACCEPTED',
    inputSummary: 'Recommendation REC-003 for afterload reduction & diuresis',
    outputSummary: 'Order placed: IV Nitroglycerin @ 20mcg/min + Lasix 80mg stat',
    risk: 'HIGH',
    clinicianAction: 'Accepted by Dr. C. Lin with notes added',
    user: 'Dr. C. Lin (Attending Cardiologist)',
    ipAddress: '192.168.10.45'
  },
  {
    id: 'aud-106',
    timestamp: '14 Sep 2026 11:05:12 AM',
    patientId: 'PT-10029',
    patientName: 'David Chen',
    agent: 'Clinician Reviewer',
    event: 'Alert Acknowledged',
    inputSummary: 'Alert ALT-20260914-004 (DKA hyperventilation pattern)',
    outputSummary: 'Alert acknowledged; Emergency insulin titration confirmed',
    risk: 'HIGH',
    clinicianAction: 'Acknowledged by Dr. N. D',
    user: 'Dr. N. D (Lead Clinician)',
    ipAddress: '192.168.10.12'
  },
];

export const INITIAL_ANALYTICS: HospitalAnalytics = {
  totalPatients: 42,
  criticalCount: 3,
  highRiskCount: 7,
  mediumRiskCount: 12,
  stableCount: 20,
  activeAlertsCount: 4,
  recommendationsCount: 6,
  deterioratingCount: 5,
  agentsActiveCount: 4,
  avgAlertLatencyMinutes: 3.4,
  acknowledgementRatePercent: 94.2,
  falseAlertReductionPercent: 36.8,
  predictionAccuracyPercent: 92.4,
  alertsByWard: [
    { ward: 'ICU', count: 18 },
    { ward: 'Emergency', count: 12 },
    { ward: 'Cardiology', count: 8 },
    { ward: 'Pulmonology', count: 6 },
    { ward: 'Surgical ICU', count: 5 },
    { ward: 'General Ward', count: 3 }
  ],
  riskDistribution: [
    { name: 'Critical', value: 3, color: '#ef4444' },
    { name: 'High Risk', value: 7, color: '#f97316' },
    { name: 'Medium Risk', value: 12, color: '#eab308' },
    { name: 'Stable', value: 20, color: '#22c55e' }
  ],
  riskTrend24h: [
    { time: '00:00', critical: 2, high: 5, medium: 14, stable: 21 },
    { time: '04:00', critical: 2, high: 6, medium: 13, stable: 21 },
    { time: '08:00', critical: 3, high: 6, medium: 12, stable: 21 },
    { time: '10:00', critical: 3, high: 7, medium: 12, stable: 20 },
    { time: '11:00', critical: 3, high: 7, medium: 12, stable: 20 }
  ],
  agentActivityHourly: [
    { hour: '07:00', monitoring: 1200, prediction: 820, escalation: 310, explanation: 140 },
    { hour: '08:00', monitoring: 1840, prediction: 1100, escalation: 420, explanation: 210 },
    { hour: '09:00', monitoring: 2100, prediction: 1350, escalation: 490, explanation: 260 },
    { hour: '10:00', monitoring: 2450, prediction: 1590, escalation: 580, explanation: 320 },
    { hour: '11:00', monitoring: 2680, prediction: 1720, escalation: 640, explanation: 380 },
  ]
};
