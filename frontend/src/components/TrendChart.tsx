'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { EstadoMexico } from '@/lib/mockDataMexico';
import { useLanguage } from '@/contexts/LanguageContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendChartProps {
  estado: EstadoMexico;
}

export default function TrendChart({ estado }: TrendChartProps) {
  const { t } = useLanguage();
  
  // Generar datos históricos simulados (últimas 8 semanas)
  const generateHistoricalData = () => {
    const weeks = [];
    const actual = [];
    const current = estado.casos_actuales;
    
    for (let i = 8; i >= 1; i--) {
      weeks.push(`-${i}w`);
      // Simular tendencia creciente
      const variance = Math.random() * 0.2 - 0.1; // ±10%
      actual.push(Math.round(current * (0.7 + (8 - i) * 0.04) * (1 + variance)));
    }
    
    return { weeks, actual };
  };

  const historical = generateHistoricalData();

  const data = {
    labels: [
      ...historical.weeks,
      'Actual',
      '+1w',
      '+2w',
      '+3w',
      '+4w'
    ],
    datasets: [
      {
        label: 'Casos Confirmados',
        data: [
          ...historical.actual,
          estado.casos_actuales,
          null,
          null,
          null,
          null
        ],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Predicción (P50)',
        data: [
          ...Array(historical.weeks.length).fill(null),
          estado.casos_actuales,
          ...estado.predicciones_semanales.map(p => p.casos_p50)
        ],
        borderColor: '#A855F7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Límite Superior (P90)',
        data: [
          ...Array(historical.weeks.length).fill(null),
          estado.casos_actuales,
          ...estado.predicciones_semanales.map(p => p.casos_p90)
        ],
        borderColor: 'rgba(239, 68, 68, 0.3)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderDash: [2, 2],
        tension: 0.4,
        borderWidth: 1,
        pointRadius: 0,
        fill: '+1'
      },
      {
        label: 'Límite Inferior (P10)',
        data: [
          ...Array(historical.weeks.length).fill(null),
          estado.casos_actuales,
          ...estado.predicciones_semanales.map(p => p.casos_p10)
        ],
        borderColor: 'rgba(34, 197, 94, 0.3)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderDash: [2, 2],
        tension: 0.4,
        borderWidth: 1,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 11
          },
          color: '#A0AEC0',
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: '#1A1F2E',
        titleColor: '#F7FAFC',
        bodyColor: '#A0AEC0',
        borderColor: '#2D3748',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            if (context.parsed.y === null) return '';
            return `${context.dataset.label}: ${context.parsed.y} casos`;
          }
        }
      },
      title: {
        display: true,
        text: 'Tendencia Histórica y Predicción (8 semanas atrás + 4 adelante)',
        color: '#A0AEC0',
        font: {
          size: 12,
          weight: 'normal' as const
        },
        padding: {
          bottom: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#A0AEC0',
          font: {
            size: 10
          }
        },
        title: {
          display: true,
          text: 'Casos Confirmados',
          color: '#A0AEC0',
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#A0AEC0',
          font: {
            size: 10
          }
        },
        title: {
          display: true,
          text: 'Semanas',
          color: '#A0AEC0',
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
}
