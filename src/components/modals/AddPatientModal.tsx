import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { X, UserPlus, Heart, Wind, Activity, Thermometer, Gauge } from 'lucide-react';

export const AddPatientModal: React.FC = () => {
  const { isAddPatientOpen, setIsAddPatientOpen, admitNewPatient } = useHospital();

  const [name, setName] = useState('');
  const [age, setAge] = useState('58');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [ward, setWard] = useState('ICU');
  const [room, setRoom] = useState('ICU - Bed 09');
  const [diagnosis, setDiagnosis] = useState('Acute Exacerbation of COPD');
  const [physician, setPhysician] = useState('Dr. N. D');
  const [hr, setHr] = useState('88');
  const [spo2, setSpo2] = useState('94');
  const [rr, setRr] = useState('20');
  const [sbp, setSbp] = useState('130');
  const [temp, setTemp] = useState('37.2');
  const [history, setHistory] = useState('Hypertension, Smoking History');
  const [allergies, setAllergies] = useState('Sulfa Drugs');

  if (!isAddPatientOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    await admitNewPatient({
      name: name.trim() || 'New Patient',
      age: Number(age) || 50,
      gender,
      ward,
      room,
      diagnosis: diagnosis.trim() || 'Clinical Observation',
      attendingPhysician: physician,
      medicalHistory: history.split(',').map(s => s.trim()).filter(Boolean),
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
      vitals: {
        heartRate: { value: Number(hr) || 80, unit: 'bpm', normalRange: '60–100', status: 'normal', trend: 'stable', lastUpdated: now, history: [{ time: now, value: Number(hr) || 80 }] },
        spO2: { value: Number(spo2) || 95, unit: '%', normalRange: '95–100', status: 'normal', trend: 'stable', lastUpdated: now, history: [{ time: now, value: Number(spo2) || 95 }] },
        respiratoryRate: { value: Number(rr) || 18, unit: '/min', normalRange: '12–20', status: 'normal', trend: 'stable', lastUpdated: now, history: [{ time: now, value: Number(rr) || 18 }] },
        bloodPressure: { value: `${sbp}/82`, systolic: Number(sbp) || 120, diastolic: 82, unit: 'mmHg', normalRange: '< 120/80', status: 'normal', trend: 'stable', lastUpdated: now, history: [{ time: now, value: Number(sbp) || 120 }] },
        temperature: { value: Number(temp) || 37.0, unit: '°C', normalRange: '36.5–37.5', status: 'normal', trend: 'stable', lastUpdated: now, history: [{ time: now, value: Number(temp) || 37.0 }] }
      }
    });

    setIsAddPatientOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Admit Patient & Initialize Digital Twin</h2>
              <p className="text-xs text-slate-400">Instantiate virtual physiological replica and assign surveillance agents</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddPatientOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          {/* Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Location & Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Ward</label>
              <select
                value={ward}
                onChange={e => setWard(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="ICU">ICU (Intensive Care)</option>
                <option value="CCU">CCU (Coronary Care)</option>
                <option value="HDU">HDU (High Dependency)</option>
                <option value="Ward A">Ward A (Pulmonary)</option>
                <option value="Ward B">Ward B (General)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Room / Bed ID</label>
              <input
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Attending Physician</label>
              <input
                type="text"
                value={physician}
                onChange={e => setPhysician(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Primary Admission Diagnosis</label>
            <input
              type="text"
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Initial Baseline Vitals */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Initial Telemetry Baseline</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">HR (bpm)</label>
                <input
                  type="number"
                  value={hr}
                  onChange={e => setHr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">SpO₂ (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={e => setSpo2(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">RR (/min)</label>
                <input
                  type="number"
                  value={rr}
                  onChange={e => setRr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">SBP (mmHg)</label>
                <input
                  type="number"
                  value={sbp}
                  onChange={e => setSbp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={e => setTemp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Comorbidities and Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Medical History (comma separated)</label>
              <input
                type="text"
                value={history}
                onChange={e => setHistory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Allergies (comma separated)</label>
              <input
                type="text"
                value={allergies}
                onChange={e => setAllergies(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddPatientOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md"
            >
              Admit Patient & Initialize Twin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
