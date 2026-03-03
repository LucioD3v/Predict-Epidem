#!/usr/bin/env python3
"""
Entrenamiento de Modelos Multi-Enfermedad
Entrena un modelo Random Forest para cada enfermedad
"""

import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Configuración
MODELS_DIR = Path('models')
MODELS_DIR.mkdir(exist_ok=True)

print("🤖 Entrenando Modelos Multi-Enfermedad...")

# Cargar dataset
df = pd.read_csv('data/processed/multi_disease_dataset.csv')

# Features base (siempre disponibles)
base_features = ['cases_lag_1', 'cases_lag_2', 'cases_lag_4', 'cases_ma_4w']

# Features climáticas (si están disponibles)
climate_features = []
if 'temp_ma_4w' in df.columns:
    climate_features.extend(['temp_ma_4w', 'precip_sum_4w', 'humidity_ma_4w'])
    print(f"   ✅ Usando features climáticas")

features = base_features + climate_features

print(f"\n📊 Features utilizadas: {features}")

# Entrenar modelo para cada enfermedad
results = {}

for disease in df['disease'].unique():
    print(f"\n{'='*60}")
    print(f"🦠 Entrenando modelo para: {disease}")
    print('='*60)
    
    # Filtrar datos de la enfermedad
    disease_data = df[df['disease'] == disease].copy()
    
    # Verificar que hay suficientes datos
    if len(disease_data) < 20:
        print(f"⚠️  Datos insuficientes ({len(disease_data)} registros). Mínimo: 20")
        continue
    
    # Preparar features y target
    X = disease_data[features]
    y = disease_data['cases']
    
    print(f"📈 Datos: {len(X)} registros")
    print(f"   Período: {disease_data['date'].min()} a {disease_data['date'].max()}")
    print(f"   Casos promedio: {y.mean():.1f} ± {y.std():.1f}")
    
    # Split train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, shuffle=False  # No shuffle para series temporales
    )
    
    # Entrenar modelo
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Predicciones
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    
    # Métricas
    mae_train = mean_absolute_error(y_train, y_pred_train)
    mae_test = mean_absolute_error(y_test, y_pred_test)
    rmse_test = np.sqrt(mean_squared_error(y_test, y_pred_test))
    r2_train = r2_score(y_train, y_pred_train)
    r2_test = r2_score(y_test, y_pred_test)
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
    
    print(f"\n📊 Métricas:")
    print(f"   MAE Train: {mae_train:.2f}")
    print(f"   MAE Test:  {mae_test:.2f}")
    print(f"   RMSE Test: {rmse_test:.2f}")
    print(f"   R² Train:  {r2_train:.3f}")
    print(f"   R² Test:   {r2_test:.3f}")
    print(f"   R² CV:     {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
    
    # Feature importance
    importance = pd.DataFrame({
        'feature': features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print(f"\n🔍 Feature Importance:")
    for _, row in importance.iterrows():
        print(f"   {row['feature']:20s}: {row['importance']:.3f}")
    
    # Guardar modelo
    model_filename = disease.lower().replace('-', '_').replace(' ', '_')
    model_path = MODELS_DIR / f'{model_filename}_predictor.pkl'
    
    joblib.dump({
        'model': model,
        'features': features,
        'disease': disease,
        'metrics': {
            'mae_test': mae_test,
            'rmse_test': rmse_test,
            'r2_test': r2_test,
            'r2_cv_mean': cv_scores.mean(),
            'r2_cv_std': cv_scores.std()
        },
        'feature_importance': importance.to_dict('records'),
        'trained_date': pd.Timestamp.now().isoformat()
    }, model_path)
    
    print(f"\n✅ Modelo guardado: {model_path}")
    
    # Guardar resultados
    results[disease] = {
        'mae_test': mae_test,
        'rmse_test': rmse_test,
        'r2_test': r2_test,
        'n_samples': len(X)
    }

# ============================================================================
# RESUMEN FINAL
# ============================================================================
print(f"\n{'='*60}")
print("📊 RESUMEN DE MODELOS")
print('='*60)

results_df = pd.DataFrame(results).T
print(results_df.round(3))

print(f"\n✅ Entrenamiento completado!")
print(f"📁 Modelos guardados en: {MODELS_DIR}")

# Guardar resumen
results_df.to_csv(MODELS_DIR / 'models_summary.csv')
print(f"📄 Resumen guardado: {MODELS_DIR / 'models_summary.csv'}")
