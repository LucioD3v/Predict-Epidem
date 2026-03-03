#!/usr/bin/env python3
"""
Generador de Datos Sintéticos de Dengue
SOLO PARA TESTING - Reemplazar con datos reales de PAHO
"""

import pandas as pd
import numpy as np
from datetime import datetime

print("🦟 Generando datos sintéticos de dengue...")
print("⚠️  IMPORTANTE: Estos son datos de PRUEBA")
print("   Reemplazar con datos reales de PAHO para producción\n")

# Configuración
np.random.seed(42)
start_date = '2020-01-01'
end_date = '2024-12-31'

# Generar fechas semanales
dates = pd.date_range(start_date, end_date, freq='W-MON')

# Simular estacionalidad del dengue
# Dengue tiene picos en temporada de lluvias (mayo-octubre en México)
weeks = np.arange(len(dates))
seasonal_pattern = 40 + 30 * np.sin((weeks * 2 * np.pi / 52) - np.pi/2)  # Pico en semana 26 (junio)

# Agregar tendencia creciente (dengue ha aumentado en México)
trend = weeks * 0.15

# Agregar ruido
noise = np.random.normal(0, 8, len(dates))

# Combinar componentes
cases = seasonal_pattern + trend + noise

# Asegurar valores positivos y enteros
cases = np.maximum(5, cases).astype(int)

# Agregar algunos brotes aleatorios
outbreak_weeks = np.random.choice(len(dates), size=5, replace=False)
for week in outbreak_weeks:
    cases[week:week+4] = cases[week:week+4] * 1.5

cases = cases.astype(int)

# Crear DataFrame
df = pd.DataFrame({
    'date': dates,
    'year': dates.year,
    'epi_week': dates.isocalendar().week,
    'cases': cases,
    'region': 'Veracruz',
    'country': 'Mexico',
    'disease': 'Dengue'
})

# Guardar
output_file = 'data/raw/dengue_synthetic.csv'
df.to_csv(output_file, index=False)

print(f"✅ Datos sintéticos generados: {len(df)} semanas")
print(f"   Período: {df['date'].min().date()} a {df['date'].max().date()}")
print(f"   Casos totales: {df['cases'].sum():,}")
print(f"   Promedio semanal: {df['cases'].mean():.1f} ± {df['cases'].std():.1f}")
print(f"   Rango: {df['cases'].min()} - {df['cases'].max()}")
print(f"\n📁 Guardado en: {output_file}")

# Mostrar estadísticas por año
print("\n📊 Casos por año:")
yearly = df.groupby('year')['cases'].agg(['sum', 'mean', 'max'])
print(yearly)

print("\n⚠️  RECORDATORIO:")
print("   Estos datos son SINTÉTICOS para testing")
print("   Descargar datos reales de:")
print("   - https://opendata.paho.org/")
print("   - https://www.gob.mx/salud/documentos/datos-abiertos-152127")
