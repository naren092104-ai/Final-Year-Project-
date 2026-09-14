import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge, StatusPill } from '../common/Badge';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Clock, 
  User, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useHospital();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [agentFilter, setAgentFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesAgent = agentFilter === 'ALL' || log.agent.toLowerCase().includes(agentFilter.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || log.risk === riskFilter;
    const matchesSearch = !searchTerm ||
      log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.inputSummary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAgent && matchesRisk && matchesSearch;
  });

  const exportAuditLogs = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smarttwin-clinical-audit-trail-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              REGULATORY & COMPLIANCE LOGS
            </span>
            <span className="text-xs font-mono text-emerald-400">
              IMMUTABLE AUDIT TRAIL
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-400" />
            Clinical Decision Support Audit & Traceability
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Traceable log recording every agent cognitive step, trigger event, SHAP explanation attribution, and clinician review signature for clinical governance.
          </p>
        </div>

        <button
          id="export-audit-trail-btn"
          onClick={exportAuditLogs}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Agent Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Actor / Agent:
            </span>
            {['ALL', 'Monitoring', 'Prediction', 'Escalation', 'Explanation', 'Clinician'].map(ag => (
              <button
                key={ag}
                onClick={() => setAgentFilter(ag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  agentFilter === ag
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {ag}
              </button>
            ))}
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-500 mr-1">Risk:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'STABLE'].map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  riskFilter === r
                    ? 'bg-slate-700 text-white font-semibold border border-slate-600'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by patient name, ID, clinician, or event type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3.5 pl-4">Timestamp & ID</th>
                <th className="py-3.5 px-3">Patient</th>
                <th className="py-3.5 px-3">Agent / Actor</th>
                <th className="py-3.5 px-3">Event Type</th>
                <th className="py-3.5 px-3">Input Summary</th>
                <th className="py-3.5 px-3">Output / Decision</th>
                <th className="py-3.5 px-3">Risk Tier</th>
                <th className="py-3.5 pr-4 text-right">User / Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs font-mono">
                    No compliance audit entries match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      <div>{log.timestamp}</div>
                      <div className="text-[9px] text-slate-500">{log.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{log.patientName}</div>
                      <div className="font-mono text-[10px] text-sky-400">{log.patientId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-300">
                        {log.agent}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {log.event}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px] max-w-[180px] truncate">
                      {log.inputSummary}
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-[200px] truncate">
                      {log.outputSummary}
                    </td>
                    <td className="py-3 px-3">
                      <RiskBadge level={log.risk} size="sm" />
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-[11px] text-slate-300">
                      <div>{log.user}</div>
                      <div className="text-[9px] text-slate-500">{log.ipAddress}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
