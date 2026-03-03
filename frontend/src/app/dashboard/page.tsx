'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import HeaderBar from '@/components/HeaderBar';
import MetricCard from '@/components/MetricCard';
import WeeklyTrendChart from '@/components/WeeklyTrendChart';
import PredictionTimelineChart from '@/components/PredictionTimelineChart';
import { TrendingUp, AlertTriangle, CheckCircle, Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HeatMap = dynamic(() => import('@/components/HeatMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-secondary rounded-lg">
      <p className="text-text-secondary">Cargando mapa...</p>
    </div>
  ),
});

const diseases = [
  { id: 'dengue', name: 'Dengue', color: 'bg-red-500', icon: '🦟', borderColor: '#EF4444' },
  { id: 'covid', name: 'COVID-19', color: 'bg-blue-500', icon: '😷', borderColor: '#3B82F6' },
  { id: 'influenza', name: 'Influenza', color: 'bg-purple-500', icon: '🤧', borderColor: '#A855F7' },
  { id: 'chikungunya', name: 'Chikungunya', color: 'bg-orange-500', icon: '🦟', borderColor: '#F97316' },
];

const diseaseData: Record<string, any> = {
  dengue: {
    cases: 1199,
    predicted: 1580,
    trend: '+32%',
    states: ['Veracruz', 'Yucatán', 'Quintana Roo', 'Chiapas', 'Oaxaca'],
    weeklyData: [
      { week: 'Sem 1', cases: 120, predicted: undefined },
      { week: 'Sem 2', cases: 150, predicted: undefined },
      { week: 'Sem 3', cases: 180, predicted: undefined },
      { week: 'Sem 4', cases: 200, predicted: 200 },
      { week: 'Sem 5', cases: null, predicted: 230 },
      { week: 'Sem 6', cases: null, predicted: 250 },
    ]
  },
  covid: {
    cases: 856,
    predicted: 920,
    trend: '+7%',
    states: ['Ciudad de México', 'Estado de México', 'Jalisco', 'Nuevo León'],
    weeklyData: [
      { week: 'Sem 1', cases: 90, predicted: undefined },
      { week: 'Sem 2', cases: 85, predicted: undefined },
      { week: 'Sem 3', cases: 88, predicted: undefined },
      { week: 'Sem 4', cases: 92, predicted: 92 },
      { week: 'Sem 5', cases: null, predicted: 95 },
      { week: 'Sem 6', cases: null, predicted: 98 },
    ]
  },
  influenza: {
    cases: 2340,
    predicted: 2680,
    trend: '+15%',
    states: ['Chihuahua', 'Sonora', 'Baja California', 'Coahuila'],
    weeklyData: [
      { week: 'Sem 1', cases: 280, predicted: undefined },
      { week: 'Sem 2', cases: 310, predicted: undefined },
      { week: 'Sem 3', cases: 290, predicted: undefined },
      { week: 'Sem 4', cases: 320, predicted: 320 },
      { week: 'Sem 5', cases: null, predicted: 350 },
      { week: 'Sem 6', cases: null, predicted: 380 },
    ]
  },
  chikungunya: {
    cases: 234,
    predicted: 310,
    trend: '+32%',
    states: ['Guerrero', 'Michoacán', 'Colima'],
    weeklyData: [
      { week: 'Sem 1', cases: 25, predicted: undefined },
      { week: 'Sem 2', cases: 30, predicted: undefined },
      { week: 'Sem 3', cases: 28, predicted: undefined },
      { week: 'Sem 4', cases: 32, predicted: 32 },
      { week: 'Sem 5', cases: null, predicted: 38 },
      { week: 'Sem 6', cases: null, predicted: 42 },
    ]
  }
};

export default function DashboardPage() {
  const [selectedDisease, setSelectedDisease] = useState('dengue');
  const { t } = useLanguage();
  const currentData = diseaseData[selectedDisease];
  const currentDisease = diseases.find(d => d.id === selectedDisease)!;
  
  return (
    <div className="min-h-screen bg-primary">
      <HeaderBar />
      
      <main className="p-3 sm:p-4 md:p-6 max-w-[1920px] mx-auto">
        {/* Disease Selector */}
        <div className="mb-4 md:mb-6">
          <div className="bg-secondary rounded-lg p-3 md:p-4 border border-border">
            <h3 className="text-sm font-semibold text-text-primary mb-3">{t('disease.select')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {diseases.map((disease) => (
                <button
                  key={disease.id}
                  onClick={() => setSelectedDisease(disease.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedDisease === disease.id
                      ? `${disease.color} border-white/50 shadow-lg`
                      : 'bg-card-bg border-border hover:border-border-hover'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{disease.icon}</span>
                    <span className={`text-sm font-semibold ${
                      selectedDisease === disease.id ? 'text-white' : 'text-text-primary'
                    }`}>
                      {disease.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <MetricCard
            title={t('metrics.current')}
            value={currentData.cases.toLocaleString()}
            icon={TrendingUp}
            iconColor="text-blue-400"
          />
          <MetricCard
            title={t('metrics.prediction')}
            value={currentData.predicted.toLocaleString()}
            icon={AlertTriangle}
            iconColor="text-orange-400"
          />
          <MetricCard
            title={t('metrics.states')}
            value={currentData.states.length.toString()}
            icon={Flame}
            iconColor="text-red-500"
            subtitle="Casos"
          />
          <MetricCard
            title="Distritos"
            value="4"
            icon={CheckCircle}
            iconColor="text-orange-500"
          />
          <MetricCard
            title="Alta Alerta"
            value="5"
            icon={AlertTriangle}
            iconColor="text-red-500"
          />
          <MetricCard
            title={t('metrics.accuracy')}
            value="94%"
            icon={TrendingUp}
            iconColor="text-green-500"
          />
        </div>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-card-bg border border-border rounded-lg p-3 md:p-4 h-[400px] md:h-[600px]">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-sm md:text-lg font-bold text-text-primary">{t('map.title')}</h2>
                <span className="text-xs text-text-secondary">{t('map.today')}</span>
              </div>
              <div className="h-[calc(100%-2.5rem)] md:h-[calc(100%-3rem)]">
                <Suspense fallback={<div>Cargando...</div>}>
                  <HeatMap disease={selectedDisease} diseaseColor={currentDisease.borderColor} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Stacks on mobile */}
          <div className="space-y-4 md:space-y-6">
            {/* Weekly Trend */}
            <div className="bg-card-bg border border-border rounded-lg p-3 md:p-4">
              <h3 className="text-xs md:text-sm font-bold text-text-primary mb-3">{t('chart.weekly')}</h3>
              <div className="h-40 md:h-48">
                <WeeklyTrendChart data={currentData.weeklyData} />
              </div>
            </div>

            {/* Top 5 Districts */}
            <div className="bg-card-bg border border-border rounded-lg p-3 md:p-4">
              <h3 className="text-xs md:text-sm font-bold text-text-primary mb-3">{t('top5.title')}</h3>
              <div className="space-y-2">
                {currentData.states.slice(0, 5).map((state: string, i: number) => {
                  const cases = Math.floor(currentData.cases / currentData.states.length * (1.5 - i * 0.1));
                  const risk = 85 - i * 8;
                  return (
                    <div key={i} className="flex items-center justify-between p-2 bg-secondary rounded text-xs md:text-sm">
                      <div>
                      <p className="font-medium text-text-primary">{state}</p>
                      <p className="text-xs text-text-secondary">{cases.toLocaleString()} {t('top5.cases')}</p>
                    </div>
                    <p className="font-bold text-red-500">{risk}%</p>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Timeline - Full width, collapsible on mobile */}
        <div className="mt-4 md:mt-6 bg-card-bg border border-border rounded-lg p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 md:mb-4">
            <h2 className="text-sm md:text-lg font-bold text-text-primary">{t('chart.prediction')} - {t(`disease.${selectedDisease}`)}</h2>
            <div className="flex items-center gap-3 md:gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-yellow-500"></div>
                <span className="text-text-secondary">Histórico</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500" style={{ borderTop: '2px dashed' }}></div>
                <span className="text-text-secondary">Predicción</span>
              </div>
            </div>
          </div>
          <div className="h-48 md:h-64">
            <PredictionTimelineChart />
          </div>
        </div>
      </main>
    </div>
  );
}
