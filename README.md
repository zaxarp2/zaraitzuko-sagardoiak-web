# Frutales Antiguos del Valle de Salazar — Web

Web editorial bilingüe (castellano / euskera) del **Proyecto de Recuperación de
Frutales Antiguos del Valle de Salazar** · *Zaraitzuko Fruta-arbola Zaharren
Berreskurapen Proiektua*.

Construida con **Astro**. Contenido en Markdown (una ficha por variedad y por
idioma), pensado para editarse más adelante con **Sveltia CMS**.

---

## Requisitos

- Node.js 18.20 o superior (recomendado 20+ o 22+)
- npm

## Arrancar en local

```bash
npm install       # instala dependencias (solo la primera vez)
npm run dev       # servidor de desarrollo en http://localhost:4321
```

- Castellano: `http://localhost:4321/`
- Euskera: `http://localhost:4321/eu/`

## Compilar para producción

```bash
npm run build     # genera el sitio estático en dist/
npm run preview   # sirve dist/ para revisarlo
```

---

## Estructura

```
src/
  content/
    variedades/
      es/*.md        18 fichas en castellano
      eu/*.md        18 fichas en euskera
    noticias/
      es/*.md        diario de campo (castellano)
      eu/*.md        diario de campo (euskera)
  content.config.ts  esquemas Zod de las colecciones
  i18n/ui.json       textos estáticos de interfaz (ES/EU) extraídos del mockup
  layouts/Base.astro nav + footer + <head> (fuentes, meta)
  components/Home.astro  hero + grid de variedades + diario
  pages/
    index.astro      /      (castellano, idioma por defecto)
    eu/index.astro   /eu/   (euskera)
  styles/global.css  diseño portado del mockup (paleta, tipografía, componentes)
```

### Idiomas

Configurado en `astro.config.mjs` con i18n nativo de Astro: el castellano es el
idioma por defecto y va sin prefijo (`/`), el euskera bajo `/eu/`. Cada ficha
existe como dos ficheros (`es/…` y `eu/…`) con el campo `lang` en el frontmatter.

### Los datos

Todas las fichas y noticias se migraron automáticamente desde el mockup HTML
original (`frutales-salazar-mockup-bilingue.html`). Los términos técnicos en
euskera pendientes de revisión conservan el marcador `[?]` con su tooltip, tal y
como se acordó en el documento de traspaso.

---

## Estado y siguientes fases

Hecho (Fases 1–2 del plan de traspaso):

- [x] Proyecto Astro con i18n (`/es` sin prefijo, `/eu`)
- [x] Paleta, tipografía y estilos portados del mockup
- [x] Esquemas Zod de `variedades` y `noticias`
- [x] Migración de las 18 fichas + 4 noticias a Markdown (ES + EU)
- [x] Portada que renderiza hero, catálogo de variedades y diario

Pendiente (Fases 3–6):

- [ ] Ficha completa de cada variedad (modal o página `/variedad/…`) con todos
      los campos y renderizado del `[?]`
- [ ] Filtros del catálogo (época, extensión, pueblo) y buscador
- [ ] Secciones "El proyecto" (metodología, promotores) y "El Valle" (mapa SVG)
- [ ] Formulario de "Colabora" (propón una variedad) → email + anti-spam
- [ ] Sveltia CMS en `/admin` para que Ester edite sin tocar código
- [ ] Despliegue a `sergiopenalver.eu`

## Decisiones abiertas antes de publicar

Ver §9 del documento de traspaso. En particular: hosting real, cuenta de GitHub
para el CMS, **privacidad de los informantes** (las fichas citan casas por
nombre), fotografías reales de campo y revisión del euskera.
