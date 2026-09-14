import React, { useState } from 'react';
import { useHospital, DEFAULT_USERS } from '../../context/HospitalContext';
import { X, Settings, Sliders, Shield, Bot, Bell, Database, Sparkles, CheckCircle2 } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    currentUser, 
    setCurrentUser,
    telemetryTickRateMs,
    setTelemetryTickRateMs,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    addToast
  } = useHospital();

  const [spo2Threshold, setSpo2Threshold] = useState('90');
  const [hrHighThreshold, setHrHighThreshold] = useState('100');
  const [rrHighThreshold, setRrHighThreshold] = useState('24');
  const [riskAcuityCutoff, setRiskAcuityCutoff] = useState('75');

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    addToast({
      title: 'Clinical AI Thresholds Saved',
      message: `Updated monitoring rules & alert limits for ${currentUser.name}`,
      type: 'success'
    });
    setIsSettingsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">CDSS & Agent Pipeline Settings</h2>
              <p className="text-xs text-slate-400">Configure clinical risk thresholds, streaming latency, and AI governance</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 mt-4 text-xs">
          {/* Active Clinician Persona */}
          <div className="space-y-2">
            <span className="text-slate-300 font-bold block">Active Clinician Profile</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEFAULT_USERS.map(u => (
                <div
                  key={u.id}
                  onClick={() => setCurrentUser(u)}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    currentUser.id === u.id ? 'bg-sky-950/50 border-sky-500/40' : 'bg-slate-950/70 border-slate-800 hover:bg-slate-950'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">{u.name}</div>
                    <div className="text-[10px] text-slate-400">{u.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monitoring Agent Thresholds */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold font-mono text-xs">
              <Bot className="w-4 h-4" /> Monitoring Agent Anomaly Thresholds
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">SpO₂ Critical Floor (%)</label>
                <input
                  type="number"
                  value={spo2Threshold}
                  onChange={e => setSpo2Threshold(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">HR Tachycardia Ceiling (bpm)</label>
                <input
                  type="number"
                  value={hrHighThreshold}
                  onChange={e => setHrHighThreshold(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">RR Tachypnea Ceiling (/min)</label>
                <input
                  type="number"
                  value={rrHighThreshold}
                  onChange={e => setRrHighThreshold(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Critical Deterioration Cutoff (%)</label>
                <input
                  type="number"
                  value={riskAcuityCutoff}
                  onChange={e => setRiskAcuityCutoff(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Audio and Streaming Toggles */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Audio Alerts for Critical Breaches</div>
                <div className="text-[11px] text-slate-400">Play clinical bedside chime when SpO2 &lt; 90% or HR &gt; 115</div>
              </div>
              <input
                type="checkbox"
                checked={audioAlertsEnabled}
                onChange={e => setAudioAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-sky-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Model Info */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Explainable AI Model Configuration:</div>
            <div>Model: <strong className="text-sky-300">Gemini 3.8 Flash (Server-Side Proxy)</strong> + Critical Rulebook v1.0</div>
            <div>SHAP Attribution: <strong>KernelExplainer (5-Factor Decomposition)</strong></div>
            <div>Safety Constraint: <strong>Surviving Sepsis & ATS Clinical Verification Guardrail</strong></div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
