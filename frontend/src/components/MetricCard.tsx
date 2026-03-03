'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

export default function MetricCard({ title, value, icon: Icon, iconColor = 'text-blue-500', subtitle }: MetricCardProps) {
  return (
    <div className="bg-card-bg border border-border rounded-lg p-3 md:p-4 hover:bg-hover-bg transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-secondary mb-1 truncate">{title}</p>
          <h3 className="text-xl md:text-2xl font-bold text-text-primary truncate">{value}</h3>
          {subtitle && <p className="text-xs text-text-secondary mt-1 truncate">{subtitle}</p>}
        </div>
        <Icon className={`w-6 h-6 md:w-8 md:h-8 ${iconColor} flex-shrink-0`} />
      </div>
    </div>
  );
}
