# Contexto de Dominio: Predicción de Dengue en México

## Ciclos Epidemiológicos

- México presenta ciclos de 4-6 años en brotes de dengue
- Estacionalidad: picos en temporada de lluvias (mayo-octubre)
- Serotipo predominante 2023-2025: DENV-3 (>85%)

## Variables Críticas para Predicción

### 1. Climáticas (lead time: 4-8 semanas)
- Temperatura 25-30°C → alta transmisión
- Humedad >70% → cría de mosquitos
- Precipitación acumulada

### 2. Epidemiológicas (lag: 2-4 semanas)
- Casos confirmados semana anterior
- Hospitalizaciones
- Casos dengue grave

### 3. Sociales (opcional)
- Búsquedas Google "síntomas dengue"
- Densidad población urbana

## Estados Prioritarios México

1. **Veracruz** (histórica alta incidencia)
2. **Guerrero**
3. **Chiapas**
4. **Quintana Roo**
5. **Yucatán**

## Métricas de Éxito

- Predecir brote 2-4 semanas antes
- Accuracy >75% en clasificación de riesgo (bajo/medio/alto/crítico)
- False negatives < 10% (prioritario: no perder brotes reales)

## Datos Históricos

- SINAVE: Sistema Nacional de Vigilancia Epidemiológica
- Boletines epidemiológicos semanales desde 1985
- Datos públicos disponibles en formato CSV/PDF
- URL: https://www.gob.mx/salud/documentos/boletin-epidemiologico

## Contexto Médico

### Dengue en México 2024-2025
- 300,000+ casos reportados en 2024 (incremento 400% vs años anteriores)
- DENV-3 predomina (86% en 2024, 94.9% en 2025)
- Hospitalizaciones masivas en Veracruz, Guerrero, Chiapas
- Colapso de sistemas de salud en temporada de lluvias

### Necesidades Hospitalarias
- Hospitales necesitan 2 semanas mínimo para prepararse
- Recursos críticos: camas UCI, medicamentos, personal médico
- Zonas rurales sin internet requieren alertas SMS

## Algoritmos ML Recomendados

- **DeepAR+**: Deep learning para series temporales con estacionalidad
- **Prophet**: Maneja tendencias y ciclos múltiples
- **CNN-QR**: Redes convolucionales para patrones complejos
- **ARIMA**: Baseline para comparación

## Horizonte de Predicción

- **Óptimo**: 2-4 semanas adelante
- **Mínimo útil**: 1 semana
- **Máximo confiable**: 6 semanas
