# 🚀 Guía Rápida - Visualizar Cambios

## ✅ Todo Está Implementado

Todos los componentes están creados e integrados:

### 📁 Archivos Creados (Nuevos)
- ✅ `src/contexts/ThemeContext.tsx`
- ✅ `src/components/ThemeToggle.tsx`
- ✅ `src/components/MobileMenu.tsx`
- ✅ `src/components/HeatMap.tsx`
- ✅ `src/components/MetricCard.tsx`
- ✅ `src/components/WeeklyTrendChart.tsx`
- ✅ `src/components/PredictionTimelineChart.tsx`
- ✅ `src/lib/mexicoGeoData.ts`
- ✅ `src/app/dashboard/page.tsx`

### 📝 Archivos Modificados
- ✅ `src/app/layout.tsx` - ThemeProvider integrado
- ✅ `src/app/page.tsx` - Variables CSS + link a dashboard
- ✅ `src/app/globals.css` - Temas + responsive
- ✅ `src/components/HeaderBar.tsx` - Toggle + menú móvil
- ✅ `tailwind.config.ts` - Variables de color

---

## 🎯 Cómo Ver los Cambios

### 1. Instalar Dependencias (si no lo has hecho)

```bash
cd frontend
npm install
```

### 2. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

### 3. Abrir en el Navegador

**Página Principal (Original mejorada):**
```
http://localhost:3000
```

**Nuevo Dashboard (Con mapa y gráficas):**
```
http://localhost:3000/dashboard
```

---

## 🎨 Qué Verás

### En la Página Principal (/)
1. **Header con toggle de tema** (sol/luna) - Click para cambiar
2. **Banner azul** con link al nuevo dashboard
3. **Todos los componentes** ahora respetan el tema seleccionado
4. **Responsive** - Prueba redimensionando la ventana

### En el Dashboard (/dashboard)
1. **4 Métricas** en la parte superior
2. **Mapa interactivo** de México (izquierda)
   - Círculos de colores por riesgo
   - Click para ver detalles
   - Zoom con scroll
3. **Gráfica semanal** (derecha arriba)
4. **Top 5 distritos** (derecha abajo)
5. **Timeline de predicción** (abajo, ancho completo)

---

## 📱 Probar Responsive

### Opción 1: Redimensionar Ventana
Simplemente arrastra el borde de tu navegador para hacerlo más pequeño

### Opción 2: DevTools
1. Presiona `F12`
2. Click en el icono de dispositivo móvil (o `Ctrl+Shift+M`)
3. Selecciona diferentes dispositivos:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

---

## 🌓 Probar Tema Claro/Oscuro

1. Busca el botón con icono de **sol** o **luna** en el header (esquina superior derecha)
2. Click para cambiar entre temas
3. Recarga la página - el tema se mantiene (localStorage)
4. Navega entre páginas - el tema persiste

---

## 🗺️ Interactuar con el Mapa

1. Ve a `/dashboard`
2. En el mapa:
   - **Scroll** para hacer zoom
   - **Click y arrastra** para mover
   - **Click en círculos** para ver popup con datos
   - **Busca iconos 🔥** en zonas de alto riesgo

---

## 📊 Ver Gráficas

### Gráfica Semanal (Sidebar)
- Línea naranja: Casos reales
- Línea roja punteada: Predicción
- Hover para ver valores exactos

### Timeline de Predicción (Abajo)
- Área naranja: Histórico (8 semanas)
- Área roja: Predicción (4 semanas)
- Línea vertical: "Hoy"

---

## ✨ Características Especiales

### 1. Persistencia de Tema
- El tema se guarda automáticamente
- Funciona entre páginas
- Se mantiene al cerrar/abrir navegador

### 2. Menú Móvil
- En pantallas < 1024px aparece icono hamburguesa
- Click para abrir menú de navegación
- Links a diferentes secciones

### 3. Mapa Dinámico
- 10 estados con datos mock
- Colores según nivel de riesgo:
  - 🟢 Verde: Bajo
  - 🟡 Amarillo: Medio
  - 🔴 Rojo: Alto
  - 🔴 Rojo oscuro: Crítico

---

## 🔍 Verificar Integración

### Checklist Visual

- [ ] Header tiene botón de tema (sol/luna)
- [ ] Click en tema cambia colores inmediatamente
- [ ] Página principal tiene banner azul "Nuevo Dashboard"
- [ ] Dashboard muestra mapa de México
- [ ] Mapa tiene círculos de colores
- [ ] Sidebar derecho tiene gráfica
- [ ] Abajo hay timeline grande
- [ ] En móvil aparece menú hamburguesa
- [ ] Todo es responsive

---

## 🐛 Si Algo No Funciona

### El servidor no inicia
```bash
# Verifica que estés en la carpeta correcta
cd frontend

# Reinstala dependencias
npm install

# Intenta de nuevo
npm run dev
```

### El mapa no aparece
- Espera unos segundos (lazy loading)
- Verifica que estés en `/dashboard`
- Revisa la consola del navegador (F12)

### El tema no cambia
- Limpia localStorage: Abre consola (F12) y escribe:
```javascript
localStorage.clear()
location.reload()
```

---

## 📸 Screenshots Esperados

### Desktop - Tema Oscuro
- Fondo negro (#0F1419)
- Cards gris oscuro (#1A1F2E)
- Texto blanco
- Mapa con fondo oscuro

### Desktop - Tema Claro
- Fondo blanco
- Cards blancos con bordes grises
- Texto negro
- Mapa con fondo claro

### Mobile
- 2 columnas en métricas
- Menú hamburguesa visible
- Mapa altura reducida (400px)
- Sidebar apilado verticalmente

---

## 🎉 ¡Listo para Deploy!

Una vez que verifiques que todo funciona localmente:

```bash
# Build de producción
npm run build

# Iniciar servidor de producción
npm start
```

O despliega en Vercel:
```bash
vercel
```

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa la consola del navegador (F12)
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de estar en la carpeta `frontend`
4. Prueba limpiando cache: `rm -rf .next`

---

**¡Todo está listo para visualizar! 🚀**
