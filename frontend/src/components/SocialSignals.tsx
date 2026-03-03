'use client';

import { MessageCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Region } from '@/lib/regions';

interface SocialSignal {
  hashtag: string;
  mentions: number;
  trend: 'up' | 'down' | 'stable';
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface SocialSignalsProps {
  selectedRegion: Region;
}

export default function SocialSignals({ selectedRegion }: SocialSignalsProps) {
  const { t } = useLanguage();
  
  // Generar señales específicas por región (usar ID para consistencia)
  const getRegionSignals = (region: Region): SocialSignal[] => {
    // Usar hash del ID de región para generar números consistentes pero diferentes
    const hash = region.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const baseSignals = [
      { hashtag: '#Dengue', base: 1000, trend: 'up' as const, sentiment: 'negative' as const },
      { hashtag: '#Mosquito', base: 800, trend: 'up' as const, sentiment: 'neutral' as const },
      { hashtag: '#Zika', base: 200, trend: 'stable' as const, sentiment: 'neutral' as const },
      { hashtag: '#Salud', base: 3000, trend: 'up' as const, sentiment: 'positive' as const },
      { hashtag: '#Prevención', base: 500, trend: 'down' as const, sentiment: 'positive' as const },
    ];

    // Variar menciones según región usando hash
    const multiplier = region.country === 'BR' ? 1.5 
                     : region.country === 'MX' ? 1.2
                     : region.country === 'CO' ? 1.1
                     : 0.8;

    return baseSignals.map((signal, idx) => ({
      ...signal,
      mentions: Math.floor(signal.base * multiplier * (0.8 + ((hash + idx * 100) % 40) / 100))
    }));
  };

  const signals = getRegionSignals(selectedRegion);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={18} className="text-blue-600" />
        <h3 className="text-sm font-bold text-slate-900">{t('socialSignals')}</h3>
      </div>

      <p className="text-xs text-slate-500 mb-3">{selectedRegion.name}</p>

      <div className="space-y-2">
        {signals.map((signal) => (
          <div key={signal.hashtag} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getSentimentColor(signal.sentiment)}`}>
                {signal.hashtag}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-bold text-slate-700">{signal.mentions}</span>
              {signal.trend === 'up' && <TrendingUp size={14} className="text-red-500" />}
              {signal.trend === 'down' && <TrendingUp size={14} className="text-green-500 rotate-180" />}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-3 italic">
        * {t('simulatedData')}
      </p>
    </div>
  );
}
