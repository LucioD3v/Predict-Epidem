# Spec: Alert System - SNS + Lambda

## Objetivo

Sistema de alertas automáticas que notifica a personal médico cuando el riesgo de brote de dengue supera el 80%, especialmente para zonas rurales sin acceso constante a internet.

## Componentes

- **AWS Lambda**: Motor de reglas y lógica de alertas
- **Amazon SNS**: Envío de SMS y emails
- **S3**: Almacenamiento de predicciones y configuración
- **EventBridge**: Trigger automático semanal

## Lógica de Alertas

### Niveles de Riesgo

```python
RISK_LEVELS = {
    'BAJO': {
        'threshold': 0.0,
        'color': 'green',
        'action': 'Monitoreo rutinario',
        'alert': False
    },
    'MEDIO': {
        'threshold': 1.2,  # 20% aumento vs promedio histórico
        'color': 'yellow',
        'action': 'Preparación preventiva',
        'alert': False
    },
    'ALTO': {
        'threshold': 1.5,  # 50% aumento
        'color': 'orange',
        'action': 'Activar protocolo de respuesta',
        'alert': True  # Enviar alerta
    },
    'CRÍTICO': {
        'threshold': 2.0,  # 100% aumento
        'color': 'red',
        'action': 'Emergencia epidemiológica',
        'alert': True  # Alerta urgente
    }
}
```

### Criterios para Disparar Alerta

Alerta se envía SI:
1. **Riesgo >= ALTO** (threshold >= 1.5)
2. **Tendencia creciente** (predicción semana 4 > semana 1)
3. **No se ha enviado alerta en últimas 48 horas** (evitar spam)

## Lambda Function: `evaluate-risk-and-alert`

### Trigger

- **EventBridge**: Cada jueves 2:00 PM (después de generar predicciones)
- **Manual**: Invocación desde QuickSight dashboard

### Proceso

```python
def lambda_handler(event, context):
    # 1. Leer predicciones más recientes
    predictions = read_latest_predictions_from_s3()
    
    # 2. Para cada estado, evaluar riesgo
    alerts_to_send = []
    
    for estado in predictions:
        risk_level = calculate_risk_level(estado)
        
        if should_send_alert(estado, risk_level):
            alert = {
                'estado': estado['name'],
                'risk_level': risk_level,
                'predicted_cases': estado['predicted_cases'],
                'increase_percentage': estado['increase_pct'],
                'weeks_ahead': 4,
                'timestamp': datetime.now().isoformat()
            }
            alerts_to_send.append(alert)
    
    # 3. Enviar alertas via SNS
    if alerts_to_send:
        send_alerts_via_sns(alerts_to_send)
        log_alerts_to_s3(alerts_to_send)
    
    # 4. Retornar resumen
    return {
        'statusCode': 200,
        'alerts_sent': len(alerts_to_send),
        'details': alerts_to_send
    }
```

### Cálculo de Riesgo

```python
def calculate_risk_level(estado_data):
    """
    Calcula nivel de riesgo basado en predicción vs promedio histórico
    """
    predicted = estado_data['predicted_cases_week4']
    historical_avg = estado_data['historical_average']
    
    ratio = predicted / historical_avg
    
    if ratio >= 2.0:
        return 'CRÍTICO'
    elif ratio >= 1.5:
        return 'ALTO'
    elif ratio >= 1.2:
        return 'MEDIO'
    else:
        return 'BAJO'
```

### Validación de Alerta

```python
def should_send_alert(estado, risk_level):
    """
    Determina si se debe enviar alerta
    """
    # Criterio 1: Riesgo >= ALTO
    if risk_level not in ['ALTO', 'CRÍTICO']:
        return False
    
    # Criterio 2: Tendencia creciente
    if not is_trend_increasing(estado):
        return False
    
    # Criterio 3: No spam (última alerta > 48 horas)
    last_alert_time = get_last_alert_time(estado['name'])
    if last_alert_time and (datetime.now() - last_alert_time).hours < 48:
        return False
    
    return True
```

## Amazon SNS Configuration

### Topics

Crear 2 SNS topics:

#### 1. `dengue-alerts-critical`
- **Uso**: Alertas CRÍTICAS
- **Suscriptores**:
  - Directores de hospitales (SMS + Email)
  - Secretaría de Salud estatal (Email)
  - Sistema de emergencias (SMS)

#### 2. `dengue-alerts-high`
- **Uso**: Alertas ALTAS
- **Suscriptores**:
  - Personal médico en centros de salud (SMS)
  - Epidemiólogos estatales (Email)
  - Coordinadores de vectores (Email)

### Formato de Mensajes

#### SMS (160 caracteres máximo)

```
ALERTA DENGUE {NIVEL}
{Estado}: {casos} casos predichos
Aumento: {%}
Semanas: 2-4
Acción: {acción_requerida}
```

**Ejemplo**:
```
ALERTA DENGUE CRÍTICO
Veracruz: 450 casos predichos
Aumento: 120%
Semanas: 2-4
Acción: Activar protocolo emergencia
```

#### Email (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .alert-critical { background-color: #dc3545; color: white; }
        .alert-high { background-color: #fd7e14; color: white; }
    </style>
</head>
<body>
    <div class="alert-{level}">
        <h2>🚨 Alerta de Brote de Dengue - {Estado}</h2>
    </div>
    
    <h3>Predicción para próximas 4 semanas:</h3>
    <ul>
        <li><strong>Casos esperados:</strong> {predicted_cases}</li>
        <li><strong>Aumento vs promedio:</strong> {increase_pct}%</li>
        <li><strong>Nivel de riesgo:</strong> {risk_level}</li>
        <li><strong>Tendencia:</strong> {trend}</li>
    </ul>
    
    <h3>Acciones Recomendadas:</h3>
    <ul>
        <li>{action_1}</li>
        <li>{action_2}</li>
        <li>{action_3}</li>
    </ul>
    
    <h3>Desglose Semanal:</h3>
    <table>
        <tr>
            <th>Semana</th>
            <th>Casos Predichos</th>
            <th>Intervalo Confianza</th>
        </tr>
        <tr>
            <td>Semana 1</td>
            <td>{week1_p50}</td>
            <td>{week1_p10} - {week1_p90}</td>
        </tr>
        <!-- ... -->
    </table>
    
    <p><small>Generado por Predict-Epidem | {timestamp}</small></p>
</body>
</html>
```

### Acciones Recomendadas por Nivel

```python
RECOMMENDED_ACTIONS = {
    'CRÍTICO': [
        'Activar protocolo de emergencia epidemiológica',
        'Asegurar stock de medicamentos (paracetamol, suero)',
        'Preparar camas UCI adicionales',
        'Convocar personal médico de guardia',
        'Iniciar campaña intensiva de fumigación',
        'Alertar a medios de comunicación'
    ],
    'ALTO': [
        'Revisar inventario de medicamentos',
        'Programar jornadas de fumigación',
        'Capacitar personal en detección temprana',
        'Activar campaña de prevención comunitaria',
        'Monitorear hospitalizaciones diariamente'
    ]
}
```

## Gestión de Suscriptores

### Archivo de Configuración

`s3://predict-epidem-mx/config/subscribers.json`

```json
{
  "Veracruz": {
    "critical": [
      {
        "name": "Dr. Juan Pérez",
        "role": "Director Hospital Regional",
        "phone": "+52-229-XXX-XXXX",
        "email": "juan.perez@salud.gob.mx",
        "protocol": "sms+email"
      },
      {
        "name": "Dra. María González",
        "role": "Secretaria de Salud Estatal",
        "phone": "+52-229-XXX-XXXX",
        "email": "maria.gonzalez@salud.gob.mx",
        "protocol": "email"
      }
    ],
    "high": [
      {
        "name": "Enfermera Ana López",
        "role": "Centro de Salud Rural",
        "phone": "+52-229-XXX-XXXX",
        "protocol": "sms"
      }
    ]
  },
  "Guerrero": {
    "critical": [...],
    "high": [...]
  }
}
```

### Lambda para Gestionar Suscripciones

```python
def subscribe_to_alerts(estado, contact_info, alert_level):
    """
    Suscribe un contacto a alertas de un estado específico
    """
    topic_arn = get_topic_arn(alert_level)
    
    if contact_info['protocol'] == 'sms':
        sns_client.subscribe(
            TopicArn=topic_arn,
            Protocol='sms',
            Endpoint=contact_info['phone'],
            Attributes={
                'FilterPolicy': json.dumps({
                    'estado': [estado]
                })
            }
        )
    
    if 'email' in contact_info['protocol']:
        sns_client.subscribe(
            TopicArn=topic_arn,
            Protocol='email',
            Endpoint=contact_info['email'],
            Attributes={
                'FilterPolicy': json.dumps({
                    'estado': [estado]
                })
            }
        )
```

## Logging y Auditoría

### Registro de Alertas Enviadas

`s3://predict-epidem-mx/logs/alerts/YYYY-MM-DD.json`

```json
{
  "timestamp": "2025-03-01T14:30:00Z",
  "alert_id": "alert-20250301-143000",
  "estado": "Veracruz",
  "risk_level": "CRÍTICO",
  "predicted_cases": 450,
  "increase_percentage": 120,
  "recipients": [
    {
      "name": "Dr. Juan Pérez",
      "phone": "+52-229-XXX-XXXX",
      "delivery_status": "success",
      "message_id": "msg-abc123"
    }
  ],
  "actions_recommended": [
    "Activar protocolo de emergencia",
    "Asegurar stock medicamentos"
  ]
}
```

### CloudWatch Metrics

- `AlertsSent`: Número de alertas enviadas
- `AlertsByCriticality`: Desglose por nivel (ALTO/CRÍTICO)
- `AlertsByState`: Desglose por estado
- `SMSDeliveryRate`: Tasa de entrega exitosa SMS
- `EmailDeliveryRate`: Tasa de entrega exitosa Email

## Testing

### Test con Datos Simulados

```python
def test_alert_system():
    # Simular predicción de riesgo CRÍTICO
    test_prediction = {
        'estado': 'Veracruz',
        'predicted_cases_week4': 450,
        'historical_average': 200,
        'trend': 'increasing'
    }
    
    # Ejecutar Lambda
    response = lambda_client.invoke(
        FunctionName='evaluate-risk-and-alert',
        Payload=json.dumps({'test_mode': True, 'data': test_prediction})
    )
    
    # Verificar que se envió alerta
    assert response['alerts_sent'] == 1
    assert response['details'][0]['risk_level'] == 'CRÍTICO'
```

### Sandbox SNS

Para testing sin enviar SMS reales:
- Usar SNS Sandbox mode
- Verificar números de teléfono de prueba
- Revisar logs en CloudWatch

## Costos (Free Tier)

- **SNS**:
  - 1,000 emails FREE/month
  - 100 SMS FREE/month
- **Lambda**: Incluido en 1M requests FREE
- **CloudWatch**: Incluido en 5GB logs FREE

**Estimado uso real**:
- ~20 alertas/mes (5 estados × 4 alertas promedio)
- ~40 SMS + 40 emails/mes
- **Total**: $0 (dentro de Free Tier)

## Entregables

1. **Lambda function**: `lambda/evaluate_risk_and_alert.py`
2. **SNS setup script**: `scripts/setup_sns_topics.py`
3. **Subscriber management**: `lambda/manage_subscribers.py`
4. **CloudFormation template**: `cloudformation/alert-system.yaml`
5. **Documentación**: Guía para agregar/remover suscriptores
6. **Templates**: Plantillas de mensajes SMS y Email

## Mejoras Futuras

- **WhatsApp**: Integrar con WhatsApp Business API
- **Dashboard móvil**: App para personal médico
- **Confirmación de recepción**: Tracking de alertas leídas
- **Escalamiento automático**: Si alerta no es confirmada en 1 hora, escalar a nivel superior
