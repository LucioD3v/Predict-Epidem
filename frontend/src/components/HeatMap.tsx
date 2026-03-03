'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockStateData } from '@/lib/mexicoGeoData';
import { mexicoStatesGeoJSON } from '@/lib/mexicoStates';
import { useLanguage } from '@/contexts/LanguageContext'; 

const interpolateColor = (score: number): string => {
  const clampedScore = Math.max(0, Math.min(100, score * 100));
  
  if (clampedScore < 25) {
    return '#10B981'; // Verde - Bajo
  } else if (clampedScore < 50) {
    return '#F59E0B'; // Amarillo - Medio
  } else if (clampedScore < 75) {
    return '#EF4444'; // Rojo - Alto
  } else {
    return '#DC2626'; // Rojo oscuro - Crítico
  }
};

interface HeatMapProps {
  disease?: string;
  diseaseColor?: string;
}

const diseaseIcons: Record<string, string> = {
  dengue: '🦟',
  covid: '😷',
  influenza: '🤧',
  chikungunya: '🦟'
};

const diseaseStates: Record<string, string[]> = {
  dengue: ['Veracruz', 'Yucatán', 'Quintana Roo', 'Chiapas', 'Oaxaca'],
  covid: ['Ciudad de México', 'México', 'Jalisco', 'Nuevo León'],
  influenza: ['Chihuahua', 'Sonora', 'Baja California', 'Coahuila'],
  chikungunya: ['Guerrero', 'Michoacán', 'Colima']
};

const stateCoordinates: Record<string, [number, number]> = {
  'Veracruz': [19.5, -96.9],
  'Yucatán': [20.7, -89.1],
  'Quintana Roo': [19.6, -88.0],
  'Chiapas': [16.7, -93.1],
  'Oaxaca': [17.0, -96.7],
  'Ciudad de México': [19.4, -99.1],
  'México': [19.3, -99.7],
  'Jalisco': [20.7, -103.4],
  'Nuevo León': [25.7, -100.3],
  'Chihuahua': [28.6, -106.1],
  'Sonora': [29.3, -110.3],
  'Baja California': [30.8, -115.5],
  'Coahuila': [27.0, -101.5],
  'Guerrero': [17.5, -99.5],
  'Michoacán': [19.2, -101.9],
  'Colima': [19.2, -103.7]
};

export default function HeatMap({ disease = 'dengue', diseaseColor = '#EF4444' }: HeatMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [23.6345, -102.5528],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      touchZoom: true,
    });

    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '©OpenStreetMap, ©CartoDB',
      maxZoom: 19,
    }).addTo(map);

    const stateDataMap = new Map(mockStateData.map(d => [d.state, d]));

    const geoJsonLayer = L.geoJSON(mexicoStatesGeoJSON as any, {
      style: (feature) => {
        const stateName = feature?.properties?.name;
        const stateData = stateName ? stateDataMap.get(stateName) : null;
        const fillColor = stateData ? interpolateColor(stateData.riskScore) : '#4B5563';
        
        return {
          fillColor,
          fillOpacity: 0.6,
          color: '#1F2937',
          weight: 1,
          opacity: 0.8,
        };
      },
      onEachFeature: (feature, layer) => {
        const stateName = feature.properties.name;
        const stateData = stateDataMap.get(stateName);
        
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 2,
              color: '#fff',
              fillOpacity: 0.8
            });
          },
          mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
          },
          click: (e) => {
            const clickedState = feature.properties.name;
            setSelectedState(clickedState);
            map.fitBounds(e.target.getBounds());
          }
        });
        
        if (stateData) {
          const riskColor = interpolateColor(stateData.riskScore);
          const riskPercentage = (stateData.riskScore * 100).toFixed(0);
          const caseDifference = stateData.predicted - stateData.cases;
          const trend = caseDifference > 0 ? '↑' : caseDifference < 0 ? '↓' : '→';
          const trendColor = caseDifference > 0 ? '#EF4444' : caseDifference < 0 ? '#10B981' : '#F59E0B';
          
          layer.bindPopup(`
            <div style="color: #1A202C; font-family: system-ui; min-width: 220px; padding: 4px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <strong style="font-size: 18px; color: #1F2937;">${stateName}</strong>
                <span style="background: ${riskColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">
                  ${stateData.riskLevel}
                </span>
              </div>
              <hr style="margin: 8px 0; border: none; border-top: 1px solid #E5E7EB;"/>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0;">
                <div style="background: #F3F4F6; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 11px; color: #6B7280; margin-bottom: 2px;">Casos Actuales</div>
                  <div style="font-size: 16px; font-weight: bold; color: #1F2937;">${stateData.cases.toLocaleString()}</div>
                </div>
                <div style="background: #EEF2FF; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 11px; color: #6B7280; margin-bottom: 2px;">Predicción</div>
                  <div style="font-size: 16px; font-weight: bold; color: #4F46E5;">${stateData.predicted.toLocaleString()}</div>
                </div>
              </div>
              
              <div style="background: #FEF3C7; padding: 8px; border-radius: 6px; margin: 8px 0;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 12px; color: #92400E;">Tendencia</span>
                  <span style="font-size: 16px; font-weight: bold; color: ${trendColor};">
                    ${trend} ${Math.abs(caseDifference).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-size: 11px; color: #6B7280;">Nivel de Riesgo</span>
                  <span style="font-size: 12px; font-weight: bold; color: ${riskColor};">${riskPercentage}%</span>
                </div>
                <div style="height: 4px; background: #E5E7EB; border-radius: 2px; overflow: hidden;">
                  <div style="height: 100%; background: ${riskColor}; width: ${riskPercentage}%;"></div>
                </div>
              </div>
            </div>
          `, {
            maxWidth: 250,
            className: 'custom-popup'
          });
        }
      }
    }).addTo(map);

    // Agregar marcadores con emojis para estados afectados
    const affectedStates = diseaseStates[disease] || [];
    const icon = diseaseIcons[disease] || '🦟';
    
    affectedStates.forEach(stateName => {
      const coords = stateCoordinates[stateName];
      
      if (coords) {
        const diseaseIcon = L.divIcon({
          html: `<div style="font-size: 28px; text-shadow: 0 0 4px black, 0 0 8px ${diseaseColor};">${icon}</div>`,
          className: 'disease-marker',
          iconSize: [35, 35],
          iconAnchor: [17, 17]
        });
        
        L.marker(coords, { icon: diseaseIcon })
          .bindPopup(`<div style="text-align: center; font-family: system-ui; padding: 4px;">
            <div style="font-size: 32px; margin-bottom: 4px;">${icon}</div>
            <strong style="color: #1F2937; font-size: 14px;">${stateName}</strong><br/>
            <span style="font-size: 12px; color: ${diseaseColor}; font-weight: 600;">${disease.toUpperCase()}</span>
          </div>`)
          .addTo(map);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [disease, diseaseColor]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      
      {selectedState && (
        <div className="absolute top-4 right-4 bg-card-bg border border-border rounded-lg p-3 shadow-lg z-[1000]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-text-primary">{selectedState}</h4>
            <button 
              onClick={() => setSelectedState(null)}
              className="text-text-secondary hover:text-text-primary"
            >
              ✕
            </button>
          </div>
          {mockStateData.find(s => s.state === selectedState) && (
            <div className="text-xs text-text-secondary">
              <p>Casos: {mockStateData.find(s => s.state === selectedState)?.cases.toLocaleString()}</p>
              <p>Predicción: {mockStateData.find(s => s.state === selectedState)?.predicted.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 bg-card-bg border border-border rounded-lg p-3 shadow-lg z-[1000]">
        <h4 className="text-xs font-semibold text-text-primary mb-2">{t('map.legend.risk')}</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#DC2626' }}></div>
            <span className="text-xs text-text-secondary">{t('map.legend.critical')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }}></div>
            <span className="text-xs text-text-secondary">{t('map.legend.high')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
            <span className="text-xs text-text-secondary">{t('map.legend.medium')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
            <span className="text-xs text-text-secondary">{t('map.legend.low')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
