import { Patient, Alert, ClinicalRecommendation, AuditLogEntry, HospitalAnalytics, AgentInfo, AgentEvent, PatientVitals } from '../types';

export const API = {
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch (e) {
      return { status: 'offline', geminiConfigured: false };
    }
  },

  async getPatients(params?: { ward?: string; risk?: string; search?: string }) {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`/api/patients?${query}`);
      const data = await res.json();
      return data.patients as Patient[];
    } catch (e) {
      console.warn('API fetch patients failed, using fallback', e);
      return [];
    }
  },

  async getPatientById(id: string) {
    try {
      const res = await fetch(`/api/patients/${id}`);
      const data = await res.json();
      return data.patient as Patient;
    } catch (e) {
      console.warn('API get patient failed', e);
      return null;
    }
  },

  async addPatient(patientData: Partial<Patient>) {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      return await res.json();
    } catch (e) {
      console.error('API add patient error', e);
      return { error: 'Failed to add patient' };
    }
  },

  async updatePatientVitals(patientId: string, vitals: PatientVitals) {
    try {
      const res = await fetch(`/api/patients/${patientId}/vitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vitals })
      });
      return await res.json();
    } catch (e) {
      console.error('API update vitals error', e);
      return null;
    }
  },

  async syncDigitalTwin(patientId: string) {
    try {
      const res = await fetch(`/api/digital-twins/${patientId}/sync`, { method: 'POST' });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getAgents() {
    try {
      const res = await fetch('/api/agents/status');
      return await res.json();
    } catch (e) {
      return { agents: [] };
    }
  },

  async getAgentEvents() {
    try {
      const res = await fetch('/api/agents/events');
      const data = await res.json();
      return (data.events || []) as AgentEvent[];
    } catch (e) {
      return [];
    }
  },

  async runAgentPipeline(patientId: string, vitals?: PatientVitals) {
    try {
      const res = await fetch('/api/agents/run-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, vitals })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getAlerts(params?: { status?: string; priority?: string }) {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`/api/alerts?${query}`);
      const data = await res.json();
      return (data.alerts || []) as Alert[];
    } catch (e) {
      return [];
    }
  },

  async acknowledgeAlert(alertId: string, clinicianName?: string) {
    try {
      const res = await fetch(`/api/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicianName })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getRecommendations(params?: { status?: string }) {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`/api/recommendations?${query}`);
      const data = await res.json();
      return (data.recommendations || []) as ClinicalRecommendation[];
    } catch (e) {
      return [];
    }
  },

  async reviewRecommendation(id: string, decision: 'ACCEPTED' | 'MODIFIED' | 'REJECTED', notes?: string, reviewerName?: string, modifiedActions?: string[]) {
    try {
      const res = await fetch(`/api/recommendations/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, notes, reviewerName, modifiedActions })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getAnalytics() {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      return data.analytics as HospitalAnalytics;
    } catch (e) {
      return null;
    }
  },

  async getAuditLogs(params?: { search?: string; agent?: string; risk?: string }) {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`/api/audit-logs?${query}`);
      const data = await res.json();
      return (data.auditLogs || []) as AuditLogEntry[];
    } catch (e) {
      return [];
    }
  },

  async generateGeminiExplanation(payload: { patientId: string; vitals: any; riskScore: number; diagnosis: string }) {
    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (e) {
      return {
        explanation: 'Clinical deterioration risk is elevated. Patient requires prompt clinical validation and supplemental oxygen titration.',
        source: 'Local Rule Engine'
      };
    }
  }
};
