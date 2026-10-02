# RiskTech — nueva versión del sitio

Sitio estático (HTML + CSS + JS, sin WordPress) con la nueva línea visual de los
mockups de `../Mockups/`. El menú tiene la estructura del sitio anterior
(`../PAGINA ANTERIOR/risktech-site`). El estado de cada punto de la auditoría
está en [AUDITORIA-ESTADO.md](AUDITORIA-ESTADO.md).

## Estructura

Cada página es una carpeta con su `index.html`. Así las URLs son **las mismas
del WordPress** (`risktech.com.co/amlrisk/`) y no hay que redirigirlas.

```
.
├── index.html                    Inicio (mockup Home)
├── amlrisk/                      (mockup AMLRISK)
├── framl-ms-antifraude/          (mockup FRAML MS AFT)
├── framl-ms-aml/                 (mockup FRAML MS AML)
├── alert-framl-defense/          Plantilla de producto (CSS de AFT + acento coral)
├── nosotros/, tecnologia/        Páginas internas (assets/css/pages/interior.css)
├── blog/, category/articulos/    Listados de contenido
├── a-prueba-de-fraude/           Podcast
├── <slug-del-artículo>/          Los 4 artículos (mismo slug del WordPress)
├── politica-de-privacidad/, politica-de-cookies/
├── agenda-tu-demo/               Formulario de demo (destino de todos los "Agenda tu demo")
├── category/podcast/             Redirección a /a-prueba-de-fraude/ (URL antigua)
├── 404.html                      Página de error propia
├── robots.txt, sitemap.xml       Los genera el build (no editar)
├── _partials/                    Piezas compartidas por TODAS las páginas
│   ├── header.html                  Menú superior + menú móvil
│   ├── footer.html                  Footer + banner de cookies
│   └── icons.html                   Íconos SVG (se usan con <use href="#nombre"/>)
├── assets/
│   ├── css/base.css              Colores de marca, botones, menú, footer, banner de cookies
│   ├── css/pages/interior.css    Base de las páginas sin mockup (cabecera, tarjetas, blog, texto largo)
│   ├── css/pages/<pagina>.css    Estilos propios de cada página
│   ├── js/main.js                Menú fijo, desplegables, menú móvil, animaciones
│   ├── js/consent.js             Consentimiento de cookies (carga GTM solo si aceptan)
│   ├── js/pages/<pagina>.js      Animaciones propias de cada página
│   └── img/                      Logos, favicon e imagen para redes (og/)
└── tools/
    ├── build.py                  Inserta piezas compartidas y genera el SEO técnico
    └── og-image.html             Fuente de la imagen para redes sociales
```

## Construir el sitio

Después de cambiar algo en `_partials/` o de agregar una página:

```bash
python3 tools/build.py
```

Eso es el **modo pruebas**: `noindex`, `robots.txt` que bloquea todo y ninguna
etiqueta de Google. Solo al publicar en risktech.com.co:

```bash
python3 tools/build.py --produccion
```

Ese modo quita el `noindex`, publica el sitemap y activa GTM (`GTM-PPT54XN`),
que solo se carga si la persona acepta las cookies. **No deja construir** si el
formulario de demo no está conectado al CRM o si falta la imagen para redes.

En cada página, el contenido entre `<!-- @include X -->` y `<!-- @end X -->` lo
reescribe el build; no lo edites a mano. El bloque `seo` (canonical, Open Graph,
datos estructurados, robots) se genera con el `<title>` y la `description` de la página.

## Formulario de demo

`agenda-tu-demo/index.html` → `<form id="demo-form" data-endpoint="…" data-key="…">`.
Envía un POST JSON a `https://crm.todosistemassti.co/api/marketing/leads/ingest`
con la cabecera `x-api-key` (= `data-key`). Campos:

| JSON | Campo del formulario |
|---|---|
| `nombreContacto` | Nombre y apellido (`nombre`) |
| `correo` | Correo corporativo (`correo`) |
| `telefono` | Celular, opcional (`celular`; vacío si no lo llena) |
| `nombreEmpresa` | Empresa (`empresa`) |
| `producto` | Texto visible de la solución elegida (`producto`), p. ej. "FRAML MS AML" |
| `mensaje` | Una línea por dato: `Rol: …`, autorización de datos con fecha y hora de Bogotá, `Acepta recibir contenidos por correo: Sí/No`, `Origen: …` (página de donde llegó) y `Página: …` (URL del formulario) |

Los botones de cada producto agregan `?producto=…` para preseleccionar la solución.

## Agregar una página nueva

1. Crea la carpeta con el slug de la URL (el mismo del WordPress si existía) y
   copia dentro un `index.html` existente del mismo nivel.
2. Cambia `<title>` (formato `Página | RiskTech`), la `description` (~150
   caracteres) y el contenido de `<main>`.
3. Crea `assets/css/pages/<pagina>.css` (y `assets/js/pages/<pagina>.js` si hace falta).
4. Si va en el menú, agrégala en `_partials/header.html`. Luego ejecuta `python3 tools/build.py`.

Para una página interior (sin mockup), copia `nosotros/index.html` y usa los
componentes de `interior.css`: `page-hero`, `card`, `g2`/`g3`/`g4`, `split`,
`final`, `posts` y `prose`. Para preguntas frecuentes usa
`<details class="faq-item"><summary>Pregunta</summary><p>Respuesta</p></details>`:
el build genera solo los datos estructurados FAQPage. Un artículo nuevo lleva
`<article data-published="AAAA-MM-DD" data-image="ruta/imagen">` para BlogPosting.

Reglas de la auditoría: botones solo "Agenda tu demo", "Habla con un experto",
"Prueba AMLRISK gratis" y "Leer más". Nombres de producto: AMLRISK, FRAML MS
AntiFraud, FRAML MS AML y FRAML Alert Defense. Toda imagen lleva `alt`.

## Imagen para redes sociales

Edita `tools/og-image.html` y, con el servidor local encendido, regenera el PNG:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1200,630 --virtual-time-budget=4000 --screenshot="$PWD/assets/img/og/risktech.png" http://localhost:8124/tools/og-image.html
```

## Ver en local

```bash
python3 -m http.server 8124
```

Y abrir <http://localhost:8124>.
