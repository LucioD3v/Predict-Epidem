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

interface PredictionChartProps {
  estado: EstadoMexico;
}

export default function PredictionChart({ estado }: PredictionChartProps) {
  const data = {
    labels: ['Actual', 'Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
      {
        label: 'Predicción (P50)',
        data: [
          estado.casos_actuales,
          ...estado.predicciones_semanales.map(p => p.casos_p50)
        ],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Límite Superior (P90)',
        data: [
          estado.casos_actuales,
          ...estado.predicciones_semanales.map(p => p.casos_p90)
        ],
        borderColor: 'rgba(239, 68, 68, 0.3)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: '+1'
      },
      {
        label: 'Límite Inferior (P10)',
        data: [
          estado.casos_actuales,
          ...estado.predicciones_semanales.map(p => p.casos_p10)
        ],
        borderColor: 'rgba(34, 197, 94, 0.3)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 11
          },
          color: '#A0AEC0',
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#1A1F2E',
        titleColor: '#F7FAFC',
        bodyColor: '#A0AEC0',
        borderColor: '#2D3748',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} casos`;
          }
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
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}
