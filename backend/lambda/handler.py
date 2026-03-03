import json
import boto3
import os
from typing import Dict, Any

s3 = boto3.client('s3')
BUCKET_NAME = os.environ.get('BUCKET_NAME', 'predict-epidem-data')

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda handler principal con routing
    """
    path = event.get('rawPath', event.get('path', ''))
    method = event.get('requestContext', {}).get('http', {}).get('method', 
                event.get('httpMethod', 'GET'))
    
    # CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    # OPTIONS para CORS preflight
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}
    
    try:
        # Routing
        if '/predictions' in path:
            return get_predictions(headers)
        elif '/diseases' in path:
            disease = path.split('/')[-1]
            return get_disease_data(disease, headers)
        elif '/health' in path:
            return health_check(headers)
        else:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Endpoint not found'})
            }
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }


def get_predictions(headers: Dict[str, str]) -> Dict[str, Any]:
    """
    GET /api/predictions
    Retorna todas las predicciones
    """
    try:
        response = s3.get_object(
            Bucket=BUCKET_NAME,
            Key='predictions/all_predictions.json'
        )
        data = json.loads(response['Body'].read().decode('utf-8'))
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(data)
        }
    except s3.exceptions.NoSuchKey:
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Predictions not found'})
        }


def get_disease_data(disease: str, headers: Dict[str, str]) -> Dict[str, Any]:
    """
    GET /api/diseases/{disease_name}
    Retorna datos históricos de una enfermedad
    """
    try:
        # Mapeo de nombres
        disease_map = {
            'covid': 'covid_19',
            'covid-19': 'covid_19',
            'dengue': 'dengue',
            'influenza': 'influenza',
            'chikungunya': 'chikungunya',
            'zika': 'zika'
        }
        
        disease_key = disease_map.get(disease.lower())
        if not disease_key:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid disease name'})
            }
        
        response = s3.get_object(
            Bucket=BUCKET_NAME,
            Key=f'predictions/{disease_key}_prediction.json'
        )
        data = json.loads(response['Body'].read().decode('utf-8'))
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(data)
        }
    except s3.exceptions.NoSuchKey:
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': f'Data for {disease} not found'})
        }


def health_check(headers: Dict[str, str]) -> Dict[str, Any]:
    """
    GET /api/health
    Health check endpoint
    """
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'status': 'healthy',
            'service': 'predict-epidem-api',
            'version': '1.0.0'
        })
    }
