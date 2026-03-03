# 🦟 Predict-Epidem
## Sistema de Predicción de Brotes Epidémicos con AWS

**Competencia**: 10,000 AIdeas - AWS Community Builders  
**Deadline**: Marzo 13, 2026  
**Región**: Veracruz, México  

---

## 🎯 Descripción

Sistema de predicción de brotes epidémicos que utiliza Machine Learning para predecir casos de 5 enfermedades con 2-4 semanas de anticipación:

- COVID-19
- Dengue
- Influenza
- Chikungunya
- Zika

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────┐
│  Vercel / AWS Amplify           │
│  Frontend: Next.js 14           │
│  https://predict-epidem.app     │
└────────────┬────────────────────┘
             │ HTTPS/REST
             ▼
┌─────────────────────────────────┐
│  API Gateway                    │
│  /api/predictions               │
│  /api/diseases/{name}           │
│  /api/health                    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  AWS Lambda (Python 3.11)       │
│  Serverless API                 │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Amazon S3                      │
│  Data Lake                      │
│  ├── data/                      │
│  ├── models/                    │
│  └── predictions/               │
└─────────────────────────────────┘
```

### Servicios AWS Utilizados

- ✅ **Amazon S3** - Data Lake para datos, modelos y predicciones
- ✅ **AWS Lambda** - API serverless en Python
- ✅ **API Gateway** - REST API endpoints
- ✅ **AWS Amplify** - Hosting del frontend (alternativa: Vercel)
- ✅ **CloudWatch** - Logs y monitoreo

**Costo**: $0 (AWS Free Tier)

---

## 📊 Datos

### Datos Reales
- ✅ **COVID-19**: 469,565 casos (Veracruz 2020-2024) - Secretaría de Salud México
- ✅ **Dengue**: 1,860,140 casos (México 2020-2024) - OpenDengue
- ✅ **Clima**: 1,827 días (Veracruz 2020-2024) - Open-Meteo

### Datos Sintéticos (Funcionales para MVP)
- ⚠️ **Influenza**: 65,466 casos (patrones estacionales)
- ⚠️ **Chikungunya**: 5,125 casos (patrones de brotes)
- ⚠️ **Zika**: 1,232 casos (brote 2016-2017)

---

## 🤖 Machine Learning

### Modelo
- **Algoritmo**: Random Forest Regressor
- **Features**: 7 (4 casos históricos + 3 climáticas)
  - `cases_lag_1`, `cases_lag_2`, `cases_lag_4`
  - `cases_ma_4w` (media móvil 4 semanas)
  - `temp_ma_4w`, `precip_sum_4w`, `humidity_ma_4w`
- **Horizonte**: 4 semanas
- **Validación**: 5-fold cross-validation

### Rendimiento
| Enfermedad   | R² Score | MAE    |
|--------------|----------|--------|
| Influenza    | 0.955    | 43.96  |
| Chikungunya  | 0.870    | 3.42   |
| Zika         | 0.709    | 1.05   |
| COVID-19     | 0.540    | 4.05   |
| Dengue       | -0.021   | 14,231 |

---

## 🚀 Instalación y Uso

### Backend

```bash
cd backend

# Instalar dependencias
pip install -r scripts/requirements.txt

# Ejecutar pipeline completo
python scripts/etl_multi_disease.py
python scripts/train_multi_disease.py
python scripts/generate_predictions.py
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar API URL
cp .env.local.example .env.local
# Editar NEXT_PUBLIC_API_URL con tu API Gateway URL

# Desarrollo
npm run dev

# Build
npm run build
npm start
```

---

## 📁 Estructura del Proyecto

```
predict-epidem/
├── backend/
│   ├── lambda/
│   │   ├── handler.py              # Lambda con 3 endpoints
│   │   └── requirements.txt
│   ├── scripts/
│   │   ├── etl_multi_disease.py    # ETL pipeline
│   │   ├── train_multi_disease.py  # Entrenamiento ML
│   │   └── generate_predictions.py # Generación predicciones
│   ├── data/
│   │   ├── raw/                    # Datos originales
│   │   └── processed/              # Datos procesados
│   ├── models/                     # Modelos .pkl
│   └── predictions/                # Predicciones JSON
│
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   ├── components/             # React components
│   │   ├── lib/                    # API client + utils
│   │   └── types/                  # TypeScript types
│   ├── public/
│   └── package.json
│
├── Data_training/                  # Datos sintéticos + guías
├── README.md
└── .gitignore
```

---

## 🔌 API Endpoints

### GET `/api/predictions`
Retorna predicciones de todas las enfermedades.

**Response:**
```json
{
  "predictions": [
    {
      "disease": "Influenza",
      "current_cases": 783,
      "predicted_cases": 804,
      "risk_level": "ALTO",
      "risk_score": 0.75,
      "trend": "ESTABLE",
      "timestamp": "2026-02-21T21:00:00Z",
      "horizon_weeks": 4
    }
  ]
}
```

### GET `/api/diseases/{name}`
Retorna datos de una enfermedad específica.

**Parámetros**: `covid`, `dengue`, `influenza`, `chikungunya`, `zika`

### GET `/api/health`
Health check del API.

---

## 🌐 Deployment

### 1. AWS Setup

```bash
# Configurar AWS CLI
aws configure

# Crear S3 bucket
aws s3 mb s3://predict-epidem-data
export BUCKET_NAME=predict-epidem-data

# Subir datos
aws s3 cp backend/data/ s3://$BUCKET_NAME/data/ --recursive
aws s3 cp backend/models/ s3://$BUCKET_NAME/models/ --recursive
aws s3 cp backend/predictions/ s3://$BUCKET_NAME/predictions/ --recursive
```

### 2. Deploy Lambda

```bash
cd backend/lambda

# Instalar dependencias
pip install -r requirements.txt -t .

# Crear ZIP
zip -r function.zip .

# Crear función
aws lambda create-function \
  --function-name predict-epidem-api \
  --runtime python3.11 \
  --role arn:aws:iam::ACCOUNT:role/lambda-s3-role \
  --handler handler.lambda_handler \
  --zip-file fileb://function.zip \
  --environment Variables={BUCKET_NAME=predict-epidem-data}

# Crear Function URL
aws lambda create-function-url-config \
  --function-name predict-epidem-api \
  --auth-type NONE \
  --cors AllowOrigins="*",AllowMethods="GET,OPTIONS"
```

### 3. Deploy Frontend

**Opción A: Vercel (Recomendado)**
```bash
cd frontend
npm install -g vercel
vercel
```

**Opción B: AWS Amplify**
1. Push a GitHub
2. AWS Console > Amplify > New app
3. Connect repository
4. Deploy

---

## 📈 Predicciones Actuales

| Enfermedad   | Actual | Predicción | Cambio | Riesgo   | Tendencia  |
|--------------|--------|------------|--------|----------|------------|
| Influenza    | 783    | 804        | +3%    | ALTO     | ESTABLE    |
| Dengue       | 3,104  | 4,630      | +49%   | MEDIO    | CRECIENTE  |
| COVID-19     | 13     | 13         | 0%     | BAJO     | ESTABLE    |
| Chikungunya  | 8      | 10         | +25%   | BAJO     | CRECIENTE  |
| Zika         | 2      | 2          | 0%     | BAJO     | ESTABLE    |

---

## 🛠️ Stack Tecnológico

### Backend
- Python 3.11
- Pandas, NumPy, Scikit-learn
- Boto3 (AWS SDK)

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Lucide Icons

### AWS
- S3, Lambda, API Gateway, Amplify, CloudWatch

---

## 📝 Fuentes de Datos

1. **COVID-19**: [Datos Abiertos México](https://datosabiertos.salud.gob.mx/)
2. **Dengue**: [OpenDengue](https://opendengue.org/) (CC BY 4.0)
3. **Clima**: [Open-Meteo](https://open-meteo.com/) (CC BY 4.0)

---

## 🎓 Próximos Pasos

- [ ] Integrar datos reales de Influenza, Chikungunya, Zika (PAHO/UNAM)
- [ ] Implementar modelos de series temporales (ARIMA, Prophet)
- [ ] Agregar features socioeconómicas y de movilidad
- [ ] Sistema de alertas por email/SMS
- [ ] API para integración con sistemas de salud

---

## 👥 Autor

**Fernando Silva**  
AWS Community Builder  
Competencia: 10,000 AIdeas 2026

---

## 📄 Licencia

MIT License

---

## 🏆 Competencia

Este proyecto participa en **10,000 AIdeas** de AWS Community Builders.

**Tags**: `#aideas-2025` `#KiroApp` `#MachineLearning` `#AWS`

**Demo**: [URL pendiente]  
**Artículo**: [builder.aws.com - pendiente]
