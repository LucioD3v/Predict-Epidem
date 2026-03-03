#!/usr/bin/env python3
"""
Script para descargar datos de dengue de PAHO
Fuente: https://opendata.paho.org/
"""

import requests
import pandas as pd
from pathlib import Path

# Crear carpeta data/raw si no existe
Path('data/raw').mkdir(parents=True, exist_ok=True)

print("🦟 Descargando datos de dengue de PAHO...")

# URL de la API de PAHO para dengue en México
# Nota: Esta es una URL de ejemplo, necesitas verificar la URL correcta en opendata.paho.org
PAHO_DENGUE_URL = "https://opendata.paho.org/api/3/action/datastore_search"

# Parámetros para México
params = {
    'resource_id': 'dengue-cases',  # ID del recurso (verificar en PAHO)
    'limit': 10000,
    'filters': '{"country":"Mexico"}'
}

try:
    response = requests.get(PAHO_DENGUE_URL, params=params, timeout=30)
    
    if response.status_code == 200:
        data = response.json()
        df = pd.DataFrame(data['result']['records'])
        df.to_csv('data/raw/dengue_paho.csv', index=False)
        print(f"✅ Descargados {len(df)} registros de dengue")
    else:
        print(f"⚠️  Error {response.status_code}: No se pudo descargar automáticamente")
        print("\n📋 DESCARGA MANUAL:")
        print("1. Ir a: https://opendata.paho.org/en/dengue-indicators")
        print("2. Filtrar por México > Veracruz")
        print("3. Descargar CSV")
        print("4. Guardar como: data/raw/dengue_paho.csv")
        
except Exception as e:
    print(f"⚠️  Error: {e}")
    print("\n📋 DESCARGA MANUAL:")
    print("1. Ir a: https://opendata.paho.org/en/dengue-indicators")
    print("2. Filtrar por México > Veracruz")
    print("3. Descargar CSV")
    print("4. Guardar como: data/raw/dengue_paho.csv")

print("\n✅ Script completado")
