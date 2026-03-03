# Spec: ML Pipeline - SageMaker Canvas

## Objetivo

Pipeline de Machine Learning para predicción de casos de dengue 2-4 semanas adelante usando SageMaker Canvas (no-code).

## Contexto

- **Migración**: Amazon Forecast → SageMaker Canvas (Forecast deprecated 2024)
- **Ventaja Canvas**: No-code, 160 horas FREE por 2 meses, mismos algoritmos que Forecast
- **Tipo de problema**: Time Series Forecasting

## Algoritmos Disponibles en Canvas

1. **DeepAR+** (Recomendado)
   - Deep learning para series temporales
   - Maneja estacionalidad múltiple
   - Mejor para datos con patrones complejos

2. **Prophet**
   - Desarrollado por Meta
   - Excelente para ciclos anuales
   - Robusto a datos faltantes

3. **CNN-QR** (Convolutional Neural Network - Quantile Regression)
   - Redes convolucionales
   - Captura patrones locales
   - Intervalos de confianza

4. **ARIMA**
   - Baseline clásico
   - Bueno para comparación

## Dataset para Canvas

### Formato Requerido

CSV con las siguientes columnas:

```csv
item_id,timestamp,target_value,temp_promedio,humedad,precipitacion,cases_lag_1,cases_lag_2,cases_lag_4,cases_ma_4w,temp_ma_4w,precip_sum_4w,humidity_ma_4w,week_of_year,month,is_rainy_season
Veracruz,2020-01-05,45,24.5,75.2,12.3,42,38,35,40.5,24.1,45.6,74.8,1,1,0
Veracruz,2020-01-12,48,25.1,76.8,15.7,45,42,38,43.25,24.3,48.9,75.5,2,1,0
...
```

### Columnas

- **item_id**: Estado mexicano (Veracruz, Guerrero, Chiapas, etc.)
- **timestamp**: Fecha (formato YYYY-MM-DD)
- **target_value**: Casos confirmados de dengue (variable a predecir)
- **Features adicionales** (related time series):
  - Variables climáticas: temp_promedio, humedad, precipitacion
  - Lags: cases_lag_1, cases_lag_2, cases_lag_4
  - Moving averages: cases_ma_4w, temp_ma_4w, precip_sum_4w, humidity_ma_4w
  - Temporales: week_of_year, month, is_rainy_season

### Preparación del Dataset

Lambda function: `prepare-canvas-dataset`

```python
# Pseudocódigo
def prepare_canvas_dataset():
    # 1. Leer todos los parquet de processed/
    df = read_all_parquet_from_s3()
    
    # 2. Filtrar estados prioritarios
    estados = ['Veracruz', 'Guerrero', 'Chiapas', 'Yucatán', 'Quintana Roo']
    df = df[df['estado'].isin(estados)]
    
    # 3. Renombrar columnas para Canvas
    df = df.rename(columns={
        'estado': 'item_id',
        'fecha': 'timestamp',
        'casos_confirmados': 'target_value'
    })
    
    # 4. Ordenar por item_id y timestamp
    df = df.sort_values(['item_id', 'timestamp'])
    
    # 5. Validar
    assert df['target_value'].min() >= 0
    assert df['timestamp'].is_monotonic_increasing
    
    # 6. Guardar CSV
    df.to_csv('s3://predict-epidem-mx/canvas/training-data.csv', index=False)
    
    return df
```

## Configuración en SageMaker Canvas

### Paso 1: Crear Dataset

1. Abrir SageMaker Canvas en AWS Console
2. Click "Import data"
3. Seleccionar `s3://predict-epidem-mx/canvas/training-data.csv`
4. Canvas detecta automáticamente:
   - Time series dataset
   - item_id column
   - timestamp column
   - target column

### Paso 2: Configurar Build

**Build Type**: Quick Build (2-15 minutos, FREE)

**Configuración**:
- **Forecast horizon**: 4 (predecir 4 semanas adelante)
- **Forecast frequency**: 1W (semanal)
- **Number of backtest windows**: 3
- **Related time series**: Seleccionar todas las features climáticas y lags
- **Holiday calendar**: Mexico (incluye días festivos mexicanos)

### Paso 3: Entrenar Modelo

Canvas automáticamente:
1. Divide datos en train/validation/test
2. Prueba múltiples algoritmos (DeepAR+, Prophet, CNN-QR, ARIMA)
3. Selecciona el mejor basado en métricas
4. Genera predicciones

**Tiempo estimado**: 2-4 horas (Quick Build)

## Métricas de Evaluación

Canvas reporta automáticamente:

### 1. WAPE (Weighted Absolute Percentage Error)
- **Objetivo**: < 0.15 (excelente para epidemiología)
- **Interpretación**: Error promedio ponderado
- **Fórmula**: `sum(|actual - predicted|) / sum(actual)`

### 2. MAPE (Mean Absolute Percentage Error)
- **Objetivo**: < 0.20
- **Interpretación**: Error porcentual promedio
- **Fórmula**: `mean(|actual - predicted| / actual)`

### 3. RMSE (Root Mean Squared Error)
- **Objetivo**: < 50 casos
- **Interpretación**: Error cuadrático medio
- Penaliza errores grandes

### 4. Quantile Loss (P10, P50, P90)
- Evalúa intervalos de confianza
- P50 = mediana de predicción
- P10/P90 = límites inferior/superior

## Predicciones

### Generar Predicciones

En Canvas:
1. Click "Predict"
2. Seleccionar horizonte: 4 semanas
3. Canvas genera:
   - Predicción puntual (P50)
   - Intervalo de confianza (P10-P90)
   - Predicción por estado

### Exportar Predicciones

Canvas guarda automáticamente en:
```
s3://predict-epidem-mx/canvas/predictions/
├── forecast-2025-03-01.csv
├── forecast-2025-03-08.csv
└── ...
```

Formato:
```csv
item_id,timestamp,p10,p50,p90
Veracruz,2025-03-08,120,145,180
Veracruz,2025-03-15,135,162,195
Veracruz,2025-03-22,148,178,215
Veracruz,2025-03-29,155,188,228
```

## What-If Analysis (Escenarios)

Canvas permite simular escenarios:

**Ejemplo**: "¿Qué pasa si temperatura aumenta 2°C?"

1. En Canvas, click "What-if analysis"
2. Modificar `temp_promedio` +2°C para próximas 4 semanas
3. Canvas re-genera predicciones con nuevo escenario
4. Comparar vs predicción base

**Casos de uso**:
- Impacto de ola de calor
- Efecto de temporada de lluvias intensa
- Intervenciones (fumigación reduce casos 20%)

## Automatización con Lambda

Lambda function: `trigger-canvas-predictions`

```python
# Pseudocódigo
def trigger_canvas_predictions():
    # 1. Verificar si hay nuevos datos
    latest_data = get_latest_processed_data()
    
    # 2. Actualizar dataset Canvas
    update_canvas_dataset(latest_data)
    
    # 3. Trigger Canvas batch prediction (via SageMaker API)
    response = sagemaker_client.create_auto_ml_job_v2(
        AutoMLJobName=f'dengue-forecast-{date}',
        AutoMLJobInputDataConfig=[...],
        ProblemType='Forecasting',
        ...
    )
    
    # 4. Esperar a que termine
    wait_for_job_completion(response['AutoMLJobArn'])
    
    # 5. Descargar predicciones
    predictions = download_predictions_from_s3()
    
    # 6. Procesar y clasificar riesgo
    risk_levels = classify_risk(predictions)
    
    # 7. Guardar en S3
    save_to_s3(risk_levels, 's3://predict-epidem-mx/predictions/latest.json')
    
    return risk_levels
```

## Clasificación de Riesgo

Basado en predicciones, clasificar en 4 niveles:

```python
def classify_risk(predicted_cases, historical_avg):
    ratio = predicted_cases / historical_avg
    
    if ratio >= 2.0:
        return 'CRÍTICO'  # >100% aumento
    elif ratio >= 1.5:
        return 'ALTO'     # 50-100% aumento
    elif ratio >= 1.2:
        return 'MEDIO'    # 20-50% aumento
    else:
        return 'BAJO'     # <20% aumento
```

## Reentrenamiento

**Frecuencia**: Mensual

**Trigger**: EventBridge (primer domingo de cada mes)

**Proceso**:
1. Lambda descarga datos actualizados
2. Prepara nuevo dataset con último mes incluido
3. Trigger nuevo Quick Build en Canvas
4. Evalúa si nuevo modelo mejora métricas
5. Si mejora, reemplaza modelo en producción

## Monitoreo del Modelo

**Métricas a trackear**:
- WAPE semanal (comparar predicción vs real)
- Drift detection (distribución de features cambia)
- False negatives (brotes no detectados)

**Alertas**:
- WAPE > 0.25 → Modelo degradado, reentrenar
- False negative detectado → Revisar features

## Costos (Free Tier)

- **SageMaker Canvas**: 160 horas FREE por 2 meses
  - Quick Build: ~3 horas por entrenamiento
  - Podemos entrenar ~50 modelos en periodo FREE
- **S3**: Incluido en 5GB FREE
- **Lambda**: Incluido en 1M requests FREE

**Total**: $0 durante competencia

## Entregables

1. **Dataset preparado**: `canvas/training-data.csv`
2. **Lambda function**: `lambda/prepare_canvas_dataset.py`
3. **Lambda function**: `lambda/trigger_canvas_predictions.py`
4. **Documentación**: Guía paso a paso Canvas setup
5. **Screenshots**: Canvas UI mostrando métricas y predicciones
6. **Notebook**: Análisis de resultados (opcional)

## Validación

- Comparar predicciones Canvas vs datos reales históricos
- Backtesting: Predecir semanas pasadas y comparar
- Objetivo: Detectar al menos 80% de brotes reales con 2+ semanas anticipación
