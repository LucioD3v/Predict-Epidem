"""
Lambda Function: Ingest SINAVE Data
Descarga y procesa datos de dengue del Sistema Nacional de Vigilancia Epidemiológica de México
"""

import json
import boto3
import requests
from datetime import datetime, timedelta
import pandas as pd
import io
import logging

# Configuración
logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client('s3')
BUCKET_NAME = 'predict-epidem-mx'

# Estados prioritarios
ESTADOS_PRIORITARIOS = [
    'Veracruz',
    'Guerrero',
    'Chiapas',
    'Yucatán',
    'Quintana Roo'
]

def lambda_handler(event, context):
    """
    Handler principal
    """
    try:
        logger.info("Iniciando ingesta de datos SINAVE")
        
        # 1. Obtener fecha actual
        fecha = datetime.now().strftime('%Y-%m-%d')
        
        # 2. Descargar datos SINAVE
        # NOTA: URL real debe ser configurada según disponibilidad de API/CSV público
        datos_dengue = descargar_datos_sinave()
        
        if not datos_dengue:
            logger.warning("No se pudieron obtener datos SINAVE")
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'No data available'})
            }
        
        # 3. Procesar y limpiar datos
        df_procesado = procesar_datos_dengue(datos_dengue)
        
        # 4. Guardar en S3
        guardar_en_s3(df_procesado, fecha)
        
        logger.info(f"Datos SINAVE guardados exitosamente: {len(df_procesado)} registros")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Datos SINAVE ingestados exitosamente',
                'fecha': fecha,
                'registros': len(df_procesado),
                's3_path': f's3://{BUCKET_NAME}/raw/dengue/{fecha}.csv'
            })
        }
        
    except Exception as e:
        logger.error(f"Error en ingesta SINAVE: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


def descargar_datos_sinave():
    """
    Descarga datos de SINAVE
    
    NOTA: Esta función debe ser adaptada según la fuente real de datos:
    - API pública de SINAVE (si existe)
    - CSV descargable del boletín epidemiológico
    - Scraping del sitio web (último recurso)
    
    Para MVP, usar datos históricos descargados manualmente
    """
    try:
        # Opción 1: API pública (ideal, pero puede no existir)
        # url = "https://api.salud.gob.mx/sinave/dengue"
        # response = requests.get(url, timeout=30)
        # return response.json()
        
        # Opción 2: CSV público
        # url = "https://datos.gob.mx/busca/dataset/dengue/resource/xxx"
        # response = requests.get(url, timeout=30)
        # return pd.read_csv(io.StringIO(response.text))
        
        # Opción 3: Para MVP, leer datos históricos ya cargados en S3
        logger.info("Leyendo datos históricos de S3 (modo MVP)")
        response = s3_client.get_object(
            Bucket=BUCKET_NAME,
            Key='historical/sinave_dengue_2020_2025.csv'
        )
        df = pd.read_csv(io.BytesIO(response['Body'].read()))
        
        # Simular datos de la semana actual (para demo)
        ultima_fecha = pd.to_datetime(df['fecha']).max()
        nueva_fecha = ultima_fecha + timedelta(weeks=1)
        
        # Generar datos sintéticos para la nueva semana (basados en promedio)
        nuevos_datos = []
        for estado in ESTADOS_PRIORITARIOS:
            df_estado = df[df['estado'] == estado]
            promedio_casos = df_estado['casos_confirmados'].tail(4).mean()
            
            # Agregar variación aleatoria ±20%
            import random
            variacion = random.uniform(0.8, 1.2)
            casos_nuevos = int(promedio_casos * variacion)
            
            nuevos_datos.append({
                'estado': estado,
                'fecha': nueva_fecha.strftime('%Y-%m-%d'),
                'casos_confirmados': casos_nuevos,
                'casos_probables': int(casos_nuevos * 0.3),
                'hospitalizaciones': int(casos_nuevos * 0.15),
                'casos_graves': int(casos_nuevos * 0.05),
                'defunciones': int(casos_nuevos * 0.01)
            })
        
        return pd.DataFrame(nuevos_datos)
        
    except Exception as e:
        logger.error(f"Error descargando datos SINAVE: {str(e)}")
        return None


def procesar_datos_dengue(df):
    """
    Limpia y estandariza datos de dengue
    """
    try:
        # Estandarizar nombres de estados
        df['estado'] = df['estado'].str.strip()
        df['estado'] = df['estado'].replace({
            'Veracruz de Ignacio de la Llave': 'Veracruz',
            'Michoacán de Ocampo': 'Michoacán',
            'Coahuila de Zaragoza': 'Coahuila'
        })
        
        # Filtrar solo estados prioritarios
        df = df[df['estado'].isin(ESTADOS_PRIORITARIOS)]
        
        # Convertir fecha a formato estándar
        df['fecha'] = pd.to_datetime(df['fecha']).dt.strftime('%Y-%m-%d')
        
        # Validar valores numéricos
        columnas_numericas = ['casos_confirmados', 'casos_probables', 'hospitalizaciones', 'casos_graves', 'defunciones']
        for col in columnas_numericas:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)
            
            # Validar rangos razonables
            if (df[col] < 0).any():
                logger.warning(f"Valores negativos detectados en {col}, corrigiendo a 0")
                df[col] = df[col].clip(lower=0)
            
            if (df[col] > 10000).any():
                logger.warning(f"Valores sospechosamente altos en {col} (>10,000)")
        
        # Ordenar por estado y fecha
        df = df.sort_values(['estado', 'fecha'])
        
        return df
        
    except Exception as e:
        logger.error(f"Error procesando datos: {str(e)}")
        raise


def guardar_en_s3(df, fecha):
    """
    Guarda DataFrame en S3 como CSV
    """
    try:
        # Convertir a CSV
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)
        
        # Subir a S3
        s3_key = f'raw/dengue/{fecha}.csv'
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=csv_buffer.getvalue(),
            ContentType='text/csv'
        )
        
        logger.info(f"Datos guardados en s3://{BUCKET_NAME}/{s3_key}")
        
    except Exception as e:
        logger.error(f"Error guardando en S3: {str(e)}")
        raise


def validar_datos(df):
    """
    Validaciones adicionales de calidad de datos
    """
    errores = []
    
    # Verificar columnas requeridas
    columnas_requeridas = ['estado', 'fecha', 'casos_confirmados']
    for col in columnas_requeridas:
        if col not in df.columns:
            errores.append(f"Columna faltante: {col}")
    
    # Verificar que hay datos para todos los estados prioritarios
    estados_en_datos = set(df['estado'].unique())
    estados_faltantes = set(ESTADOS_PRIORITARIOS) - estados_en_datos
    if estados_faltantes:
        errores.append(f"Estados faltantes: {estados_faltantes}")
    
    # Verificar fechas válidas
    try:
        pd.to_datetime(df['fecha'])
    except:
        errores.append("Fechas inválidas detectadas")
    
    if errores:
        logger.error(f"Errores de validación: {errores}")
        raise ValueError(f"Validación fallida: {errores}")
    
    return True
