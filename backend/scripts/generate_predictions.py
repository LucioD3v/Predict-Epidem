#!/usr/bin/env python3
"""
Generador de Predicciones Multi-Enfermedad
Genera predicciones para todas las enfermedades disponibles
"""

import json
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime

# Configuración
MODELS_DIR = Path('models')
PREDICTIONS_DIR = Path('predictions')
PREDICTIONS_DIR.mkdir(exist_ok=True)

print("🔮 Generando Predicciones Multi-Enfermedad...")

# Cargar dataset
df = pd.read_csv('data/processed/multi_disease_dataset.csv')
df['date'] = pd.to_datetime(df['date'])

# Resultados
all_predictions = []

# Generar predicciones para cada enfermedad
for model_file in MODELS_DIR.glob('*_predictor.pkl'):
    print(f"\n{'='*60}")
    
    # Cargar modelo
    model_data = joblib.load(model_file)
    model = model_data['model']
    features = model_data['features']
    disease = model_data['disease']
    
    print(f"🦠 {disease}")
    
    # Filtrar datos de la enfermedad
    disease_data = df[df['disease'] == disease].copy()
    
    if len(disease_data) == 0:
        print(f"⚠️  No hay datos disponibles")
        continue
    
    # Últimos datos
    latest = disease_data.tail(1)
    
    # Verificar que tenemos todas las features
    missing_features = [f for f in features if f not in latest.columns]
    if missing_features:
        print(f"⚠️  Features faltantes: {missing_features}")
        continue
    
    X = latest[features]
    
    # Predecir
    prediction = model.predict(X)[0]
    prediction = max(0, int(prediction))  # No puede ser negativo
    
    # Datos actuales
    current_cases = int(latest['cases'].values[0])
    current_date = latest['date'].values[0]
    
    # Calcular nivel de riesgo
    # Basado en múltiples factores
    historical_mean = disease_data['cases'].mean()
    historical_std = disease_data['cases'].std()
    
    # Factor 1: Z-score de la predicción
    z_score = (prediction - historical_mean) / (historical_std + 1e-6)
    
    # Factor 2: Cambio porcentual respecto a casos actuales
    change_pct = ((prediction - current_cases) / (current_cases + 1)) * 100
    
    # Factor 3: Magnitud absoluta de casos predichos
    # Umbrales por enfermedad
    thresholds = {
        'COVID-19': {'critico': 100, 'alto': 50, 'medio': 20},
        'Dengue': {'critico': 10000, 'alto': 5000, 'medio': 2000},
        'Influenza': {'critico': 1000, 'alto': 500, 'medio': 200},
        'Chikungunya': {'critico': 50, 'alto': 20, 'medio': 10},
        'Zika': {'critico': 20, 'alto': 10, 'medio': 5}
    }
    
    disease_thresholds = thresholds.get(disease, {'critico': 100, 'alto': 50, 'medio': 20})
    
    # Determinar riesgo combinando factores
    if prediction >= disease_thresholds['critico'] or z_score > 2 or change_pct > 100:
        risk_level = "CRÍTICO"
        risk_score = 0.9
    elif prediction >= disease_thresholds['alto'] or z_score > 1 or change_pct > 50:
        risk_level = "ALTO"
        risk_score = 0.7
    elif prediction >= disease_thresholds['medio'] or z_score > 0 or change_pct > 20:
        risk_level = "MEDIO"
        risk_score = 0.5
    else:
        risk_level = "BAJO"
        risk_score = 0.3
    
    # Tendencia
    if prediction > current_cases * 1.2:
        trend = "CRECIENTE"
    elif prediction < current_cases * 0.8:
        trend = "DECRECIENTE"
    else:
        trend = "ESTABLE"
    
    # Crear resultado
    result = {
        'disease': disease,
        'timestamp': datetime.now().isoformat(),
        'region': 'Veracruz, México',
        'current_date': str(current_date)[:10],
        'current_cases': current_cases,
        'predicted_cases': prediction,
        'prediction_horizon_weeks': 4,
        'risk_level': risk_level,
        'risk_score': float(risk_score),
        'trend': trend,
        'historical_mean': float(historical_mean),
        'historical_std': float(historical_std),
        'model_metrics': model_data['metrics']
    }
    
    all_predictions.append(result)
    
    # Mostrar resultado
    print(f"   Casos actuales: {current_cases}")
    print(f"   Predicción (4 sem): {prediction}")
    print(f"   Cambio: {prediction - current_cases:+d} ({((prediction/current_cases - 1)*100):+.1f}%)")
    print(f"   Riesgo: {risk_level} ({risk_score:.0%})")
    print(f"   Tendencia: {trend}")

# ============================================================================
# GUARDAR RESULTADOS
# ============================================================================
print(f"\n{'='*60}")
print("💾 Guardando resultados...")

# Guardar predicciones individuales
for pred in all_predictions:
    disease_name = pred['disease'].lower().replace('-', '_').replace(' ', '_')
    filename = PREDICTIONS_DIR / f'{disease_name}_prediction.json'
    
    with open(filename, 'w') as f:
        json.dump(pred, f, indent=2)
    
    print(f"✅ {pred['disease']}: {filename}")

# Guardar predicciones consolidadas
consolidated = {
    'timestamp': datetime.now().isoformat(),
    'region': 'Veracruz, México',
    'diseases': all_predictions,
    'summary': {
        'total_diseases': len(all_predictions),
        'critical_alerts': sum(1 for p in all_predictions if p['risk_level'] == 'CRÍTICO'),
        'high_alerts': sum(1 for p in all_predictions if p['risk_level'] == 'ALTO'),
    }
}

with open(PREDICTIONS_DIR / 'all_predictions.json', 'w') as f:
    json.dump(consolidated, f, indent=2)

print(f"\n✅ Predicciones consolidadas: {PREDICTIONS_DIR / 'all_predictions.json'}")

# ============================================================================
# RESUMEN
# ============================================================================
print(f"\n{'='*60}")
print("📊 RESUMEN DE PREDICCIONES")
print('='*60)

summary_df = pd.DataFrame(all_predictions)[
    ['disease', 'current_cases', 'predicted_cases', 'risk_level', 'trend']
]
print(summary_df.to_string(index=False))

print(f"\n🚨 Alertas:")
print(f"   Críticas: {consolidated['summary']['critical_alerts']}")
print(f"   Altas: {consolidated['summary']['high_alerts']}")

print(f"\n✅ Predicciones generadas exitosamente!")
