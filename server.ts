import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PATIENTS, INITIAL_AGENTS, INITIAL_ALERTS, INITIAL_RECOMMENDATIONS, INITIAL_AUDIT_LOGS, INITIAL_ANALYTICS } from './src/data/mockPatients.js';
import { Patient, Alert, ClinicalRecommendation, AuditLogEntry, PatientVitals, AgentEvent, RiskLevel, DigitalTwinState } from './src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Database Store
let patients: Patient[] = JSON.parse(JSON.stringify(INITIAL_PATIENTS));
let agents = JSON.parse(JSON.stringify(INITIAL_AGENTS));
let alerts: Alert[] = JSON.parse(JSON.stringify(INITIAL_ALERTS));
let recommendations: ClinicalRecommendation[] = JSON.parse(JSON.stringify(INITIAL_RECOMMENDATIONS));
let auditLogs: AuditLogEntry[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
let analytics = JSON.parse(JSON.stringify(INITIAL_ANALYTICS));

let agentEvents: AgentEvent[] = [
  {
    id: 'evt-001',
    timestamp: '2026-09-14T11:13:08Z',
    timeFormatted: '11:13:08 AM',
    patientId: 'PT-10023',
    patientName: 'Ramesh Kumar',
    agentType: 'EXPLANATION',
    eventType: 'Recommendation Synthesized',
    summary: 'Clinical rationale and 5 prioritized actions generated for respiratory deterioration',
    details: 'Derived from ATS and Surviving Sepsis guidelines. Prompt clinician validation flagged.',
    severity: 'CRITICAL',
  },
  {
    id: 'evt-002',
    timestamp: '2026-09-14T11:13:06Z',
    timeFormatted: '11:13:06 AM',
    patientId: 'PT-10023',
    patientName: 'Ramesh Kumar',
    agentType: 'ESCALATION',
    eventType: 'Priority Changed',
    summary: 'Alert priority upgraded to CRITICAL (Immediate Clinician Review)',
    details: 'Multi-organ risk threshold exceeded with worsening SpO2 trajectory.',
    severity: 'CRITICAL',
  },
  {
    id: 'evt-003',
    timestamp: '2026-09-14T11:13:05Z',
    timeFormatted: '11:13:05 AM',
    patientId: 'PT-10023',
    patientName: 'Ramesh Kumar',
    agentType: 'PREDICTION',
    eventType: 'Risk Calculated',
    summary: 'Calculated 78% probability of acute respiratory failure within 2-4 hours',
    details: 'Feature weights: Decreased SpO2 (0.38), Tachypnea (0.24), Tachycardia (0.16).',
    severity: 'CRITICAL',
  },
  {
    id: 'evt-004',
    timestamp: '2026-09-14T11:13:04Z',
    timeFormatted: '11:13:04 AM',
    patientId: 'PT-10023',
    patientName: 'Ramesh Kumar',
    agentType: 'MONITORING',
    eventType: 'Abnormal Vital Detected',
    summary: 'Abnormal SpO2 detected: 86% (Critical Low) with Respiratory Rate 28 /min',
    details: 'Drop of 8% from baseline 94%. Tachypneic threshold 20 /min exceeded.',
    severity: 'CRITICAL',
  }
];

// Server-side Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// --------------------------------------------------------------------------
// AGENT ORCHESTRATION PIPELINE ENGINE
// --------------------------------------------------------------------------

function executeAgentPipeline(patient: Patient, updatedVitals: PatientVitals) {
  const previousVitals = JSON.parse(JSON.stringify(patient.vitals));
  patient.vitals = updatedVitals;
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const timestampIso = new Date().toISOString();

  // 1. MONITORING AGENT
  const abnormalities: string[] = [];
  const hr = updatedVitals.heartRate.value;
  const spo2 = updatedVitals.spO2.value;
  const rr = updatedVitals.respiratoryRate.value;
  const temp = updatedVitals.temperature.value;
  const sbp = updatedVitals.bloodPressure.systolic;

  if (spo2 < 90) abnormalities.push(`Severe Hypoxemia (SpO₂ ${spo2}%)`);
  else if (spo2 < 94) abnormalities.push(`Mild Hypoxemia (SpO₂ ${spo2}%)`);

  if (rr > 24) abnormalities.push(`Severe Tachypnea (${rr} /min)`);
  else if (rr > 20) abnormalities.push(`Mild Tachypnea (${rr} /min)`);

  if (hr > 110) abnormalities.push(`Marked Tachycardia (${hr} bpm)`);
  else if (hr > 100) abnormalities.push(`Tachycardia (${hr} bpm)`);
  else if (hr < 55) abnormalities.push(`Bradycardia (${hr} bpm)`);

  if (temp > 38.0) abnormalities.push(`Hyperthermia / Febrile spike (${temp} °C)`);
  else if (temp < 36.0) abnormalities.push(`Hypothermia (${temp} °C)`);

  if (sbp < 90) abnormalities.push(`Hypotension (SBP ${sbp} mmHg)`);
  else if (sbp > 160) abnormalities.push(`Severe Hypertension (SBP ${sbp} mmHg)`);

  const monitoringEvent: AgentEvent = {
    id: `evt-${Date.now()}-1`,
    timestamp: timestampIso,
    timeFormatted: nowStr,
    patientId: patient.patientId,
    patientName: patient.name,
    agentType: 'MONITORING',
    eventType: abnormalities.length > 0 ? 'Abnormality Detected' : 'Vitals Stable',
    summary: abnormalities.length > 0 ? `Abnormal vitals detected: ${abnormalities.slice(0, 2).join(', ')}` : 'All telemetry vitals within baseline tolerance',
    details: abnormalities.join(' | ') || 'Continuous monitoring shows stable physiological baseline.',
    severity: abnormalities.length >= 2 || spo2 < 88 || sbp < 90 ? 'CRITICAL' : abnormalities.length > 0 ? 'HIGH' : 'STABLE'
  };
  agentEvents.unshift(monitoringEvent);

  // 2. PREDICTION AGENT (Machine Learning & Deterioration Risk Scoring)
  let riskScore = 15;
  if (spo2 < 88) riskScore += 40;
  else if (spo2 < 92) riskScore += 25;
  else if (spo2 < 95) riskScore += 10;

  if (rr > 26) riskScore += 25;
  else if (rr > 20) riskScore += 15;

  if (hr > 115) riskScore += 18;
  else if (hr > 100) riskScore += 10;

  if (temp > 38.0) riskScore += 12;
  if (sbp < 90) riskScore += 25;
  else if (sbp > 160) riskScore += 15;

  riskScore = Math.min(Math.max(riskScore, 5), 98);

  let riskLevel: RiskLevel = 'STABLE';
  if (riskScore >= 75) riskLevel = 'CRITICAL';
  else if (riskScore >= 55) riskLevel = 'HIGH';
  else if (riskScore >= 35) riskLevel = 'MEDIUM';

  patient.riskScore = riskScore;
  patient.riskLevel = riskLevel;
  patient.trend = riskScore > 60 ? 'Deteriorating' : riskScore < 30 ? 'Improving' : 'Stable';
  patient.lastUpdated = `Just now (${nowStr})`;

  const topPredictedEvents = [
    { name: spo2 < 92 ? 'Acute Respiratory Failure' : 'Cardiopulmonary Decompensation', probability: riskScore, timeframe: 'Within 2–4 hours', confidence: 0.91 },
    { name: 'Sepsis / Hemodynamic Instability', probability: Math.max(20, Math.round(riskScore * 0.6)), timeframe: 'Within 6–12 hours', confidence: 0.82 },
    { name: 'Septic / Cardiogenic Shock', probability: Math.max(10, Math.round(riskScore * 0.4)), timeframe: 'Within 12–24 hours', confidence: 0.74 }
  ];

  const predictionEvent: AgentEvent = {
    id: `evt-${Date.now()}-2`,
    timestamp: timestampIso,
    timeFormatted: nowStr,
    patientId: patient.patientId,
    patientName: patient.name,
    agentType: 'PREDICTION',
    eventType: 'Risk Calculated',
    summary: `Deterioration probability calculated at ${riskScore}% (${riskLevel})`,
    details: `Top predicted risk: ${topPredictedEvents[0].name} (${topPredictedEvents[0].probability}% probability)`,
    severity: riskLevel
  };
  agentEvents.unshift(predictionEvent);

  // 3. ESCALATION AGENT
  let priorityTitle = 'LOW PRIORITY';
  let shouldCreateAlert = false;
  if (riskLevel === 'CRITICAL') {
    priorityTitle = 'CRITICAL';
    shouldCreateAlert = true;
  } else if (riskLevel === 'HIGH') {
    priorityTitle = 'HIGH PRIORITY';
    shouldCreateAlert = true;
  } else if (riskLevel === 'MEDIUM') {
    priorityTitle = 'MEDIUM PRIORITY';
  }

  let createdAlert: Alert | null = null;
  if (shouldCreateAlert) {
    const alertId = `ALT-${Date.now().toString().slice(-6)}`;
    createdAlert = {
      id: `alt-${Date.now()}`,
      alertCode: alertId,
      patientId: patient.patientId,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      ward: patient.ward,
      room: patient.room,
      priority: priorityTitle as any,
      severity: riskLevel,
      title: riskLevel === 'CRITICAL' ? 'Critical Alert Detected — Immediate Clinician Attention Required' : 'High Priority Clinical Alert Detected',
      detectedAt: `14 Sep 2026 ${nowStr}`,
      triggerEvent: topPredictedEvents[0].name,
      triggerParameters: [
        { parameter: 'SpO₂', currentValue: `${spo2} %`, normalRange: '95 – 100', status: spo2 < 90 ? 'High Risk' : spo2 < 94 ? 'Low' : 'Normal' },
        { parameter: 'Respiratory Rate', currentValue: `${rr} /min`, normalRange: '12 – 20', status: rr > 24 ? 'High' : 'Normal' },
        { parameter: 'Heart Rate', currentValue: `${hr} bpm`, normalRange: '60 – 100', status: hr > 100 ? 'High' : 'Normal' },
        { parameter: 'Temperature', currentValue: `${temp} °C`, normalRange: '36.5 – 37.5', status: temp > 37.5 ? 'High' : 'Normal' },
      ],
      clinicalContext: `Patient exhibits rapid physiological shift: SpO₂ ${spo2}%, RR ${rr}/min, HR ${hr} bpm. Immediate clinician review required.`,
      detectedBy: ['Monitoring Agent', 'Prediction Agent', 'Escalation Agent'],
      status: 'ACTIVE',
      assignedTeam: patient.ward === 'ICU' ? 'ICU Rapid Response' : 'Ward Care Team'
    };
    alerts.unshift(createdAlert);
  }

  const escalationEvent: AgentEvent = {
    id: `evt-${Date.now()}-3`,
    timestamp: timestampIso,
    timeFormatted: nowStr,
    patientId: patient.patientId,
    patientName: patient.name,
    agentType: 'ESCALATION',
    eventType: 'Triage Classification',
    summary: `Priority designated as ${priorityTitle} (${shouldCreateAlert ? 'Alert Dispatched' : 'Routine Monitoring'})`,
    details: shouldCreateAlert ? `Dispatched to ${patient.ward} response team for bedside review.` : 'No critical escalation threshold breached.',
    severity: riskLevel
  };
  agentEvents.unshift(escalationEvent);

  // 4. EXPLANATION AGENT
  const keyContributingFactors = [
    { factor: `Decreased SpO₂ (${spo2}%)`, impactScore: 36, category: 'vital' as const, iconType: 'lungs' as const },
    { factor: `Elevated Respiratory Rate (${rr} /min)`, impactScore: 26, category: 'vital' as const, iconType: 'lungs' as const },
    { factor: `Tachycardia (${hr} bpm)`, impactScore: 18, category: 'vital' as const, iconType: 'heart' as const },
    { factor: `Core Temperature (${temp} °C)`, impactScore: 12, category: 'vital' as const, iconType: 'temp' as const },
    { factor: `Primary Diagnosis: ${patient.diagnosis}`, impactScore: 8, category: 'history' as const, iconType: 'history' as const }
  ];

  const modelExplanation = `The model identified a ${riskLevel.toLowerCase()} risk of ${topPredictedEvents[0].name.toLowerCase()} due to a combination of oxygen saturation shifts (${spo2}%), elevated respiratory rate (${rr}/min), and compensatory tachycardia (${hr} bpm). These patterns are consistent with acute physiological decompensation.`;

  const recommendedActions = [
    { order: 1, action: `Titrate supplemental oxygen to maintain SpO₂ > 92% (Consider High Flow Nasal Cannula or Non-Rebreather Mask).`, category: 'oxygen' as const, rationale: 'Prevent end-organ hypoxemia.' },
    { order: 2, action: `Obtain urgent Arterial Blood Gas (ABG) to evaluate PaO2/PaCO2 exchange and pH.`, category: 'lab' as const, rationale: 'Assess alveolar-arterial gradient and acid-base status.' },
    { order: 3, action: `Review current antimicrobial / pharmacotherapy regimen.`, category: 'medication' as const, rationale: 'Verify therapeutic coverage for primary underlying etiology.' },
    { order: 4, action: `Notify attending physician (${patient.attendingPhysician}) and bedside nurse for clinical reassessment.`, category: 'team' as const, rationale: 'Ensure interdisciplinary rapid assessment.' },
    { order: 5, action: `Increase telemetry sampling frequency to continuous 1-minute real-time interval.`, category: 'monitoring' as const, rationale: 'Close trend surveillance.' }
  ];

  const newRecommendation: ClinicalRecommendation = {
    id: `rec-${Date.now()}`,
    alertId: createdAlert?.id,
    patientId: patient.patientId,
    patientName: patient.name,
    patientAge: patient.age,
    patientGender: patient.gender,
    room: patient.room,
    ward: patient.ward,
    predictionTime: `14 Sep 2026 ${nowStr}`,
    dataSource: 'Digital Twin (Real-time)',
    modelInfo: 'Critical Event Prediction Model (v1.0)',
    predictedRiskTitle: `Risk of ${topPredictedEvents[0].name}`,
    riskProbability: riskScore,
    riskLevel,
    topPredictedEvents,
    keyContributingFactors,
    modelExplanation,
    recommendedActions,
    clinicalGuidelinesReference: 'Clinical guidelines reference: Surviving Sepsis Campaign Guidelines & American Thoracic Society (ATS) Acute Hypoxemia Protocol.',
    status: 'PENDING_REVIEW'
  };

  if (shouldCreateAlert) {
    recommendations.unshift(newRecommendation);
  }

  const explanationEvent: AgentEvent = {
    id: `evt-${Date.now()}-4`,
    timestamp: timestampIso,
    timeFormatted: nowStr,
    patientId: patient.patientId,
    patientName: patient.name,
    agentType: 'EXPLANATION',
    eventType: 'Explanation Generated',
    summary: 'Clinical rationale synthesized and 5 evidence-based actions queued for clinician validation',
    details: 'Explainable AI mapping completed with guideline citation and factor attribution.',
    severity: riskLevel
  };
  agentEvents.unshift(explanationEvent);

  // 5. UPDATE DIGITAL TWIN STATE & DELTAS
  patient.digitalTwin.lastSynchronized = `14 Sep 2026 ${nowStr}`;
  patient.digitalTwin.physiologicalState = updatedVitals;
  patient.digitalTwin.stateDeltas = [
    { parameter: 'SpO₂ Saturation', previousValue: `${previousVitals.spO2.value}%`, currentValue: `${spo2}%`, changeType: spo2 < previousVitals.spO2.value ? 'worsened' : spo2 > previousVitals.spO2.value ? 'improved' : 'unchanged', timestamp: nowStr },
    { parameter: 'Respiratory Rate', previousValue: `${previousVitals.respiratoryRate.value}/min`, currentValue: `${rr}/min`, changeType: rr > previousVitals.respiratoryRate.value ? 'worsened' : rr < previousVitals.respiratoryRate.value ? 'improved' : 'unchanged', timestamp: nowStr },
    { parameter: 'Heart Rate', previousValue: `${previousVitals.heartRate.value} bpm`, currentValue: `${hr} bpm`, changeType: hr > previousVitals.heartRate.value ? 'worsened' : 'improved', timestamp: nowStr },
    { parameter: 'Risk Level', previousValue: patient.riskLevel, currentValue: riskLevel, changeType: riskScore > 50 ? 'worsened' : 'improved', timestamp: nowStr }
  ];

  patient.digitalTwin.twinTimeline.unshift({
    timestamp: nowStr,
    event: `Digital Twin updated: Risk score ${riskScore}%, Monitoring Agent detected ${abnormalities.length} parameters out of bounds.`,
    source: 'Agent Orchestrator',
    impact: riskLevel === 'CRITICAL' ? 'high' : riskLevel === 'HIGH' ? 'medium' : 'low'
  });

  // Update audit log
  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    timestamp: `14 Sep 2026 ${nowStr}`,
    patientId: patient.patientId,
    patientName: patient.name,
    agent: 'Agent Orchestrator',
    event: 'End-to-End Pipeline Execution',
    inputSummary: `Vitals: SpO2 ${spo2}%, HR ${hr}, RR ${rr}, Temp ${temp}, BP ${sbp}`,
    outputSummary: `Risk Score: ${riskScore}% (${riskLevel}), ${abnormalities.length} anomalies detected`,
    risk: riskLevel,
    user: 'System Simulation Stream',
    ipAddress: '127.0.0.1'
  });

  return {
    patient,
    monitoringOutput: { abnormalitiesDetected: abnormalities, isAbnormal: abnormalities.length > 0 },
    predictionOutput: { predictedRisk: `Risk of ${topPredictedEvents[0].name}`, riskProbability: riskScore, riskLevel, topEvents: topPredictedEvents },
    escalationOutput: { priority: priorityTitle, alertCreated: shouldCreateAlert, alertId: createdAlert?.alertCode },
    explanationOutput: { modelExplanation, recommendedActions: recommendedActions.map(r => r.action), guidelinesRef: newRecommendation.clinicalGuidelinesReference },
    recommendation: shouldCreateAlert ? newRecommendation : null
  };
}

// --------------------------------------------------------------------------
// REST API ROUTES
// --------------------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    service: 'SmartTwin AI Clinical Decision Support Engine',
    timestamp: new Date().toISOString(),
    agents: {
      monitoring: 'ACTIVE',
      prediction: 'ACTIVE',
      escalation: 'ACTIVE',
      explanation: 'ACTIVE'
    },
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Patients API
app.get('/api/patients', (req, res) => {
  const { ward, risk, search } = req.query;
  let filtered = [...patients];

  if (ward && ward !== 'ALL') {
    filtered = filtered.filter(p => p.ward.toLowerCase() === (ward as string).toLowerCase());
  }
  if (risk && risk !== 'ALL') {
    filtered = filtered.filter(p => p.riskLevel.toLowerCase() === (risk as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q) ||
      p.room.toLowerCase().includes(q) ||
      p.diagnosis.toLowerCase().includes(q)
    );
  }

  res.json({ patients: filtered, total: filtered.length });
});

app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id || p.patientId === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  res.json({ patient });
});

app.post('/api/patients', (req, res) => {
  const newPatientData = req.body;
  const newId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newPatient: Patient = {
    id: newId,
    patientId: newId,
    name: newPatientData.name || 'New Patient',
    age: Number(newPatientData.age) || 50,
    gender: newPatientData.gender || 'Male',
    room: newPatientData.room || 'ICU - Bed 09',
    ward: newPatientData.ward || 'ICU',
    diagnosis: newPatientData.diagnosis || 'Clinical Observation',
    admissionDate: '14 Sep 2026',
    attendingPhysician: newPatientData.attendingPhysician || 'Dr. N. D',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    riskLevel: 'STABLE',
    riskScore: 20,
    trend: 'Stable',
    lastUpdated: `Just now (${now})`,
    vitals: newPatientData.vitals || {
      heartRate: { value: 75, unit: 'bpm', normalRange: '60–100', status: 'normal', trend: 'stable', lastUpdated: now, history: [{ time: '10:00', value: 75 }] },
      temperature: { value: 37.0, unit: '°C', normalRange: '36.5–37.5', status: 'normal', trend: 'stable', lastUpdated: now, history: [{ time: '10:00', value: 37.0 }] },
      respiratoryRate: { value: 16, unit: '/min', normalRange: '12–20', status: 'normal', trend: 'stable', lastUpdated: now, history: [{ time: '10:00', value: 16 }] },
      spO2: { value: 98, unit: '%', normalRange: '95–100', status: 'normal', trend: 'stable', lastUpdated: now, history: [{ time: '10:00', value: 98 }] },
      bloodPressure: { value: '120/80', systolic: 120, diastolic: 80, unit: 'mmHg', normalRange: '< 120/80', status: 'normal', trend: 'stable', lastUpdated: now, history: [{ time: '10:00', value: 120 }] }
    },
    medicalHistory: newPatientData.medicalHistory || ['No major prior history'],
    medications: newPatientData.medications || [],
    allergies: newPatientData.allergies || ['No known drug allergies'],
    recentLabs: [],
    digitalTwin: {
      patientId: newId,
      lastSynchronized: `14 Sep 2026 ${now}`,
      dataFreshnessMs: 20,
      syncStatus: 'SYNCHRONIZED',
      dataSources: ['Bedside Telemetry Stream'],
      physiologicalState: {} as any,
      organSystems: [
        { system: 'respiratory', name: 'Respiratory System', status: 'STABLE', score: 15, keyMetrics: 'SpO2 98%, RR 16/min', clinicalNote: 'Clear breath sounds.' },
        { system: 'cardiovascular', name: 'Cardiovascular System', status: 'STABLE', score: 18, keyMetrics: 'HR 75 bpm, BP 120/80', clinicalNote: 'Normal sinus rhythm.' }
      ],
      stateDeltas: [],
      twinTimeline: [{ timestamp: now, event: 'Patient admitted and Digital Twin initialized.', source: 'Admission Gateway', impact: 'low' }]
    },
    patientContext: {
      consciousState: 'Alert and oriented',
      oxygenSupport: 'Room air',
      urineOutput: 'Normal',
      distressLevel: 'None'
    },
    events: [{ id: `e-${Date.now()}`, time: now, description: 'Patient admitted and Digital Twin instantiated', category: 'admission' }]
  };
  newPatient.digitalTwin.physiologicalState = newPatient.vitals;
  patients.unshift(newPatient);

  res.status(201).json({ patient: newPatient, message: 'Patient admitted and Digital Twin created' });
});

// Update vitals and trigger Agent pipeline
app.post('/api/patients/:id/vitals', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id || p.patientId === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const updatedVitals = req.body.vitals || patient.vitals;
  const result = executeAgentPipeline(patient, updatedVitals);
  res.json({ success: true, result });
});

// Digital Twins API
app.get('/api/digital-twins/:patientId', (req, res) => {
  const patient = patients.find(p => p.id === req.params.patientId || p.patientId === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Digital Twin not found' });
  }
  res.json({ digitalTwin: patient.digitalTwin, patientSummary: { name: patient.name, age: patient.age, gender: patient.gender, room: patient.room, ward: patient.ward, diagnosis: patient.diagnosis, riskLevel: patient.riskLevel } });
});

app.post('/api/digital-twins/:patientId/sync', (req, res) => {
  const patient = patients.find(p => p.id === req.params.patientId || p.patientId === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Digital Twin not found' });
  }
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  patient.digitalTwin.lastSynchronized = `14 Sep 2026 ${nowStr}`;
  patient.digitalTwin.dataFreshnessMs = Math.floor(10 + Math.random() * 25);
  patient.digitalTwin.syncStatus = 'SYNCHRONIZED';
  res.json({ success: true, digitalTwin: patient.digitalTwin });
});

// AI Agents API
app.get('/api/agents/status', (req, res) => {
  res.json({ agents, totalActive: agents.length });
});

app.get('/api/agents/events', (req, res) => {
  res.json({ events: agentEvents.slice(0, 50) });
});

// Run full simulation / pipeline for any patient
app.post('/api/agents/run-pipeline', (req, res) => {
  const { patientId, vitals: simulatedVitals } = req.body;
  const patient = patients.find(p => p.id === patientId || p.patientId === patientId) || patients[0];
  const startTime = Date.now();

  const currentVitals = simulatedVitals || patient.vitals;
  const result = executeAgentPipeline(patient, currentVitals);
  const executionTimeMs = Date.now() - startTime;

  res.json({
    success: true,
    executionTimeMs,
    ...result
  });
});

// Alerts API
app.get('/api/alerts', (req, res) => {
  const { status, priority } = req.query;
  let filtered = [...alerts];
  if (status && status !== 'ALL') {
    filtered = filtered.filter(a => a.status.toLowerCase() === (status as string).toLowerCase());
  }
  if (priority && priority !== 'ALL') {
    filtered = filtered.filter(a => a.priority.toLowerCase().includes((priority as string).toLowerCase()) || a.severity.toLowerCase() === (priority as string).toLowerCase());
  }
  res.json({ alerts: filtered, total: filtered.length });
});

app.post('/api/alerts/:id/acknowledge', (req, res) => {
  const { clinicianName } = req.body;
  const alert = alerts.find(a => a.id === req.params.id || a.alertCode === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  alert.status = 'ACKNOWLEDGED';
  alert.acknowledgedBy = clinicianName || 'Dr. N. D';
  alert.acknowledgedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    timestamp: `14 Sep 2026 ${alert.acknowledgedAt}`,
    patientId: alert.patientId,
    patientName: alert.patientName,
    agent: 'Clinician Reviewer',
    event: 'Alert Acknowledged',
    inputSummary: `Alert ${alert.alertCode} (${alert.triggerEvent})`,
    outputSummary: `Status updated to ACKNOWLEDGED by ${alert.acknowledgedBy}`,
    risk: alert.severity,
    clinicianAction: `Acknowledged by ${alert.acknowledgedBy}`,
    user: alert.acknowledgedBy,
    ipAddress: '192.168.10.12'
  });

  res.json({ success: true, alert });
});

// Recommendations API
app.get('/api/recommendations', (req, res) => {
  const { status } = req.query;
  let filtered = [...recommendations];
  if (status && status !== 'ALL') {
    filtered = filtered.filter(r => r.status.toLowerCase() === (status as string).toLowerCase());
  }
  res.json({ recommendations: filtered, total: filtered.length });
});

app.post('/api/recommendations/:id/review', (req, res) => {
  const { decision, notes, reviewerName, modifiedActions } = req.body; // 'ACCEPTED' | 'MODIFIED' | 'REJECTED'
  const rec = recommendations.find(r => r.id === req.params.id);
  if (!rec) {
    return res.status(404).json({ error: 'Recommendation not found' });
  }

  rec.status = decision;
  rec.clinicianNotes = notes;
  rec.reviewedBy = reviewerName || 'Dr. N. D';
  rec.reviewedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (modifiedActions) {
    rec.modifiedActions = modifiedActions;
  }

  // Record audit trail
  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    timestamp: `14 Sep 2026 ${rec.reviewedAt}`,
    patientId: rec.patientId,
    patientName: rec.patientName,
    agent: 'Clinician Reviewer',
    event: `Clinical Decision: ${decision}`,
    inputSummary: `Recommendation for ${rec.predictedRiskTitle} (${rec.riskProbability}% prob)`,
    outputSummary: notes || `Recommendation ${decision} with ${rec.recommendedActions.length} actions reviewed`,
    risk: rec.riskLevel,
    clinicianAction: `${decision} by ${rec.reviewedBy}`,
    user: rec.reviewedBy,
    ipAddress: '192.168.10.12'
  });

  res.json({ success: true, recommendation: rec });
});

// Analytics API
app.get('/api/analytics', (req, res) => {
  // Update real-time counts
  const critical = patients.filter(p => p.riskLevel === 'CRITICAL').length;
  const high = patients.filter(p => p.riskLevel === 'HIGH').length;
  const medium = patients.filter(p => p.riskLevel === 'MEDIUM').length;
  const stable = patients.filter(p => p.riskLevel === 'STABLE').length;

  analytics.totalPatients = patients.length;
  analytics.criticalCount = critical;
  analytics.highRiskCount = high;
  analytics.mediumRiskCount = medium;
  analytics.stableCount = stable;
  analytics.activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;
  analytics.recommendationsCount = recommendations.filter(r => r.status === 'PENDING_REVIEW').length;
  analytics.riskDistribution = [
    { name: 'Critical', value: critical, color: '#ef4444' },
    { name: 'High Risk', value: high, color: '#f97316' },
    { name: 'Medium Risk', value: medium, color: '#eab308' },
    { name: 'Stable', value: stable, color: '#22c55e' }
  ];

  res.json({ analytics });
});

// Audit Logs API
app.get('/api/audit-logs', (req, res) => {
  const { search, agent, risk } = req.query;
  let filtered = [...auditLogs];

  if (agent && agent !== 'ALL') {
    filtered = filtered.filter(l => l.agent.toLowerCase().includes((agent as string).toLowerCase()));
  }
  if (risk && risk !== 'ALL') {
    filtered = filtered.filter(l => l.risk.toLowerCase() === (risk as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(l =>
      l.patientName.toLowerCase().includes(q) ||
      l.patientId.toLowerCase().includes(q) ||
      l.event.toLowerCase().includes(q) ||
      l.user.toLowerCase().includes(q)
    );
  }

  res.json({ auditLogs: filtered, total: filtered.length });
});

// Gemini-powered Explainable AI Endpoint
app.post('/api/gemini/explain', async (req, res) => {
  const { patientId, vitals, riskScore, diagnosis } = req.body;
  const ai = getAIClient();

  if (!ai) {
    // Return high-quality structured deterministic response if no key is configured
    return res.json({
      source: 'Deterministic Clinical Engine',
      explanation: `The system flagged clinical deterioration risk (${riskScore}%) for patient with ${diagnosis}. Primary physiological drivers include SpO2 of ${vitals?.spO2?.value ?? 86}%, Respiratory Rate of ${vitals?.respiratoryRate?.value ?? 28}/min, and Heart Rate of ${vitals?.heartRate?.value ?? 112} bpm. Findings indicate acute ventilation-perfusion mismatch requiring immediate clinician validation.`,
      confidence: 0.92,
      model: 'SmartTwin Clinical Rulebook v1.0 (Deterministic Fallback)'
    });
  }

  try {
    const prompt = `You are a clinical decision support assistant in an Explainable AI (XAI) smart hospital system.
    A patient digital twin presents with:
    - Diagnosis: ${diagnosis || 'Pneumonia'}
    - Vitals: SpO2: ${vitals?.spO2?.value || 86}%, RR: ${vitals?.respiratoryRate?.value || 28}/min, HR: ${vitals?.heartRate?.value || 112} bpm, Temp: ${vitals?.temperature?.value || 38.1}°C, BP: ${vitals?.bloodPressure?.value || '138/86'}
    - Calculated Risk Score: ${riskScore || 78}% (Deterioration)

    Provide a concise, highly objective, professional 2-3 sentence clinical explanation explaining WHY these indicators correlate with acute deterioration risk and cite relevant standard clinical guideline rationale (e.g. Surviving Sepsis Campaign or ATS).
    Strict constraint: Remind that this is a clinical decision support suggestion requiring clinician verification.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      source: 'Gemini 3.8 Flash (Server-Side)',
      explanation: response.text || 'Clinical explanation generated successfully.',
      confidence: 0.95,
      model: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.json({
      source: 'Deterministic Clinical Engine (Fallback)',
      explanation: `Clinical deterioration risk is elevated (${riskScore}%) due to significant hypoxemia and tachypneic compensation in the context of ${diagnosis}. Immediate bedside clinical assessment is recommended per standard critical care protocols.`,
      confidence: 0.90,
      model: 'SmartTwin Clinical Rulebook v1.0'
    });
  }
});

// Vite Middleware for Full-Stack development / Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SmartTwin AI] Full-stack Clinical Decision Support Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
