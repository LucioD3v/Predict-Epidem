'use client';

import { Bell, Mail, MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import { recentAlerts } from '@/lib/mockDataMexico';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AlertsPanel() {
  const { t } = useLanguage();
  
  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'CRÍTICO':
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'ALTO':
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'MEDIO':
      case 'MEDIUM':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-green-500/10 text-green-400 border-green-500/30';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-[#1A1F2E] rounded-lg p-4 border border-[#2D3748]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-red-400" />
          <h3 className="text-sm font-bold text-white">{t('alerts.active')}</h3>
        </div>
        <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
          {recentAlerts.length}
        </span>
      </div>

      <div className="space-y-3">
        {recentAlerts.map((alert) => {
          const translatedRisk = alert.nivel === 'CRÍTICO' ? t('alerts.critical') : 
                                 alert.nivel === 'ALTO' ? t('alerts.high') :
                                 alert.nivel === 'MEDIO' ? t('alerts.medium') : t('alerts.low');
          
          return (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${getRiskColor(alert.nivel)} hover:bg-opacity-20 transition-all cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-sm text-white">{alert.estado}</p>
                <p className="text-xs opacity-75 flex items-center gap-1 mt-1">
                  <Clock size={12} />
                  {formatTime(alert.timestamp)}
                </p>
              </div>
              <span className="px-2 py-1 bg-[#0F1419] rounded text-xs font-bold flex items-center gap-1">
                <AlertTriangle size={12} />
                {translatedRisk}
              </span>
            </div>
            
            <p className="text-xs mb-2 text-slate-300">{alert.mensaje}</p>
            
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <MessageSquare size={12} />
                <span>{alert.enviado_a} SMS</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={12} />
                <span>{alert.enviado_a} Emails</span>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-[#2D3748]">
        <p className="text-xs text-slate-500 text-center">
          Powered by <span className="font-semibold text-orange-400">Amazon SNS</span>
        </p>
      </div>
    </div>
  );
}
