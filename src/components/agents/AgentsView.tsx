import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge, StatusPill } from '../common/Badge';
import { 
  Bot, 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Cpu, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  RefreshCw,
  Zap,
  Layers
} from 'lucide-react';

export const AgentsView: React.FC = () => {
  const { 
    agents, 
    agentEvents, 
    patients, 
    selectedPatient, 
    runSimulationForPatient,
    navigateToDecisionSupport,
    isLoading 
  } = useHospital();

  const [selectedAgentTab, setSelectedAgentTab] = useState<'all' | 'monitoring' | 'prediction' | 'escalation' | 'explanation'>('all');
  const [selectedEventPayload, setSelectedEventPayload] = useState<any>(null);
  const [targetPatientId, setTargetPatientId] = useState<string>(selectedPatient?.patientId || patients[0]?.patientId || 'PT-10023');
  const [isExecutingPipeline, setIsExecutingPipeline] = useState<boolean>(false);
  const [lastPipelineResult, setLastPipelineResult] = useState<any>(null);

  const filteredEvents = agentEvents.filter(e => {
    if (selectedAgentTab === 'all') return true;
    return e.agentType.toLowerCase() === selectedAgentTab.toLowerCase();
  });

  const handleRunPipeline = async () => {
    setIsExecutingPipeline(true);
    try {
      const res = await runSimulationForPatient(targetPatientId);
      setLastPipelineResult(res);
    } finally {
      setIsExecutingPipeline(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              AGENTIC AI COGNITIVE ARCHITECTURE
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 4 Agents Active
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Bot className="w-6 h-6 text-sky-400" />
            Specialized 4-Agent Orchestration Engine
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Autonomous sequential pipeline decomposing raw hospital telemetry into structured clinical insights, multi-parameter risk forecasting, alert triage, and explainable decision support.
          </p>
        </div>

        {/* Manual Pipeline Runner */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800 shrink-0">
          <select
            value={targetPatientId}
            onChange={(e) => setTargetPatientId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          >
            {patients.map(p => (
              <option key={p.patientId} value={p.patientId}>
                {p.name} ({p.patientId} · {p.riskLevel})
              </option>
            ))}
          </select>

          <button
            id="run-4-agent-pipeline-btn"
            onClick={handleRunPipeline}
            disabled={isExecutingPipeline || isLoading}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isExecutingPipeline ? 'animate-spin' : ''}`} />
            <span>{isExecutingPipeline ? 'Executing...' : 'Run Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Sequential Architecture Visualizer Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Information Flow & Agent Handoff Pipeline
            </h3>
            <p className="text-xs text-slate-400">Strict sequential cognitive decomposition prevents hallucination and ensures safety</p>
          </div>
          <span className="text-xs font-mono text-slate-500">Pipeline Latency: ~42ms</span>
        </div>

        {/* Interactive Diagram Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Step 1: Telemetry & Digital Twin */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">INPUT DATA</span>
              <h4 className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" /> Bedside Twin
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Raw SpO₂, HR, RR, BP, and Temp continuous data streams.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-sky-400">25ms buffer sync</div>
          </div>

          {/* Step 2: Monitoring Agent */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">AGENT 1</span>
              <h4 className="text-xs font-bold text-sky-300 mt-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" /> Monitoring Agent
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Extracts threshold breaches, rate-of-change, and physiological state deltas.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-emerald-400">Anomaly flag trigger</div>
          </div>

          {/* Step 3: Prediction Agent */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">AGENT 2</span>
              <h4 className="text-xs font-bold text-purple-300 mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" /> Prediction Agent
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Computes 2-4h deterioration probability and multi-organ trajectory score.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-purple-400">Risk Score: 0–100%</div>
          </div>

          {/* Step 4: Escalation Agent */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">AGENT 3</span>
              <h4 className="text-xs font-bold text-amber-300 mt-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Escalation Agent
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Triages alert priority (Critical vs High) and notifies ward care teams.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-amber-400">Alarm fatigue filter</div>
          </div>

          {/* Step 5: Explanation Agent */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">AGENT 4</span>
              <h4 className="text-xs font-bold text-emerald-300 mt-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Explanation Agent
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Synthesizes SHAP weights, guidelines, and 5 prioritized clinical actions.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-emerald-400">Clinician CDSS Queue</div>
          </div>
        </div>
      </div>

      {/* 4 Agent Deep-Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map(agent => (
          <div key={agent.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                  {agent.id}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {agent.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white tracking-tight">{agent.name}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{agent.role}</p>

              {/* Responsibilities */}
              <div className="mt-3 space-y-1">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Capabilities</div>
                {agent.responsibilities.slice(0, 3).map((resp, i) => (
                  <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-sky-400"></span>
                    <span className="truncate">{resp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-center font-mono">
              <div className="bg-slate-950/70 p-1.5 rounded-lg">
                <div className="text-[9px] text-slate-500">PROCESSED</div>
                <div className="text-xs font-bold text-slate-200">{agent.metrics.eventsProcessed}</div>
              </div>
              <div className="bg-slate-950/70 p-1.5 rounded-lg">
                <div className="text-[9px] text-slate-500">AVG LATENCY</div>
                <div className="text-xs font-bold text-emerald-400">{agent.metrics.avgLatencyMs}ms</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Activity Telemetry Feed & JSON Payload Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Event Stream (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                Live Agent Execution Event Stream
              </h3>
              <p className="text-xs text-slate-400">Real-time reasoning logs across all 4 agents</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
              {(['all', 'monitoring', 'prediction', 'escalation', 'explanation'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedAgentTab(tab)}
                  className={`px-2 py-0.5 rounded transition-all text-[10px] ${
                    selectedAgentTab === tab ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-mono">
                No recent events for selected filter. Run the pipeline above to trigger new events.
              </div>
            ) : (
              filteredEvents.map(evt => {
                const isSelected = selectedEventPayload?.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventPayload(evt)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-sky-950/40 border-sky-500/50' 
                        : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-900 border border-slate-700 text-sky-300 font-bold">
                          {evt.agentType}
                        </span>
                        <span className="font-semibold text-slate-200">{evt.eventType}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{evt.timeFormatted}</span>
                    </div>

                    <div className="text-slate-300 mt-1 font-medium">{evt.summary}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{evt.details}</div>

                    <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Target: {evt.patientName} ({evt.patientId})</span>
                      <RiskBadge level={evt.severity} size="sm" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* JSON Inspector / Detail (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Agent Payload JSON Inspector</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Structured State</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Inspect structured data packet exchanged between agents in the cognitive reasoning chain:
            </p>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-sky-300 max-h-80 overflow-y-auto leading-relaxed">
              <pre>
                {JSON.stringify(
                  selectedEventPayload || lastPipelineResult || {
                    agentPipeline: 'SmartTwin Autonomous Cognitive Orchestrator',
                    activePatient: targetPatientId,
                    status: 'IDLE_WAITING_FOR_TRIGGER',
                    hint: 'Click on any event in the left list or press "Run Pipeline" above to inspect execution payloads.'
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => navigateToDecisionSupport(undefined, targetPatientId)}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Generated Recommendations for Patient →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
