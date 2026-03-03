'use client';

import { MapPin, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Region } from '@/lib/regions';

interface RiskMapProps {
  selectedRegion: Region;
}

export default function RiskMap({ selectedRegion }: RiskMapProps) {
  const { t } = useLanguage();

  // Puntos de riesgo simulados alrededor de la región seleccionada
  const riskPoints = [
    { name: 'Zona Centro', risk: 'high', cases: 234 },
    { name: 'Zona Norte', risk: 'medium', cases: 156 },
    { name: 'Zona Sur', risk: 'high', cases: 289 },
    { name: 'Zona Este', risk: 'low', cases: 45 },
    { name: 'Zona Oeste', risk: 'medium', cases: 178 },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return t('high');
      case 'medium': return t('medium');
      case 'low': return t('low');
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={18} className="text-purple-600" />
        <h3 className="text-sm font-bold text-slate-900">{t('riskMap')}</h3>
      </div>

      {/* Mapa simplificado */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 h-64 overflow-hidden">
        {/* Región central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <MapPin size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs font-bold text-slate-700">{selectedRegion.name}</span>
            </div>
          </div>
        </div>

        {/* Puntos de riesgo distribuidos */}
        {riskPoints.map((point, index) => {
          const positions = [
            { top: '15%', left: '20%' },
            { top: '20%', right: '25%' },
            { bottom: '20%', left: '25%' },
            { bottom: '25%', right: '20%' },
            { top: '50%', left: '10%' },
          ];
          const pos = positions[index];

          return (
            <div
              key={point.name}
              className="absolute group cursor-pointer"
              style={pos}
            >
              <div className={`w-8 h-8 ${getRiskColor(point.risk)} rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform`}>
                <AlertTriangle size={16} className="text-white" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                  <p className="font-bold">{point.name}</p>
                  <p>{getRiskLabel(point.risk)} - {point.cases} {t('cases')}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-slate-600">{t('low')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span className="text-slate-600">{t('medium')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-slate-600">{t('high')}</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 italic text-center">
        * {t('simplifiedMap')}
      </p>
    </div>
  );
}
