import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge, StatusPill } from '../common/Badge';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Activity, 
  PieChart as PieIcon, 
  Layers,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { analytics, patients } = useHospital();

  const responseTimeData = [
    { ward: 'ICU', responseMinutes: 3.2, target: 5.0 },
    { ward: 'CCU', responseMinutes: 4.1, target: 5.0 },
    { ward: 'HDU', responseMinutes: 6.8, target: 10.0 },
    { ward: 'Ward A', responseMinutes: 8.4, target: 15.0 },
    { ward: 'Ward B', responseMinutes: 9.1, target: 15.0 }
  ];

  const falseAlarmSuppressionData = [
    { month: 'May', rawAlerts: 420, aiFiltered: 240, fatigueReduction: '43%' },
    { month: 'Jun', rawAlerts: 460, aiFiltered: 255, fatigueReduction: '45%' },
    { month: 'Jul', rawAlerts: 490, aiFiltered: 270, fatigueReduction: '45%' },
    { month: 'Aug', rawAlerts: 510, aiFiltered: 290, fatigueReduction: '43%' },
    { month: 'Sep', rawAlerts: 530, aiFiltered: 310, fatigueReduction: '42%' }
  ];

  const modelMetrics = [
    { metric: 'ROC-AUC Score', value: '0.94', description: 'Discriminative accuracy for 2-4 hr deterioration' },
    { metric: 'Sensitivity (Recall)', value: '92.4%', description: 'Catch rate for acute physiological crises' },
    { metric: 'Specificity', value: '89.1%', description: 'True negative suppression rate' },
    { metric: 'Median Early Warning Lead', value: '4.2 hrs', description: 'Lead time before overt cardiopulmonary collapse' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
            HOSPITAL QUALITY & ML VALIDATION
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-sky-400" />
          Clinical AI Analytics & Operational Metrics
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Comprehensive hospital quality metrics, alarm fatigue reduction, ML validation ROC-AUC benchmarks, and interdisciplinary clinician response latency surveillance.
        </p>
      </div>

      {/* Model Performance Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {modelMetrics.map((m, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{m.metric}</div>
              <div className="text-2xl md:text-3xl font-bold font-mono text-sky-400 mt-1">{m.value}</div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-tight">{m.description}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Mean Clinician Alert Response Time by Ward */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Mean Clinician Response Latency by Ward
              </h3>
              <p className="text-xs text-slate-400">Response time from alert dispatch to bedside acknowledgment</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">All within SLA</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="ward" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="m" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="responseMinutes" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Actual Response (min)" />
                <Bar dataKey="target" fill="#334155" radius={[6, 6, 0, 0]} name="SLA Target (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Median Hospital Response: <strong>4.8 minutes</strong></span>
            <span className="text-emerald-400">Target &lt; 10 min</span>
          </div>
        </div>

        {/* Chart 2: Alarm Fatigue Suppression by Escalation Agent */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Alarm Fatigue Reduction (Escalation Agent)
              </h3>
              <p className="text-xs text-slate-400">Raw telemetry noise vs meaningful filtered clinical alerts</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              -42% Noise
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={falseAlarmSuppressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="rawAlerts" stroke="#ef4444" strokeWidth={2} name="Raw Alarms (Unfiltered)" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="aiFiltered" stroke="#10b981" strokeWidth={2} name="Escalation Agent Triaged" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Suppressed 220 nuisance alarms this month</span>
            <span className="text-emerald-400 font-semibold">99.8% Sensitivity Maintained</span>
          </div>
        </div>
      </div>
    </div>
  );
};
