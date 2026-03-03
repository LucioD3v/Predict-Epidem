'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '@/lib/LanguageContext';
import { Region, regions } from '@/lib/regions';

// Fix para iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  selectedRegion: Region;
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap({ selectedRegion }: InteractiveMapProps) {
  const { t } = useLanguage();

  // Generar datos de riesgo simulados para cada región
  const getRegionRisk = (region: Region) => {
    // Riesgos específicos por región
    const specificRisks: Record<string, { risk: 'low' | 'medium' | 'high', cases: number }> = {
      // ALTO
      'manaus': { risk: 'high', cases: 342 },
      'guayaquil': { risk: 'high', cases: 289 },
      'cancun': { risk: 'high', cases: 267 },
      'panama': { risk: 'high', cases: 234 },
      
      // MEDIO
      'veracruz': { risk: 'medium', cases: 178 },
      'cali': { risk: 'medium', cases: 156 },
      'riodejaneiro': { risk: 'medium', cases: 143 },
      'caracas': { risk: 'medium', cases: 129 },
      'lima': { risk: 'medium', cases: 112 },
      
      // BAJO
      'santiago': { risk: 'low', cases: 23 },
      'cdmx': { risk: 'low', cases: 34 },
      'monterrey': { risk: 'low', cases: 28 },
      'buenosaires': { risk: 'low', cases: 19 },
      'cordoba': { risk: 'low', cases: 15 },
    };
    
    // Si tiene riesgo específico, usarlo
    if (specificRisks[region.id]) {
      return specificRisks[region.id];
    }
    
    // Si no, generar aleatorio
    const risks = ['low', 'medium', 'high'] as const;
    const randomRisk = risks[Math.floor(Math.random() * risks.length)];
    const cases = randomRisk === 'high' ? Math.floor(Math.random() * 300) + 200 
                : randomRisk === 'medium' ? Math.floor(Math.random() * 150) + 50
                : Math.floor(Math.random() * 50);
    return { risk: randomRisk, cases };
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return t('high');
      case 'medium': return t('medium');
      case 'low': return t('low');
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative z-0">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🗺️</span>
        <h3 className="text-sm font-bold text-slate-900">{t('riskMap')}</h3>
      </div>

      <div className="h-80 rounded-lg overflow-hidden border border-slate-200 relative z-0">
        <MapContainer
          center={[selectedRegion.lat, selectedRegion.lng]}
          zoom={5}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <MapUpdater center={[selectedRegion.lat, selectedRegion.lng]} zoom={10} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Mostrar TODAS las regiones */}
          {regions.map((region) => {
            const { risk, cases } = getRegionRisk(region);
            const isSelected = region.id === selectedRegion.id;
            
            return (
              <div key={region.id}>
                <Circle
                  center={[region.lat, region.lng]}
                  radius={50000}
                  pathOptions={{
                    color: getRiskColor(risk),
                    fillColor: getRiskColor(risk),
                    fillOpacity: isSelected ? 0.5 : 0.3,
                    weight: isSelected ? 3 : 2,
                  }}
                />
                <Marker position={[region.lat, region.lng]}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{region.name}</p>
                      <p>{getRiskLabel(risk)} - {cases} {t('cases')}</p>
                      {isSelected && <p className="text-blue-600 text-xs mt-1">📍 Región seleccionada</p>}
                    </div>
                  </Popup>
                </Marker>
              </div>
            );
          })}
        </MapContainer>
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-slate-600">{t('low')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span className="text-slate-600">{t('medium')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-slate-600">{t('high')}</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 italic text-center">
        * Mapa de Latinoamérica con {regions.length} {t('monitoredRegions')}
      </p>
    </div>
  );
}
