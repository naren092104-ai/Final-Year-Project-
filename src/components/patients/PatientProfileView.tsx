import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge, StatusPill } from '../common/Badge';
import { 
  Heart, 
  Activity, 
  Wind, 
  Thermometer, 
  Gauge, 
  Pill, 
  AlertOctagon, 
  FlaskConical, 
  Clock, 
  Calendar, 
  User, 
  Cpu, 
  Stethoscope, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  ChevronLeft, 
  Zap, 
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const PatientProfileView: React.FC = () => {
  const { 
    selectedPatient, 
    patients, 
    setSelectedPatientId, 
    setCurrentPage, 
    navigateToDigitalTwin, 
    navigateToDecisionSupport,
    runSimulationForPatient,
    isLoading
  } = useHospital();

  const [timeRange, setTimeRange] = useState<'6h' | '12h' | '24h'>('6h');
  const [activeMetric, setActiveMetric] = useState<'all' | 'spO2' | 'heartRate' | 'respiratoryRate' | 'bloodPressure'>('all');

  const patient = selectedPatient || patients[0];

  // Build multi-metric historical trend data
  const trendData = [
    { time: '06:00', hr: 78, spo2: 95, rr: 16, bpSys: 122, temp: 37.0 },
    { time: '07:00', hr: 82, spo2: 94, rr: 18, bpSys: 124, temp: 37.1 },
    { time: '08:00', hr: 88, spo2: 92, rr: 20, bpSys: 128, temp: 37.4 },
    { time: '09:00', hr: 94, spo2: 90, rr: 22, bpSys: 132, temp: 37.7 },
    { time: '10:00', hr: 104, spo2: 88, rr: 25, bpSys: 135, temp: 37.9 },
    { time: '11:00', hr: patient.vitals.heartRate.value, spo2: patient.vitals.spO2.value, rr: patient.vitals.respiratoryRate.value, bpSys: patient.vitals.bloodPressure.systolic, temp: patient.vitals.temperature.value }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            id="back-to-roster-btn"
            onClick={() => setCurrentPage('patients')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400">PATIENT PROFILE DOSSIER /</span>
          <span className="text-xs font-bold text-sky-400 font-mono">{patient.patientId}</span>
        </div>

        {/* Quick Patient Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Select Patient:</span>
          <select
            value={patient.patientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-sky-500"
          >
            {patients.map(p => (
              <option key={p.patientId} value={p.patientId}>
                {p.name} ({p.room} · {p.riskLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Patient Dossier Header (Matching Design Mockup Fig 6.1) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Patient Bio */}
          <div className="flex items-start gap-4">
            <img 
              src={patient.avatarUrl} 
              alt={patient.name} 
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/40 shrink-0 shadow-md" 
            />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {patient.name}
                </h1>
                <RiskBadge level={patient.riskLevel} size="md" />
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {patient.room} ({patient.ward})
                </span>
              </div>

              <p className="text-xs md:text-sm text-sky-300 font-medium mt-1">
                Primary Diagnosis: <span className="text-white font-semibold">{patient.diagnosis}</span>
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400 font-mono">
                <span>ID: <strong className="text-slate-200">{patient.patientId}</strong></span>
                <span>•</span>
                <span>Age/Sex: <strong className="text-slate-200">{patient.age}y / {patient.gender}</strong></span>
                <span>•</span>
                <span>Admitted: <strong className="text-slate-200">{patient.admissionDate}</strong></span>
                <span>•</span>
                <span>Attending: <strong className="text-slate-200">{patient.attendingPhysician}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="open-digital-twin-btn"
              onClick={() => navigateToDigitalTwin(patient.patientId)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Digital Twin</span>
            </button>

            <button
              id="open-cdss-btn"
              onClick={() => navigateToDecisionSupport(undefined, patient.patientId)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-900/30 flex items-center gap-1.5 transition-colors"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Decision Support (CDSS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Clinical Records vs Right AI Analytics & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vitals, Context, History, Meds, Labs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Current Vitals Real-Time Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Current Continuous Vitals</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                STREAMING
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Heart Rate */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> Heart Rate
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">60–100 bpm</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-2xl font-bold font-mono ${patient.vitals.heartRate.value > 100 ? 'text-amber-400' : 'text-white'}`}>
                    {patient.vitals.heartRate.value}
                  </span>
                  <span className="text-xs font-mono text-slate-400">bpm</span>
                </div>
              </div>

              {/* SpO2 */}
              <div className={`border rounded-xl p-3 ${patient.vitals.spO2.value < 90 ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-950/70 border-slate-800'}`}>
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-sky-400" /> SpO₂
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">95–100 %</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-2xl font-bold font-mono ${patient.vitals.spO2.value < 90 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                    {patient.vitals.spO2.value}
                  </span>
                  <span className="text-xs font-mono text-slate-400">%</span>
                </div>
              </div>

              {/* Respiratory Rate */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" /> Resp. Rate
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">12–20 /min</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-2xl font-bold font-mono ${patient.vitals.respiratoryRate.value > 22 ? 'text-rose-400' : 'text-white'}`}>
                    {patient.vitals.respiratoryRate.value}
                  </span>
                  <span className="text-xs font-mono text-slate-400">/min</span>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-purple-400" /> Blood Press.
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">&lt; 120/80</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-white">
                    {patient.vitals.bloodPressure.value}
                  </span>
                  <span className="text-xs font-mono text-slate-400">mmHg</span>
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 col-span-2">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Core Body Temperature
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">36.5–37.5 °C</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-xl font-bold font-mono ${patient.vitals.temperature.value > 37.8 ? 'text-amber-400' : 'text-white'}`}>
                    {patient.vitals.temperature.value} °C
                  </span>
                  <span className="text-xs font-mono text-slate-400">Continuous probe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Context */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white tracking-tight mb-3">Bedside Clinical Context</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Conscious State</div>
                <div className="font-semibold text-slate-200">{patient.patientContext.consciousState}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Oxygen Support</div>
                <div className="font-semibold text-slate-200">{patient.patientContext.oxygenSupport}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Urine Output</div>
                <div className="font-semibold text-slate-200">{patient.patientContext.urineOutput}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Respiratory Distress</div>
                <div className={`font-semibold ${patient.patientContext.distressLevel === 'Severe' ? 'text-rose-400' : 'text-slate-200'}`}>
                  {patient.patientContext.distressLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Medical History & Allergies */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white tracking-tight mb-3">Medical History & Allergies</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Comorbidities / History
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {patient.medicalHistory.map((h, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Allergies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {patient.allergies.map((a, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3 text-rose-400" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Current Medications & Labs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white tracking-tight mb-3">Active Medications & Recent Labs</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Active Pharmacotherapy
                </span>
                <div className="space-y-1.5">
                  {patient.medications.map((m, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{m.name}</span>
                      <span className="font-mono text-slate-400 text-[11px]">{m.dosage} · {m.route} ({m.frequency})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Recent Laboratory Workup
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {patient.recentLabs.map((l, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-slate-400">{l.testName}</div>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <span className={`font-bold ${l.status === 'abnormal' || l.status === 'critical' ? 'text-amber-400' : 'text-slate-200'}`}>
                          {l.value} {l.unit}
                        </span>
                        <span className="text-[9px] text-slate-500">{l.normalRange}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Risk Assessment, Trends & Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Risk Assessment Box (Matching Fig 6.1) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  AI DECISION SUPPORT SYNTHESIS
                </span>
                <h3 className="text-base font-bold text-white tracking-tight mt-1">
                  Deterioration Risk Assessment
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <RiskBadge level={patient.riskLevel} size="lg" />
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-rose-400 leading-none">
                    {patient.riskScore}%
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    Confidence: 91%
                  </div>
                </div>
              </div>
            </div>

            {/* Key Contributing Factors */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Key Contributing Risk Factors (SHAP Feature Attribution)
              </h4>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-rose-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span className="font-semibold text-slate-200">Decreased SpO₂ Saturation ({patient.vitals.spO2.value}%)</span>
                  </div>
                  <span className="font-mono text-rose-400 font-bold">+38% Impact</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="font-semibold text-slate-200">Elevated Respiratory Rate ({patient.vitals.respiratoryRate.value} /min)</span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">+24% Impact</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    <span className="font-semibold text-slate-200">Compensatory Tachycardia ({patient.vitals.heartRate.value} bpm)</span>
                  </div>
                  <span className="font-mono text-sky-400 font-bold">+16% Impact</span>
                </div>
              </div>
            </div>

            {/* Model Natural Language Clinical Rationale */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXPLANATION AGENT CLINICAL SUMMARY</span>
              </div>
              <p>
                Patient displays acute physiological decompensation marked by significant hypoxemia (SpO₂ {patient.vitals.spO2.value}%) and tachypnea ({patient.vitals.respiratoryRate.value}/min). Pattern aligns with acute ventilation-perfusion mismatch secondary to {patient.diagnosis}.
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                Reference: American Thoracic Society (ATS) & Surviving Sepsis Guidelines.
              </div>
            </div>

            {/* Review Button */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => navigateToDecisionSupport(undefined, patient.patientId)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Review & Approve Clinical Actions (CDSS)</span>
              </button>
            </div>
          </div>

          {/* Interactive Vital Signs Trend Chart (Matching Fig 6.1) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Vital Signs Historical Trajectory
                </h3>
                <p className="text-xs text-slate-400">Multi-parameter continuous trend monitoring</p>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                {(['6h', '12h', '24h'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      timeRange === t ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="hr" stroke="#f43f5e" strokeWidth={2} name="Heart Rate (bpm)" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="spo2" stroke="#0ea5e9" strokeWidth={2} name="SpO2 (%)" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="rr" stroke="#10b981" strokeWidth={2} name="Resp. Rate (/min)" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="bpSys" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="4 4" name="SBP (mmHg)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Patient Events & Telemetry Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white tracking-tight mb-3">
              Telemetry Event & Agent Interaction Log
            </h3>
            <div className="space-y-3">
              {patient.events.map((evt, idx) => (
                <div key={evt.id || idx} className="flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sky-400 font-mono text-[10px] shrink-0 mt-0.5">
                    {evt.time}
                  </div>
                  <div className="flex-1 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="font-semibold text-slate-200">{evt.description}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-wider">
                      Category: {evt.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
