import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge, StatusPill } from '../common/Badge';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  User, 
  Stethoscope, 
  Eye, 
  Filter, 
  ChevronRight, 
  Search,
  Bell,
  Activity,
  Layers
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    navigateToPatientProfile, 
    navigateToDecisionSupport,
    currentUser 
  } = useHospital();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ACKNOWLEDGED'>('ACTIVE');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAlerts = alerts.filter(a => {
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || a.severity === priorityFilter;
    const matchesSearch = !searchTerm || 
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.alertCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.triggerEvent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const activeCriticalAlerts = alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL');

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner (Matching Fig 6.2 Critical Alert Notification) */}
      {activeCriticalAlerts.length > 0 && (
        <div className="bg-rose-950/40 border-2 border-rose-500/60 rounded-2xl p-5 shadow-xl shadow-rose-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse-slow">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                  URGENT CLINICAL ATTENTION
                </span>
                <span className="text-xs font-mono text-rose-300">
                  {activeCriticalAlerts.length} Unacknowledged Critical Alert{activeCriticalAlerts.length > 1 ? 's' : ''}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-1">
                Critical Alert Detected: {activeCriticalAlerts[0].patientName} ({activeCriticalAlerts[0].room})
              </h2>
              <p className="text-xs text-rose-200 mt-1 max-w-2xl leading-relaxed">
                {activeCriticalAlerts[0].triggerEvent} — Triggered by rapid SpO₂ / RR deterioration. Immediate bedside triage and clinician validation required.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id={`ack-crit-alert-${activeCriticalAlerts[0].id}`}
              onClick={() => acknowledgeAlert(activeCriticalAlerts[0].id)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/60 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Acknowledge Alert</span>
            </button>
            <button
              onClick={() => navigateToDecisionSupport(undefined, activeCriticalAlerts[0].patientId)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-rose-500/40 flex items-center gap-1.5 transition-colors"
            >
              <Stethoscope className="w-4 h-4 text-rose-400" />
              <span>Review CDSS</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {(['ACTIVE', 'ACKNOWLEDGED', 'ALL'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === tab
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All Alerts' : tab}
              </button>
            ))}
          </div>

          {/* Priority Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Priority:
            </span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  priorityFilter === p
                    ? 'bg-slate-700 text-white font-semibold border border-slate-600'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient, alert code (e.g. ALT-10023), symptom, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
          />
        </div>
      </div>

      {/* Alerts Feed Cards (Matching Fig 6.2 Smart Alert Details) */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No alerts found matching current filter criteria.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCrit = alert.severity === 'CRITICAL';
            const isAck = alert.status === 'ACKNOWLEDGED';

            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-lg transition-all ${
                  isCrit && !isAck
                    ? 'border-rose-500/60 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/20'
                    : isAck
                    ? 'border-slate-800/80 opacity-80'
                    : 'border-slate-800'
                }`}
              >
                {/* Alert Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-400">
                      {alert.alertCode}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Detected at: <strong className="text-slate-200">{alert.detectedAt}</strong>
                    </span>
                    <RiskBadge level={alert.severity} size="sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase font-semibold border ${
                      isAck
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>

                {/* Patient Context & Trigger */}
                <div className="mt-3.5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Bio (4 cols) */}
                  <div className="lg:col-span-4 space-y-2">
                    <div>
                      <div className="text-base font-bold text-white">{alert.patientName}</div>
                      <div className="text-xs font-mono text-slate-400">
                        {alert.patientId} · {alert.patientAge}y / {alert.patientGender} · <strong className="text-sky-300">{alert.room} ({alert.ward})</strong>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">Clinical Context</div>
                      <p className="leading-snug">{alert.clinicalContext}</p>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      Detected by: <span className="text-sky-300">{alert.detectedBy.join(' → ')}</span>
                    </div>
                  </div>

                  {/* Right Triggering Parameters Table (Matching Fig 6.2) (8 cols) */}
                  <div className="lg:col-span-8 space-y-3">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      Triggering Physiological Parameters
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs bg-slate-950 rounded-xl border border-slate-800">
                        <thead>
                          <tr className="border-b border-slate-800/80 text-slate-400 font-mono text-[10px] uppercase">
                            <th className="p-2.5 pl-3">Parameter</th>
                            <th className="p-2.5">Current Value</th>
                            <th className="p-2.5">Normal Range</th>
                            <th className="p-2.5 pr-3">Anomaly Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-sans">
                          {alert.triggerParameters.map((param, i) => (
                            <tr key={i}>
                              <td className="p-2.5 pl-3 font-semibold text-slate-200">{param.parameter}</td>
                              <td className="p-2.5 font-mono font-bold text-slate-100">{param.currentValue}</td>
                              <td className="p-2.5 font-mono text-slate-400">{param.normalRange}</td>
                              <td className="p-2.5 pr-3">
                                <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-medium ${
                                  param.status.toLowerCase().includes('high') || param.status.toLowerCase().includes('risk')
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : param.status.toLowerCase().includes('low')
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {param.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer Controls & Acknowledgment Status */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-mono text-slate-400">
                    {isAck ? (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Acknowledged by {alert.acknowledgedBy} at {alert.acknowledgedAt}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-rose-400">
                        <AlertTriangle className="w-4 h-4 animate-pulse" />
                        Unacknowledged · Assigned to {alert.assignedTeam}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateToPatientProfile(alert.patientId)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      Patient Profile
                    </button>

                    <button
                      onClick={() => navigateToDecisionSupport(undefined, alert.patientId)}
                      className="px-3.5 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 text-xs font-semibold border border-sky-500/40 flex items-center gap-1 transition-colors"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Review CDSS Actions</span>
                    </button>

                    {!isAck && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
