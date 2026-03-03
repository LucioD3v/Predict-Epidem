'use client';

import { Prediction } from '@/types';
import { getRiskColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import Simulator from './Simulator';
import { useLanguage } from '@/lib/LanguageContext';

export default function PredictionCard({ prediction }: { prediction: Prediction }) {
  const { t } = useLanguage();
  const { disease, current_cases, predicted_cases, risk_level, trend } = prediction;
  
  const change = predicted_cases - current_cases;
  const changePercent = current_cases > 0 
    ? ((change / current_cases) * 100).toFixed(1)
    : '0';

  const TrendIcon = trend === 'CRECIENTE' ? TrendingUp 
    : trend === 'DECRECIENTE' ? TrendingDown 
    : Minus;

  const translateRisk = (level: string) => {
    const map: any = {
      'BAJO': t('low'),
      'MEDIO': t('medium'),
      'ALTO': t('high'),
      'CRÍTICO': t('critical')
    };
    return map[level] || level;
  };

  const translateTrend = (trendValue: string) => {
    const map: any = {
      'ESTABLE': t('stable'),
      'CRECIENTE': t('increasing'),
      'DECRECIENTE': t('decreasing')
    };
    return map[trendValue] || trendValue;
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="group bg-white rounded-xl lg:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 lg:p-6 border border-slate-100 hover:border-blue-200">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h3 className="text-base lg:text-xl font-bold text-slate-900 truncate">{disease}</h3>
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
          <Activity className="text-blue-600" size={16} />
        </div>
      </div>
      
      <div className="space-y-3 lg:space-y-4">
        <div className="bg-slate-50 rounded-lg lg:rounded-xl p-3 lg:p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{t('currentCases')}</p>
          <p className="text-2xl lg:text-3xl font-bold text-slate-900">
            {formatNumber(current_cases)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg lg:rounded-xl p-3 lg:p-4">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">{t('prediction')}</p>
          <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {formatNumber(predicted_cases)}
          </p>
          <p className={`text-xs lg:text-sm font-semibold mt-1 ${change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {change >= 0 ? '↗' : '↘'} {formatNumber(Math.abs(change))} ({changePercent}%)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <span className={`px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-bold shadow-sm text-center ${getRiskColor(risk_level)}`}>
            {translateRisk(risk_level)}
          </span>
          
          <div className="flex items-center justify-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
            <TrendIcon size={16} />
            <span className="text-xs lg:text-sm font-medium">{translateTrend(trend)}</span>
          </div>
        </div>

        <Simulator disease={disease} />
      </div>
    </div>
  );
}
