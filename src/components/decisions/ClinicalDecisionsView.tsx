import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge, StatusPill } from '../common/Badge';
import { 
  Stethoscope, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Clock, 
  User, 
  BookOpen, 
  Layers, 
  Plus, 
  Trash2,
  Bot,
  Zap,
  Info
} from 'lucide-react';
import { API } from '../../lib/api';

export const ClinicalDecisionsView: React.FC = () => {
  const { 
    recommendations, 
    reviewRecommendation, 
    currentUser, 
    patients, 
    selectedPatientId,
    setSelectedPatientId,
    addToast
  } = useHospital();

  const [selectedRecId, setSelectedRecId] = useState<string>(recommendations[0]?.id || 'rec-001');
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [clinicianNotes, setClinicianNotes] = useState<string>('');
  const [modifiedActionsList, setModifiedActionsList] = useState<string[]>([]);
  const [newActionInput, setNewActionInput] = useState<string>('');
  const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);
  const [geminiExplanation, setGeminiExplanation] = useState<string | null>(null);

  const selectedRec = recommendations.find(r => r.id === selectedRecId) || recommendations[0];

  const handleStartModify = () => {
    if (!selectedRec) return;
    setModifiedActionsList(selectedRec.recommendedActions.map(a => a.action));
    setClinicianNotes(selectedRec.clinicianNotes || '');
    setIsModifying(true);
  };

  const handleAddCustomAction = () => {
    if (!newActionInput.trim()) return;
    setModifiedActionsList(prev => [...prev, newActionInput.trim()]);
    setNewActionInput('');
  };

  const handleRemoveAction = (index: number) => {
    setModifiedActionsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleDecision = async (decision: 'ACCEPTED' | 'MODIFIED' | 'REJECTED') => {
    if (!selectedRec) return;
    const actionsToSend = decision === 'MODIFIED' ? modifiedActionsList : undefined;
    await reviewRecommendation(selectedRec.id, decision, clinicianNotes, actionsToSend);
    setIsModifying(false);
  };

  const handleAskGeminiSecondOpinion = async () => {
    if (!selectedRec) return;
    setIsGeminiLoading(true);
    try {
      const targetPatient = patients.find(p => p.patientId === selectedRec.patientId);
      const res = await API.generateGeminiExplanation({
        patientId: selectedRec.patientId,
        vitals: targetPatient?.vitals,
        riskScore: selectedRec.riskProbability,
        diagnosis: targetPatient?.diagnosis || 'Pneumonia'
      });
      setGeminiExplanation(res.explanation);
      addToast({
        title: 'Gemini 3.8 Flash Synthesis Ready',
        message: 'Second opinion clinical synthesis generated with evidence grounding.',
        type: 'info'
      });
    } finally {
      setIsGeminiLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner (CDSS Framing) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              EXPLAINABLE AI CLINICAL DECISION SUPPORT
            </span>
            <span className="text-xs font-mono text-amber-400">
              CLINICIAN APPROVAL REQUIRED
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-sky-400" />
            Clinical Decision Support & Review Workflow (CDSS)
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Multi-agent recommendation synthesis with SHAP feature attributions, evidence citations, and formal clinician validation workflow.
          </p>
        </div>

        {/* Recommendation Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 shrink-0">
          <span className="text-xs text-slate-400">Case:</span>
          <select
            value={selectedRec?.id}
            onChange={(e) => {
              setSelectedRecId(e.target.value);
              setIsModifying(false);
              setGeminiExplanation(null);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          >
            {recommendations.map(r => (
              <option key={r.id} value={r.id}>
                {r.patientName} ({r.ward} · {r.riskProbability}% Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedRec && (
        <div className="space-y-6">
          {/* SECTION 1: Prediction Results Output (Matching Fig 6.3) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">PREDICTION AGENT OUTPUT</span>
                <h2 className="text-base font-bold text-white tracking-tight">
                  1. Multi-Parameter Deterioration Risk Modeling
                </h2>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <span>Patient: <strong className="text-white">{selectedRec.patientName} ({selectedRec.patientId})</strong></span>
                <span>·</span>
                <span>{selectedRec.room}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Primary Risk Gauge (4 cols) */}
              <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-slate-400">Primary Predicted Risk</div>
                  <h3 className="text-base font-bold text-rose-400 mt-1">{selectedRec.predictedRiskTitle}</h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold font-mono text-rose-400">{selectedRec.riskProbability}%</span>
                    <span className="text-xs font-mono text-slate-400">Probability (2-4 hrs)</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <RiskBadge level={selectedRec.riskLevel} size="md" />
                  <span className="text-[11px] font-mono text-slate-400">Model AUC: 0.94</span>
                </div>
              </div>

              {/* Top 3 Predicted Events (4 cols) */}
              <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                  Top 3 Predicted Deterioration Events
                </div>
                <div className="space-y-2 pt-1">
                  {selectedRec.topPredictedEvents.map((evt, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{evt.name}</span>
                        <span className="font-mono font-bold text-rose-400">{evt.probability}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                        <span>{evt.timeframe}</span>
                        <span>Conf: {Math.round(evt.confidence * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Contributing Factors / SHAP (4 cols) */}
              <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                  SHAP Feature Impact Attribution
                </div>
                <div className="space-y-1.5 pt-1">
                  {selectedRec.keyContributingFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded-md bg-slate-900/60">
                      <span className="text-slate-300 truncate max-w-[200px]">{factor.factor}</span>
                      <span className="font-mono text-rose-400 font-bold shrink-0">+{factor.impactScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Explanation & Recommendation Output (Matching Fig 6.3) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">EXPLANATION AGENT OUTPUT</span>
                <h2 className="text-base font-bold text-white tracking-tight">
                  2. Explainable Clinical Rationale & Prioritized Actions
                </h2>
              </div>

              <button
                id="ask-gemini-second-opinion-btn"
                onClick={handleAskGeminiSecondOpinion}
                disabled={isGeminiLoading}
                className="px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 text-sky-400 ${isGeminiLoading ? 'animate-spin' : ''}`} />
                <span>{isGeminiLoading ? 'Synthesizing...' : 'Gemini 3.8 Second Opinion'}</span>
              </button>
            </div>

            {/* Natural Language Explanation Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold font-mono text-[11px]">
                <Bot className="w-4 h-4" />
                <span>PRIMARY CLINICAL RATIONALE</span>
              </div>
              <p className="text-slate-300">
                {selectedRec.modelExplanation}
              </p>

              {/* Gemini Augmented Explanation if available */}
              {geminiExplanation && (
                <div className="mt-3 p-3 rounded-lg bg-sky-950/30 border border-sky-500/30 text-sky-200 animate-in fade-in">
                  <div className="text-[10px] font-mono text-sky-400 font-bold mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> GEMINI 3.8 FLASH EVIDENCE SYNTHESIS
                  </div>
                  <p>{geminiExplanation}</p>
                </div>
              )}

              <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedRec.clinicalGuidelinesReference}</span>
              </div>
            </div>

            {/* 5 Prioritized Actionable Recommendations */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Prioritized Evidence-Based Clinical Actions
                </h3>
                {!isModifying && selectedRec.status === 'PENDING_REVIEW' && (
                  <button
                    id="modify-actions-btn"
                    onClick={handleStartModify}
                    className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Modify Action List
                  </button>
                )}
              </div>

              {!isModifying ? (
                <div className="space-y-2.5">
                  {selectedRec.recommendedActions.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3 text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px] border border-sky-500/30">
                        {rec.order}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-100 leading-snug">{rec.action}</div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          <span className="font-mono text-slate-500">Rationale:</span> {rec.rationale}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Modify Mode */
                <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-sky-500/40">
                  <div className="text-xs font-mono text-sky-300 font-bold mb-2">
                    Editing Clinical Action Checklist:
                  </div>

                  <div className="space-y-2">
                    {modifiedActionsList.map((act, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <span className="font-mono text-sky-400 font-bold text-[11px]">{i + 1}.</span>
                        <input
                          type="text"
                          value={act}
                          onChange={(e) => {
                            const updated = [...modifiedActionsList];
                            updated[i] = e.target.value;
                            setModifiedActionsList(updated);
                          }}
                          className="flex-1 bg-transparent text-slate-200 focus:outline-none"
                        />
                        <button
                          onClick={() => handleRemoveAction(i)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add action */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add custom clinical step..."
                      value={newActionInput}
                      onChange={(e) => setNewActionInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCustomAction()}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      onClick={handleAddCustomAction}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Clinician Action Workflow (Matching Fig 6.4) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">CLINICAL GOVERNANCE & SIGN-OFF</span>
                <h2 className="text-base font-bold text-white tracking-tight">
                  3. Clinician Review & Decision Validation
                </h2>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Signing Clinician: <strong className="text-sky-300">{currentUser.name}</strong> ({currentUser.role})
              </div>
            </div>

            {/* Clinician Notes Input */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Clinical Reviewer Notes / Justification:
              </label>
              <textarea
                value={clinicianNotes}
                onChange={(e) => setClinicianNotes(e.target.value)}
                placeholder="Enter clinical assessment notes, bedside physical exam corroboration, or override reasoning..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            {/* Review Status or Action Buttons */}
            {selectedRec.status !== 'PENDING_REVIEW' ? (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Recorded Decision:</span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                      selectedRec.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : selectedRec.status === 'MODIFIED' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {selectedRec.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Signed by {selectedRec.reviewedBy} at {selectedRec.reviewedAt}
                  </div>
                  {selectedRec.clinicianNotes && (
                    <p className="text-xs text-slate-300 mt-1 italic">"{selectedRec.clinicianNotes}"</p>
                  )}
                </div>

                <button
                  onClick={() => handleStartModify()}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                >
                  Revise Decision
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                <button
                  id="reject-rec-btn"
                  onClick={() => handleDecision('REJECTED')}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Recommendation</span>
                </button>

                <button
                  id="modify-rec-btn"
                  onClick={() => {
                    if (!isModifying) handleStartModify();
                    else handleDecision('MODIFIED');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isModifying ? 'Approve Modified Actions' : 'Modify & Approve'}</span>
                </button>

                <button
                  id="accept-rec-btn"
                  onClick={() => handleDecision('ACCEPTED')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept & Approve Clinical Protocol</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
