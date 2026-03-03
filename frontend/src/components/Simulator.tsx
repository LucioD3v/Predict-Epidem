'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface SimulationProps {
  disease: string;
}

export default function Simulator({ disease }: SimulationProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState({
    currentCases: 100,
    temperature: 26,
    precipitation: 150,
    humidity: 75,
  });
  const [prediction, setPrediction] = useState<number | null>(null);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const runSimulation = () => {
    const tempFactor = (params.temperature - 20) / 10;
    const precipFactor = params.precipitation / 200;
    const humidityFactor = params.humidity / 100;
    
    const growthRate = 1 + (tempFactor * 0.1) + (precipFactor * 0.15) + (humidityFactor * 0.1);
    const predicted = Math.round(params.currentCases * growthRate);
    
    setPrediction(predicted);
  };

  const reset = () => {
    setParams({
      currentCases: 100,
      temperature: 26,
      precipitation: 150,
      humidity: 75,
    });
    setPrediction(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <Play size={18} />
        {t('simulator')}
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-900">🧪 {t('simulator')}</h4>
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          X
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            {t('currentCases')}: {params.currentCases}
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            value={params.currentCases}
            onChange={(e) => setParams({ ...params, currentCases: parseInt(e.target.value) })}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            {t('temperature')}: {params.temperature}°C
          </label>
          <input
            type="range"
            min="15"
            max="35"
            value={params.temperature}
            onChange={(e) => setParams({ ...params, temperature: parseInt(e.target.value) })}
            className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            {t('precipitation')}: {params.precipitation}mm
          </label>
          <input
            type="range"
            min="0"
            max="400"
            value={params.precipitation}
            onChange={(e) => setParams({ ...params, precipitation: parseInt(e.target.value) })}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            {t('humidity')}: {params.humidity}%
          </label>
          <input
            type="range"
            min="40"
            max="100"
            value={params.humidity}
            onChange={(e) => setParams({ ...params, humidity: parseInt(e.target.value) })}
            className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={runSimulation}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Play size={16} />
            {t('simulate')}
          </button>
          <button
            onClick={reset}
            className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-300 transition-all"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {prediction !== null && (
          <div className="mt-3 p-3 bg-white rounded-lg border-2 border-purple-300 animate-pulse">
            <p className="text-xs font-semibold text-slate-500 mb-1">{t('prediction')}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatNumber(prediction)}
            </p>
            <p className={`text-xs font-semibold mt-1 ${prediction > params.currentCases ? 'text-red-600' : 'text-green-600'}`}>
              {prediction > params.currentCases ? '↗' : '↘'} {Math.abs(prediction - params.currentCases)}
              ({(((prediction - params.currentCases) / params.currentCases) * 100).toFixed(1)}%)
            </p>
          </div>
        )}

        <p className="text-xs text-slate-500 italic mt-2">
          * Simulación simplificada
        </p>
      </div>
    </div>
  );
}
