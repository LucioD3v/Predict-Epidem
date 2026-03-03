# 🦟 Guía para Agregar Datos de Dengue

## OPCIÓN 1: Descarga Manual de PAHO (RECOMENDADO)

### Paso 1: Ir a PAHO Open Data
```
https://opendata.paho.org/
```

### Paso 2: Buscar Dengue
1. En el buscador, escribir: **"dengue"**
2. Seleccionar: **"Dengue - Reported cases"** o **"Dengue indicators"**

### Paso 3: Filtrar por México
1. Buscar filtro de país/country
2. Seleccionar: **Mexico**
3. Si hay opción de estado, seleccionar: **Veracruz**

### Paso 4: Descargar
1. Click en **"Export"** o **"Download"**
2. Formato: **CSV**
3. Guardar como: `data/raw/dengue_paho.csv`

### Paso 5: Verificar Columnas
El archivo debe tener columnas como:
- `date` o `fecha` o `epi_week` (semana epidemiológica)
- `cases` o `casos` (número de casos)
- `country` / `state` / `region`

---

## OPCIÓN 2: API de PAHO (Avanzado)

### Explorar API
```bash
# Ver datasets disponibles
curl "https://opendata.paho.org/api/3/action/package_list"

# Ver detalles de un dataset
curl "https://opendata.paho.org/api/3/action/package_show?id=dengue-cases"
```

### Descargar con Python
```python
import requests
import pandas as pd

# URL del recurso (verificar ID correcto en PAHO)
url = "https://opendata.paho.org/api/3/action/datastore_search"
params = {
    'resource_id': 'RESOURCE_ID_AQUI',  # Obtener de package_show
    'limit': 10000,
    'filters': '{"country":"Mexico"}'
}

response = requests.get(url, params=params)
data = response.json()

df = pd.DataFrame(data['result']['records'])
df.to_csv('data/raw/dengue_paho.csv', index=False)
```

---

## OPCIÓN 3: Datos de Gobierno de México

### Fuente: Dirección General de Epidemiología
```
https://www.gob.mx/salud/documentos/datos-abiertos-152127
```

### Pasos:
1. Buscar: **"Dengue"** o **"Enfermedades transmitidas por vector"**
2. Descargar CSV
3. Filtrar por Veracruz (código: 30)
4. Guardar como: `data/raw/dengue_mexico.csv`

---

## OPCIÓN 4: Usar Datos Sintéticos (Solo para Testing)

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Generar datos sintéticos
np.random.seed(42)
dates = pd.date_range('2020-01-01', '2024-12-31', freq='W')

# Simular estacionalidad (más casos en verano)
seasonal = 50 + 30 * np.sin(np.arange(len(dates)) * 2 * np.pi / 52)
noise = np.random.normal(0, 10, len(dates))
cases = np.maximum(0, seasonal + noise).astype(int)

df = pd.DataFrame({
    'date': dates,
    'year': dates.year,
    'epi_week': dates.isocalendar().week,
    'cases': cases,
    'region': 'Veracruz',
    'country': 'Mexico'
})

df.to_csv('data/raw/dengue_synthetic.csv', index=False)
print(f"✅ Datos sintéticos generados: {len(df)} semanas")
```

---

## Después de Descargar Dengue

### 1. Ajustar ETL si es necesario
Si las columnas tienen nombres diferentes, editar `scripts/etl_multi_disease.py`:

```python
# Sección de DENGUE (línea ~70)
dengue = pd.read_csv('data/raw/dengue_paho.csv')

# Ajustar nombres de columnas según tu archivo
dengue = dengue.rename(columns={
    'fecha': 'date',           # Si está en español
    'casos': 'cases',
    'semana_epi': 'epi_week'
})

# Filtrar Veracruz si no está filtrado
dengue = dengue[dengue['state'] == 'Veracruz']
```

### 2. Re-ejecutar Pipeline
```bash
# ETL
python scripts/etl_multi_disease.py

# Entrenar modelos
python scripts/train_multi_disease.py

# Generar predicciones
python scripts/generate_predictions.py
```

### 3. Verificar Resultados
```bash
# Ver predicciones
cat predictions/all_predictions.json

# Ver modelos entrenados
ls -lh models/
```

---

## Estructura de Datos Esperada

### Formato Mínimo Requerido
```csv
date,cases
2020-01-05,45
2020-01-12,52
2020-01-19,48
...
```

### Formato Completo (Ideal)
```csv
date,year,epi_week,cases,region,country
2020-01-05,2020,1,45,Veracruz,Mexico
2020-01-12,2020,2,52,Veracruz,Mexico
2020-01-19,2020,3,48,Veracruz,Mexico
...
```

---

## Troubleshooting

### Error: "No se encontraron datos de dengue"
- Verificar que el archivo existe: `ls data/raw/dengue_*.csv`
- Verificar nombre del archivo en el script ETL

### Error: "KeyError: 'cases'"
- Las columnas tienen nombres diferentes
- Ajustar el script ETL con los nombres correctos

### Datos insuficientes
- Mínimo requerido: **20 semanas** de datos
- Recomendado: **2+ años** (100+ semanas)

---

## Próximos Pasos

Una vez que tengas datos de dengue:

1. ✅ Ejecutar pipeline completo
2. ✅ Verificar métricas del modelo (R² > 0.5)
3. ✅ Actualizar dashboard con ambas enfermedades
4. ✅ Agregar más enfermedades (Chikungunya, Zika)

---

## Recursos

- **PAHO Open Data**: https://opendata.paho.org/
- **Datos Abiertos México**: https://www.gob.mx/salud/documentos/datos-abiertos-152127
- **WHO Disease Outbreak News**: https://www.who.int/emergencies/disease-outbreak-news
- **Visual Crossing (Clima)**: https://www.visualcrossing.com/

---

**¿Necesitas ayuda?** Revisa `ANALISIS_DATOS_EMILIANO.md` para más detalles.
