import React from 'react';
import { useHospital, NavigationPage } from '../../context/HospitalContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Cpu, 
  Activity, 
  Bot, 
  AlertTriangle, 
  Stethoscope, 
  BarChart3, 
  PlayCircle, 
  FileText, 
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Building2,
  Info
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, alerts, recommendations, patients } = useHospital();

  const criticalAlertsCount = alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL').length;
  const pendingDecisionsCount = recommendations.filter(r => r.status === 'PENDING_REVIEW').length;
  const criticalPatientsCount = patients.filter(p => p.riskLevel === 'CRITICAL').length;

  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string; group?: string }[] = [
    {
      group: 'MAIN CLINICAL WORKSPACE',
      id: 'overview',
      label: 'Executive Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'patients',
      label: 'Patient Roster',
      icon: <Users className="w-4 h-4" />,
      badge: patients.length,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'patient-profile',
      label: 'Patient Profile',
      icon: <UserCheck className="w-4 h-4" />,
      badge: criticalPatientsCount > 0 ? `${criticalPatientsCount} Crit` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    {
      id: 'digital-twins',
      label: 'Digital Twins',
      icon: <Cpu className="w-4 h-4" />
    },
    {
      id: 'live-monitoring',
      label: 'Live Telemetry Grid',
      icon: <Activity className="w-4 h-4" />
    },
    {
      group: 'AGENTIC AI REASONING',
      id: 'ai-agents',
      label: 'AI Agents Pipeline',
      icon: <Bot className="w-4 h-4" />,
      badge: '4 Active',
      badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
    },
    {
      id: 'alerts',
      label: 'Smart Alerts',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: criticalAlertsCount > 0 ? criticalAlertsCount : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold'
    },
    {
      id: 'clinical-decisions',
      label: 'Decision Support (CDSS)',
      icon: <Stethoscope className="w-4 h-4" />,
      badge: pendingDecisionsCount > 0 ? pendingDecisionsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      group: 'SIMULATION & VALIDATION',
      id: 'simulation',
      label: 'Deterioration Simulator',
      icon: <PlayCircle className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Hospital Analytics',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'audit-logs',
      label: 'Audit & Compliance Logs',
      icon: <FileText className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">SmartTwin</span>
              <span className="text-xs px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-mono font-semibold border border-sky-500/30">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">Clinical Decision Support</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          const isActive = currentPage === item.id;
          return (
            <React.Fragment key={item.id}>
              {item.group && (
                <div className={`px-2 pt-3.5 pb-1 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider ${idx > 0 ? 'mt-2 border-t border-slate-800/50' : ''}`}>
                  {item.group}
                </div>
              )}
              <button
                id={`nav-item-${item.id}`}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-sky-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Clinical Disclaimer & Demo Badge */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-slate-400 space-y-2">
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-0.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Clinical Decision Support</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-tight">
            Demo environment with simulated patient data. Clinician review required for all recommendations.
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-mono">
          <span>v2.4.0 (Build 2026.09)</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Orchestrator OK
          </span>
        </div>
      </div>
    </aside>
  );
};
