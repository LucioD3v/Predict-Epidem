'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    // Header
    'header.title': 'Predict-Epidem',
    'header.subtitle': 'Inteligencia Epidemiológica',
    'header.export': 'Exportar',
    
    // Home
    'home.dashboard': 'Nuevo Dashboard Interactivo',
    'home.dashboardDesc': 'Mapa de calor + Gráficas de tendencias',
    'home.states': 'Estados Monitoreados',
    'home.alerts': 'Alertas Activas',
    'home.current': 'Casos Actuales',
    'home.prediction': 'Predicción Semana 4',
    'home.increase': 'Aumento Esperado',
    'home.analysis': 'Análisis de Tendencias',
    'home.temperature': 'Temperatura',
    'home.humidity': 'Humedad',
    'home.precipitation': 'Precipitación',
    
    // Metrics Panel
    'metrics.thisWeek': 'Esta semana',
    'metrics.confirmed': 'Casos confirmados',
    'metrics.week4': 'Semana 4',
    'metrics.predicted': 'Casos predichos',
    'metrics.trend': 'Tendencia',
    'metrics.avgIncrease': 'Aumento promedio',
    'metrics.alerts': 'Alertas',
    'metrics.highRisk': 'Estados en riesgo alto',
    'metrics.excellent': 'Excelente',
    'metrics.modelAccuracy': 'Precisión del modelo',
    
    // Alerts
    'alerts.active': 'Alertas Activas',
    'alerts.outbreak': 'Brote predicho',
    'alerts.cases': 'casos',
    'alerts.weeks': 'semanas',
    'alerts.critical': 'CRÍTICO',
    'alerts.high': 'ALTO',
    'alerts.medium': 'MEDIO',
    'alerts.low': 'BAJO',
    
    // Diseases
    'disease.dengue': 'Dengue',
    'disease.covid': 'COVID-19',
    'disease.influenza': 'Influenza',
    'disease.chikungunya': 'Chikungunya',
    'disease.select': 'Seleccionar Enfermedad',
    
    // Metrics
    'metrics.current': 'Casos Actuales',
    'metrics.prediction': 'Predicción 4 Sem',
    'metrics.states': 'Estados Afectados',
    'metrics.accuracy': 'Precisión',
    'metrics.districts': 'Distritos',
    'metrics.highAlert': 'Alta Alerta',
    
    // Map
    'map.title': 'Mapa de Riesgo',
    'map.today': 'Hoy',
    'map.legend.critical': 'Crítico (75-100%)',
    'map.legend.high': 'Alto (50-75%)',
    'map.legend.medium': 'Medio (25-50%)',
    'map.legend.low': 'Bajo (0-25%)',
    'map.legend.risk': 'Nivel de Riesgo',
    
    // Charts
    'chart.weekly': 'Tendencia Semanal',
    'chart.prediction': 'Predicción',
    'chart.historical': 'Histórico',
    
    // Top 5
    'top5.title': 'Top 5 Alto Riesgo',
    'top5.cases': 'casos',
    
    // Common
    'common.week': 'Sem',
    'common.cases': 'Casos',
    'common.predicted': 'Predicción',
  },
  en: {
    // Header
    'header.title': 'Predict-Epidem',
    'header.subtitle': 'Epidemiological Intelligence',
    'header.export': 'Export',
    
    // Home
    'home.dashboard': 'New Interactive Dashboard',
    'home.dashboardDesc': 'Heat map + Trend charts',
    'home.states': 'Monitored States',
    'home.alerts': 'Active Alerts',
    'home.current': 'Current Cases',
    'home.prediction': 'Week 4 Forecast',
    'home.increase': 'Expected Increase',
    'home.analysis': 'Trend Analysis',
    'home.temperature': 'Temperature',
    'home.humidity': 'Humidity',
    'home.precipitation': 'Precipitation',
    
    // Metrics Panel
    'metrics.thisWeek': 'This week',
    'metrics.confirmed': 'Confirmed cases',
    'metrics.week4': 'Week 4',
    'metrics.predicted': 'Predicted cases',
    'metrics.trend': 'Trend',
    'metrics.avgIncrease': 'Average increase',
    'metrics.alerts': 'Alerts',
    'metrics.highRisk': 'High risk states',
    'metrics.excellent': 'Excellent',
    'metrics.modelAccuracy': 'Model accuracy',
    
    // Alerts
    'alerts.active': 'Active Alerts',
    'alerts.outbreak': 'Predicted outbreak',
    'alerts.cases': 'cases',
    'alerts.weeks': 'weeks',
    'alerts.critical': 'CRITICAL',
    'alerts.high': 'HIGH',
    'alerts.medium': 'MEDIUM',
    'alerts.low': 'LOW',
    
    // Diseases
    'disease.dengue': 'Dengue',
    'disease.covid': 'COVID-19',
    'disease.influenza': 'Influenza',
    'disease.chikungunya': 'Chikungunya',
    'disease.select': 'Select Disease',
    
    // Metrics
    'metrics.current': 'Current Cases',
    'metrics.prediction': '4 Week Forecast',
    'metrics.states': 'Affected States',
    'metrics.accuracy': 'Accuracy',
    'metrics.districts': 'Districts',
    'metrics.highAlert': 'High Alert',
    
    // Map
    'map.title': 'Risk Map',
    'map.today': 'Today',
    'map.legend.critical': 'Critical (75-100%)',
    'map.legend.high': 'High (50-75%)',
    'map.legend.medium': 'Medium (25-50%)',
    'map.legend.low': 'Low (0-25%)',
    'map.legend.risk': 'Risk Level',
    
    // Charts
    'chart.weekly': 'Weekly Trend',
    'chart.prediction': 'Forecast',
    'chart.historical': 'Historical',
    
    // Top 5
    'top5.title': 'Top 5 High Risk',
    'top5.cases': 'cases',
    
    // Common
    'common.week': 'Week',
    'common.cases': 'Cases',
    'common.predicted': 'Forecast',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.es] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
