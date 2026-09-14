import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { AlertTriangle, CheckCircle2, Info, X, Bell } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHospital();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          critical: <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        };

        const bgStyles = {
          critical: 'bg-slate-900/95 border-rose-500/40 text-rose-100 shadow-rose-950/50',
          warning: 'bg-slate-900/95 border-amber-500/40 text-amber-100 shadow-amber-950/50',
          success: 'bg-slate-900/95 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50',
          info: 'bg-slate-900/95 border-sky-500/40 text-sky-100 shadow-sky-950/50'
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all transform animate-slide-in ${bgStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold tracking-tight text-white">{toast.title}</h4>
                <span className="text-[10px] font-mono text-slate-400">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
