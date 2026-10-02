#!/usr/bin/env python3
"""Arma el sitio: inserta las piezas compartidas y genera lo técnico de SEO.

Uso (desde la carpeta del sitio):

    python3 tools/build.py              # modo PRUEBAS (por defecto)
    python3 tools/build.py --produccion # modo PRODUCCIÓN (solo al publicar en risktech.com.co)

Diferencias entre modos:
                         PRUEBAS                    PRODUCCIÓN
  meta robots            noindex, nofollow          index, follow
  robots.txt             bloquea todo el sitio      permite todo + sitemap
  etiquetas de Google    no se cargan nunca         GTM se carga solo si el usuario acepta cookies

Cada página marca dónde va cada pieza así:

    <!-- @include header -->
    ...lo que haya aquí se reemplaza en cada build (no editar a mano)...
    <!-- @end header -->

Piezas: seo (se genera aquí), icons, header, footer (archivos _partials/<nombre>.html).
`{{root}}` en una pieza se cambia por la ruta relativa a la raíz del sitio.
"""
import html
import json
import re
import sys
from datetime import date
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
PARTIALS = SITE / "_partials"
DOMINIO = "https://risktech.com.co"
GTM_ID = "GTM-PPT54XN"
OG_IMAGE = f"{DOMINIO}/assets/img/og/risktech.png"
PRODUCCION = "--produccion" in sys.argv
BLOCK = re.compile(r"(<!-- @include (\w[\w-]*) -->)(.*?)(<!-- @end \2 -->)", re.S)
EXCLUIR = {"_partials", "tools", "assets", ".claude", ".git"}

ORG = {
    "@type": "Organization",
    "@id": f"{DOMINIO}/#organization",
    "name": "RiskTech",
    "legalName": "RISKTECH S.A.S.",
    "url": f"{DOMINIO}/",
    "logo": f"{DOMINIO}/assets/img/logos/risktech.png",
    "email": "mercadeo@risktech.com.co",
    "telephone": "+57 317 365 3316",
    "address": {"@type": "PostalAddress", "addressLocality": "Bogotá", "addressCountry": "CO"},
    "sameAs": [
        "https://co.linkedin.com/company/risktechsas",
        "https://www.instagram.com/risktech.co/",
        "https://www.facebook.com/r1sktech",
    ],
}
# Páginas de producto -> datos estructurados SoftwareApplication
PRODUCTOS = {
    "/amlrisk/": "AMLRISK",
    "/framl-ms-antifraude/": "FRAML-MS Anti-Fraud",
    "/framl-ms-aml/": "FRAML-MS AML",
    "/alert-framl-defense/": "FRAML Alert Defense",
}


def paginas():
    out = []
    for p in sorted(SITE.rglob("*.html")):
        rel = p.relative_to(SITE)
        if rel.parts[0] in EXCLUIR:
            continue
        if 'http-equiv="refresh"' in p.read_text(encoding="utf-8"):
            continue  # páginas de redirección: fuera del sitemap y sin piezas
        if p.name == "index.html" or rel.as_posix() == "404.html":
            out.append(p)
    return out


def url_de(rel: Path) -> str:
    """index.html -> /   ·   amlrisk/index.html -> /amlrisk/"""
    if rel.name == "404.html":
        return "/404.html"
    return "/" + "".join(f"{x}/" for x in rel.parts[:-1])


def meta(src, patron):
    m = re.search(patron, src, re.S)
    return html.unescape(m.group(1).strip()) if m else ""


def seo(src: str, rel: Path, root: str) -> str:
    url = url_de(rel)
    abs_url = DOMINIO + url
    titulo = meta(src, r"<title>(.*?)</title>")
    desc = meta(src, r'<meta name="description" content="([^"]*)"')
    es_404 = rel.name == "404.html"
    robots = "noindex, follow" if es_404 else ("index, follow" if PRODUCCION else "noindex, nofollow")
    e = lambda s: html.escape(s, quote=True)
    lineas = [f'<meta name="robots" content="{robots}">']
    if not es_404:
        lineas += [
            f'<link rel="canonical" href="{abs_url}">',
            '<meta property="og:type" content="website">',
            '<meta property="og:site_name" content="RiskTech">',
            '<meta property="og:locale" content="es_CO">',
            f'<meta property="og:title" content="{e(titulo)}">',
            f'<meta property="og:description" content="{e(desc)}">',
            f'<meta property="og:url" content="{abs_url}">',
            f'<meta property="og:image" content="{OG_IMAGE}">',
            '<meta property="og:image:width" content="1200">',
            '<meta property="og:image:height" content="630">',
            '<meta property="og:image:alt" content="RiskTech · Prevención de fraude y AML con IA">',
            '<meta name="twitter:card" content="summary_large_image">',
        ]
    lineas += [
        f'<link rel="icon" href="{root}assets/img/favicon.webp" type="image/webp">',
        f'<link rel="apple-touch-icon" href="{root}assets/img/favicon.webp">',
    ]
    grafo = []
    if url == "/":
        grafo += [ORG, {"@type": "WebSite", "@id": f"{DOMINIO}/#website", "url": f"{DOMINIO}/",
                        "name": "RiskTech", "inLanguage": "es-CO", "publisher": {"@id": ORG["@id"]}}]
    elif url in PRODUCTOS:
        grafo.append({"@type": "SoftwareApplication", "name": PRODUCTOS[url], "url": abs_url,
                      "description": desc, "applicationCategory": "BusinessApplication",
                      "operatingSystem": "Web", "inLanguage": "es",
                      "publisher": {"@id": ORG["@id"]}, "provider": ORG})
    # artículos del blog: <article data-published="AAAA-MM-DD" data-image="ruta"> -> BlogPosting
    art = re.search(r'<article data-published="([^"]+)" data-image="([^"]+)"', src)
    if art:
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", src, re.S)
        grafo.append({"@type": "BlogPosting", "headline": re.sub(r"<[^>]+>", "", h1.group(1)).strip() if h1 else titulo,
                      "description": desc, "datePublished": art.group(1), "inLanguage": "es-CO",
                      "image": f"{DOMINIO}/{art.group(2)}", "mainEntityOfPage": abs_url,
                      "author": {"@type": "Organization", "name": "Equipo RiskTech", "url": f"{DOMINIO}/nosotros/"},
                      "publisher": {"@id": ORG["@id"]}})
    # preguntas frecuentes (<details class="faq-item"><summary>P</summary><p>R</p></details>) -> FAQPage
    faqs = re.findall(r'<details class="faq-item"[^>]*>\s*<summary>(.*?)</summary>\s*(.*?)</details>', src, re.S)
    if faqs:
        limpio = lambda t: html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t))).strip()
        grafo.append({"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": limpio(q), "acceptedAnswer": {"@type": "Answer", "text": limpio(a)}}
            for q, a in faqs]})
    if not es_404:
        grafo.append({"@type": "WebPage", "@id": abs_url, "url": abs_url, "name": titulo,
                      "description": desc, "inLanguage": "es-CO",
                      "isPartOf": {"@id": f"{DOMINIO}/#website"}})
        lineas.append('<script type="application/ld+json">'
                      + json.dumps({"@context": "https://schema.org", "@graph": grafo}, ensure_ascii=False)
                      + "</script>")
    cfg = {"gtm": GTM_ID if PRODUCCION else None}
    lineas.append(f"<script>window.RT_CONFIG={json.dumps(cfg)};</script>")
    return "\n".join(lineas)


def render(name: str, root: str, page_href: str, src: str, rel: Path) -> str:
    if name == "seo":
        return seo(src, rel, root)
    html_ = (PARTIALS / f"{name}.html").read_text(encoding="utf-8").replace("{{root}}", root)
    if name == "header":
        html_ = html_.replace(f'<a href="{page_href}"', f'<a aria-current="page" href="{page_href}"')
        # marcar el desplegable que contiene la página actual
        html_ = re.sub(
            r'<div class="has-drop">(<button.*?</button>\s*<div class="drop"[^>]*>.*?</div>)',
            lambda m: ('<div class="has-drop current">' if 'aria-current="page"' in m.group(1)
                       else '<div class="has-drop">') + m.group(1),
            html_, flags=re.S)
    return html_.rstrip("\n")


def build_page(path: Path) -> bool:
    rel = path.relative_to(SITE)
    depth = len(rel.parts) - 1
    root = "../" * depth if depth else "./"
    page_href = root if rel.name == "index.html" and depth == 0 else root + "/".join(rel.parts[:-1]) + "/"
    if rel.name == "404.html":
        root, page_href = "/", "/404.html"  # la 404 se sirve desde cualquier ruta
    src = path.read_text(encoding="utf-8")

    def repl(m):
        name = m.group(2)
        if name != "seo" and not (PARTIALS / f"{name}.html").exists():
            sys.exit(f"{rel}: no existe _partials/{name}.html")
        return f"{m.group(1)}\n{render(name, root, page_href, src, rel)}\n{m.group(4)}"

    out = BLOCK.sub(repl, src)
    if out != src:
        path.write_text(out, encoding="utf-8")
        return True
    return False


def robots_y_sitemap(pages):
    urls = [url_de(p.relative_to(SITE)) for p in pages if p.name != "404.html"]
    hoy = date.today().isoformat()
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    sm += [f"  <url><loc>{DOMINIO}{u}</loc><lastmod>{hoy}</lastmod></url>" for u in urls]
    sm.append("</urlset>")
    (SITE / "sitemap.xml").write_text("\n".join(sm) + "\n", encoding="utf-8")
    if PRODUCCION:
        robots = f"User-agent: *\nAllow: /\n\nSitemap: {DOMINIO}/sitemap.xml\n"
    else:
        robots = "# SITIO DE PRUEBAS: no indexar. Se reemplaza al construir con --produccion.\nUser-agent: *\nDisallow: /\n"
    (SITE / "robots.txt").write_text(robots, encoding="utf-8")


def validar_produccion():
    """Bloquea la publicación si queda algo que haría perder datos o posicionamiento."""
    errores = []
    demo = SITE / "agenda-tu-demo" / "index.html"
    if demo.exists() and re.search(r'<form id="demo-form" data-endpoint=""', demo.read_text(encoding="utf-8")):
        errores.append("agenda-tu-demo: el formulario no está conectado al CRM (data-endpoint vacío).")
    if not (SITE / "assets/img/og/risktech.png").exists():
        errores.append("falta la imagen para redes sociales assets/img/og/risktech.png.")
    if errores:
        sys.exit("No se puede construir en modo PRODUCCIÓN:\n  - " + "\n  - ".join(errores))


def main():
    if PRODUCCION:
        validar_produccion()
    pages = paginas()
    changed = [p for p in pages if build_page(p)]
    robots_y_sitemap(pages)
    print(f"Modo: {'PRODUCCIÓN' if PRODUCCION else 'PRUEBAS (noindex, sin etiquetas)'}")
    print(f"{len(pages)} páginas revisadas, {len(changed)} actualizadas; robots.txt y sitemap.xml generados")
    for p in changed:
        print("  ·", p.relative_to(SITE))


if __name__ == "__main__":
    main()
