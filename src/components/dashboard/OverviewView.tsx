import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge, StatusPill } from '../common/Badge';
import { 
  Users, 
  AlertTriangle, 
  HeartPulse, 
  Activity, 
  ShieldAlert, 
  Bot, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  Stethoscope,
  RefreshCw,
  Cpu,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const OverviewView: React.FC = () => {
  const { 
    patients, 
    alerts, 
    recommendations, 
    analytics, 
    navigateToPatientProfile, 
    navigateToDecisionSupport,
    setCurrentPage, 
    acknowledgeAlert,
    runSimulationForPatient,
    refreshAllData,
    isLoading
  } = useHospital();

  const criticalPatients = patients.filter(p => p.riskLevel === 'CRITICAL');
  const highRiskPatients = patients.filter(p => p.riskLevel === 'HIGH');
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const pendingRecs = recommendations.filter(r => r.status === 'PENDING_REVIEW');

  const riskData = [
    { name: 'Critical', value: analytics.criticalCount || 3, color: '#ef4444' },
    { name: 'High Risk', value: analytics.highRiskCount || 4, color: '#f97316' },
    { name: 'Medium Risk', value: analytics.mediumRiskCount || 5, color: '#eab308' },
    { name: 'Stable', value: analytics.stableCount || 4, color: '#22c55e' }
  ];

  const trendData = [
    { time: '06:00', critical: 1, high: 3, stable: 12 },
    { time: '07:00', critical: 2, high: 4, stable: 10 },
    { time: '08:00', critical: 2, high: 5, stable: 9 },
    { time: '09:00', critical: 3, high: 4, stable: 9 },
    { time: '10:00', critical: 4, high: 4, stable: 8 },
    { time: '11:00', critical: 3, high: 5, stable: 8 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner / System Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              SMART HOSPITAL AI PLATFORM
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              All 4 Agents Operational
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
            Clinical Decision Support & Digital Twin Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Continuous physiological surveillance with autonomous 4-agent orchestration: Monitoring, Predictive Deterioration Modeling, Escalation, and Explainable Clinical Recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="refresh-overview-btn"
            onClick={() => refreshAllData()}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>

          <button
            id="launch-demo-simulation-btn"
            onClick={() => setCurrentPage('simulation')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-900/30 flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Run Deterioration Simulation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div 
          onClick={() => setCurrentPage('patients')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium font-mono uppercase tracking-wider">Total Patients Monitored</span>
            <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-slate-700 transition-colors">
              <Users className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight">
              {patients.length}
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              100% Digital Twin Sync
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{analytics.stableCount} Stable</span>
            <span>· {analytics.mediumRiskCount} Moderate</span>
          </div>
        </div>

        {/* Critical Risk Patients */}
        <div 
          onClick={() => setCurrentPage('patients')}
          className="bg-slate-900 border border-rose-500/30 hover:border-rose-500/50 rounded-2xl p-4 transition-all cursor-pointer shadow-sm bg-gradient-to-b from-slate-900 to-rose-950/20 group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium font-mono uppercase tracking-wider text-rose-400">Critical Risk Patients</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 group-hover:bg-rose-500/30 transition-colors">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold font-mono text-rose-400 tracking-tight">
              {criticalPatients.length}
            </div>
            <span className="text-[11px] font-mono text-rose-300/80">
              Score ≥ 75%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-rose-300/90 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            Requires urgent bedside assessment
          </div>
        </div>

        {/* Active Smart Alerts */}
        <div 
          onClick={() => setCurrentPage('alerts')}
          className="bg-slate-900 border border-amber-500/30 hover:border-amber-500/50 rounded-2xl p-4 transition-all cursor-pointer shadow-sm bg-gradient-to-b from-slate-900 to-amber-950/20 group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium font-mono uppercase tracking-wider text-amber-400">Active Smart Alerts</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30 transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold font-mono text-amber-400 tracking-tight">
              {activeAlerts.length}
            </div>
            <span className="text-[11px] font-mono text-amber-300">
              {alerts.filter(a => a.severity === 'CRITICAL').length} Critical
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>Escalation Agent triaged</span>
          </div>
        </div>

        {/* Pending CDSS Recommendations */}
        <div 
          onClick={() => setCurrentPage('clinical-decisions')}
          className="bg-slate-900 border border-sky-500/30 hover:border-sky-500/50 rounded-2xl p-4 transition-all cursor-pointer shadow-sm bg-gradient-to-b from-slate-900 to-sky-950/20 group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium font-mono uppercase tracking-wider text-sky-400">CDSS Recommendations</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 group-hover:bg-sky-500/30 transition-colors">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold font-mono text-sky-400 tracking-tight">
              {pendingRecs.length}
            </div>
            <span className="text-[11px] font-mono text-sky-300">
              Pending Review
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>Clinician validation required</span>
          </div>
        </div>
      </div>

      {/* Charts & Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Donut */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Patient Risk Tier Distribution</h3>
              <p className="text-xs text-slate-400">Real-time risk classification by Prediction Agent</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{patients.length} Total</span>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            {riskData.map(item => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6-Hour Deterioration Trend */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">6-Hour Ward Acuity & Deterioration Trend</h3>
              <p className="text-xs text-slate-400">Aggregated risk trajectory across ICU, CCU, and Step-down Wards</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              AUC-ROC: 0.94
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#criticalGrad)" name="Critical Acuity" />
                <Area type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#highGrad)" name="High Risk" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <TrendingDown className="w-3.5 h-3.5" />
              Early Intervention reduced median deterioration latency by 4.2 hours
            </span>
            <button
              onClick={() => setCurrentPage('analytics')}
              className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-0.5"
            >
              Full Analytics →
            </button>
          </div>
        </div>
      </div>

      {/* Priority Critical Patients Attention Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                High-Acuity Patient Surveillance Queue
              </h2>
              <p className="text-xs text-slate-400">
                Patients prioritized by Multi-Parameter Deterioration Probability
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('patients')}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
          >
            View All {patients.length} Patients <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="pb-3 pl-2">Patient</th>
                <th className="pb-3">Location / Ward</th>
                <th className="pb-3">Diagnosis</th>
                <th className="pb-3">Heart Rate</th>
                <th className="pb-3">SpO₂</th>
                <th className="pb-3">Resp. Rate</th>
                <th className="pb-3">Risk Score</th>
                <th className="pb-3">Trend</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {patients.slice(0, 5).map(p => {
                const isCrit = p.riskLevel === 'CRITICAL';
                return (
                  <tr 
                    key={p.id}
                    className={`hover:bg-slate-800/40 transition-colors ${isCrit ? 'bg-rose-950/10' : ''}`}
                  >
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={p.avatarUrl} 
                          alt={p.name} 
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700" 
                        />
                        <div>
                          <div className="font-semibold text-slate-200 hover:text-sky-400 cursor-pointer" onClick={() => navigateToPatientProfile(p.patientId)}>
                            {p.name}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {p.patientId} · {p.age}y {p.gender[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-mono">
                      <span className="text-slate-300 font-medium">{p.room}</span>
                      <div className="text-[10px] text-slate-400">{p.ward}</div>
                    </td>
                    <td className="py-3 text-slate-300 max-w-[160px] truncate">
                      {p.diagnosis}
                    </td>
                    <td className="py-3 font-mono">
                      <span className={p.vitals.heartRate.value > 100 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                        {p.vitals.heartRate.value} bpm
                      </span>
                    </td>
                    <td className="py-3 font-mono">
                      <span className={p.vitals.spO2.value < 90 ? 'text-rose-400 font-bold animate-pulse' : p.vitals.spO2.value < 95 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                        {p.vitals.spO2.value} %
                      </span>
                    </td>
                    <td className="py-3 font-mono">
                      <span className={p.vitals.respiratoryRate.value > 22 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                        {p.vitals.respiratoryRate.value} /min
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={p.riskLevel} size="sm" />
                        <span className="font-mono font-bold text-slate-200">{p.riskScore}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-[11px] font-medium ${
                        p.trend === 'Deteriorating' ? 'text-rose-400' : p.trend === 'Improving' ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        {p.trend}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateToPatientProfile(p.patientId)}
                          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-colors"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => navigateToDecisionSupport(undefined, p.patientId)}
                          className="px-2.5 py-1 rounded-md bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 text-[11px] font-semibold border border-sky-500/40 transition-colors"
                        >
                          CDSS
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Specialized AI Agents Live Architecture Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Bot className="w-4 h-4 text-sky-400" />
              Autonomous 4-Agent Orchestration Pipeline
            </h3>
            <p className="text-xs text-slate-400">Sequential multi-agent cognitive architecture for safe clinical intelligence</p>
          </div>
          <button 
            onClick={() => setCurrentPage('ai-agents')}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
          >
            Inspect Agent Telemetry →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* Monitoring Agent */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  AGENT 1
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-200">Monitoring Agent</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Detects vital sign threshold violations, trends, and continuous anomaly patterns.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
              Latency: 18ms · 100% telemetry coverage
            </div>
          </div>

          {/* Prediction Agent */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  AGENT 2
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-200">Prediction Agent</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Estimates 2-4 hr deterioration probability using multi-parameter physiological models.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
              AUC-ROC: 0.94 · 78% risk detected
            </div>
          </div>

          {/* Escalation Agent */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AGENT 3
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-200">Escalation Agent</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Triages alert priority, suppresses alarm fatigue, and routes notifications to ICU teams.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
              Fatigue reduction: 42% · Instant paging
            </div>
          </div>

          {/* Explanation Agent */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AGENT 4
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-200">Explanation Agent (XAI)</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Synthesizes clinical rationale, key SHAP contributing factors, and prioritized actionable advice.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
              Surviving Sepsis & ATS citations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
