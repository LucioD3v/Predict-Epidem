#!/usr/bin/env python3
"""
ETL Multi-Enfermedad: COVID-19 + Dengue + Futuras enfermedades
Procesa datos epidemiológicos y climáticos para Veracruz, México
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime

# Configuración
VERACRUZ_CODE = 30  # Código de Veracruz en datos de México
OUTPUT_DIR = Path('data/processed')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("🔄 Iniciando ETL Multi-Enfermedad...")

# ============================================================================
# 1. CARGAR DATASET CONSOLIDADO
# ============================================================================
print("\n📊 Cargando dataset consolidado de todas las enfermedades...")

try:
    all_diseases = pd.read_csv('data/raw/all_diseases_mexico.csv')
    all_diseases['date'] = pd.to_datetime(all_diseases['date'])
    
    print(f"✅ Dataset cargado: {len(all_diseases)} registros")
    print(f"   Enfermedades: {', '.join(all_diseases['disease'].unique())}")
    print(f"   Período: {all_diseases['date'].min().date()} a {all_diseases['date'].max().date()}")
    
    # Filtrar desde 2020 para tener datos más recientes y consistentes
    all_diseases = all_diseases[all_diseases['year'] >= 2020].copy()
    
    print(f"\n📅 Filtrado 2020-2024:")
    for disease in all_diseases['disease'].unique():
        disease_data = all_diseases[all_diseases['disease'] == disease]
        print(f"   • {disease}: {len(disease_data)} semanas, {disease_data['cases'].sum():,.0f} casos")
    
except Exception as e:
    print(f"❌ Error cargando dataset: {e}")
    print("   Ejecutar: python scripts/generate_all_diseases.py")
    all_diseases = pd.DataFrame()

# ============================================================================
# 2. DATOS CLIMÁTICOS
# ============================================================================
print("\n🌤️  Procesando datos climáticos...")

weather = None
# Intentar primero datos reales, luego sintéticos
for weather_file in ['weather_veracruz.csv', 'weather_veracruz_synthetic.csv']:
    weather_path = Path(f'data/raw/{weather_file}')
    if weather_path.exists():
        try:
            weather = pd.read_csv(weather_path)
            weather['date'] = pd.to_datetime(weather['datetime'])
            weather['year'] = weather['date'].dt.year
            weather['epi_week'] = weather['date'].dt.isocalendar().week
            
            # Agrupar por semana
            weather_weekly = weather.groupby(['year', 'epi_week']).agg({
                'temp': 'mean',
                'precip': 'sum',
                'humidity': 'mean'
            }).reset_index()
            
            source = "reales" if "synthetic" not in weather_file else "sintéticos"
            print(f"✅ Clima: {len(weather)} días ({source})")
            break
        except Exception as e:
            print(f"⚠️  Error con {weather_file}: {e}")
            weather = None

if weather is None:
    print("⚠️  No se encontraron datos climáticos")
    print("   Ejecutar: python scripts/generate_weather_data.py")
    weather_weekly = None

# ============================================================================
# 3. COMBINAR Y FEATURE ENGINEERING
# ============================================================================
if len(all_diseases) > 0:
    print("\n🔧 Creando features...")
    
    # Ordenar por enfermedad y fecha
    all_diseases = all_diseases.sort_values(['disease', 'date']).reset_index(drop=True)
    
    # Merge con datos climáticos si existen
    if weather_weekly is not None:
        all_diseases = all_diseases.merge(
            weather_weekly,
            on=['year', 'epi_week'],
            how='left'
        )
        print(f"   ✅ Datos climáticos integrados")
    
    # Features por enfermedad
    for disease in all_diseases['disease'].unique():
        mask = all_diseases['disease'] == disease
        
        # Lags de casos
        all_diseases.loc[mask, 'cases_lag_1'] = all_diseases.loc[mask, 'cases'].shift(1)
        all_diseases.loc[mask, 'cases_lag_2'] = all_diseases.loc[mask, 'cases'].shift(2)
        all_diseases.loc[mask, 'cases_lag_4'] = all_diseases.loc[mask, 'cases'].shift(4)
        
        # Promedios móviles
        all_diseases.loc[mask, 'cases_ma_4w'] = all_diseases.loc[mask, 'cases'].rolling(4).mean()
        
        # Features climáticas (si existen)
        if 'temp' in all_diseases.columns:
            all_diseases.loc[mask, 'temp_ma_4w'] = all_diseases.loc[mask, 'temp'].rolling(4).mean()
            all_diseases.loc[mask, 'precip_sum_4w'] = all_diseases.loc[mask, 'precip'].rolling(4).sum()
            all_diseases.loc[mask, 'humidity_ma_4w'] = all_diseases.loc[mask, 'humidity'].rolling(4).mean()
    
    # Limpiar NaN
    merged_clean = all_diseases.dropna()
    
    # ========================================================================
    # 4. GUARDAR DATASETS
    # ========================================================================
    print("\n💾 Guardando datasets...")
    
    # Dataset completo
    merged_clean.to_csv(OUTPUT_DIR / 'multi_disease_dataset.csv', index=False)
    print(f"✅ Dataset completo: {len(merged_clean)} registros")
    
    # Datasets por enfermedad
    for disease in merged_clean['disease'].unique():
        disease_data = merged_clean[merged_clean['disease'] == disease]
        filename = disease.lower().replace('-', '_').replace(' ', '_')
        disease_data.to_csv(OUTPUT_DIR / f'{filename}_dataset.csv', index=False)
        print(f"   - {disease}: {len(disease_data)} registros")
    
    # Resumen
    print("\n📊 RESUMEN:")
    print(merged_clean.groupby('disease').agg({
        'cases': ['count', 'sum', 'mean', 'std']
    }).round(2))
    
    print("\n✅ ETL completado exitosamente!")
    print(f"📁 Archivos guardados en: {OUTPUT_DIR}")

else:
    print("\n❌ No hay datos para procesar")
    print("   Ejecutar: python scripts/generate_all_diseases.py")
