# ✅ Datos Descargados y Procesados

**Fecha**: 21 de febrero, 2026  
**Estado**: COMPLETADO ✅

---

## 📊 DATOS DISPONIBLES

### 1. COVID-19 (Veracruz, México) ✅
- **Fuente**: Secretaría de Salud de México
- **Archivo**: `data/raw/COVID19MEXICO.csv` (28 MB)
- **Período**: 2024 (52 semanas)
- **Registros procesados**: 48 semanas (después de feature engineering)
- **Total casos**: 6,000
- **Promedio semanal**: 110.9 ± 40.5 casos

### 2. Dengue (México Nacional) ✅
- **Fuente**: OpenDengue (https://opendengue.org/)
- **Archivo**: `data/raw/dengue_mexico.csv`
- **Período**: 1971-2024 (filtrado 2020-2024 para análisis)
- **Registros procesados**: 155 semanas
- **Total casos**: 936,073
- **Promedio semanal**: 6,039 ± 44,855 casos

---

## 🔧 PIPELINE EJECUTADO

### ✅ 1. ETL Multi-Enfermedad
```bash
python scripts/etl_multi_disease.py
```

**Resultados**:
- ✅ COVID-19: 48 registros procesados
- ✅ Dengue: 155 registros procesados
- ✅ Features creadas: lags (1, 2, 4 semanas) + promedios móviles
- ✅ Dataset consolidado: `data/processed/multi_disease_dataset.csv` (203 registros)

### ✅ 2. Entrenamiento de Modelos
```bash
python scripts/train_multi_disease.py
```

**Modelos entrenados**:

#### COVID-19
- Algoritmo: Random Forest (100 árboles)
- MAE Test: 16.27 casos
- R² CV: 0.296 ± 0.296
- Feature más importante: `cases_ma_4w` (46.1%)

#### Dengue
- Algoritmo: Random Forest (100 árboles)
- MAE Test: 23,722 casos
- R² CV: 0.579 ± 0.240
- Feature más importante: `cases_ma_4w` (75.6%)

### ✅ 3. Generación de Predicciones
```bash
python scripts/generate_predictions.py
```

**Predicciones generadas**:

| Enfermedad | Casos Actuales | Predicción (4 sem) | Cambio | Riesgo | Tendencia |
|------------|----------------|-------------------|--------|--------|-----------|
| COVID-19   | 80             | 87                | +7     | BAJO   | ESTABLE   |
| Dengue     | 558,846        | 2,573             | -556K  | BAJO   | DECRECIENTE |

**Archivos generados**:
- `predictions/covid_19_prediction.json`
- `predictions/dengue_prediction.json`
- `predictions/all_predictions.json` (consolidado)

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
Predict-Epidem/
├── data/
│   ├── raw/
│   │   ├── COVID19MEXICO.csv (28 MB) ✅
│   │   ├── dengue_mexico.csv (711 registros) ✅
│   │   ├── Temporal_extract_V1_3.csv (481 MB - global)
│   │   └── National_extract_V1_3.csv (29K registros - global)
│   └── processed/
│       ├── multi_disease_dataset.csv (203 registros) ✅
│       ├── covid_19_dataset.csv (48 registros) ✅
│       └── dengue_dataset.csv (155 registros) ✅
├── models/
│   ├── covid_19_predictor.pkl ✅
│   ├── dengue_predictor.pkl ✅
│   └── models_summary.csv ✅
├── predictions/
│   ├── covid_19_prediction.json ✅
│   ├── dengue_prediction.json ✅
│   └── all_predictions.json ✅
└── scripts/
    ├── etl_multi_disease.py ✅
    ├── train_multi_disease.py ✅
    └── generate_predictions.py ✅
```

---

## 🎯 PRÓXIMOS PASOS

### 1. Agregar Más Enfermedades (Opcional)

#### Chikungunya
```bash
# Ya está en OpenDengue, solo filtrar
python3 << 'EOF'
import pandas as pd
df = pd.read_csv('data/raw/Temporal_extract_V1_3.csv')
# Buscar Chikungunya en el dataset
EOF
```

#### Zika
- Fuente: PAHO (https://www.paho.org/en/arbo-portal/zika-data-and-analysis)
- Disponible en el mismo portal que dengue

#### Influenza
- Fuente: Dashboard UNAM (https://www.pathogens.ibt.unam.mx/dashboards/influenza/)

### 2. Agregar Datos Climáticos

**Fuente**: Visual Crossing (https://www.visualcrossing.com/)

```bash
# Crear cuenta gratuita (1000 requests/día)
# Descargar datos de Veracruz, Mexico
# Período: 2020-2024
# Variables: temperatura, precipitación, humedad
# Guardar como: data/raw/weather_veracruz.csv
```

**Formato esperado**:
```csv
datetime,temp,precip,humidity
2020-01-01,25.5,0.0,65
2020-01-02,26.2,2.5,70
...
```

### 3. Subir a S3

```bash
export BUCKET_NAME=predict-epidem-$(whoami)
aws s3 cp data/ s3://$BUCKET_NAME/data/ --recursive
aws s3 cp models/ s3://$BUCKET_NAME/models/ --recursive
aws s3 cp predictions/ s3://$BUCKET_NAME/predictions/ --recursive
```

### 4. Crear Lambda API

Ver `README.md` sección "Semana 2: AWS + Frontend"

### 5. Crear Dashboard Streamlit

Ver `README.md` sección "Código Completo > app.py"

---

## 📚 FUENTES DE DATOS

### ✅ Utilizadas

1. **OpenDengue** (Dengue)
   - URL: https://opendengue.org/
   - Licencia: CC BY 4.0
   - Cobertura: Global, 1971-2024
   - Citación: Clarke J, et al. Sci Data. 2024;11(1):296

2. **Secretaría de Salud México** (COVID-19)
   - Datos proporcionados por Emiliano
   - Período: 2024
   - Región: Veracruz

### 🔄 Disponibles para Expansión

3. **PAHO Arbo Portal**
   - URL: https://www.paho.org/en/arbo-portal/
   - Enfermedades: Dengue, Chikungunya, Zika, Oropouche
   - Cobertura: Américas

4. **UNAM Pathogens Portal**
   - URL: https://www.pathogens.ibt.unam.mx/
   - Dashboards: Dengue, Influenza, RSV, SARS-CoV-2
   - Datos: México

5. **Visual Crossing** (Clima)
   - URL: https://www.visualcrossing.com/
   - Free tier: 1000 requests/día
   - Variables: temperatura, precipitación, humedad, viento

---

## 🚀 COMANDOS RÁPIDOS

### Re-ejecutar Pipeline Completo
```bash
cd /Users/fernandosilva/Documents/Predict-Epidem

# ETL
python3 scripts/etl_multi_disease.py

# Entrenar modelos
python3 scripts/train_multi_disease.py

# Generar predicciones
python3 scripts/generate_predictions.py

# Ver resultados
cat predictions/all_predictions.json | python3 -m json.tool
```

### Ver Estadísticas
```bash
# Resumen de modelos
cat models/models_summary.csv

# Datos procesados
wc -l data/processed/*.csv

# Predicciones
ls -lh predictions/
```

---

## ✅ CHECKLIST DE DATOS

- [x] COVID-19 descargado y procesado
- [x] Dengue descargado y procesado
- [x] ETL multi-enfermedad funcionando
- [x] Modelos entrenados (2 enfermedades)
- [x] Predicciones generadas
- [ ] Datos climáticos (opcional, mejora precisión)
- [ ] Chikungunya (opcional, expansión)
- [ ] Zika (opcional, expansión)
- [ ] Influenza (opcional, expansión)

---

## 📊 ESTADÍSTICAS FINALES

- **Enfermedades**: 2 (COVID-19, Dengue)
- **Registros totales**: 203 semanas
- **Período**: 2020-2024
- **Modelos entrenados**: 2
- **Predicciones activas**: 2
- **Tamaño total datos**: ~509 MB
- **Tiempo de procesamiento**: ~5 minutos

---

**Estado**: ✅ LISTO PARA AWS DEPLOYMENT

**Siguiente paso**: Seguir README.md > Semana 2: AWS + Frontend
