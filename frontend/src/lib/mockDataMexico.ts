// Datos de muestra para demo - México Dengue Prediction

export interface EstadoMexico {
  id: string;
  name: string;
  lat: number;
  lng: number;
  casos_actuales: number;
  casos_predichos_semana4: number;
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
  tendencia: 'ESTABLE' | 'CRECIENTE' | 'DECRECIENTE';
  aumento_porcentaje: number;
  predicciones_semanales: {
    semana: number;
    casos_p50: number;
    casos_p10: number;
    casos_p90: number;
  }[];
  clima: {
    temperatura: number;
    humedad: number;
    precipitacion: number;
  };
  bounds?: [number, number][];  // Coordenadas del polígono (simplificadas)
}

export const estadosMexico: EstadoMexico[] = [
  {
    id: 'veracruz',
    name: 'Veracruz',
    lat: 19.1738,
    lng: -96.1342,
    casos_actuales: 342,
    casos_predichos_semana4: 450,
    riesgo: 'CRÍTICO',
    tendencia: 'CRECIENTE',
    aumento_porcentaje: 132,
    predicciones_semanales: [
      { semana: 1, casos_p50: 365, casos_p10: 320, casos_p90: 410 },
      { semana: 2, casos_p50: 395, casos_p10: 345, casos_p90: 445 },
      { semana: 3, casos_p50: 420, casos_p10: 365, casos_p90: 475 },
      { semana: 4, casos_p50: 450, casos_p10: 390, casos_p90: 510 }
    ],
    clima: {
      temperatura: 28.5,
      humedad: 82,
      precipitacion: 185
    },
    bounds: [
      [20.5, -98.5], [20.5, -95.0], [19.5, -94.5], [18.0, -94.5],
      [17.5, -95.0], [18.0, -96.5], [19.0, -97.5], [20.0, -98.0], [20.5, -98.5]
    ]
  },
  {
    id: 'guerrero',
    name: 'Guerrero',
    lat: 17.5516,
    lng: -99.5047,
    casos_actuales: 289,
    casos_predichos_semana4: 410,
    riesgo: 'ALTO',
    tendencia: 'CRECIENTE',
    aumento_porcentaje: 142,
    predicciones_semanales: [
      { semana: 1, casos_p50: 310, casos_p10: 275, casos_p90: 345 },
      { semana: 2, casos_p50: 345, casos_p10: 305, casos_p90: 385 },
      { semana: 3, casos_p50: 375, casos_p10: 330, casos_p90: 420 },
      { semana: 4, casos_p50: 410, casos_p10: 360, casos_p90: 460 }
    ],
    clima: {
      temperatura: 29.2,
      humedad: 78,
      precipitacion: 210
    }
  },
  {
    id: 'chiapas',
    name: 'Chiapas',
    lat: 16.7569,
    lng: -93.1292,
    casos_actuales: 234,
    casos_predichos_semana4: 320,
    riesgo: 'ALTO',
    tendencia: 'CRECIENTE',
    aumento_porcentaje: 137,
    predicciones_semanales: [
      { semana: 1, casos_p50: 255, casos_p10: 225, casos_p90: 285 },
      { semana: 2, casos_p50: 280, casos_p10: 245, casos_p90: 315 },
      { semana: 3, casos_p50: 300, casos_p10: 265, casos_p90: 335 },
      { semana: 4, casos_p50: 320, casos_p10: 280, casos_p90: 360 }
    ],
    clima: {
      temperatura: 27.8,
      humedad: 85,
      precipitacion: 230
    }
  },
  {
    id: 'yucatan',
    name: 'Yucatán',
    lat: 20.9674,
    lng: -89.5926,
    casos_actuales: 178,
    casos_predichos_semana4: 215,
    riesgo: 'MEDIO',
    tendencia: 'CRECIENTE',
    aumento_porcentaje: 121,
    predicciones_semanales: [
      { semana: 1, casos_p50: 185, casos_p10: 165, casos_p90: 205 },
      { semana: 2, casos_p50: 195, casos_p10: 175, casos_p90: 215 },
      { semana: 3, casos_p50: 205, casos_p10: 180, casos_p90: 230 },
      { semana: 4, casos_p50: 215, casos_p10: 190, casos_p90: 240 }
    ],
    clima: {
      temperatura: 28.0,
      humedad: 79,
      precipitacion: 165
    }
  },
  {
    id: 'quintanaroo',
    name: 'Quintana Roo',
    lat: 21.1619,
    lng: -86.8515,
    casos_actuales: 156,
    casos_predichos_semana4: 185,
    riesgo: 'MEDIO',
    tendencia: 'CRECIENTE',
    aumento_porcentaje: 119,
    predicciones_semanales: [
      { semana: 1, casos_p50: 165, casos_p10: 145, casos_p90: 185 },
      { semana: 2, casos_p50: 172, casos_p10: 150, casos_p90: 194 },
      { semana: 3, casos_p50: 178, casos_p10: 155, casos_p90: 201 },
      { semana: 4, casos_p50: 185, casos_p10: 160, casos_p90: 210 }
    ],
    clima: {
      temperatura: 27.5,
      humedad: 80,
      precipitacion: 170
    }
  }
];

// Métricas del modelo SageMaker Canvas
export const modelMetrics = {
  wape: 0.12,
  mape: 0.15,
  rmse: 42.3,
  algorithm: 'DeepAR+',
  training_time: '3.2 horas',
  last_updated: '2026-02-27T14:00:00Z'
};

// Alertas recientes
export const recentAlerts = [
  {
    id: 'alert-001',
    estado: 'Veracruz',
    nivel: 'CRÍTICO',
    timestamp: '2026-02-27T14:30:00Z',
    mensaje: 'Brote predicho: 450 casos en 4 semanas (+132%)',
    enviado_a: 15
  },
  {
    id: 'alert-002',
    estado: 'Guerrero',
    nivel: 'ALTO',
    timestamp: '2026-02-27T14:30:00Z',
    mensaje: 'Brote predicho: 410 casos en 4 semanas (+142%)',
    enviado_a: 12
  },
  {
    id: 'alert-003',
    estado: 'Chiapas',
    nivel: 'ALTO',
    timestamp: '2026-02-27T14:30:00Z',
    mensaje: 'Brote predicho: 320 casos en 4 semanas (+137%)',
    enviado_a: 10
  }
];
