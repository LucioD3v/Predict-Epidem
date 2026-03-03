#!/usr/bin/env python3
"""
Descarga y genera datos de múltiples enfermedades para México
Incluye: COVID-19, Dengue, Influenza, Chikungunya, Zika
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path

print("🦠 GENERANDO DATASET MULTI-ENFERMEDAD COMPLETO\n")
print("="*60)

# ============================================================================
# 1. DENGUE (Ya tenemos datos reales 2015-2024)
# ============================================================================
print("\n🦟 1. DENGUE (Datos reales de OpenDengue)")
dengue = pd.read_csv('data/raw/dengue_mexico_2015_2024.csv')
dengue['date'] = pd.to_datetime(dengue['date'])
dengue['disease'] = 'Dengue'
print(f"   ✅ {len(dengue)} semanas (2015-2024)")
print(f"   Total casos: {dengue['cases'].sum():,.0f}")

# ============================================================================
# 2. COVID-19 (Datos reales Veracruz 2020-2024)
# ============================================================================
print("\n🦠 2. COVID-19 (Datos reales Veracruz 2020-2024)")
covid = pd.read_csv('data/raw/COVID19_VERACRUZ_2020_2024.csv', low_memory=False)
covid['FECHA_SINTOMAS'] = pd.to_datetime(covid['FECHA_SINTOMAS'], errors='coerce')
covid_veracruz = covid[covid['FECHA_SINTOMAS'].notna()]

covid_veracruz['year'] = covid_veracruz['FECHA_SINTOMAS'].dt.year
covid_veracruz['epi_week'] = covid_veracruz['FECHA_SINTOMAS'].dt.isocalendar().week
covid_veracruz['date'] = covid_veracruz['FECHA_SINTOMAS']

covid_weekly = covid_veracruz.groupby(['year', 'epi_week', 'date']).size().reset_index(name='cases')
covid_weekly['disease'] = 'COVID-19'
print(f"   ✅ {len(covid_weekly)} semanas (2020-2024)")
print(f"   Total casos: {covid_weekly['cases'].sum():,.0f}")

# ============================================================================
# 3. CHIKUNGUNYA (Datos sintéticos basados en patrones reales)
# ============================================================================
print("\n🦟 3. CHIKUNGUNYA (Datos sintéticos basados en epidemiología)")
print("   Fuente: Patrones de PAHO - Brotes en 2014-2015, 2019")

# Chikungunya tiene brotes esporádicos en México
np.random.seed(43)
dates_chik = pd.date_range('2015-01-01', '2024-12-31', freq='W-MON')

# Patrón: brotes en 2015, 2019, casos bajos otros años
cases_chik = []
for date in dates_chik:
    year = date.year
    week = date.isocalendar().week
    
    # Brote 2015
    if year == 2015:
        base = 150 + 100 * np.sin((week - 20) * 2 * np.pi / 52)
    # Brote 2019
    elif year == 2019:
        base = 100 + 80 * np.sin((week - 25) * 2 * np.pi / 52)
    # Años normales
    else:
        base = 20 + 15 * np.sin((week - 20) * 2 * np.pi / 52)
    
    noise = np.random.normal(0, base * 0.2)
    cases_chik.append(max(0, int(base + noise)))

chikungunya = pd.DataFrame({
    'date': dates_chik,
    'year': dates_chik.year,
    'epi_week': dates_chik.isocalendar().week,
    'cases': cases_chik,
    'disease': 'Chikungunya'
})
print(f"   ✅ {len(chikungunya)} semanas (2015-2024)")
print(f"   Total casos: {chikungunya['cases'].sum():,.0f}")

# ============================================================================
# 4. ZIKA (Datos sintéticos basados en patrones reales)
# ============================================================================
print("\n🦟 4. ZIKA (Datos sintéticos basados en epidemiología)")
print("   Fuente: Patrones de PAHO - Brote 2016-2017, casos bajos después")

np.random.seed(44)
dates_zika = pd.date_range('2015-01-01', '2024-12-31', freq='W-MON')

cases_zika = []
for date in dates_zika:
    year = date.year
    week = date.isocalendar().week
    
    # Brote grande 2016
    if year == 2016:
        base = 200 + 150 * np.sin((week - 15) * 2 * np.pi / 52)
    # Continuación 2017
    elif year == 2017:
        base = 80 + 60 * np.sin((week - 15) * 2 * np.pi / 52)
    # Casos esporádicos después
    elif year >= 2018:
        base = 5 + 3 * np.sin((week - 15) * 2 * np.pi / 52)
    # Antes del brote
    else:
        base = 2
    
    noise = np.random.normal(0, base * 0.3)
    cases_zika.append(max(0, int(base + noise)))

zika = pd.DataFrame({
    'date': dates_zika,
    'year': dates_zika.year,
    'epi_week': dates_zika.isocalendar().week,
    'cases': cases_zika,
    'disease': 'Zika'
})
print(f"   ✅ {len(zika)} semanas (2015-2024)")
print(f"   Total casos: {zika['cases'].sum():,.0f}")

# ============================================================================
# 5. INFLUENZA (Datos sintéticos basados en patrones reales)
# ============================================================================
print("\n🦠 5. INFLUENZA (Datos sintéticos basados en epidemiología)")
print("   Fuente: Patrones estacionales - Picos en invierno")

np.random.seed(45)
dates_flu = pd.date_range('2015-01-01', '2024-12-31', freq='W-MON')

cases_flu = []
for date in dates_flu:
    year = date.year
    week = date.isocalendar().week
    
    # Influenza tiene picos en invierno (semanas 1-10 y 45-52)
    if week <= 10 or week >= 45:
        base = 800 + 400 * np.sin((week + 26) * 2 * np.pi / 52)
    else:
        base = 150 + 100 * np.sin(week * 2 * np.pi / 52)
    
    # Pandemia COVID redujo influenza en 2020-2021
    if year in [2020, 2021]:
        base *= 0.3
    
    noise = np.random.normal(0, base * 0.15)
    cases_flu.append(max(0, int(base + noise)))

influenza = pd.DataFrame({
    'date': dates_flu,
    'year': dates_flu.year,
    'epi_week': dates_flu.isocalendar().week,
    'cases': cases_flu,
    'disease': 'Influenza'
})
print(f"   ✅ {len(influenza)} semanas (2015-2024)")
print(f"   Total casos: {influenza['cases'].sum():,.0f}")

# ============================================================================
# COMBINAR TODO
# ============================================================================
print("\n" + "="*60)
print("📊 CONSOLIDANDO DATASET MULTI-ENFERMEDAD")
print("="*60)

# Asegurar que todas tengan las mismas columnas
all_diseases = pd.concat([
    dengue[['date', 'year', 'epi_week', 'cases', 'disease']],
    covid_weekly[['date', 'year', 'epi_week', 'cases', 'disease']],
    chikungunya[['date', 'year', 'epi_week', 'cases', 'disease']],
    zika[['date', 'year', 'epi_week', 'cases', 'disease']],
    influenza[['date', 'year', 'epi_week', 'cases', 'disease']]
], ignore_index=True)

# Guardar
all_diseases.to_csv('data/raw/all_diseases_mexico.csv', index=False)

print(f"\n✅ Dataset consolidado guardado: data/raw/all_diseases_mexico.csv")
print(f"   Total registros: {len(all_diseases):,}")
print(f"   Enfermedades: {all_diseases['disease'].nunique()}")
print(f"   Período: {all_diseases['date'].min().date()} a {all_diseases['date'].max().date()}")

# Resumen por enfermedad
print(f"\n📋 RESUMEN POR ENFERMEDAD:")
summary = all_diseases.groupby('disease').agg({
    'cases': ['count', 'sum', 'mean', 'max'],
    'date': ['min', 'max']
})
print(summary)

print(f"\n🎯 DATOS LISTOS PARA ENTRENAMIENTO")
print(f"   • Dengue: Datos reales OpenDengue ✅")
print(f"   • COVID-19: Datos reales Veracruz ✅")
print(f"   • Chikungunya: Sintéticos (basados en PAHO) ⚠️")
print(f"   • Zika: Sintéticos (basados en PAHO) ⚠️")
print(f"   • Influenza: Sintéticos (patrones estacionales) ⚠️")
print(f"\n💡 Reemplazar datos sintéticos con reales cuando estén disponibles")
