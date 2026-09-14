import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge, StatusPill } from '../common/Badge';
import { 
  Activity, 
  Heart, 
  Wind, 
  Gauge, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Filter, 
  Search,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Cpu,
  Stethoscope
} from 'lucide-react';

export const LiveMonitoringView: React.FC = () => {
  const { 
    patients, 
    isLiveMonitoringActive, 
    setIsLiveMonitoringActive, 
    audioAlertsEnabled, 
    setAudioAlertsEnabled,
    telemetryTickRateMs,
    setTelemetryTickRateMs,
    navigateToPatientProfile,
    navigateToDigitalTwin,
    navigateToDecisionSupport
  } = useHospital();

  const [wardFilter, setWardFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredPatients = patients.filter(p => {
    const matchesWard = wardFilter === 'ALL' || p.ward.toLowerCase() === wardFilter.toLowerCase();
    const matchesSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesWard && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header & Telemetry Stream Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isLiveMonitoringActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
              {isLiveMonitoringActive ? 'CENTRAL TELEMETRY STREAM ACTIVE' : 'STREAM PAUSED'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {filteredPatients.length} Channels
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-sky-400" />
            Live Bedside Telemetry Surveillance Grid
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Real-time multi-channel physiological waveform and numerical parameter telemetry with threshold breach alerts.
          </p>
        </div>

        {/* Streaming Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="toggle-stream-btn"
            onClick={() => setIsLiveMonitoringActive(!isLiveMonitoringActive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              isLiveMonitoringActive 
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
                : 'bg-emerald-600 text-white border-emerald-500 shadow-md'
            }`}
          >
            {isLiveMonitoringActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isLiveMonitoringActive ? 'Pause Telemetry' : 'Resume Telemetry'}</span>
          </button>

          <button
            id="toggle-audio-grid-btn"
            onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
            className={`p-2 rounded-xl text-xs border transition-colors ${
              audioAlertsEnabled ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Audio alerts on critical threshold breach"
          >
            {audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <span className="text-[10px] font-mono text-slate-500">SPEED:</span>
            <select
              value={telemetryTickRateMs}
              onChange={(e) => setTelemetryTickRateMs(Number(e.target.value))}
              className="bg-transparent text-xs font-mono text-sky-400 focus:outline-none cursor-pointer"
            >
              <option value={1000}>1.0s (Fast)</option>
              <option value={3000}>3.0s (Normal)</option>
              <option value={5000}>5.0s (Relaxed)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ward Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          {['ALL', 'ICU', 'CCU', 'Ward A', 'Ward B'].map(w => (
            <button
              key={w}
              onClick={() => setWardFilter(w)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                wardFilter === w ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {w === 'ALL' ? 'All Beds' : w}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bed or patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
          />
        </div>
      </div>

      {/* Telemetry Monitor Cards Grid (2x2 or 3x3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPatients.map(patient => {
          const isCrit = patient.riskLevel === 'CRITICAL';
          const isHigh = patient.riskLevel === 'HIGH';

          return (
            <div
              key={patient.id}
              className={`rounded-2xl border transition-all p-4 bg-slate-900 flex flex-col justify-between shadow-lg ${
                isCrit 
                  ? 'border-rose-500/50 ring-1 ring-rose-500/30 bg-gradient-to-b from-slate-900 to-rose-950/20' 
                  : isHigh 
                  ? 'border-amber-500/40 bg-gradient-to-b from-slate-900 to-amber-950/10' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-300">
                      {patient.room}
                    </span>
                    <div>
                      <div 
                        onClick={() => navigateToPatientProfile(patient.patientId)}
                        className="text-xs font-bold text-white hover:text-sky-400 cursor-pointer transition-colors"
                      >
                        {patient.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {patient.patientId} · {patient.ward}
                      </div>
                    </div>
                  </div>

                  <RiskBadge level={patient.riskLevel} size="sm" />
                </div>

                {/* Animated ECG Waveform Canvas Visualizer */}
                <div className="my-3 bg-slate-950 rounded-xl p-2.5 border border-slate-800 relative overflow-hidden h-20 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 z-10">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 animate-pulse" /> LEAD II (ECG)
                    </span>
                    <span className={patient.vitals.heartRate.value > 100 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {patient.vitals.heartRate.value > 100 ? 'Sinus Tachycardia' : 'Normal Sinus Rhythm'}
                    </span>
                  </div>

                  {/* SVG ECG Waveform */}
                  <div className="w-full flex items-center justify-center my-auto">
                    <svg className="w-full h-8 text-emerald-400 stroke-current fill-none" viewBox="0 0 300 40" preserveAspectRatio="none">
                      <path
                        d="M 0 20 L 40 20 L 45 10 L 50 30 L 55 5 L 60 35 L 65 20 L 100 20 L 105 20 L 140 20 L 145 10 L 150 30 L 155 5 L 160 35 L 165 20 L 200 20 L 240 20 L 245 10 L 250 30 L 255 5 L 260 35 L 265 20 L 300 20"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={isLiveMonitoringActive ? 'animate-pulse' : ''}
                      />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 z-10">
                    <span>Gain: 10mm/mV</span>
                    <span>Speed: 25mm/s</span>
                  </div>
                </div>

                {/* Live Numeric Vital Metric Blocks */}
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  {/* HR */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">HR</div>
                    <div className={`text-base font-bold ${patient.vitals.heartRate.value > 100 ? 'text-amber-400' : 'text-white'}`}>
                      {patient.vitals.heartRate.value}
                    </div>
                    <div className="text-[9px] text-slate-500">bpm</div>
                  </div>

                  {/* SpO2 */}
                  <div className={`border rounded-lg p-2 ${patient.vitals.spO2.value < 90 ? 'bg-rose-950/30 border-rose-500/40 text-rose-400' : 'bg-slate-950/80 border-slate-800'}`}>
                    <div className="text-[10px] text-slate-400">SpO₂</div>
                    <div className={`text-base font-bold ${patient.vitals.spO2.value < 90 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                      {patient.vitals.spO2.value}%
                    </div>
                    <div className="text-[9px] text-slate-500">sat</div>
                  </div>

                  {/* RR */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">RR</div>
                    <div className={`text-base font-bold ${patient.vitals.respiratoryRate.value > 22 ? 'text-rose-400' : 'text-white'}`}>
                      {patient.vitals.respiratoryRate.value}
                    </div>
                    <div className="text-[9px] text-slate-500">/min</div>
                  </div>

                  {/* BP */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2">
                    <div className="text-[10px] text-slate-400">NIBP</div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      {patient.vitals.bloodPressure.value}
                    </div>
                    <div className="text-[9px] text-slate-500">mmHg</div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[10px] font-mono text-slate-400">
                  Risk: <strong className={isCrit ? 'text-rose-400' : 'text-slate-200'}>{patient.riskScore}%</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigateToPatientProfile(patient.patientId)}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigateToDigitalTwin(patient.patientId)}
                    className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700"
                    title="Digital Twin"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigateToDecisionSupport(undefined, patient.patientId)}
                    className="px-2.5 py-1 rounded-md bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 text-[11px] font-semibold border border-sky-500/40"
                  >
                    CDSS
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
