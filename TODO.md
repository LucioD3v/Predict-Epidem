# 📋 CHECKLIST - QUÉ FALTA PARA COMPLETAR

**Fecha actual**: 21 de febrero, 2026  
**Deadline**: 13 de marzo, 2026  
**Tiempo restante**: ~3 semanas

---

## ✅ SEMANA 1 - PREPARACIÓN (COMPLETO)

### Datos
- [x] Descargar datos COVID-19 (469K casos)
- [x] Descargar datos Dengue (1.86M casos)
- [x] Descargar datos climáticos reales (1,827 días)
- [x] Generar datos sintéticos (Influenza, Chikungunya, Zika)
- [x] Documentar fuentes de datos

### Machine Learning
- [x] Script ETL multi-enfermedad
- [x] Script entrenamiento modelos
- [x] Script generación predicciones
- [x] Entrenar 5 modelos
- [x] Generar predicciones JSON

### Backend
- [x] Crear estructura backend/
- [x] Lambda handler con 3 endpoints
- [x] requirements.txt para Lambda
- [x] Mover datos/modelos/predicciones a backend/

### Frontend
- [x] Crear estructura frontend/
- [x] Configurar Next.js 14 + TypeScript
- [x] Crear tipos TypeScript
- [x] Crear API client
- [x] Componente PredictionCard
- [x] Componente Sidebar (AWS services)
- [x] Página principal (Dashboard)
- [x] Configuración TailwindCSS
- [x] .env.local.example

### Documentación
- [x] README.md actualizado
- [x] .gitignore actualizado
- [x] ANALISIS_DATOS_EMILIANO.md
- [x] DATOS_DESCARGADOS.md
- [x] COMO_AGREGAR_DENGUE.md

---

## ❌ SEMANA 2 - AWS DEPLOYMENT (TODO POR HACER)

### Día 1-2: AWS Setup (4h)
- [ ] Crear cuenta AWS Free Tier (si no existe)
- [ ] Verificar email y configurar MFA
- [ ] Crear usuario IAM con permisos:
  - S3FullAccess
  - LambdaFullAccess
  - APIGatewayAdministrator
  - CloudWatchLogsFullAccess
- [ ] Instalar AWS CLI: `pip install awscli`
- [ ] Configurar credenciales: `aws configure`
- [ ] Verificar acceso: `aws sts get-caller-identity`

### Día 3: S3 Setup (2h)
- [ ] Crear bucket S3: `aws s3 mb s3://predict-epidem-data`
- [ ] Configurar permisos del bucket
- [ ] Subir datos: `aws s3 cp backend/data/ s3://predict-epidem-data/data/ --recursive`
- [ ] Subir modelos: `aws s3 cp backend/models/ s3://predict-epidem-data/models/ --recursive`
- [ ] Subir predicciones: `aws s3 cp backend/predictions/ s3://predict-epidem-data/predictions/ --recursive`
- [ ] Verificar archivos: `aws s3 ls s3://predict-epidem-data/ --recursive`

### Día 4-5: Lambda + API Gateway (8h)
- [ ] Crear rol IAM para Lambda (con acceso a S3)
- [ ] Instalar dependencias Lambda:
  ```bash
  cd backend/lambda
  pip install -r requirements.txt -t .
  ```
- [ ] Crear ZIP del Lambda:
  ```bash
  zip -r function.zip handler.py boto3/
  ```
- [ ] Crear función Lambda:
  ```bash
  aws lambda create-function \
    --function-name predict-epidem-api \
    --runtime python3.11 \
    --role arn:aws:iam::ACCOUNT:role/lambda-s3-role \
    --handler handler.lambda_handler \
    --zip-file fileb://function.zip \
    --environment Variables={BUCKET_NAME=predict-epidem-data} \
    --timeout 30 \
    --memory-size 512
  ```
- [ ] Crear Function URL o API Gateway
- [ ] Configurar CORS
- [ ] Probar endpoints:
  - [ ] GET /api/predictions
  - [ ] GET /api/diseases/covid
  - [ ] GET /api/health
- [ ] Guardar URL del API

### Día 6-7: Frontend Deploy (8h)
- [ ] Probar frontend localmente:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- [ ] Verificar que funciona en http://localhost:3000
- [ ] Crear .env.local con API URL real
- [ ] Probar integración con API real
- [ ] **Opción A: Deploy en Vercel**
  - [ ] Crear cuenta en Vercel
  - [ ] Instalar Vercel CLI: `npm i -g vercel`
  - [ ] Deploy: `vercel`
  - [ ] Configurar variable de entorno NEXT_PUBLIC_API_URL
  - [ ] Obtener URL pública
- [ ] **Opción B: Deploy en AWS Amplify**
  - [ ] Push código a GitHub
  - [ ] AWS Console > Amplify > New app
  - [ ] Conectar repositorio
  - [ ] Configurar build settings
  - [ ] Agregar variable de entorno
  - [ ] Deploy
  - [ ] Obtener URL pública

### Día 8: Testing & Screenshots (4h)
- [ ] Probar demo completo end-to-end
- [ ] Verificar que todas las predicciones se muestran
- [ ] Probar en móvil (responsive)
- [ ] Screenshots:
  - [ ] AWS S3 Console (bucket con archivos)
  - [ ] AWS Lambda Console (función)
  - [ ] API Gateway Console (endpoints)
  - [ ] CloudWatch Logs (logs del Lambda)
  - [ ] Frontend dashboard completo
  - [ ] Frontend en móvil
- [ ] Grabar video demo (2-3 minutos):
  - [ ] Mostrar dashboard
  - [ ] Explicar predicciones
  - [ ] Mostrar AWS Console
  - [ ] Explicar arquitectura
- [ ] Crear diagrama de arquitectura (draw.io o similar)

---

## ❌ SEMANA 3 - ARTÍCULO & PUBLICACIÓN (TODO POR HACER)

### Día 1-3: Escribir Artículo (12h)
- [ ] Crear borrador en Markdown
- [ ] Estructura del artículo:
  - [ ] Título llamativo
  - [ ] Introducción (problema de salud pública)
  - [ ] Visión del proyecto
  - [ ] Arquitectura AWS (diagrama)
  - [ ] Datos utilizados (mencionar fuentes)
  - [ ] Machine Learning (explicar modelo)
  - [ ] Demo (screenshots + video)
  - [ ] Resultados y predicciones
  - [ ] Aprendizajes y desafíos
  - [ ] Próximos pasos
  - [ ] Conclusión
- [ ] Agregar screenshots
- [ ] Agregar video demo
- [ ] Mencionar servicios AWS prominentemente
- [ ] Incluir enlaces:
  - [ ] Demo público
  - [ ] GitHub repository
  - [ ] Fuentes de datos
- [ ] Revisar ortografía y gramática

### Día 4-5: Publicar (8h)
- [ ] Crear cuenta en builder.aws.com (si no existe)
- [ ] Subir artículo
- [ ] Agregar tags obligatorios:
  - [ ] #aideas-2025
  - [ ] #KiroApp
- [ ] Agregar tags adicionales:
  - [ ] #MachineLearning
  - [ ] #HealthTech
  - [ ] #Serverless
  - [ ] #Python
- [ ] Revisar preview
- [ ] Publicar
- [ ] Verificar que aparece en builder.aws.com

### Día 6: GitHub & Documentación Final (4h)
- [ ] Crear repositorio público en GitHub
- [ ] Push código completo
- [ ] Verificar .gitignore (no subir datos grandes)
- [ ] Actualizar README.md con:
  - [ ] URL del demo
  - [ ] URL del artículo
  - [ ] Screenshots
  - [ ] Instrucciones de deployment
- [ ] Crear LICENSE (MIT)
- [ ] Crear CONTRIBUTING.md (opcional)
- [ ] Agregar badges al README
- [ ] Verificar que todo funciona

### Día 7: Preparación para Votación (4h)
- [ ] Crear post en redes sociales:
  - [ ] LinkedIn
  - [ ] Twitter/X
  - [ ] Comunidades AWS
- [ ] Preparar pitch de 1 minuto
- [ ] Revisar que todos los enlaces funcionan
- [ ] Probar demo desde diferentes dispositivos
- [ ] Backup de todo el código
- [ ] Documentar costos AWS (debe ser $0)

---

## 📊 RESUMEN DE PROGRESO

| Fase                  | Estado      | Progreso |
|-----------------------|-------------|----------|
| Semana 1: Preparación | ✅ Completo | 100%     |
| Semana 2: Deployment  | ❌ Pendiente| 0%       |
| Semana 3: Artículo    | ❌ Pendiente| 0%       |

**Progreso Total**: 33% (1 de 3 semanas)

---

## 🚨 CRÍTICO - NO OLVIDAR

1. **Tags obligatorios**: #aideas-2025 #KiroApp
2. **Deadline**: Marzo 13, 2026
3. **AWS debe ser visible**: Screenshots del Console
4. **Demo funcional**: URL pública accesible
5. **Artículo publicado**: En builder.aws.com
6. **GitHub público**: Con código completo
7. **Costo $0**: Solo Free Tier

---

## 📞 RECURSOS

- **AWS Free Tier**: https://aws.amazon.com/free/
- **builder.aws.com**: https://builder.aws.com/
- **Vercel**: https://vercel.com/
- **10,000 AIdeas**: https://community.aws/10000-aideas

---

## 🎯 PRÓXIMO PASO INMEDIATO

**Empezar Semana 2 - Día 1:**
1. Verificar si tienes cuenta AWS
2. Si no, crear cuenta AWS Free Tier
3. Configurar AWS CLI
4. Crear bucket S3

**Comando para empezar:**
```bash
aws configure
```
