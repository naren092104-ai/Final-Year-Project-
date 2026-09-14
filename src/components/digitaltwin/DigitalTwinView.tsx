import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge, StatusPill } from '../common/Badge';
import { 
  Cpu, 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  Brain, 
  Droplet, 
  Zap, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  Layers,
  TrendingDown,
  TrendingUp,
  History
} from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  const { 
    selectedPatient, 
    patients, 
    setSelectedPatientId, 
    navigateToPatientProfile, 
    navigateToDecisionSupport,
    setCurrentPage,
    isLoading
  } = useHospital();

  const [isSyncing, setIsSyncing] = useState(false);
  const patient = selectedPatient || patients[0];
  const twin = patient.digitalTwin;

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  const organIcons: Record<string, React.ReactNode> = {
    respiratory: <Wind className="w-5 h-5 text-sky-400" />,
    cardiovascular: <Heart className="w-5 h-5 text-rose-400" />,
    thermoregulatory: <Thermometer className="w-5 h-5 text-amber-400" />,
    metabolic: <Droplet className="w-5 h-5 text-purple-400" />,
    renal: <Droplet className="w-5 h-5 text-cyan-400" />,
    neurological: <Brain className="w-5 h-5 text-blue-400" />
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header with Digital Twin Status & Patient Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              PHYSIOLOGICAL DIGITAL TWIN CORE
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {twin.syncStatus}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-sky-400" />
            Digital Twin: {patient.name} ({patient.patientId})
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Continuously updated virtual replica synthesizing streaming bedside telemetry, organ system metrics, historical baseline deviations, and AI agent feedback loops.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <select
            value={patient.patientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-sky-500"
          >
            {patients.map(p => (
              <option key={p.patientId} value={p.patientId}>
                {p.name} ({p.room} · {p.riskLevel})
              </option>
            ))}
          </select>

          <button
            id="sync-twin-btn"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Twin State</span>
          </button>
        </div>
      </div>

      {/* Sync Health & Telemetry Latency Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Sync Latency</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
            {twin.dataFreshnessMs || 20} ms
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Real-time edge buffer</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Last Twin State Sync</div>
          <div className="text-sm font-bold font-mono text-slate-200 mt-0.5 truncate">
            {twin.lastSynchronized}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Automated continuous cycle</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Telemetry Ingestion Sources</div>
          <div className="text-sm font-bold font-mono text-sky-400 mt-0.5">
            {twin.dataSources.length} Feeds Active
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 truncate">{twin.dataSources.join(', ')}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Overall Composite Risk</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-rose-400">{patient.riskScore}%</span>
            <RiskBadge level={patient.riskLevel} size="sm" />
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Prediction Agent score</div>
        </div>
      </div>

      {/* Main Grid: Organ System Digital Breakdown vs State Deltas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Organ Systems Virtual Modeling (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Organ Systems Physiological Modeling
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {twin.organSystems.length} Subsystems Monitored
              </span>
            </div>

            <div className="space-y-3">
              {twin.organSystems.map((organ, idx) => {
                const isCrit = organ.status === 'CRITICAL';
                const isMod = organ.status === 'MODERATE' || organ.status === 'ELEVATED';

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isCrit 
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-sm' 
                        : isMod
                        ? 'bg-amber-950/10 border-amber-500/30'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                          {organIcons[organ.system] || <Activity className="w-5 h-5 text-sky-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-100">{organ.name}</h4>
                            <RiskBadge level={organ.status === 'CRITICAL' ? 'CRITICAL' : organ.status === 'MODERATE' || organ.status === 'ELEVATED' ? 'HIGH' : 'STABLE'} size="sm" />
                          </div>
                          <div className="text-xs font-mono text-slate-300 font-semibold mt-0.5">
                            Key Telemetry: {organ.keyMetrics}
                          </div>
                        </div>
                      </div>

                      {/* Organ Risk Gauge */}
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono text-slate-400">Acuity Index</div>
                        <div className={`text-lg font-bold font-mono ${isCrit ? 'text-rose-400' : isMod ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {organ.score}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-start gap-1.5 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Clinical State Note:</span>
                      <span className="leading-snug">{organ.clinicalNote}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: State Deltas (Before vs After) & Twin Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* State Deltas (Matching Fig 6.1 Digital Twin Delta Specification) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  State Deltas (Baseline vs Current)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Digital Diff</span>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Real-time physiological shifts detected by the Monitoring Agent comparing current streaming packets to historical baseline:
            </p>

            <div className="space-y-2.5">
              {twin.stateDeltas.map((delta, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-xl border text-xs ${
                    delta.changeType === 'worsened'
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : delta.changeType === 'improved'
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-200">{delta.parameter}</span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                      delta.changeType === 'worsened' ? 'bg-rose-500/20 text-rose-300 font-bold' : delta.changeType === 'improved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {delta.changeType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-mono text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 block">PREVIOUS</span>
                      <span className="text-slate-400">{delta.previousValue}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">CURRENT</span>
                      <span className={`font-bold ${delta.changeType === 'worsened' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {delta.currentValue}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Twin Event Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white tracking-tight mb-3">
              Twin State Synchronization Timeline
            </h3>

            <div className="space-y-3">
              {twin.twinTimeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-sky-400 font-mono text-[10px] shrink-0">
                    {item.timestamp}
                  </span>
                  <div className="flex-1 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="text-slate-200 font-medium leading-snug">{item.event}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Source: {item.source}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => navigateToDecisionSupport(undefined, patient.patientId)}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>Generate CDSS Recommendation from Twin</span>
            </button>
            <button
              onClick={() => navigateToPatientProfile(patient.patientId)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              View Full Clinical Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
