import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Patient, Alert, ClinicalRecommendation, AuditLogEntry, HospitalAnalytics, AgentInfo, AgentEvent, PatientVitals } from '../types';
import { INITIAL_PATIENTS, INITIAL_AGENTS, INITIAL_ALERTS, INITIAL_RECOMMENDATIONS, INITIAL_AUDIT_LOGS, INITIAL_ANALYTICS } from '../data/mockPatients';
import { API } from '../lib/api';

export type NavigationPage = 
  | 'overview' 
  | 'patients' 
  | 'patient-profile' 
  | 'digital-twins' 
  | 'live-monitoring' 
  | 'ai-agents' 
  | 'alerts' 
  | 'clinical-decisions' 
  | 'analytics' 
  | 'simulation' 
  | 'audit-logs';

export type ClinicianRole = 'Attending Physician' | 'ICU Specialist' | 'Senior Charge Nurse' | 'Clinical AI Administrator';

export interface UserProfile {
  name: string;
  role: ClinicianRole;
  department: string;
  avatar: string;
  id: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  timestamp: string;
}

interface HospitalContextType {
  // Navigation & View
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedPatient: Patient | null;
  navigateToPatientProfile: (patientId: string) => void;
  navigateToDigitalTwin: (patientId: string) => void;
  navigateToDecisionSupport: (recommendationId?: string, patientId?: string) => void;

  // Data Collections
  patients: Patient[];
  alerts: Alert[];
  recommendations: ClinicalRecommendation[];
  agents: AgentInfo[];
  agentEvents: AgentEvent[];
  auditLogs: AuditLogEntry[];
  analytics: HospitalAnalytics;
  isLoading: boolean;

  // User Profile
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;

  // Live Stream & Telemetry Simulation
  isLiveMonitoringActive: boolean;
  setIsLiveMonitoringActive: (active: boolean) => void;
  telemetryTickRateMs: number;
  setTelemetryTickRateMs: (rate: number) => void;
  audioAlertsEnabled: boolean;
  setAudioAlertsEnabled: (enabled: boolean) => void;

  // Actions
  refreshAllData: () => Promise<void>;
  updatePatientVitals: (patientId: string, vitals: PatientVitals) => Promise<any>;
  acknowledgeAlert: (alertId: string) => Promise<boolean>;
  reviewRecommendation: (recId: string, decision: 'ACCEPTED' | 'MODIFIED' | 'REJECTED', notes?: string, modifiedActions?: string[]) => Promise<boolean>;
  runSimulationForPatient: (patientId: string, customVitals?: PatientVitals) => Promise<any>;
  admitNewPatient: (patientData: Partial<Patient>) => Promise<boolean>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;

  // Search & Filters
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Modals & Settings
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isAddPatientOpen: boolean;
  setIsAddPatientOpen: (open: boolean) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-01',
    name: 'Dr. N. D',
    role: 'Attending Physician',
    department: 'Intensive Care Unit',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-02',
    name: 'Dr. Sarah Chen',
    role: 'ICU Specialist',
    department: 'Critical Care & Pulmonology',
    avatar: 'https://images.unsplash.com/photo-1594824813583-78531548231c?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-03',
    name: 'Nurse Marcus Vance',
    role: 'Senior Charge Nurse',
    department: 'Cardiology Telemetry Ward',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-04',
    name: 'Alex Rivera',
    role: 'Clinical AI Administrator',
    department: 'Biomedical Informatics',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('overview');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('PT-10023');
  
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [recommendations, setRecommendations] = useState<ClinicalRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [analytics, setAnalytics] = useState<HospitalAnalytics>(INITIAL_ANALYTICS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USERS[0]);
  const [isLiveMonitoringActive, setIsLiveMonitoringActive] = useState<boolean>(true);
  const [telemetryTickRateMs, setTelemetryTickRateMs] = useState<number>(3000);
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState<boolean>(false);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = `tst-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      removeToast(id);
    }, 6000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshAllData = useCallback(async () => {
    try {
      const [pts, alts, recs, anl, evts, logs] = await Promise.all([
        API.getPatients(),
        API.getAlerts(),
        API.getRecommendations(),
        API.getAnalytics(),
        API.getAgentEvents(),
        API.getAuditLogs()
      ]);

      if (pts && pts.length > 0) setPatients(pts);
      if (alts) setAlerts(alts);
      if (recs) setRecommendations(recs);
      if (anl) setAnalytics(anl);
      if (evts && evts.length > 0) setAgentEvents(evts);
      if (logs && logs.length > 0) setAuditLogs(logs);
    } catch (e) {
      console.warn('Refresh error; using local state fallback', e);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Selected patient object
  const selectedPatient = patients.find(p => p.id === selectedPatientId || p.patientId === selectedPatientId) || patients[0] || null;

  const navigateToPatientProfile = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentPage('patient-profile');
  };

  const navigateToDigitalTwin = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentPage('digital-twins');
  };

  const navigateToDecisionSupport = (recommendationId?: string, patientId?: string) => {
    if (patientId) setSelectedPatientId(patientId);
    setCurrentPage('clinical-decisions');
  };

  // Live telemetry subtle fluctuation engine for demo realism
  useEffect(() => {
    if (!isLiveMonitoringActive) return;

    const interval = setInterval(() => {
      setPatients(prevPatients => {
        return prevPatients.map(p => {
          // Slight physiological jitter
          const hrJitter = (Math.random() - 0.5) * 1.5;
          const spo2Jitter = Math.random() > 0.8 ? (Math.random() - 0.5) * 0.8 : 0;
          const currentHr = Math.round(Math.max(45, Math.min(180, p.vitals.heartRate.value + hrJitter)));
          const currentSpo2 = Math.round(Math.max(75, Math.min(100, p.vitals.spO2.value + spo2Jitter)));

          const updatedVitals: PatientVitals = {
            ...p.vitals,
            heartRate: {
              ...p.vitals.heartRate,
              value: currentHr,
              history: [...p.vitals.heartRate.history.slice(-19), { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), value: currentHr }]
            },
            spO2: {
              ...p.vitals.spO2,
              value: currentSpo2,
              history: [...p.vitals.spO2.history.slice(-19), { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), value: currentSpo2 }]
            }
          };

          return {
            ...p,
            vitals: updatedVitals,
            digitalTwin: {
              ...p.digitalTwin,
              dataFreshnessMs: Math.floor(10 + Math.random() * 35),
              physiologicalState: updatedVitals
            }
          };
        });
      });
    }, telemetryTickRateMs);

    return () => clearInterval(interval);
  }, [isLiveMonitoringActive, telemetryTickRateMs]);

  const updatePatientVitals = async (patientId: string, vitals: PatientVitals) => {
    setIsLoading(true);
    try {
      const res = await API.updatePatientVitals(patientId, vitals);
      if (res?.result?.patient) {
        setPatients(prev => prev.map(p => p.patientId === patientId ? res.result.patient : p));
        await refreshAllData();
        addToast({
          title: 'Vitals Updated & Agents Triggered',
          message: `Digital Twin for ${res.result.patient.name} updated with risk score ${res.result.patient.riskScore}%`,
          type: res.result.patient.riskLevel === 'CRITICAL' ? 'critical' : 'info'
        });
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string): Promise<boolean> => {
    const res = await API.acknowledgeAlert(alertId, currentUser.name);
    if (res?.success) {
      setAlerts(prev => prev.map(a => a.id === alertId || a.alertCode === alertId ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: currentUser.name, acknowledgedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : a));
      addToast({
        title: 'Alert Acknowledged',
        message: `Alert recorded in clinical audit log by ${currentUser.name}`,
        type: 'success'
      });
      refreshAllData();
      return true;
    }
    return false;
  };

  const reviewRecommendation = async (recId: string, decision: 'ACCEPTED' | 'MODIFIED' | 'REJECTED', notes?: string, modifiedActions?: string[]): Promise<boolean> => {
    const res = await API.reviewRecommendation(recId, decision, notes, currentUser.name, modifiedActions);
    if (res?.success) {
      setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: decision, clinicianNotes: notes, reviewedBy: currentUser.name, reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), modifiedActions } : r));
      addToast({
        title: `Recommendation ${decision}`,
        message: `Decision logged with clinician signature (${currentUser.name})`,
        type: decision === 'ACCEPTED' ? 'success' : decision === 'MODIFIED' ? 'info' : 'warning'
      });
      refreshAllData();
      return true;
    }
    return false;
  };

  const runSimulationForPatient = async (patientId: string, customVitals?: PatientVitals) => {
    setIsLoading(true);
    try {
      const res = await API.runAgentPipeline(patientId, customVitals);
      if (res?.success) {
        await refreshAllData();
        addToast({
          title: 'Simulation Executed',
          message: `4-Agent Pipeline finished in ${res.executionTimeMs || 42}ms for ${res.patient?.name}`,
          type: 'info'
        });
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const admitNewPatient = async (patientData: Partial<Patient>): Promise<boolean> => {
    const res = await API.addPatient(patientData);
    if (res?.patient) {
      setPatients(prev => [res.patient, ...prev]);
      addToast({
        title: 'Patient Admitted',
        message: `${res.patient.name} admitted to ${res.patient.ward}. Digital Twin instantiated.`,
        type: 'success'
      });
      return true;
    }
    return false;
  };

  return (
    <HospitalContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        navigateToPatientProfile,
        navigateToDigitalTwin,
        navigateToDecisionSupport,
        patients,
        alerts,
        recommendations,
        agents,
        agentEvents,
        auditLogs,
        analytics,
        isLoading,
        currentUser,
        setCurrentUser,
        isLiveMonitoringActive,
        setIsLiveMonitoringActive,
        telemetryTickRateMs,
        setTelemetryTickRateMs,
        audioAlertsEnabled,
        setAudioAlertsEnabled,
        refreshAllData,
        updatePatientVitals,
        acknowledgeAlert,
        reviewRecommendation,
        runSimulationForPatient,
        admitNewPatient,
        toasts,
        addToast,
        removeToast,
        globalSearch,
        setGlobalSearch,
        isSettingsOpen,
        setIsSettingsOpen,
        isAddPatientOpen,
        setIsAddPatientOpen
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
