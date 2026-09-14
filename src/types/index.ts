export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'STABLE';

export type UserRole = 'Doctor' | 'Nurse' | 'Admin';

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  role: UserRole;
  avatar: string;
  department: string;
  email: string;
}

export interface VitalSign {
  value: number | string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'low' | 'high' | 'critical-low' | 'critical-high';
  trend: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  lastUpdated: string;
  history: { time: string; value: number }[];
}

export interface PatientVitals {
  heartRate: VitalSign & { value: number };
  temperature: VitalSign & { value: number };
  respiratoryRate: VitalSign & { value: number };
  spO2: VitalSign & { value: number };
  bloodPressure: VitalSign & { value: string; systolic: number; diastolic: number };
  glucose?: VitalSign & { value: number };
}

export interface LabResult {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  status: 'active' | 'completed' | 'paused';
}

export interface OrganSystemStatus {
  system: 'respiratory' | 'cardiovascular' | 'neurological' | 'renal' | 'metabolic' | 'thermoregulatory';
  name: string;
  status: RiskLevel;
  score: number; // 0-100
  keyMetrics: string;
  clinicalNote: string;
}

export interface DigitalTwinState {
  patientId: string;
  lastSynchronized: string;
  dataFreshnessMs: number;
  syncStatus: 'SYNCHRONIZED' | 'SYNCING' | 'STALE' | 'DISCONNECTED';
  dataSources: string[];
  physiologicalState: PatientVitals;
  organSystems: OrganSystemStatus[];
  stateDeltas: {
    parameter: string;
    previousValue: string;
    currentValue: string;
    changeType: 'worsened' | 'improved' | 'unchanged';
    timestamp: string;
  }[];
  twinTimeline: {
    timestamp: string;
    event: string;
    source: string;
    impact: 'low' | 'medium' | 'high';
  }[];
}

export interface Patient {
  id: string;
  patientId: string; // e.g., "PT-10023"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  room: string;
  ward: 'ICU' | 'Cardiology' | 'Pulmonology' | 'General Ward' | 'Emergency' | 'Surgical ICU';
  diagnosis: string;
  admissionDate: string;
  attendingPhysician: string;
  avatarUrl?: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100%
  trend: 'Deteriorating' | 'Stable' | 'Improving';
  lastUpdated: string;
  vitals: PatientVitals;
  medicalHistory: string[];
  medications: Medication[];
  allergies: string[];
  recentLabs: LabResult[];
  digitalTwin: DigitalTwinState;
  patientContext: {
    consciousState: string;
    oxygenSupport: string;
    urineOutput: string;
    distressLevel: string;
  };
  events: {
    id: string;
    time: string;
    description: string;
    category: 'vital_change' | 'agent_alert' | 'clinical_review' | 'admission';
  }[];
}

export type AgentType = 'MONITORING' | 'PREDICTION' | 'ESCALATION' | 'EXPLANATION';

export interface AgentInfo {
  id: AgentType;
  name: string;
  title: string;
  purpose: string;
  status: 'ACTIVE' | 'PROCESSING' | 'IDLE';
  tasks: string[];
  lastExecutionTime: string;
  inferenceLatencyMs: number;
  processedEventsToday: number;
}

export interface AgentEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  patientId: string;
  patientName: string;
  agentType: AgentType;
  eventType: string;
  summary: string;
  details: string;
  severity: RiskLevel;
  inputPayload?: Record<string, any>;
  outputPayload?: Record<string, any>;
}

export interface AlertTriggerParam {
  parameter: string;
  currentValue: string;
  normalRange: string;
  status: 'Normal' | 'High' | 'High Risk' | 'Critical' | 'Low Risk' | 'Low';
}

export interface Alert {
  id: string;
  alertCode: string; // e.g. "ALT-20260914-001"
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  ward: string;
  room: string;
  priority: 'HIGH PRIORITY' | 'CRITICAL' | 'MEDIUM PRIORITY' | 'LOW PRIORITY';
  severity: RiskLevel;
  title: string;
  detectedAt: string;
  triggerEvent: string; // e.g. "Respiratory Deterioration"
  triggerParameters: AlertTriggerParam[];
  clinicalContext: string;
  detectedBy: string[]; // ["Monitoring Agent", "Prediction Agent"]
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  assignedTeam: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface PredictedEventItem {
  name: string;
  probability: number; // percentage e.g. 78
  timeframe: string; // e.g. "Within 4-6 hours"
  confidence: number;
}

export interface KeyContributingFactor {
  factor: string;
  impactScore: number;
  category: 'vital' | 'history' | 'demographic' | 'lab';
  iconType: 'lungs' | 'heart' | 'temp' | 'history' | 'user' | 'lab';
}

export interface RecommendationAction {
  order: number;
  action: string;
  category: 'oxygen' | 'lab' | 'medication' | 'team' | 'monitoring' | 'other';
  rationale: string;
}

export interface ClinicalRecommendation {
  id: string;
  alertId?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  room: string;
  ward: string;
  predictionTime: string;
  dataSource: string; // "Digital Twin (Real-time)"
  modelInfo: string; // "Critical Event Prediction Model (v1.0)"
  predictedRiskTitle: string; // "High Risk of Respiratory Failure"
  riskProbability: number; // 78%
  riskLevel: RiskLevel;
  topPredictedEvents: PredictedEventItem[];
  keyContributingFactors: KeyContributingFactor[];
  modelExplanation: string;
  recommendedActions: RecommendationAction[];
  clinicalGuidelinesReference: string;
  status: 'PENDING_REVIEW' | 'ACCEPTED' | 'MODIFIED' | 'REJECTED';
  clinicianNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  modifiedActions?: string[];
  rejectionReason?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  patientId: string;
  patientName: string;
  agent: string;
  event: string;
  inputSummary: string;
  outputSummary: string;
  risk: RiskLevel;
  clinicianAction?: string;
  user: string;
  ipAddress?: string;
}

export interface HospitalAnalytics {
  totalPatients: number;
  criticalCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  stableCount: number;
  activeAlertsCount: number;
  recommendationsCount: number;
  deterioratingCount: number;
  agentsActiveCount: number;
  avgAlertLatencyMinutes: number;
  acknowledgementRatePercent: number;
  falseAlertReductionPercent: number;
  predictionAccuracyPercent: number;
  alertsByWard: { ward: string; count: number }[];
  riskDistribution: { name: string; value: number; color: string }[];
  riskTrend24h: { time: string; critical: number; high: number; medium: number; stable: number }[];
  agentActivityHourly: { hour: string; monitoring: number; prediction: number; escalation: number; explanation: number }[];
}

export interface SimulationStepLog {
  step: number;
  title: string;
  agent: string;
  status: 'pending' | 'running' | 'completed';
  result: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface SimulationResult {
  patientId: string;
  initialVitals: PatientVitals;
  simulatedVitals: PatientVitals;
  twinUpdated: boolean;
  monitoringOutput: {
    abnormalitiesDetected: string[];
    isAbnormal: boolean;
  };
  predictionOutput: {
    predictedRisk: string;
    riskProbability: number;
    riskLevel: RiskLevel;
    topEvents: PredictedEventItem[];
  };
  escalationOutput: {
    priority: string;
    alertCreated: boolean;
    alertId?: string;
  };
  explanationOutput: {
    modelExplanation: string;
    recommendedActions: string[];
    guidelinesRef: string;
  };
  executionTimeMs: number;
}
