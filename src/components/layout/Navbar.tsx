import React, { useState, useEffect } from 'react';
import { useHospital, DEFAULT_USERS, UserProfile } from '../../context/HospitalContext';
import { 
  Activity, 
  Search, 
  Bell, 
  Settings, 
  ShieldAlert, 
  CheckCircle, 
  Radio, 
  Play, 
  Pause, 
  Sliders, 
  User, 
  ChevronDown, 
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Plus
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    isLiveMonitoringActive, 
    setIsLiveMonitoringActive,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    alerts,
    recommendations,
    setIsSettingsOpen,
    setIsAddPatientOpen,
    globalSearch,
    setGlobalSearch,
    navigateToDecisionSupport,
    setCurrentPage
  } = useHospital();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showAlertMenu, setShowAlertMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' · 14 Sep 2026');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeCriticalAlerts = alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL');
  const pendingRecs = recommendations.filter(r => r.status === 'PENDING_REVIEW');

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Search Input & System Status */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search patient name, ID (e.g. PT-10023), ward, room, or symptom..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition-all font-sans"
          />
          {globalSearch && (
            <button 
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Middle: Live Telemetry Indicator & Clock */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            {isLiveMonitoringActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveMonitoringActive ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
          </span>
          <span className="text-slate-300">TELEMETRY STREAM:</span>
          <span className={isLiveMonitoringActive ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
            {isLiveMonitoringActive ? 'LIVE (25ms SYNC)' : 'PAUSED'}
          </span>
        </div>

        <button
          id="toggle-telemetry-btn"
          onClick={() => setIsLiveMonitoringActive(!isLiveMonitoringActive)}
          title={isLiveMonitoringActive ? 'Pause real-time telemetry feed' : 'Resume real-time telemetry feed'}
          className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
            isLiveMonitoringActive ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
          }`}
        >
          {isLiveMonitoringActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          id="toggle-audio-btn"
          onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
          title={audioAlertsEnabled ? 'Disable audio alerts' : 'Enable audio alerts'}
          className={`p-1.5 rounded-lg border text-xs transition-colors ${
            audioAlertsEnabled ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          {audioAlertsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        <div className="text-xs font-mono text-slate-400 border-l border-slate-800 pl-3">
          {currentTime}
        </div>
      </div>

      {/* Right Controls: Quick Add Patient, Notifications, Clinician Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Admit Patient */}
        <button
          id="quick-admit-patient-btn"
          onClick={() => setIsAddPatientOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Admit Patient</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className="relative p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            aria-label="Alerts and notifications"
          >
            <Bell className="w-4 h-4" />
            {activeCriticalAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-900">
                {activeCriticalAlerts.length}
              </span>
            )}
          </button>

          {/* Alert Popover Menu */}
          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Active Clinical Alerts</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {activeCriticalAlerts.length} Critical
                </span>
              </div>

              <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto my-2">
                {activeCriticalAlerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                    No unacknowledged critical alerts. All patients stable.
                  </div>
                ) : (
                  activeCriticalAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => {
                        setShowAlertMenu(false);
                        setCurrentPage('alerts');
                      }}
                      className="py-2.5 hover:bg-slate-800/50 rounded-lg px-2 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-400">{alert.patientName} ({alert.room})</span>
                        <span className="text-[10px] font-mono text-slate-400">{alert.detectedAt.split(' ').slice(-1)[0]}</span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{alert.triggerEvent}</p>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        SpO₂: {alert.triggerParameters.find(p => p.parameter === 'SpO₂')?.currentValue || '86%'}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <button
                  onClick={() => {
                    setShowAlertMenu(false);
                    setCurrentPage('alerts');
                  }}
                  className="text-sky-400 hover:text-sky-300 font-medium"
                >
                  View All Alerts ({alerts.length}) →
                </button>
                <button
                  onClick={() => {
                    setShowAlertMenu(false);
                    setCurrentPage('clinical-decisions');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium"
                >
                  Pending Reviews ({pendingRecs.length})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Clinician Switcher */}
        <div className="relative">
          <button
            id="clinician-profile-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 md:px-3 md:py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-6 h-6 rounded-full object-cover ring-1 ring-sky-500/40"
            />
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight flex items-center gap-1">
                {currentUser.name}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-sky-400 font-mono leading-tight">{currentUser.role}</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 pb-2 border-b border-slate-800">
                Switch Clinician Persona
              </div>
              <div className="space-y-1 mt-2">
                {DEFAULT_USERS.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                      currentUser.id === u.id ? 'bg-sky-950/60 border border-sky-500/30' : 'hover:bg-slate-800'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Settings Trigger */}
        <button
          id="open-settings-btn"
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          title="Clinical Decision Support Configuration"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
