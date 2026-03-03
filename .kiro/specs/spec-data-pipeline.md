# Spec: Data Pipeline - Predict-Epidem México

## Objetivo

Pipeline automatizado que ingiere datos de dengue de SINAVE México y datos climáticos semanalmente a S3.

## Componentes Técnicos

- **AWS Lambda** (Python 3.11)
- **Boto3** para S3
- **Requests** para APIs públicas
- **EventBridge** para scheduling semanal
- **CloudWatch** para logs y monitoreo

## Fuentes de Datos

### 1. SINAVE (Sistema Nacional de Vigilancia Epidemiológica)
- **URL**: https://www.gob.mx/salud/documentos/boletin-epidemiologico
- **Formato**: CSV/PDF (boletín epidemiológico semanal)
- **Datos a extraer**:
  - Casos dengue por estado mexicano
  - Casos confirmados vs probables
  - Hospitalizaciones
  - Casos dengue grave
  - Defunciones
- **Frecuencia**: Semanal (actualización jueves)

### 2. Clima (Weather API Free Tier)
- **API**: weatherapi.com (free tier: 1M calls/month)
- **Estados prioritarios**: Veracruz, Guerrero, Chiapas, Yucatán, Quintana Roo
- **Variables**:
  - Temperatura promedio (°C)
  - Temperatura máxima/mínima
  - Humedad relativa (%)
  - Precipitación acumulada (mm)
  - Días con lluvia
- **Frecuencia**: Diaria, agregada semanalmente

### 3. Google Trends (Opcional - Fase 2)
- **Términos**: "síntomas dengue", "fiebre dengue", "mosquito aedes"
- **Región**: México, por estado
- **Frecuencia**: Semanal

## Estructura de Datos en S3

```
s3://predict-epidem-mx/
├── raw/
│   ├── dengue/
│   │   ├── 2024-01-15.csv
│   │   ├── 2024-01-22.csv
│   │   └── ...
│   ├── weather/
│   │   ├── 2024-01-15.json
│   │   ├── 2024-01-22.json
│   │   └── ...
│   └── trends/ (opcional)
│       └── 2024-01-15.json
├── processed/
│   ├── unified-2024-01-15.parquet
│   ├── unified-2024-01-22.parquet
│   └── ...
└── models/
    └── sagemaker-canvas/
        └── predictions/
```

## Transformaciones (ETL)

### 1. Limpieza
- Estandarizar nombres de estados (ej: "Veracruz de Ignacio de la Llave" → "Veracruz")
- Manejar valores faltantes (forward fill para clima)
- Detectar y corregir outliers (casos > 3 std dev)

### 2. Feature Engineering
- **Ventanas móviles**:
  - `cases_lag_1`: casos semana anterior
  - `cases_lag_2`: casos 2 semanas atrás
  - `cases_lag_4`: casos 4 semanas atrás
  - `cases_ma_4w`: media móvil 4 semanas
  - `cases_ma_8w`: media móvil 8 semanas
- **Variables climáticas agregadas**:
  - `temp_ma_4w`: temperatura promedio 4 semanas
  - `precip_sum_4w`: precipitación acumulada 4 semanas
  - `humidity_ma_4w`: humedad promedio 4 semanas
  - `rain_days_4w`: días con lluvia últimas 4 semanas
- **Variables temporales**:
  - `week_of_year`: semana del año (1-52)
  - `month`: mes (1-12)
  - `is_rainy_season`: boolean (mayo-octubre)

### 3. Unificación
- Join por `estado` + `fecha`
- Formato final: Parquet (compresión snappy)
- Schema:
  ```
  estado: string
  fecha: date
  casos_confirmados: int
  casos_probables: int
  hospitalizaciones: int
  casos_graves: int
  defunciones: int
  temp_promedio: float
  temp_max: float
  temp_min: float
  humedad: float
  precipitacion: float
  cases_lag_1: int
  cases_lag_2: int
  cases_lag_4: int
  cases_ma_4w: float
  temp_ma_4w: float
  precip_sum_4w: float
  humidity_ma_4w: float
  week_of_year: int
  month: int
  is_rainy_season: bool
  ```

## Lambda Functions

### 1. `ingest-sinave-data`
- **Trigger**: EventBridge (cada jueves 10:00 AM)
- **Timeout**: 5 minutos
- **Memory**: 512 MB
- **Acciones**:
  1. Descargar boletín SINAVE más reciente
  2. Parsear CSV/PDF
  3. Extraer datos dengue por estado
  4. Guardar en `s3://predict-epidem-mx/raw/dengue/YYYY-MM-DD.csv`
  5. Log en CloudWatch

### 2. `ingest-weather-data`
- **Trigger**: EventBridge (cada día 6:00 AM)
- **Timeout**: 3 minutos
- **Memory**: 256 MB
- **Acciones**:
  1. Llamar Weather API para 5 estados prioritarios
  2. Extraer variables climáticas
  3. Guardar en `s3://predict-epidem-mx/raw/weather/YYYY-MM-DD.json`
  4. Log en CloudWatch

### 3. `process-unified-data`
- **Trigger**: EventBridge (cada jueves 12:00 PM, después de ingest-sinave)
- **Timeout**: 10 minutos
- **Memory**: 1024 MB
- **Acciones**:
  1. Leer últimos datos raw de S3
  2. Aplicar transformaciones ETL
  3. Generar features
  4. Guardar Parquet en `s3://predict-epidem-mx/processed/`
  5. Actualizar dataset maestro para SageMaker Canvas
  6. Log en CloudWatch

## Manejo de Errores

- **Retry**: 3 intentos con backoff exponencial
- **Dead Letter Queue**: SNS topic para alertas de fallos
- **Validación de datos**:
  - Verificar schema antes de guardar
  - Alertar si casos > 10,000 (posible error)
  - Alertar si temperatura < 0°C o > 50°C
- **Logs estructurados**: JSON format en CloudWatch

## Monitoreo

- **CloudWatch Metrics**:
  - Número de registros procesados
  - Tiempo de ejecución
  - Errores por tipo
- **CloudWatch Alarms**:
  - Lambda errors > 5 en 1 hora
  - Lambda duration > 80% timeout
  - S3 bucket size > 4.5 GB (90% Free Tier)

## Seguridad

- **IAM Role**: Mínimos privilegios
  - S3: PutObject, GetObject en bucket específico
  - CloudWatch: PutLogEvents
  - Secrets Manager: GetSecretValue (API keys)
- **Encryption**: S3 server-side encryption (SSE-S3)
- **API Keys**: Almacenar en AWS Secrets Manager

## Costos (Free Tier)

- Lambda: 1M requests/month FREE (usaremos ~500/month)
- S3: 5GB storage FREE (usaremos ~2GB)
- EventBridge: 14M eventos FREE (usaremos ~100/month)
- CloudWatch: 5GB logs FREE (suficiente)
- **Total**: $0

## Entregables

1. **Código Lambda**:
   - `lambda/ingest_sinave.py`
   - `lambda/ingest_weather.py`
   - `lambda/process_unified.py`
   - `lambda/requirements.txt`

2. **Infrastructure as Code**:
   - `cloudformation/data-pipeline.yaml`
   - Incluye: Lambdas, EventBridge rules, IAM roles, S3 bucket

3. **Documentación**:
   - README con setup instructions
   - Diagrama de arquitectura
   - Ejemplos de datos

## Testing

- **Unit tests**: pytest para cada función
- **Integration test**: End-to-end con datos de prueba
- **Validación**: Comparar output con datos históricos conocidos
