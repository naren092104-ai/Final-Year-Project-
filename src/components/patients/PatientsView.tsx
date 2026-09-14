import React, { useState, useMemo } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { RiskBadge } from '../common/Badge';
import { Patient } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  SlidersHorizontal, 
  ChevronRight, 
  Cpu, 
  Stethoscope, 
  ArrowUpDown,
  Download,
  Activity,
  Heart
} from 'lucide-react';

export const PatientsView: React.FC = () => {
  const { 
    patients, 
    navigateToPatientProfile, 
    navigateToDigitalTwin, 
    navigateToDecisionSupport,
    setIsAddPatientOpen,
    globalSearch,
    setGlobalSearch
  } = useHospital();

  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'risk' | 'name' | 'room' | 'age'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const wards = ['ALL', 'ICU', 'CCU', 'Ward A', 'Ward B', 'HDU'];
  const riskLevels = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'STABLE'];

  const filteredPatients = useMemo(() => {
    let result = [...patients];

    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        p.room.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q) ||
        p.attendingPhysician.toLowerCase().includes(q)
      );
    }

    if (selectedWard !== 'ALL') {
      result = result.filter(p => p.ward.toLowerCase() === selectedWard.toLowerCase());
    }

    if (selectedRisk !== 'ALL') {
      result = result.filter(p => p.riskLevel.toUpperCase() === selectedRisk.toUpperCase());
    }

    result.sort((a, b) => {
      let valA: any = a.riskScore;
      let valB: any = b.riskScore;

      if (sortBy === 'name') {
        valA = a.name;
        valB = b.name;
      } else if (sortBy === 'room') {
        valA = a.room;
        valB = b.room;
      } else if (sortBy === 'age') {
        valA = a.age;
        valB = b.age;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [patients, globalSearch, selectedWard, selectedRisk, sortBy, sortOrder]);

  const exportPatientRoster = () => {
    const jsonStr = JSON.stringify(filteredPatients, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smarttwin-patients-roster-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-400" />
            Hospital Patient Roster & Digital Twin States
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time surveillance roster of {patients.length} admitted patients across all wards
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="export-roster-btn"
            onClick={exportPatientRoster}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            id="admit-patient-btn"
            onClick={() => setIsAddPatientOpen(true)}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-900/30 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Admit New Patient</span>
          </button>
        </div>
      </div>

      {/* Ward Tabs & Risk Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Ward Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            {wards.map(ward => (
              <button
                key={ward}
                onClick={() => setSelectedWard(ward)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedWard === ward
                    ? 'bg-sky-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ward === 'ALL' ? 'All Wards' : ward}
              </button>
            ))}
          </div>

          {/* Risk Level Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Risk:
            </span>
            {riskLevels.map(risk => (
              <button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedRisk === risk
                    ? 'bg-slate-700 text-white font-semibold border border-slate-600'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, room, or condition..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="risk">Risk Score</option>
              <option value="name">Patient Name</option>
              <option value="room">Room Number</option>
              <option value="age">Age</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300"
              title={`Sorting ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-slate-500">
              Showing {filteredPatients.length} of {patients.length}
            </span>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 pl-4">Patient Profile</th>
                <th className="py-3.5 px-3">Location / Ward</th>
                <th className="py-3.5 px-3">Admission & Diagnosis</th>
                <th className="py-3.5 px-3">Telemetry Vitals</th>
                <th className="py-3.5 px-3">Risk Assessment</th>
                <th className="py-3.5 px-3">Digital Twin Status</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No patients match your active filters or search criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => {
                  const isCrit = patient.riskLevel === 'CRITICAL';
                  const isHigh = patient.riskLevel === 'HIGH';

                  return (
                    <tr 
                      key={patient.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isCrit ? 'bg-rose-950/10' : isHigh ? 'bg-amber-950/5' : ''
                      }`}
                    >
                      {/* Patient Info */}
                      <td className="py-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={patient.avatarUrl} 
                            alt={patient.name} 
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700 shrink-0" 
                          />
                          <div>
                            <div 
                              onClick={() => navigateToPatientProfile(patient.patientId)}
                              className="font-bold text-slate-200 hover:text-sky-400 cursor-pointer transition-colors"
                            >
                              {patient.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span className="text-sky-400 font-semibold">{patient.patientId}</span>
                              <span>·</span>
                              <span>{patient.age}y / {patient.gender}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-3 font-mono">
                        <div className="font-semibold text-slate-200">{patient.room}</div>
                        <div className="text-[10px] text-slate-400">{patient.ward}</div>
                      </td>

                      {/* Diagnosis */}
                      <td className="py-3.5 px-3 max-w-[200px]">
                        <div className="font-medium text-slate-200 truncate">{patient.diagnosis}</div>
                        <div className="text-[10px] text-slate-400 truncate">Attending: {patient.attendingPhysician}</div>
                      </td>

                      {/* Live Vitals snapshot */}
                      <td className="py-3.5 px-3">
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
                          <div>
                            <span className="text-slate-500 text-[10px]">HR:</span>{' '}
                            <span className={patient.vitals.heartRate.value > 100 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                              {patient.vitals.heartRate.value}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px]">SpO₂:</span>{' '}
                            <span className={patient.vitals.spO2.value < 90 ? 'text-rose-400 font-bold animate-pulse' : patient.vitals.spO2.value < 95 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                              {patient.vitals.spO2.value}%
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px]">RR:</span>{' '}
                            <span className={patient.vitals.respiratoryRate.value > 22 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                              {patient.vitals.respiratoryRate.value}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px]">BP:</span>{' '}
                            <span className="text-slate-200">
                              {patient.vitals.bloodPressure.value}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Risk Assessment */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2 mb-1">
                          <RiskBadge level={patient.riskLevel} size="sm" />
                          <span className="font-mono font-bold text-slate-200">{patient.riskScore}%</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Trend:{' '}
                          <span className={patient.trend === 'Deteriorating' ? 'text-rose-400 font-semibold' : patient.trend === 'Improving' ? 'text-emerald-400' : 'text-slate-400'}>
                            {patient.trend}
                          </span>
                        </div>
                      </td>

                      {/* Digital Twin Status */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>SYNCHRONIZED</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Latency: {patient.digitalTwin.dataFreshnessMs || 25}ms
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-profile-${patient.patientId}`}
                            onClick={() => navigateToPatientProfile(patient.patientId)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                          >
                            Profile
                          </button>
                          <button
                            id={`btn-twin-${patient.patientId}`}
                            onClick={() => navigateToDigitalTwin(patient.patientId)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
                            title="Inspect Organ-level Digital Twin"
                          >
                            <Cpu className="w-3 h-3 text-sky-400" />
                            <span>Twin</span>
                          </button>
                          <button
                            id={`btn-cdss-${patient.patientId}`}
                            onClick={() => navigateToDecisionSupport(undefined, patient.patientId)}
                            className="px-2.5 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 text-xs font-semibold border border-sky-500/40 transition-colors"
                          >
                            CDSS
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
