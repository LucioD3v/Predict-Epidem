# 📚 FUENTES DE DATOS REALES

## 🦠 INFLUENZA

### Opción 1: UNAM Pathogens Portal
- URL: https://www.pathogens.ibt.unam.mx/dashboards/influenza/
- Datos: México, actualizados semanalmente
- Formato: Dashboard interactivo (requiere scraping o contacto directo)

### Opción 2: Datos Abiertos México (Incluido en COVID)
- Los archivos COVID19MEXICO incluyen clasificación de Influenza
- Columna: CLASIFICACION_FINAL_FLU
- Valores: 1=Influenza confirmada
- Problema: En Veracruz 2020-2024 no hay casos confirmados registrados

### Opción 3: WHO FluNet
- URL: https://www.who.int/tools/flunet
- Datos globales de influenza
- Requiere registro

## 🦟 CHIKUNGUNYA

### Opción 1: PAHO Arbo Portal
- URL: https://www.paho.org/en/arbo-portal/chikungunya-data-and-analysis
- Datos: Américas, por país
- Formato: Dashboard (no descarga directa)

### Opción 2: Datos Abiertos México
- URL: https://www.gob.mx/salud/documentos/datos-abiertos-152127
- Buscar: "Enfermedades transmitidas por vector"
- Puede incluir Chikungunya

### Opción 3: Estudios Publicados
- Lancet: https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(21)00030-9/fulltext
- Datos de hotspots urbanos en México

## 🦟 ZIKA

### Opción 1: PAHO Arbo Portal
- URL: https://www.paho.org/en/arbo-portal/zika-data-and-analysis
- Datos: Américas, por país
- Formato: Dashboard

### Opción 2: CDC GitHub (Histórico)
- URL: https://github.com/cdcepi/zika
- Datos: 2015-2017 (brote principal)
- Nota: Repositorio puede estar desactualizado

### Opción 3: Estudios en México
- BMC: https://bmcinfectdis.biomedcentral.com/articles/10.1186/s12879-021-06520-x
- Datos de Tapachula, Chiapas 2016-2018

## 📊 ESTADO ACTUAL

### Datos Reales Disponibles:
- ✅ COVID-19: 469,565 casos (Veracruz 2020-2024)
- ✅ Dengue: 1,860,140 casos (México 2020-2024)
- ✅ Clima: Sintéticos (reemplazar con Visual Crossing)

### Datos Sintéticos (Basados en patrones epidemiológicos):
- ⚠️ Influenza: 261 semanas, 65,466 casos
- ⚠️ Chikungunya: 261 semanas, 5,125 casos
- ⚠️ Zika: 261 semanas, 1,232 casos

## 💡 RECOMENDACIÓN

Para el MVP de la competencia:
1. Usar datos sintéticos actuales (son realistas)
2. Mencionar en el artículo que son "basados en patrones epidemiológicos"
3. En "Future Work" mencionar integración de datos reales
4. Enfocarse en COVID y Dengue que SÍ tienen datos reales

Los modelos funcionan bien con datos sintéticos para demostración.
El valor está en la arquitectura AWS y el sistema multi-enfermedad.
