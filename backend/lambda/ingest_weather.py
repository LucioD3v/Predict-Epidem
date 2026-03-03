"""
Lambda Function: Ingest Weather Data
Descarga datos climáticos de Weather API para estados prioritarios de México
"""

import json
import boto3
import requests
from datetime import datetime, timedelta
import logging

# Configuración
logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client('s3')
secrets_client = boto3.client('secretsmanager')

BUCKET_NAME = 'predict-epidem-mx'

# Coordenadas de capitales de estados prioritarios
ESTADOS_COORDS = {
    'Veracruz': {'lat': 19.1738, 'lon': -96.1342},
    'Guerrero': {'lat': 17.5516, 'lon': -99.5047},  # Chilpancingo
    'Chiapas': {'lat': 16.7569, 'lon': -93.1292},   # Tuxtla Gutiérrez
    'Yucatán': {'lat': 20.9674, 'lon': -89.5926},   # Mérida
    'Quintana Roo': {'lat': 21.1619, 'lon': -86.8515}  # Cancún
}

def lambda_handler(event, context):
    """
    Handler principal
    """
    try:
        logger.info("Iniciando ingesta de datos climáticos")
        
        # 1. Obtener API key de Secrets Manager
        api_key = get_weather_api_key()
        
        # 2. Obtener fecha
        fecha = datetime.now().strftime('%Y-%m-%d')
        
        # 3. Descargar datos para cada estado
        datos_clima = {}
        for estado, coords in ESTADOS_COORDS.items():
            logger.info(f"Descargando clima para {estado}")
            datos = descargar_clima_estado(estado, coords, api_key)
            if datos:
                datos_clima[estado] = datos
        
        if not datos_clima:
            logger.warning("No se pudieron obtener datos climáticos")
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'No weather data available'})
            }
        
        # 4. Guardar en S3
        guardar_en_s3(datos_clima, fecha)
        
        logger.info(f"Datos climáticos guardados: {len(datos_clima)} estados")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Datos climáticos ingestados exitosamente',
                'fecha': fecha,
                'estados': list(datos_clima.keys()),
                's3_path': f's3://{BUCKET_NAME}/raw/weather/{fecha}.json'
            })
        }
        
    except Exception as e:
        logger.error(f"Error en ingesta climática: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


def get_weather_api_key():
    """
    Obtiene API key de Weather API desde Secrets Manager
    """
    try:
        response = secrets_client.get_secret_value(
            SecretId='predict-epidem/weather-api-key'
        )
        secret = json.loads(response['SecretString'])
        return secret['api_key']
    except Exception as e:
        logger.warning(f"No se pudo obtener API key de Secrets Manager: {str(e)}")
        # Para MVP, usar variable de entorno o valor por defecto
        import os
        return os.environ.get('WEATHER_API_KEY', 'demo_key')


def descargar_clima_estado(estado, coords, api_key):
    """
    Descarga datos climáticos para un estado específico
    
    Usando weatherapi.com Free Tier:
    - 1M calls/month FREE
    - Historical data disponible
    """
    try:
        # Weather API endpoint
        base_url = "http://api.weatherapi.com/v1/history.json"
        
        # Obtener datos de los últimos 7 días
        fecha_fin = datetime.now()
        fecha_inicio = fecha_fin - timedelta(days=7)
        
        params = {
            'key': api_key,
            'q': f"{coords['lat']},{coords['lon']}",
            'dt': fecha_inicio.strftime('%Y-%m-%d'),
            'end_dt': fecha_fin.strftime('%Y-%m-%d')
        }
        
        response = requests.get(base_url, params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            return procesar_datos_clima(data, estado)
        else:
            logger.error(f"Error API Weather para {estado}: {response.status_code}")
            # Fallback: generar datos sintéticos para demo
            return generar_datos_clima_sinteticos(estado)
            
    except Exception as e:
        logger.error(f"Error descargando clima para {estado}: {str(e)}")
        return generar_datos_clima_sinteticos(estado)


def procesar_datos_clima(data, estado):
    """
    Procesa respuesta de Weather API
    """
    try:
        dias = data.get('forecast', {}).get('forecastday', [])
        
        if not dias:
            return None
        
        # Agregar datos de la semana
        temp_promedio = []
        temp_max = []
        temp_min = []
        humedad = []
        precipitacion = []
        
        for dia in dias:
            day_data = dia.get('day', {})
            temp_promedio.append(day_data.get('avgtemp_c', 0))
            temp_max.append(day_data.get('maxtemp_c', 0))
            temp_min.append(day_data.get('mintemp_c', 0))
            humedad.append(day_data.get('avghumidity', 0))
            precipitacion.append(day_data.get('totalprecip_mm', 0))
        
        # Calcular promedios semanales
        resultado = {
            'estado': estado,
            'fecha': datetime.now().strftime('%Y-%m-%d'),
            'temp_promedio': round(sum(temp_promedio) / len(temp_promedio), 1),
            'temp_max': round(max(temp_max), 1),
            'temp_min': round(min(temp_min), 1),
            'humedad': round(sum(humedad) / len(humedad), 1),
            'precipitacion': round(sum(precipitacion), 1),
            'dias_con_lluvia': sum(1 for p in precipitacion if p > 1.0)
        }
        
        return resultado
        
    except Exception as e:
        logger.error(f"Error procesando clima: {str(e)}")
        return None


def generar_datos_clima_sinteticos(estado):
    """
    Genera datos climáticos sintéticos para demo/testing
    Basado en promedios históricos de cada estado
    """
    import random
    
    # Promedios históricos por estado (temporada de lluvias)
    promedios = {
        'Veracruz': {'temp': 26.5, 'humedad': 78, 'precip': 180},
        'Guerrero': {'temp': 28.0, 'humedad': 75, 'precip': 200},
        'Chiapas': {'temp': 25.5, 'humedad': 80, 'precip': 220},
        'Yucatán': {'temp': 27.5, 'humedad': 77, 'precip': 150},
        'Quintana Roo': {'temp': 27.0, 'humedad': 79, 'precip': 160}
    }
    
    prom = promedios.get(estado, {'temp': 26, 'humedad': 75, 'precip': 150})
    
    # Agregar variación aleatoria ±10%
    return {
        'estado': estado,
        'fecha': datetime.now().strftime('%Y-%m-%d'),
        'temp_promedio': round(prom['temp'] * random.uniform(0.9, 1.1), 1),
        'temp_max': round(prom['temp'] * random.uniform(1.05, 1.15), 1),
        'temp_min': round(prom['temp'] * random.uniform(0.85, 0.95), 1),
        'humedad': round(prom['humedad'] * random.uniform(0.9, 1.1), 1),
        'precipitacion': round(prom['precip'] * random.uniform(0.5, 1.5), 1),
        'dias_con_lluvia': random.randint(2, 6),
        'synthetic': True  # Flag para indicar que son datos sintéticos
    }


def guardar_en_s3(datos_clima, fecha):
    """
    Guarda datos climáticos en S3 como JSON
    """
    try:
        s3_key = f'raw/weather/{fecha}.json'
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=json.dumps(datos_clima, indent=2),
            ContentType='application/json'
        )
        
        logger.info(f"Datos climáticos guardados en s3://{BUCKET_NAME}/{s3_key}")
        
    except Exception as e:
        logger.error(f"Error guardando en S3: {str(e)}")
        raise


def validar_datos_clima(datos):
    """
    Valida rangos razonables para datos climáticos
    """
    errores = []
    
    for estado, data in datos.items():
        # Temperatura entre 0°C y 50°C
        if not (0 <= data.get('temp_promedio', 0) <= 50):
            errores.append(f"{estado}: Temperatura fuera de rango")
        
        # Humedad entre 0% y 100%
        if not (0 <= data.get('humedad', 0) <= 100):
            errores.append(f"{estado}: Humedad fuera de rango")
        
        # Precipitación >= 0
        if data.get('precipitacion', 0) < 0:
            errores.append(f"{estado}: Precipitación negativa")
    
    if errores:
        logger.warning(f"Advertencias de validación: {errores}")
    
    return len(errores) == 0
