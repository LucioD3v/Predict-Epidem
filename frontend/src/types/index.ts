export type RiskLevel = 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
export type Trend = 'ESTABLE' | 'CRECIENTE' | 'DECRECIENTE';

export interface Prediction {
  disease: string;
  current_cases: number;
  predicted_cases: number;
  risk_level: RiskLevel;
  risk_score: number;
  trend: Trend;
  timestamp: string;
  horizon_weeks: number;
}

export interface ApiResponse {
  predictions: Prediction[];
}
