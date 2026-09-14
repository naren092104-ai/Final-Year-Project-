import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge, StatusPill } from '../common/Badge';
import { PatientVitals } from '../../types';
import { 
  PlayCircle, 
  Zap, 
  Sliders, 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  Gauge, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw,
  Cpu,
  Stethoscope
} from 'lucide-react';

export const SimulationView: React.FC = () => {
  const { 
    patients, 
    selectedPatient, 
    setSelectedPatientId, 
    updatePatientVitals, 
    navigateToDecisionSupport,
    navigateToDigitalTwin,
    isLoading 
  } = useHospital();

  const [targetPatientId, setTargetPatientId] = useState<string>(selectedPatient?.patientId || patients[0]?.patientId || 'PT-10023');
  const patient = patients.find(p => p.patientId === targetPatientId) || patients[0];

  // Sliders state
  const [heartRate, setHeartRate] = useState<number>(patient.vitals.heartRate.value);
  const [spO2, setSpO2] = useState<number>(patient.vitals.spO2.value);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(patient.vitals.respiratoryRate.value);
  const [systolicBP, setSystolicBP] = useState<number>(patient.vitals.bloodPressure.systolic);
  const [temperature, setTemperature] = useState<number>(patient.vitals.temperature.value);

  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Sync sliders when patient selector changes
  const handleSelectPatient = (id: string) => {
    setTargetPatientId(id);
    const p = patients.find(pt => pt.patientId === id);
    if (p) {
      setHeartRate(p.vitals.heartRate.value);
      setSpO2(p.vitals.spO2.value);
      setRespiratoryRate(p.vitals.respiratoryRate.value);
      setSystolicBP(p.vitals.bloodPressure.systolic);
      setTemperature(p.vitals.temperature.value);
      setSimulationResult(null);
    }
  };

  // Deterioration Preset Profiles
  const applyPreset = (preset: 'sepsis' | 'hypoxemia' | 'hypertensive' | 'stable') => {
    if (preset === 'sepsis') {
      setHeartRate(124);
      setSpO2(89);
      setRespiratoryRate(28);
      setSystolicBP(86);
      setTemperature(38.8);
    } else if (preset === 'hypoxemia') {
      setHeartRate(114);
      setSpO2(84);
      setRespiratoryRate(32);
      setSystolicBP(142);
      setTemperature(37.6);
    } else if (preset === 'hypertensive') {
      setHeartRate(98);
      setSpO2(95);
      setRespiratoryRate(20);
      setSystolicBP(185);
      setTemperature(36.9);
    } else if (preset === 'stable') {
      setHeartRate(72);
      setSpO2(98);
      setRespiratoryRate(16);
      setSystolicBP(118);
      setTemperature(36.8);
    }
  };

  const handleExecuteSimulation = async () => {
    setIsSimulating(true);
    const simulatedVitals: PatientVitals = {
      ...patient.vitals,
      heartRate: { ...patient.vitals.heartRate, value: heartRate },
      spO2: { ...patient.vitals.spO2, value: spO2 },
      respiratoryRate: { ...patient.vitals.respiratoryRate, value: respiratoryRate },
      bloodPressure: {
        ...patient.vitals.bloodPressure,
        value: `${systolicBP}/84`,
        systolic: systolicBP,
        diastolic: 84
      },
      temperature: { ...patient.vitals.temperature, value: temperature }
    };

    try {
      const res = await updatePatientVitals(patient.patientId, simulatedVitals);
      setSimulationResult(res?.result);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              INTERACTIVE SCENARIO SIMULATOR
            </span>
            <span className="text-xs font-mono text-emerald-400">
              VIVA & DEMO PRESENTATION MODE
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-sky-400" />
            Patient Deterioration Simulator & Agent Engine
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Simulate acute physiological shocks or recovery trajectories. Watch the 4-Agent Orchestrator autonomously process thresholds, calculate risk, escalate alerts, and generate explainable clinical protocols.
          </p>
        </div>

        {/* Patient Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 shrink-0">
          <span className="text-xs text-slate-400">Target Patient:</span>
          <select
            value={targetPatientId}
            onChange={(e) => handleSelectPatient(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          >
            {patients.map(p => (
              <option key={p.patientId} value={p.patientId}>
                {p.name} ({p.room} · {p.riskLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Scenario Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> 1-Click Clinical Deterioration Presets:
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            id="preset-hypoxemia-btn"
            onClick={() => applyPreset('hypoxemia')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 text-left transition-all group"
          >
            <div className="text-xs font-bold text-rose-400 group-hover:text-rose-300">Acute Respiratory Decompensation</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">SpO₂ 84%, RR 32, HR 114</div>
          </button>

          <button
            id="preset-sepsis-btn"
            onClick={() => applyPreset('sepsis')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 text-left transition-all group"
          >
            <div className="text-xs font-bold text-rose-400 group-hover:text-rose-300">Septic Shock Cascade</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">Temp 38.8°C, SBP 86, HR 124</div>
          </button>

          <button
            id="preset-hypertensive-btn"
            onClick={() => applyPreset('hypertensive')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
          >
            <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300">Hypertensive Urgency</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">SBP 185 mmHg, HR 98</div>
          </button>

          <button
            id="preset-stable-btn"
            onClick={() => applyPreset('stable')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
          >
            <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">Rapid Stabilization</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">SpO₂ 98%, HR 72, RR 16</div>
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry Sliders (5 cols) vs Live Agent Execution Pipeline (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Adjust Bedside Telemetry Stream</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Target: {patient.name}</span>
          </div>

          {/* Heart Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Heart Rate:
              </span>
              <span className="font-mono font-bold text-white text-sm">{heartRate} bpm</span>
            </div>
            <input
              type="range"
              min={40}
              max={180}
              value={heartRate}
              onChange={(e) => setHeartRate(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>40 (Brady)</span>
              <span>Normal: 60-100</span>
              <span>180 (Severe Tachy)</span>
            </div>
          </div>

          {/* SpO2 Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Wind className="w-3.5 h-3.5 text-sky-400" /> SpO₂ Saturation:
              </span>
              <span className={`font-mono font-bold text-sm ${spO2 < 90 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                {spO2} %
              </span>
            </div>
            <input
              type="range"
              min={70}
              max={100}
              value={spO2}
              onChange={(e) => setSpO2(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>70% (Severe Hypoxemia)</span>
              <span>Normal: 95-100%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Respiratory Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Respiratory Rate:
              </span>
              <span className={`font-mono font-bold text-sm ${respiratoryRate > 24 ? 'text-rose-400' : 'text-white'}`}>
                {respiratoryRate} /min
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={45}
              value={respiratoryRate}
              onChange={(e) => setRespiratoryRate(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>8 /min</span>
              <span>Normal: 12-20</span>
              <span>45 /min (Tachypnea)</span>
            </div>
          </div>

          {/* Systolic BP Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Gauge className="w-3.5 h-3.5 text-purple-400" /> Systolic Blood Pressure:
              </span>
              <span className="font-mono font-bold text-white text-sm">{systolicBP} mmHg</span>
            </div>
            <input
              type="range"
              min={60}
              max={220}
              value={systolicBP}
              onChange={(e) => setSystolicBP(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>60 (Hypotension / Shock)</span>
              <span>Normal: 100-130</span>
              <span>220 (Hypertension)</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature:
              </span>
              <span className="font-mono font-bold text-white text-sm">{temperature.toFixed(1)} °C</span>
            </div>
            <input
              type="range"
              min={35.0}
              max={41.0}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>35.0 °C</span>
              <span>Normal: 36.5-37.5</span>
              <span>41.0 °C (Hyperpyrexia)</span>
            </div>
          </div>

          {/* Execute Simulation Action */}
          <button
            id="execute-simulation-btn"
            onClick={handleExecuteSimulation}
            disabled={isSimulating || isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-950/60 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <PlayCircle className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Processing Multi-Agent Pipeline...' : 'Inject Telemetry & Run 4-Agent Pipeline'}</span>
          </button>
        </div>

        {/* Right Column: Live Step-by-Step 4-Agent Execution Results */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Bot className="w-4 h-4 text-sky-400" />
                  Live Pipeline Execution Output
                </h3>
                <p className="text-xs text-slate-400">Step-by-step cognitive handoffs across the 4 agents</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                {simulationResult ? 'Pipeline Completed OK' : 'Ready to Run'}
              </span>
            </div>

            {/* Step-by-Step Results */}
            <div className="space-y-3 mt-4">
              {/* Step 1: Monitoring */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sky-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    STEP 1: MONITORING AGENT
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Telemetry Ingest</span>
                </div>
                <div className="text-slate-300">
                  {simulationResult?.monitoringOutput?.isAbnormal ? (
                    <span className="text-rose-400 font-semibold">
                      Threshold violations detected: {simulationResult.monitoringOutput.abnormalitiesDetected.join(', ')}
                    </span>
                  ) : (
                    <span className="text-emerald-400">
                      All continuous parameters within baseline tolerances.
                    </span>
                  )}
                </div>
              </div>

              {/* Step 2: Prediction */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    STEP 2: PREDICTION AGENT (DETERIORATION RISK)
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Risk Model</span>
                </div>
                <div className="flex items-baseline justify-between text-slate-200">
                  <span>{simulationResult?.predictionOutput?.predictedRisk || 'Composite Deterioration Forecast'}</span>
                  <div className="flex items-center gap-1.5">
                    <RiskBadge level={simulationResult?.predictionOutput?.riskLevel || patient.riskLevel} size="sm" />
                    <span className="font-mono font-bold text-white text-sm">
                      {simulationResult?.predictionOutput?.riskProbability ?? patient.riskScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: Escalation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    STEP 3: ESCALATION AGENT (TRIAGE & ALARM FATIGUE)
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Triage Routing</span>
                </div>
                <div className="text-slate-300 flex items-center justify-between">
                  <span>Priority Tier: <strong className="text-amber-400">{simulationResult?.escalationOutput?.priority || 'CRITICAL'}</strong></span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {simulationResult?.escalationOutput?.alertCreated ? `Alert Dispatched (${simulationResult.escalationOutput.alertId || 'ACTIVE'})` : 'No Critical Alert Triggered'}
                  </span>
                </div>
              </div>

              {/* Step 4: Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    STEP 4: EXPLANATION AGENT (CLINICAL ACTIONS & GUIDELINES)
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">CDSS Synthesis</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {simulationResult?.explanationOutput?.modelExplanation || 'Clinical rationale and prioritized guideline-grounded actions synthesized for clinician validation.'}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => navigateToDigitalTwin(patient.patientId)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Inspect Updated Digital Twin</span>
            </button>

            <button
              onClick={() => navigateToDecisionSupport(undefined, patient.patientId)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Review in Decision Support (CDSS) →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
