# 🚨 PLAN DE RESCATE URGENTE: PREDICT-EPIDEM

**Deadline**: 13 marzo 2026 (14 días restantes)  
**Objetivo**: Alinear implementación con propuesta oficial de competencia 10,000 AIdeas

---

## 📊 SITUACIÓN ACTUAL

### ❌ Desajuste Crítico Identificado

**Servicios Prometidos en Propuesta:**
- ✅ Kiro (AI chatbot)
- ✅ SageMaker (ML training/inference)
- ✅ AWS Glue (ETL automatizado)
- ✅ Amazon QuickSight (dashboards)
- ✅ Amazon SNS (alertas SMS/email)
- ✅ Amazon AppFlow (integración APIs)
- ✅ AWS Lambda (compute)
- ✅ Amazon S3 (Data Lake)

**Servicios Implementados Actualmente:**
- ✅ S3 (parcial)
- ✅ Lambda (básico)
- ❌ Resto: NO IMPLEMENTADO

**Impacto**: Solo ~20% de la arquitectura prometida está implementada.

---

## 🎯 NUEVA ARQUITECTURA (100% Free Tier)

### Cambios Clave

1. **Amazon Forecast → SageMaker Canvas**
   - Forecast deprecated desde 2024
   - Canvas es no-code, 160 hrs FREE por 2 meses
   - Mismos algoritmos: DeepAR+, Prophet, CNN-QR, ARIMA

2. **Enfoque: México Específicamente**
   - Cambio de "Latinoamérica" a "México - Dengue"
   - Estados prioritarios: Veracruz, Guerrero, Chiapas, Yucatán, Quintana Roo
   - Datos públicos: SINAVE (Sistema Nacional de Vigilancia Epidemiológica)

3. **Datos Reales Disponibles**
   - SINAVE: Boletines epidemiológicos semanales desde 1985
   - Weather API: Free tier 1M calls/month
   - Ciclos documentados: 4-6 años en México
   - DENV-3 predominante 2023-2025 (>85%)

---

## ✅ CHECKLIST DE ACCIÓN (14 DÍAS)

### DÍA 1-2: Setup Inicial ✅ COMPLETADO

- [x] Crear estructura de specs Kiro
- [x] Steering file con contexto epidemiológico
- [x] Spec: Data Pipeline
- [x] Spec: ML Pipeline (SageMaker Canvas)
- [x] Spec: Alert System (SNS)
- [x] Lambda: ingest_sinave.py
- [x] Lambda: ingest_weather.py

### DÍA 3-4: Data Pipeline

- [ ] **Lambda: process_unified.py**
  - Unir datos dengue + clima
  - Feature engineering (lags, moving averages)
  - Guardar Parquet en S3

- [ ] **Lambda: prepare_canvas_dataset.py**
  - Convertir datos a formato Canvas
  - Validar schema
  - Subir a S3

- [ ] **CloudFormation: data-pipeline.yaml**
  - Definir Lambdas
  - EventBridge triggers (semanal)
  - IAM roles
  - S3 bucket

- [ ] **Descargar datos históricos SINAVE**
  - Buscar CSV públicos 2020-2025
  - Subir a S3 como seed data

- [ ] **Testing pipeline completo**
  - Ejecutar ingesta manual
  - Verificar datos en S3
  - Validar formato

### DÍA 5-6: SageMaker Canvas

- [ ] **Configurar SageMaker Canvas**
  - Crear dominio SageMaker
  - Abrir Canvas UI
  - Importar dataset desde S3

- [ ] **Entrenar modelo**
  - Quick Build (2-4 horas)
  - Configurar forecast horizon: 4 semanas
  - Seleccionar features
  - Esperar resultados

- [ ] **Evaluar métricas**
  - WAPE < 0.15 (objetivo)
  - MAPE < 0.20
  - Revisar backtesting

- [ ] **Generar predicciones**
  - Predicción 4 semanas adelante
  - Exportar a S3
  - Validar formato

- [ ] **Screenshots para artículo**
  - Canvas UI con métricas
  - Gráfica predicción vs real
  - Configuración del modelo

### DÍA 7-8: Sistema de Alertas

- [ ] **Lambda: evaluate_risk_and_alert.py**
  - Leer predicciones de S3
  - Calcular niveles de riesgo
  - Lógica de alertas (riesgo > 80%)

- [ ] **Configurar Amazon SNS**
  - Crear topics: dengue-alerts-critical, dengue-alerts-high
  - Agregar suscriptores de prueba
  - Configurar templates SMS/Email

- [ ] **Lambda: manage_subscribers.py**
  - CRUD para suscriptores
  - Filtros por estado
  - Validación de contactos

- [ ] **Testing alertas**
  - Simular riesgo CRÍTICO
  - Verificar envío SMS/Email
  - Revisar logs CloudWatch

- [ ] **Screenshots para artículo**
  - Ejemplo SMS recibido
  - Email HTML formateado
  - Dashboard de alertas

### DÍA 9: QuickSight Dashboard

- [ ] **Configurar QuickSight**
  - Activar Free Trial (30 días)
  - Conectar a S3
  - Crear dataset

- [ ] **Crear visualizaciones**
  - Mapa de México con niveles de riesgo por estado
  - Gráfica de tendencia temporal
  - Tabla de predicciones
  - KPIs: casos actuales, predichos, % aumento

- [ ] **Embeber dashboard (opcional)**
  - Generar URL pública
  - Integrar en frontend Next.js

- [ ] **Screenshots para artículo**
  - Dashboard completo
  - Mapa de calor
  - Gráficas de tendencias

### DÍA 10: Integración Kiro

- [ ] **Documentar uso de Kiro**
  - Cómo se usaron specs
  - Steering files para contexto
  - Ejemplos de prompts
  - Tiempo ahorrado

- [ ] **Crear ejemplos**
  - Prompt que generó Lambda
  - Spec que usó Kiro
  - Output generado

- [ ] **Screenshots**
  - Kiro IDE con specs
  - Conversación con Kiro
  - Código generado

### DÍA 11-12: Artículo AWS Builder Center

- [ ] **Escribir artículo completo**
  - Título: "AIdeas: Predict-Epidem México - Predicción de Brotes de Dengue con IA"
  - Tags: #aideas-2025 #Kiro #SocialImpact
  - Secciones:
    - Our Vision (150-200 palabras)
    - The Problem (100-150 palabras)
    - How We Built This (300-400 palabras) - INCLUIR KIRO
    - Architecture Diagram
    - Demo / Screenshots (mínimo 3)
    - Key Features
    - What We Learned (150-200 palabras)
    - Future Roadmap

- [ ] **Crear diagrama de arquitectura**
  - Herramienta: draw.io o Lucidchart
  - Mostrar flujo completo
  - Incluir todos los servicios AWS

- [ ] **Preparar screenshots**
  - Organizar en carpeta
  - Optimizar tamaño
  - Agregar captions

- [ ] **Revisar con mentora**
  - Enviar draft
  - Incorporar feedback
  - Pulir redacción

### DÍA 13: Publicación y GitHub

- [ ] **Publicar artículo**
  - Subir a builder.aws.com
  - Verificar formato
  - Agregar tags correctos

- [ ] **Preparar repositorio GitHub**
  - Limpiar código
  - README completo
  - Documentación setup
  - CloudFormation templates
  - Ejemplos de datos

- [ ] **Push a GitHub**
  - Crear repo público
  - Commit todo el código
  - Agregar LICENSE (MIT)
  - Agregar badges

- [ ] **Actualizar frontend**
  - Conectar a APIs reales
  - Actualizar URLs
  - Rebuild y deploy a S3/Amplify

- [ ] **Testing end-to-end**
  - Verificar pipeline completo
  - Probar alertas
  - Validar dashboard

### DÍA 14: Buffer y Promoción

- [ ] **Revisión final**
  - Verificar todos los servicios funcionan
  - Probar demo completo
  - Corregir bugs de último minuto

- [ ] **Promoción**
  - Compartir artículo en LinkedIn
  - Twitter con hashtags
  - Comunidad AWS
  - Pedir likes/shares

- [ ] **Preparar presentación**
  - Slides de 5 minutos
  - Demo en vivo
  - Video de 2-3 minutos (opcional)

---

## 📁 ESTRUCTURA DE ARCHIVOS CREADA

```
Predict-Epidem/
├── .kiro/
│   ├── steering/
│   │   └── epidemiology-context.md ✅
│   └── specs/
│       ├── spec-data-pipeline.md ✅
│       ├── spec-ml-pipeline.md ✅
│       └── spec-alert-system.md ✅
├── backend/
│   ├── lambda/
│   │   ├── ingest_sinave.py ✅
│   │   ├── ingest_weather.py ✅
│   │   ├── process_unified.py (pendiente)
│   │   ├── prepare_canvas_dataset.py (pendiente)
│   │   ├── evaluate_risk_and_alert.py (pendiente)
│   │   ├── manage_subscribers.py (pendiente)
│   │   └── requirements.txt (pendiente)
│   ├── cloudformation/
│   │   ├── data-pipeline.yaml (pendiente)
│   │   ├── alert-system.yaml (pendiente)
│   │   └── sagemaker-canvas.yaml (pendiente)
│   └── scripts/
│       └── setup_sns_topics.py (pendiente)
├── frontend/ (existente, actualizar)
├── docs/
│   ├── article-draft.md (pendiente)
│   ├── architecture-diagram.png (pendiente)
│   └── screenshots/ (pendiente)
└── README.md (actualizar)
```

---

## 💰 PRESUPUESTO FREE TIER (CONFIRMADO $0)

| Servicio | Free Tier | Uso Estimado | Costo |
|----------|-----------|--------------|-------|
| S3 | 5GB storage | ~2GB | $0 |
| Lambda | 1M requests/month | ~500/month | $0 |
| SageMaker Canvas | 160 hrs × 2 meses | ~10 hrs | $0 |
| SNS | 1000 emails + 100 SMS | ~40 emails + 40 SMS | $0 |
| QuickSight | 30 días trial | 14 días | $0 |
| EventBridge | 14M eventos | ~100/month | $0 |
| CloudWatch | 5GB logs | ~1GB | $0 |
| **TOTAL** | | | **$0** |

---

## 🎓 RECURSOS NECESARIOS

### Tutoriales AWS
- SageMaker Canvas: https://aws.amazon.com/sagemaker/canvas/
- SNS SMS: https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html
- QuickSight: https://aws.amazon.com/quicksight/getting-started/

### Datos México
- SINAVE: https://www.gob.mx/salud/documentos/boletin-epidemiologico
- Datos Abiertos: https://datos.gob.mx
- Weather API: https://www.weatherapi.com/

### Kiro
- Docs: https://kiro.dev/docs
- Spec-Driven Development: https://kiro.dev/docs/specs

---

## ⚠️ RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Datos SINAVE no disponibles | Media | Alto | Usar datos históricos descargados manualmente |
| SageMaker Canvas tarda >4 hrs | Baja | Medio | Usar Quick Build, no Standard |
| SNS SMS no funciona en México | Media | Medio | Priorizar emails, SMS como bonus |
| QuickSight no en Free Tier | Baja | Bajo | Usar trial 30 días, suficiente |
| No terminar en 14 días | Media | Alto | Priorizar MVP, features opcionales al final |

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

### AHORA MISMO (próximas 2 horas):

1. **Descargar datos históricos SINAVE**
   - Buscar CSV públicos de dengue México 2020-2025
   - Guardar en `backend/data/historical/`

2. **Configurar AWS**
   - Crear bucket S3: `predict-epidem-mx`
   - Subir datos históricos
   - Configurar IAM roles

3. **Completar Lambda process_unified.py**
   - Unir dengue + clima
   - Feature engineering
   - Guardar Parquet

### MAÑANA (DÍA 3):

4. **Configurar SageMaker Canvas**
   - Crear dominio
   - Preparar dataset
   - Iniciar Quick Build

5. **Mientras Canvas entrena (2-4 hrs)**
   - Escribir Lambda de alertas
   - Configurar SNS topics
   - Crear templates de mensajes

---

## 📞 CONTACTO Y SOPORTE

- **Mentora**: [Nombre de tu mentora]
- **Equipo**: Vicente G Guzmán, Emiliano Martínez, Fernando Silva
- **Comunidad AWS**: AWS Community Builders Slack

---

## ✅ CRITERIOS DE ÉXITO

### Mínimo Viable (DEBE tener):
- ✅ Pipeline de datos funcionando (Lambda + S3)
- ✅ Modelo SageMaker Canvas entrenado con WAPE < 0.20
- ✅ Sistema de alertas SNS operativo
- ✅ Dashboard QuickSight con mapa de México
- ✅ Artículo publicado en builder.aws.com
- ✅ Código en GitHub público
- ✅ Uso de Kiro documentado

### Deseable (Nice to have):
- ⚠️ Frontend conectado a APIs reales
- ⚠️ What-if analysis en Canvas
- ⚠️ Video demo 2-3 minutos
- ⚠️ Integración Google Trends

### Opcional (Si hay tiempo):
- ❌ Mobile app
- ❌ WhatsApp integration
- ❌ Expansión a otros países

---

**ÚLTIMA ACTUALIZACIÓN**: 2026-02-27  
**ESTADO**: ✅ Fase 1 Completada (Specs + Lambdas iniciales)  
**SIGUIENTE**: Día 3 - Completar Data Pipeline
