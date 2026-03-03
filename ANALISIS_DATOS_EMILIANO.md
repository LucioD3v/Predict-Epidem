# 📊 Análisis de Datos Proporcionados por Emiliano

**Fecha**: 21 de febrero, 2026  
**Ubicación**: `/Users/fernandosilva/Documents/Predict-Epidem/Data/`

---

## ✅ DATOS DISPONIBLES

### 1. **COVID-19 México (2024)** ⭐ ÚTIL
- **Archivo**: `COVID19MEXICO2024.zip` (29.8 MB)
- **Contenido**: Casos individuales de COVID-19 en México
- **Columnas clave**:
  - `FECHA_SINTOMAS`: Fecha de inicio de síntomas
  - `ENTIDAD_RES`: Estado de residencia (código)
  - `MUNICIPIO_RES`: Municipio de residencia
  - `EDAD`, `SEXO`: Demografía
  - `DIABETES`, `HIPERTENSION`, `OBESIDAD`: Comorbilidades
- **Período**: 2024
- **Formato**: CSV con registros individuales
- **Uso potencial**: ✅ Modelo de predicción de enfermedades respiratorias

### 2. **IHME - Datos de Salud México** ⚠️ LIMITADO
- **Archivos**: 
  - `download.csv` (102 KB)
  - `download (1).csv` (102 KB)
- **Contenido**: DALYs (Disability-Adjusted Life Years) para México
- **Enfermedades incluidas**:
  - ✅ **Dengue** (línea 66-67)
  - Tuberculosis
  - HIV/AIDS
  - Diarrea
  - Infecciones respiratorias
- **Período**: 1990-2023
- **Limitación**: ⚠️ Solo tiene 2 líneas de dengue:
  - Porcentaje de DALYs en 2023: 0.00044%
  - Cambio anual 1990-2023: +5.88%
- **Uso potencial**: ⚠️ Insuficiente para predicción (no hay series temporales detalladas)

### 3. **IHME - HIV/AIDS Latinoamérica** ❌ NO RELEVANTE
- **Archivos**: 
  - `IHME_LA_HIV_MORT_2000_2017_*.zip` (múltiples archivos, ~1.3 GB total)
- **Contenido**: Mortalidad por HIV/AIDS en Latinoamérica 2000-2017
- **Uso potencial**: ❌ No relevante para dengue

### 4. **PAHO - Egresos Hospitalarios México** ❌ NO TIENE DENGUE
- **Archivo**: `esep_english_00_csv.zip` (7 KB)
- **Contenido**: Pacientes egresados de hospitales en México
- **Período**: 2004-2022
- **Limitación**: ❌ No contiene datos de dengue
- **Uso potencial**: ❌ No útil para este proyecto

### 5. **PAHO - Recursos Privados** ❌ NO RELEVANTE
- **Archivo**: `recursospriv_english_00_xlsx.zip` (9 KB)
- **Contenido**: Recursos de salud privados
- **Uso potencial**: ❌ No relevante

### 6. **WHO - Tuberculosis** ❌ NO RELEVANTE
- **Archivo**: `C288D13_ALL_LATEST.csv` (693 KB)
- **Contenido**: Casos de tuberculosis por país
- **Uso potencial**: ❌ No relevante para dengue

### 7. **WHO - Malaria** ❌ NO RELEVANTE
- **Archivo**: `442CEA8_ALL_LATEST.csv` (462 KB)
- **Contenido**: Casos de malaria por país
- **Uso potencial**: ❌ No relevante para dengue

### 8. **WHO - Enfermedades No Transmisibles** ❌ NO RELEVANTE
- **Archivo**: `1F96863_ALL_LATEST.csv` (2.3 MB)
- **Contenido**: Muertes por enfermedades no transmisibles
- **Uso potencial**: ❌ No relevante para dengue

---

## 🚨 PROBLEMA CRÍTICO: NO HAY DATOS DE DENGUE

### ❌ Lo que NO tenemos:
- Series temporales de casos de dengue por semana/mes
- Datos de dengue específicos de Veracruz
- Datos epidemiológicos detallados de dengue

### ✅ Lo que SÍ tenemos:
- Datos de COVID-19 con estructura temporal útil
- Datos agregados de dengue (solo 2 líneas, insuficiente)

---

## 💡 SOLUCIONES PROPUESTAS

### OPCIÓN 1: Usar COVID-19 como Demo ⭐ RECOMENDADO
**Ventajas**:
- ✅ Datos reales y completos
- ✅ Series temporales detalladas (2024)
- ✅ Incluye Veracruz (código entidad: 30)
- ✅ Mismo pipeline ML funciona
- ✅ Relevante para salud pública

**Cambios necesarios**:
```python
# En lugar de:
# "Predict-Epidem: Predicción de Dengue"

# Usar:
# "Predict-Epidem: Sistema de Alerta Temprana de Enfermedades"
# MVP: COVID-19, Expansión: Dengue, Chikungunya, etc.
```

**Arquitectura AWS**: ✅ Igual (S3, Lambda, Amplify)

### OPCIÓN 2: Descargar Datos de Dengue de PAHO ⚠️ REQUIERE TIEMPO
**Fuente**: https://opendata.paho.org/en/dengue-indicators

**Pasos**:
1. Ir a PAHO Open Data
2. Buscar "Dengue cases Mexico"
3. Filtrar por Veracruz
4. Descargar CSV con series temporales

**Tiempo estimado**: 1-2 horas

**Riesgo**: ⚠️ Puede que no haya datos granulares de Veracruz

### OPCIÓN 3: Usar Datos Sintéticos ❌ NO RECOMENDADO
**Por qué NO**:
- ❌ Pierde credibilidad
- ❌ No cumple requisito de "datos reales"
- ❌ Competencia requiere impacto real

---

## 🎯 RECOMENDACIÓN FINAL

### ✅ USAR COVID-19 COMO MVP

**Justificación**:
1. **Datos completos y reales** ✅
2. **Mismo problema epidemiológico** (predicción de brotes)
3. **Misma arquitectura AWS** ✅
4. **Más relevante actualmente** (COVID sigue siendo problema)
5. **Expansión futura a dengue** (roadmap)

**Narrativa para el artículo**:
```markdown
# Predict-Epidem: Sistema de Alerta Temprana con AWS

## Our Vision
Crear un sistema escalable de predicción de brotes epidemiológicos
usando Machine Learning y AWS.

## MVP: COVID-19
Comenzamos con COVID-19 porque:
- Datos completos disponibles
- Problema actual en México
- Infraestructura reutilizable

## Roadmap
- ✅ Fase 1: COVID-19 (MVP)
- 🔄 Fase 2: Dengue
- 🔄 Fase 3: Multi-enfermedad (Chikungunya, Zika)
```

---

## 📝 CAMBIOS NECESARIOS EN README.md

### Actualizar secciones:

1. **Título**:
```markdown
# 🦠 Predict-Epidem: Sistema de Alerta Temprana
## Predicción de Brotes Epidemiológicos con AWS
**MVP**: COVID-19 | **Roadmap**: Dengue, Chikungunya, Zika
```

2. **Datos**:
```markdown
### Datos Disponibles
- ✅ COVID-19 México 2024 (29.8 MB)
- 🔄 Dengue (próxima fase)
```

3. **Scripts ETL**:
```python
# Leer COVID en lugar de dengue
covid = pd.read_csv('data/raw/COVID19MEXICO.csv')

# Filtrar Veracruz (código 30)
veracruz = covid[covid['ENTIDAD_RES'] == '30']

# Agrupar por semana epidemiológica
weekly = veracruz.groupby(
    pd.to_datetime(veracruz['FECHA_SINTOMAS']).dt.isocalendar().week
).size().reset_index(name='cases')
```

---

## ⏱️ IMPACTO EN TIMELINE

### Sin cambios:
- ✅ Semana 1: Igual (usar COVID en lugar de dengue)
- ✅ Semana 2: Igual (misma arquitectura AWS)
- ✅ Semana 3: Ajustar narrativa del artículo

**Tiempo adicional**: 0 horas (datos ya disponibles)

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. ✅ Extraer datos de COVID
2. ✅ Filtrar Veracruz
3. ✅ Crear series temporales semanales
4. ✅ Continuar con pipeline ML
5. ✅ Actualizar README.md con nueva narrativa

---

## 📞 PREGUNTAS PARA EMILIANO

Si necesitas datos específicos de dengue:
1. ¿Tienes acceso a datos de dengue de Veracruz?
2. ¿Qué período necesitas? (2020-2024 ideal)
3. ¿Granularidad? (semanal/mensual)

**Mientras tanto**: Proceder con COVID-19 como MVP ✅
