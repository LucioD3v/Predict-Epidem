import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskColor(level: string): string {
  switch (level) {
    case 'BAJO': return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
    case 'MEDIO': return 'text-amber-700 bg-amber-50 border border-amber-200';
    case 'ALTO': return 'text-orange-700 bg-orange-50 border border-orange-200';
    case 'CRÍTICO': return 'text-red-700 bg-red-50 border border-red-200';
    default: return 'text-slate-700 bg-slate-50 border border-slate-200';
  }
}
