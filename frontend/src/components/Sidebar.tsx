'use client';

import { Cloud, Database, Zap, Activity, BarChart3, Users } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Sidebar() {
  const { t } = useLanguage();
  
  const services = [
    { name: 'Amazon S3', icon: Database, desc: 'Data Lake', color: 'from-green-500 to-emerald-600' },
    { name: 'AWS Lambda', icon: Zap, desc: 'API Serverless', color: 'from-orange-500 to-red-600' },
    { name: 'API Gateway', icon: Activity, desc: 'REST Endpoint', color: 'from-purple-500 to-pink-600' },
    { name: 'AWS Amplify', icon: Cloud, desc: 'Hosting', color: 'from-blue-500 to-cyan-600' },
    { name: 'CloudWatch', icon: BarChart3, desc: 'Monitoring', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <aside className="w-72 h-full bg-white border-r border-slate-200 p-6 shadow-sm overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Cloud size={18} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">{t('awsServices')}</h2>
        </div>
        <p className="text-xs text-slate-500">{t('servicesUsed')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3 mb-6 lg:mb-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.name} className="group flex items-start gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className={`p-2 lg:p-2.5 bg-gradient-to-br ${service.color} rounded-lg shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}>
                <Icon size={16} className="text-white lg:w-[18px] lg:h-[18px]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs lg:text-sm font-semibold text-slate-900 truncate">{service.name}</p>
                <p className="text-xs text-slate-500 hidden lg:block">{service.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6 lg:mb-8 p-3 lg:p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">🤖</span>
          </div>
          <p className="text-xs font-bold text-slate-900">{t('machineLearning')}</p>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t('mlDescription')}
        </p>
      </div>

      <div className="p-3 lg:p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-slate-700" />
          <h3 className="text-sm lg:text-base font-bold text-slate-900">{t('team')}</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">💡 {t('ideaBy')}</p>
            <p className="text-xs lg:text-sm font-bold text-slate-900">Vicente G Guzmán</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">🤝 {t('collaborators')}</p>
            <p className="text-xs lg:text-sm font-bold text-slate-900">Emiliano Martínez, Fernando Silva</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
