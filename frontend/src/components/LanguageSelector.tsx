'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-200">
      <Globe size={16} className="text-slate-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
        className="text-sm font-medium text-slate-700 bg-transparent border-none outline-none cursor-pointer"
      >
        <option value="es">🇪🇸 ES</option>
        <option value="en">🇺🇸 EN</option>
      </select>
    </div>
  );
}
