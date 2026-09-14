import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', className = '' }) => {
  const normalized = (level || 'STABLE').toUpperCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-semibold'
  };

  const colorStyles: Record<string, string> = {
    CRITICAL: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-xs shadow-rose-500/10',
    HIGH: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    MEDIUM: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
    STABLE: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  };

  const style = colorStyles[normalized] || 'bg-slate-800 text-slate-300 border border-slate-700';

  return (
    <span
      id={`risk-badge-${normalized.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wide uppercase ${sizeClasses[size]} ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${normalized === 'CRITICAL' ? 'bg-rose-400 animate-ping' : normalized === 'HIGH' ? 'bg-amber-400' : normalized === 'MEDIUM' ? 'bg-yellow-400' : 'bg-emerald-400'}`} />
      {normalized}
    </span>
  );
};

export const StatusPill: React.FC<{ label: string; variant?: 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'slate'; size?: 'sm' | 'md' }> = ({
  label,
  variant = 'blue',
  size = 'sm'
}) => {
  const variants = {
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    blue: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    red: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    slate: 'bg-slate-800/80 text-slate-400 border-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-medium border ${variants[variant]}`}
    >
      {label}
    </span>
  );
};
