'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeaderBar from '@/components/HeaderBar';
import MetricsPanel from '@/components/MetricsPanel';
import AlertsPanel from '@/components/AlertsPanel';
import TrendChart from '@/components/TrendChart';
import { estadosMexico, EstadoMexico } from '@/lib/mockDataMexico';
import { ChevronDown, ChevronUp, Map } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const [selectedEstado, setSelectedEstado] = useState<EstadoMexico>(estadosMexico[0]);
  const [showTrendPanel, setShowTrendPanel] = useState(true);
  const { t } = useLanguage();

  const handleEstadoClick = (estado: EstadoMexico) => {
    setSelectedEstado(estado);
    setShowTrendPanel(true);
  };

  return (
    <div className="min-h-screen bg-primary">
      <HeaderBar />
      
      <main className="p-4 md:p-6">
        {/* Quick Access to Dashboard */}
        <Link 
          href="/dashboard"
          className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-between hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <div>
            <h3 className="text-white font-bold text-lg">{t('home.dashboard')}</h3>
            <p className="text-blue-100 text-sm">{t('home.dashboardDesc')}</p>
          </div>
          <Map className="text-white" size={32} />
        </Link>

        <div className="mb-6">
          <MetricsPanel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-card-bg rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🗺️</span>
                <h3 className="text-sm font-bold text-text-primary">{t('home.states')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {estadosMexico.map((estado) => {
                  const isSelected = selectedEstado.id === estado.id;
                  return (
                    <button
                      key={estado.id}
                      onClick={() => handleEstadoClick(estado)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
                          : 'border-border hover:border-tertiary hover:bg-hover-bg'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-base font-bold text-text-primary">{estado.name}</p>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          estado.riesgo === 'CRÍTICO' ? 'bg-red-500/20 text-red-400' :
                          estado.riesgo === 'ALTO' ? 'bg-orange-500/20 text-orange-400' :
                          estado.riesgo === 'MEDIO' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {estado.riesgo}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-text-secondary">
                          {t('home.current')}: <span className="text-text-primary font-semibold">{estado.casos_actuales}</span>
                        </p>
                        <p className="text-sm text-text-secondary">
                          {t('home.prediction')}: <span className="text-purple-400 font-semibold">{estado.casos_predichos_semana4}</span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <AlertsPanel />
          </div>
        </div>

        <div className="bg-card-bg rounded-lg border border-border overflow-hidden mb-6">
          <button
            onClick={() => setShowTrendPanel(!showTrendPanel)}
            className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-hover-bg transition-all"
          >
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <h2 className="text-base md:text-lg font-bold text-text-primary">{selectedEstado.name}</h2>
              <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${
                selectedEstado.riesgo === 'CRÍTICO' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                selectedEstado.riesgo === 'ALTO' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                selectedEstado.riesgo === 'MEDIO' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                'bg-green-500/10 text-green-400 border border-green-500/30'
              }`}>
                {selectedEstado.riesgo}
              </span>
            </div>
            {showTrendPanel ? <ChevronUp size={20} className="text-text-secondary" /> : <ChevronDown size={20} className="text-text-secondary" />}
          </button>

          {showTrendPanel && (
            <div className="px-4 md:px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <p className="text-xs text-text-secondary mb-1">Casos Actuales</p>
                  <p className="text-2xl font-bold text-blue-400">{selectedEstado.casos_actuales}</p>
                </div>
                <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <p className="text-xs text-text-secondary mb-1">Predicción Semana 4</p>
                  <p className="text-2xl font-bold text-purple-400">{selectedEstado.casos_predichos_semana4}</p>
                </div>
                <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                  <p className="text-xs text-text-secondary mb-1">{t('home.increase')}</p>
                  <p className="text-2xl font-bold text-red-400">+{selectedEstado.aumento_porcentaje}%</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  {t('home.analysis')}
                </h3>
                <TrendChart estado={selectedEstado} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-text-secondary mb-1">🌡️ {t('home.temperature')}</p>
                  <p className="text-lg font-bold text-text-primary">{selectedEstado.clima.temperatura}°C</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1">💧 {t('home.humidity')}</p>
                  <p className="text-lg font-bold text-text-primary">{selectedEstado.clima.humedad}%</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1">🌧️ {t('home.precipitation')}</p>
                  <p className="text-lg font-bold text-text-primary">{selectedEstado.clima.precipitacion}mm</p>
                </div>
              </div>
            </div>
          )}
        </div>

        

        <footer className="mt-8 pt-6 border-t border-border">
          <div className="text-center text-text-secondary text-xs space-y-2">
            <p className="font-semibold">
              Predict-Epidem México | 10,000 AIdeas Competition
            </p>
            <a 
              href="https://community.aws/10000-aideas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline block"
            >
              community.aws/10000-aideas
            </a>
            <p className="text-xs opacity-60">
              Powered by AWS Free Tier | Lambda + S3 + CloudWatch
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
