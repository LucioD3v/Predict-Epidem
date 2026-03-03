'use client';

import { Download, Settings, Globe } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeaderBar() {
  const { language, setLanguage, t } = useLanguage();
  
  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    console.log(`Exportando como ${format}...`);
  };

  return (
    <header className="h-16 bg-secondary border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-lg md:text-xl shadow-lg">
          🦟
        </div>
        <div className="hidden sm:block">
          <h1 className="text-base md:text-lg font-bold text-text-primary">{t('header.title')}</h1>
          <p className="text-xs text-text-secondary hidden md:block">{t('header.subtitle')}</p>
        </div>
        </a>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1">
          <button
            onClick={() => setLanguage('es')}
            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
              language === 'es' ? 'bg-blue-600 text-white' : 'text-text-secondary hover:bg-hover-bg'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
              language === 'en' ? 'bg-blue-600 text-white' : 'text-text-secondary hover:bg-hover-bg'
            }`}
          >
            EN
          </button>
        </div>

        <div className="relative group hidden md:block">
          <button className="px-3 md:px-4 py-2 bg-secondary hover:bg-tertiary border border-border rounded-lg flex items-center gap-2 text-sm text-text-secondary transition-all">
            <Download size={16} />
            <span className="hidden lg:inline">{t('header.export')}</span>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-card-bg border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button
              onClick={() => handleExport('csv')}
              className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-hover-bg first:rounded-t-lg"
            >
              📄 CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-hover-bg"
            >
              📋 JSON
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-hover-bg last:rounded-b-lg"
            >
              📑 PDF Report
            </button>
          </div>
        </div>

        <ThemeToggle />
        <MobileMenu />
      </div>
    </header>
  );
}
