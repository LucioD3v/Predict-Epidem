# 🗺️ Mapa de Integración - Componentes

## 📊 Flujo de Integración

```
app/layout.tsx (Root)
    ├── ThemeProvider (contexts/ThemeContext.tsx)
    │   └── LanguageProvider
    │       └── children (páginas)
    │
    ├── app/page.tsx (/)
    │   ├── HeaderBar
    │   │   ├── ThemeToggle ⭐ NUEVO
    │   │   └── MobileMenu ⭐ NUEVO
    │   ├── MetricsPanel
    │   ├── AlertsPanel
    │   └── TrendChart
    │
    └── app/dashboard/page.tsx (/dashboard) ⭐ NUEVO
        ├── HeaderBar
        │   ├── ThemeToggle ⭐
        │   └── MobileMenu ⭐
        ├── MetricCard (x4) ⭐ NUEVO
        ├── HeatMap ⭐ NUEVO
        │   └── mexicoGeoData.ts ⭐
        ├── WeeklyTrendChart ⭐ NUEVO
        ├── PredictionTimelineChart ⭐ NUEVO
        └── Top 5 Districts
```

---

## 🎨 Sistema de Temas

```
ThemeContext.tsx
    ├── Estado: theme ('light' | 'dark')
    ├── Función: toggleTheme()
    ├── Persistencia: localStorage
    └── Usado por:
        ├── ThemeToggle.tsx (botón)
        ├── globals.css (variables CSS)
        └── Todos los componentes (vía CSS vars)
```

### Variables CSS Dinámicas

```css
:root[data-theme="dark"] {
  --bg-primary: #0F1419
  --bg-secondary: #1A1F2E
  --text-primary: #F7FAFC
  ...
}

:root[data-theme="light"] {
  --bg-primary: #FFFFFF
  --bg-secondary: #F7FAFC
  --text-primary: #1A202C
  ...
}
```

---

## 🗺️ Componente HeatMap

```
HeatMap.tsx
    ├── Leaflet Map
    │   ├── Tile Layer (CartoDB Dark)
    │   ├── Circle Markers (32 estados)
    │   │   ├── Radio: proporcional a casos
    │   │   ├── Color: según riesgo
    │   │   └── Popup: info del estado
    │   └── Fire Icons (alto riesgo)
    │
    └── Legend (overlay)
        ├── Crítico (rojo oscuro)
        ├── Alto (rojo)
        ├── Medio (amarillo)
        └── Bajo (verde)

Datos: mexicoGeoData.ts
    ├── mexicoStatesGeoJSON (32 estados)
    ├── mockStateData (10 estados con datos)
    └── getRiskColor() (función helper)
```

---

## 📊 Componentes de Gráficas

### WeeklyTrendChart.tsx
```
Recharts LineChart
    ├── Datos: 12 semanas
    │   ├── 8 semanas históricas
    │   └── 4 semanas predicción
    ├── Líneas:
    │   ├── cases (naranja, sólida)
    │   └── predicted (roja, punteada)
    └── Features:
        ├── CartesianGrid
        ├── XAxis (semanas)
        ├── YAxis (casos)
        └── Tooltip
```

### PredictionTimelineChart.tsx
```
Recharts AreaChart
    ├── Datos: 13 puntos
    │   ├── -8 a 0: histórico
    │   └── 0 a +4: predicción
    ├── Áreas:
    │   ├── historical (gradiente naranja)
    │   └── predicted (gradiente rojo)
    └── Features:
        ├── ReferenceLine ("Hoy")
        ├── Gradientes (defs)
        └── Tooltip con formato
```

---

## 📱 Sistema Responsive

### Breakpoints
```
Mobile:  < 640px
    ├── Grid: 2 columnas
    ├── Menú: Hamburguesa
    ├── Padding: 3px
    └── Mapa: 400px altura

Tablet:  768px - 1024px
    ├── Grid: 2-3 columnas
    ├── Font: 14px
    └── Mapa: 500px altura

Desktop: > 1024px
    ├── Grid: 4 columnas
    ├── Menú: Completo
    └── Mapa: 600px altura
```

### MobileMenu.tsx
```
Estado: isOpen (boolean)
    ├── Trigger: Botón hamburguesa
    ├── Overlay: Fondo oscuro
    └── Menu: Lista de links
        ├── Inicio (/)
        ├── Dashboard (/dashboard)
        ├── Análisis
        └── Configuración
```

---

## 🔗 Dependencias entre Archivos

### Imports Principales

```typescript
// layout.tsx
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/lib/LanguageContext'

// HeaderBar.tsx
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'

// ThemeToggle.tsx
import { useTheme } from '@/contexts/ThemeContext'

// HeatMap.tsx
import { mexicoStatesGeoJSON, mockStateData, getRiskColor } from '@/lib/mexicoGeoData'

// dashboard/page.tsx
import HeatMap from '@/components/HeatMap'
import MetricCard from '@/components/MetricCard'
import WeeklyTrendChart from '@/components/WeeklyTrendChart'
import PredictionTimelineChart from '@/components/PredictionTimelineChart'
```

---

## 🎯 Rutas de la Aplicación

```
/                           → app/page.tsx
    ├── Vista original mejorada
    ├── Usa ThemeProvider
    ├── Link a /dashboard
    └── Responsive

/dashboard                  → app/dashboard/page.tsx
    ├── Nuevo dashboard
    ├── Mapa interactivo
    ├── Gráficas de tendencias
    └── Fully responsive
```

---

## 🎨 Clases CSS Reutilizables

```css
/* Tailwind + CSS Variables */
bg-primary          → var(--bg-primary)
bg-secondary        → var(--bg-secondary)
bg-tertiary         → var(--bg-tertiary)
text-primary        → var(--text-primary)
text-secondary      → var(--text-secondary)
border              → var(--border)
card-bg             → var(--card-bg)
hover-bg            → var(--hover-bg)

/* Colores de Riesgo */
risk-low            → var(--risk-low)      #10B981
risk-medium         → var(--risk-medium)   #F59E0B
risk-high           → var(--risk-high)     #EF4444
risk-critical       → var(--risk-critical) #DC2626
```

---

## 📦 Paquetes Utilizados

```json
{
  "leaflet": "^1.9.4",           // Mapa interactivo
  "react-leaflet": "^4.2.1",     // Wrapper React para Leaflet
  "recharts": "^2.10.4",         // Gráficas
  "lucide-react": "^0.323.0",    // Iconos
  "next": "^14.1.0",             // Framework
  "tailwindcss": "^3.4.1"        // Estilos
}
```

---

## ✅ Checklist de Integración

### Archivos Creados
- [x] `contexts/ThemeContext.tsx`
- [x] `components/ThemeToggle.tsx`
- [x] `components/MobileMenu.tsx`
- [x] `components/HeatMap.tsx`
- [x] `components/MetricCard.tsx`
- [x] `components/WeeklyTrendChart.tsx`
- [x] `components/PredictionTimelineChart.tsx`
- [x] `lib/mexicoGeoData.ts`
- [x] `app/dashboard/page.tsx`

### Archivos Modificados
- [x] `app/layout.tsx` - ThemeProvider
- [x] `app/page.tsx` - CSS vars + link
- [x] `app/globals.css` - Temas + responsive
- [x] `components/HeaderBar.tsx` - Toggle + menú
- [x] `tailwind.config.ts` - Variables

### Funcionalidades
- [x] Tema claro/oscuro funcional
- [x] Persistencia en localStorage
- [x] Mapa interactivo con datos
- [x] Gráficas con predicciones
- [x] Responsive mobile/tablet/desktop
- [x] Menú hamburguesa
- [x] Touch gestures en mapa
- [x] Tooltips informativos

---

## 🚀 Estado: LISTO PARA DEPLOY

Todos los componentes están:
✅ Creados
✅ Integrados
✅ Conectados
✅ Testeables

**Siguiente paso:** `npm run dev` y visitar `/dashboard`
