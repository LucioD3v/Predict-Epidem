'use client';

import { X, Info, TrendingUp, Target, CheckCircle } from 'lucide-react';
import { modelMetrics } from '@/lib/mockDataMexico';

interface ModelAccuracyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModelAccuracyModal({ isOpen, onClose }: ModelAccuracyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#1A1F2E] rounded-lg border border-[#2D3748] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2D3748]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Precisión del Modelo</h2>
              <p className="text-xs text-slate-400">SageMaker Canvas - {modelMetrics.algorithm}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2D3748] rounded-lg transition-all"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Precisión General</p>
                <p className="text-4xl font-bold text-white">{(1 - modelMetrics.wape) * 100}%</p>
              </div>
              <div className="text-right">
                <CheckCircle size={48} className="text-green-400" />
                <p className="text-xs text-green-400 font-semibold mt-1">Excelente</p>
              </div>
            </div>
            <div className="h-2 bg-[#2D3748] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${(1 - modelMetrics.wape) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Métricas Detalladas */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-400" />
              Métricas de Evaluación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0F1419] rounded-lg p-4 border border-[#2D3748]">
                <p className="text-xs text-slate-400 mb-1">WAPE</p>
                <p className="text-2xl font-bold text-green-400">{modelMetrics.wape}</p>
                <p className="text-xs text-slate-500 mt-2">Weighted Absolute % Error</p>
                <p className="text-xs text-slate-600 mt-1">Objetivo: &lt; 0.15</p>
              </div>
              <div className="bg-[#0F1419] rounded-lg p-4 border border-[#2D3748]">
                <p className="text-xs text-slate-400 mb-1">MAPE</p>
                <p className="text-2xl font-bold text-green-400">{modelMetrics.mape}</p>
                <p className="text-xs text-slate-500 mt-2">Mean Absolute % Error</p>
                <p className="text-xs text-slate-600 mt-1">Objetivo: &lt; 0.20</p>
              </div>
              <div className="bg-[#0F1419] rounded-lg p-4 border border-[#2D3748]">
                <p className="text-xs text-slate-400 mb-1">RMSE</p>
                <p className="text-2xl font-bold text-blue-400">{modelMetrics.rmse}</p>
                <p className="text-xs text-slate-500 mt-2">Root Mean Squared Error</p>
                <p className="text-xs text-slate-600 mt-1">casos</p>
              </div>
            </div>
          </div>

          {/* Explicación */}
          <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Cómo Calculamos la Precisión</h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <p>
                    <span className="font-semibold text-white">WAPE (0.12):</span> Mide el error promedio ponderado.
                    Un valor de 0.12 significa que nuestras predicciones tienen un error del 12%, lo cual es excelente para epidemiología.
                  </p>
                  <p>
                    <span className="font-semibold text-white">MAPE (0.15):</span> Error porcentual promedio.
                    Indica que en promedio nos desviamos un 15% del valor real.
                  </p>
                  <p>
                    <span className="font-semibold text-white">RMSE (42.3):</span> Penaliza errores grandes.
                    En promedio, nuestras predicciones se desvían ±42 casos del valor real.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Validación */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Proceso de Validación</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-purple-400">1</span>
                </div>
                <div>
                  <p className="text-sm text-white font-semibold">Backtesting</p>
                  <p className="text-xs text-slate-400">Validación en 3 ventanas temporales diferentes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-purple-400">2</span>
                </div>
                <div>
                  <p className="text-sm text-white font-semibold">Cross-Validation</p>
                  <p className="text-xs text-slate-400">5-fold para evitar overfitting</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-purple-400">3</span>
                </div>
                <div>
                  <p className="text-sm text-white font-semibold">Intervalos de Confianza</p>
                  <p className="text-xs text-slate-400">P10-P90 (90% de probabilidad)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Training Info */}
          <div className="bg-[#0F1419] rounded-lg p-4 border border-[#2D3748]">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 mb-1">Algoritmo</p>
                <p className="text-white font-semibold">{modelMetrics.algorithm}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Tiempo de Entrenamiento</p>
                <p className="text-white font-semibold">{modelMetrics.training_time}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Última Actualización</p>
                <p className="text-white font-semibold">Hace 2 horas</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Tipo de Build</p>
                <p className="text-white font-semibold">Quick Build</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2D3748] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold text-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
