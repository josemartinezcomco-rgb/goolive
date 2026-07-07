# Contexto del trabajo · Dashboard Comercial Powest

> Documento de contexto extraído del ZIP adjunto en el repositorio
> (`dashboard-powest-claude-task-progress-check-snimo9.zip`). Reúne **toda la
> información y el contexto del trabajo realizado**: qué es la aplicación, cómo
> está construida, qué muestra cada pantalla, el modelo de datos, el despliegue
> y la integración con Microsoft Teams.

---

## 1. Resumen ejecutivo

**Qué es:** un **dashboard comercial estático** (una sola página web, sin
backend ni build) que visualiza las ventas de **Powest** frente al presupuesto,
con desgloses por jefatura comercial, dinamización, zona, cliente, producto y
avance diario. Está pensado para consultarse en el navegador y **embebido dentro
de Microsoft Teams / SharePoint / Office**.

- **Autor:** Jose Martinez (© 2026, según el pie del dashboard).
- **Identidad de marca Powest:** rojo `#e11f1d`, negro `#1d1d1b`, gris `#5a5a5a`,
  blanco hueso `#f9f9fa`; tipografía Helvetica.
- **Idioma / locale:** español, formato de moneda **COP** (`es-CO`).
- **Estado de los datos incluidos:** generados el **2026-07-02 08:06**, con corte
  al **2026-06-30**. Junio 2026 marcado como **preliminar**
  ("totales por zona al día; detalle por producto/cliente parcial").

> Nota: el repositorio se llama `goolive` ("app deportiva") pero el ZIP adjunto
> contiene el proyecto **dashboard-powest**. Este documento describe lo que
> realmente hay en el ZIP.

---

## 2. Stack tecnológico

| Aspecto | Detalle |
|---|---|
| Tipo | Sitio **100% estático**: HTML + JavaScript vanilla, **sin build, sin framework, sin dependencias npm** |
| Gráficas | **Chart.js** vendorizado localmente (`chart.umd.min.js`, ~205 KB), no CDN |
| Datos | Un único archivo `dashboard_data.js` (~8.8 MB) que asigna `window.DASH = {...}` |
| Estilos | CSS embebido en `index.html` (variables CSS, grid/flexbox, responsive, estilos de impresión) |
| Exportación | CSV/Excel generado en cliente (locale es-CO: separador `;`, decimales con coma, BOM UTF-8) |
| Impresión | `@media print` imprime solo la hoja activa en horizontal, con logo |

---

## 3. Inventario de archivos del ZIP

| Archivo | Función |
|---|---|
| `index.html` | **La aplicación completa** (1048 líneas): estructura, CSS y toda la lógica JS de las 6 páginas |
| `dashboard_data.js` | **Datos** (~8.8 MB): `window.DASH` con todo el modelo (ver §5) |
| `chart.umd.min.js` | Librería Chart.js vendorizada |
| `logo-powest.webp` | Logo de marca |
| `README.md` | "dashboard-powest — Dashboard Comercial Powest" |
| `DEPLOY.md` | Guía de despliegue en **Cloudflare Pages** (con Brotli) y migración desde Azure |
| `_headers` | Cabeceras Cloudflare: CSP `frame-ancestors` (Teams/Office/SharePoint/Powest) + cache |
| `_redirects` | Fallback SPA de Cloudflare (`/* -> /index.html 200`) |
| `staticwebapp.config.json` | Config equivalente para **Azure Static Web Apps** (rutas, CSP, mime, fallback) |
| `.github/workflows/azure-static-web-apps.yml` | CI de despliegue a Azure (`skip_app_build: true`) |
| `teams.html` | Pestaña de contenido en Teams: inicializa teams-js y redirige a `/index.html` (acceso sin login) |
| `teams-config.html` | Pantalla de configuración al agregar la pestaña a un canal de Teams |
| `teams-auth-end.html` | Callback de fin de autenticación de Teams (`notifySuccess`) |

---

## 4. Las 6 páginas del dashboard

Navegación por barra lateral (en móvil/tablet se convierte en barra superior
deslizable). Cada página tiene sus propios controles (selectores/chips), KPIs,
gráficas Chart.js y tablas exportables a Excel.

1. **Análisis general** — KPIs de la compañía o por jefatura comercial (ventas a
   la fecha, presupuesto YTD y anual, ejecución YTD/anual, variación YoY). Barras
   ventas vs presupuesto mensual, dona de composición por línea, y evolución
   anual histórica con selector de periodo comparable (año, YTD, semestres,
   trimestres, meses).
2. **Dinamización** — filtra por dinamizador y mes. KPIs de ventas/ppto/ejecución
   y nº de zonas. Barras horizontales por línea, barras apiladas zona×línea, y
   **tabla de ejecución por zona** (ventas vs ppto, % con semáforo) exportable.
3. **Detalle por zona** — selector de zona, mes, años (chips) y estado de cliente
   (**Todos / Activos / Inactivos / Pareto 80-20**). Líneas por producto año a
   año, barras totales año a año, **tabla de clientes** (hasta 300 en pantalla,
   Excel completo) y **resumen** de clientes activos/inactivos/Pareto de los
   últimos 2 años.
4. **Detalle por cliente** — buscador por nombre o NIT. KPIs (cliente, ventas de
   la selección, zona, dinamizador). Serie de ventas totales y por línea (mes a
   mes o un mes año a año); si el cliente tiene datos del mes en curso, vista
   **día a día**.
5. **Análisis por producto** — segmenta por General / Jefatura / Dinamización /
   Zona y por métrica **Valor ($) o Cantidad (u)**. Barras apiladas por línea
   2020–2026 y **tabla árbol Línea › Grupo › Referencia** (expandible; el Excel
   exporta todas las referencias aplanadas).
6. **Ventas diarias** — avance diario del mes en curso (días hábiles Lun–Vie) por
   General o dinamización. KPIs (acumulado, ppto asignado prorrateado,
   cumplimiento, ppto del mes), **tabla por zona**, gráfica de acumulado vs
   presupuesto y **tabla día a día**. Degrada con gracia si el mes aún no tiene
   ejecución.

**Detalles de UX transversales:** paleta de 10 colores liderada por el rojo de
marca; tooltips modo `index`/`nearest`; plugin propio **crosshair** (línea
vertical punteada en gráficas de línea/barra); botón **PDF/Imprimir**; botones
**⤓ Excel** por tabla; banner de **preliminar** cuando `meta.preliminar` es true.

---

## 5. Modelo de datos (`window.DASH`)

Claves de primer nivel:
`meta`, `kpi`, `mensual2026`, `ventasHist`, `jefaturas`, `porLinea2026`,
`porZona2026`, `zonaLinea2026`, `zonaMes2026`, `pptoZonaMes`, `porDinam2026`,
`dinamLinea2026`, `histZona`, `histLinea`, `zonaLineaMes`, `histLineaMes`,
`cliZonaMes`, `clientes`, `clienteSerie`, `producto`, `ventasDiarias`,
`clienteDiaria`.

**`meta`** — `generado`, `ultimaFecha` (2026-06-30), `anioActual` (2026),
`ultMes` (6), `ultMesNom` (Jun), `aniosHist` [2020…2026], `lineas` (7 líneas de
producto), `filas` (**681.132** registros de origen), `preliminar` (true),
`notaPreliminar`.

**Líneas de producto (7):** Calidad de Energía, Acumuladores de Energía,
Infraestructura TIC, Energía Renovable, Sin línea, Servicios y Varios,
Aeronavegación.

**`jefaturas`** — por clave (`__GEN__`, `RETAIL`, `ALEJANDRO ORTIZ`,
`MIGUEL RAMIREZ`, `OPERACIONES COMERCIALES`, `RICARDO RIOS`): `ventasAnio`,
`prevYTD`, `pptoAnio`, `pptoYTD`, `ejecAnio`, `ejecYTD`, `yoy`, `mensual[]`,
`porLinea[]`, `ventasHist`, `anioMes{año:{mes:valor}}`.

**Cifras de compañía (`__GEN__`, corte jun-2026):** ventas a la fecha
**$38.146.537.606**, ppto YTD **$42.734.350.000**, ejecución YTD **89,26 %**,
ppto anual **$94.665.000.000**, ejecución anual **40,3 %**, **YoY +7,88 %**.

**`porZona2026`** (59 zonas) — `zona`, `ejecutivo`, `dinamizador`, `jefatura`,
`ventas`, `ppto`, `ejec`.
**`porDinam2026`** (7) — dinamizadores: Oscar Furque, Valentina Sepúlveda, Leidy
de la Hoz, Yanneth Collazos, RETAIL, Ricardo Rios, Op. Comerciales.

**`clientes`** (**6.867**) — por NIT: `n` (nombre), `z` (zona), `d`
(dinamizador), `j` (jefatura), `t` (total).
**`clienteSerie`** — por NIT: `total{"YYYY-MM":valor}` y `lineas{linea:{"YYYY-MM":valor}}`.

**`producto`** — segmentos `general`/`jefatura`/`dinam`/`zona`; cada hoja: `l`
(línea), `g` (grupo), `r` (referencia), `y{año:[valor, cantidad]}`. La vista
general tiene **725 referencias**.

**`ventasDiarias`** — `anio`, `mes`, `mesNom`, `ultDia`, `diasHabMes`,
`preliminar`, `opciones[]`, `segments{}` con `rows[]`
(`d, fecha, habil, venta, acum, pptoAsig, cumpl`) y `zonas[]`
(`zona, ejec, asig, cumpl`). Presupuesto **prorrateado por días hábiles**.
**`clienteDiaria`** — `total{nit:{dia:valor}}` y `lineas{nit:{linea:{dia:valor}}}`.

---

## 6. Despliegue

**Objetivo:** el sitio es estático; el archivo pesado `dashboard_data.js` (~8.8
MB) se sirve **comprimido con Brotli** (~1.5 MB, −85 %) sin tocar el código.

- **Opción recomendada — Cloudflare Pages + Git** (sin secretos): conectar el
  repo, production branch `main`, framework `None`, sin build command, output
  `/`. Cada push a `main` redespliega. `_headers` y `_redirects` configuran CSP,
  cache y fallback SPA.
- **Opción alternativa — GitHub Actions** con `cloudflare/wrangler-action@v3`
  (requiere `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`).
- **Azure Static Web Apps** (config legado, se mantiene para migración sin
  caídas): `staticwebapp.config.json` + workflow `azure-static-web-apps.yml`
  (`skip_app_build: true`, `AZURE_STATIC_WEB_APPS_API_TOKEN`). El plan es
  validar Cloudflare y luego borrar ambos archivos de Azure.
- **Cache:** `dashboard_data.js` → `max-age=0, must-revalidate` (datos diarios);
  `chart.umd.min.js` y logo → 1 semana.

---

## 7. Integración con Microsoft Teams

- **CSP `frame-ancestors`** permite embeber en `teams.microsoft.com`,
  `*.office.com`, `*.sharepoint.com`, `*.powest.com` (definido tanto en
  `_headers` de Cloudflare como en `staticwebapp.config.json` de Azure).
- `teams.html`: inicializa `microsoftTeams` (teams-js 2.24.0) y **entra directo**
  al dashboard sin inicio de sesión.
- `teams-config.html`: al agregar la pestaña a un canal, guarda `contentUrl` /
  `websiteUrl` = `/teams.html`, nombre "Dashboard Comercial".
- `teams-auth-end.html`: callback de fin de auth (`authentication.notifySuccess`).

---

## 8. Cómo actualizar y probar

- **Actualizar datos:** regenerar `dashboard_data.js` (misma forma `window.DASH`)
  y hacer push a `main`; el deploy y el cache se refrescan solos.
- **Probar en local:** basta un servidor estático en la raíz
  (p. ej. `python3 -m http.server`) y abrir `index.html`.
- **Verificar Brotli en producción:**
  `curl -s -H "Accept-Encoding: br" -o /dev/null -w "%{size_download}\n" https://<sitio>.pages.dev/dashboard_data.js`
  debe rondar ~1.5 MB (y `content-encoding: br` en las cabeceras).
