'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EstadoMexico } from '@/lib/mockDataMexico';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapaMexicoProps {
  estados: EstadoMexico[];
  selectedEstado?: EstadoMexico;
  onEstadoClick?: (estado: EstadoMexico) => void;
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapaMexico({ estados, selectedEstado, onEstadoClick }: MapaMexicoProps) {
  const getRiskColor = (riesgo: string) => {
    switch (riesgo) {
      case 'CRÍTICO': return '#dc2626';
      case 'ALTO': return '#ea580c';
      case 'MEDIO': return '#eab308';
      case 'BAJO': return '#16a34a';
      default: return '#64748b';
    }
  };

  const getRiskRadius = (riesgo: string) => {
    switch (riesgo) {
      case 'CRÍTICO': return 80000;
      case 'ALTO': return 60000;
      case 'MEDIO': return 40000;
      case 'BAJO': return 25000;
      default: return 20000;
    }
  };

  const center: [number, number] = selectedEstado 
    ? [selectedEstado.lat, selectedEstado.lng]
    : [23.6345, -102.5528]; // Centro de México

  const zoom = selectedEstado ? 7 : 5;

  return (
    <div className="bg-[#1A1F2E] rounded-lg p-4 border border-[#2D3748] relative z-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗺️</span>
          <h3 className="text-sm font-bold text-white">Mapa de Riesgo - México</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-slate-400">Crítico</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-slate-400">Alto</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-slate-400">Medio</span>
          </div>
        </div>
      </div>

      <div className="h-96 rounded-lg overflow-hidden border border-[#2D3748] relative z-0 touch-pan-y">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom={false}
          zoomControl={true}
          dragging={true}
          touchZoom={true}
        >
          <MapUpdater center={center} zoom={zoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {estados.map((estado) => (
            <CircleMarker
              key={estado.id}
              center={[estado.lat, estado.lng]}
              radius={15}
              pathOptions={{
                fillColor: getRiskColor(estado.riesgo),
                fillOpacity: 0.7,
                color: getRiskColor(estado.riesgo),
                weight: selectedEstado?.id === estado.id ? 3 : 1,
                opacity: 1
              }}
              eventHandlers={{
                click: () => onEstadoClick?.(estado)
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h4 className="font-bold text-sm mb-2">{estado.name}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Riesgo:</span>
                      <span className={`font-semibold ${
                        estado.riesgo === 'CRÍTICO' ? 'text-red-600' :
                        estado.riesgo === 'ALTO' ? 'text-orange-600' :
                        estado.riesgo === 'MEDIO' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {estado.riesgo}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Casos actuales:</span>
                      <span className="font-semibold">{estado.casos_actuales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Predicción (4 sem):</span>
                      <span className="font-semibold">{estado.casos_predichos_semana4}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Aumento:</span>
                      <span className="font-semibold text-red-600">+{estado.aumento_porcentaje}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tendencia:</span>
                      <span className="font-semibold">{estado.tendencia}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      🌡️ {estado.clima.temperatura}°C | 💧 {estado.clima.humedad}% | 🌧️ {estado.clima.precipitacion}mm
                    </p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-3 text-xs text-slate-500 text-center">
        Predicciones generadas con <span className="font-semibold text-purple-400">SageMaker Canvas</span> | Datos de <span className="font-semibold text-blue-400">SINAVE</span>
      </div>
    </div>
  );
}
