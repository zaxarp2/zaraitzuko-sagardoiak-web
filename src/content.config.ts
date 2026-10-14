import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Colección de variedades.
 * Estructura en disco: src/content/variedades/{es,eu}/{slug}.md
 * El idioma va también en el frontmatter (`lang`) para poder filtrar
 * fácilmente y para que Sveltia CMS lo gestione en la fase de CMS.
 */
// El editor guarda '' cuando un desplegable opcional se deja sin elegir: se trata como "sin valor".
const vacioAUndefined = (v: unknown) => (v === '' || v === null ? undefined : v);

const variedades = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/variedades' }),
  schema: z.object({
    // Comunes (no cambian entre idiomas)
    // Orden en el catálogo (admite decimales: 1.5 va entre la 1 y la 2). El número que se ve en la web se calcula solo.
    n: z.number(),
    name: z.string(),
    // Manzana o pera (cada especie tiene su propia numeración y su sección)
    especie: z.enum(['manzana', 'pera']).default('manzana'),
    // Estado: se pueden marcar varios (p. ej. «Pendiente fruto» + «Pendiente molecular»).
    // Acepta también el formato antiguo de un solo valor; 'draft' (Borrador) ya no existe y pasa a «Pendiente más información».
    status: z.preprocess(
      (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v]).map((x) => (x === 'draft' ? 'info' : x)),
      z.array(z.enum(['confirmed', 'pending', 'fruto', 'info'])).min(1)
    ),
    // Época de recolección (la antigua «otoño» pasa a «media»)
    epoca: z.preprocess((v) => (v === 'otono' ? 'media' : vacioAUndefined(v)), z.enum(['temprana', 'media', 'tardia']).optional()),
    // Presencia: solo registrada en el Valle / presente también fuera (con los nombres que recibe fuera)
    ambito: z.preprocess(vacioAUndefined, z.enum(['valle', 'fuera']).optional()),
    fueraNombres: z.string().optional(),
    extension: z.preprocess(vacioAUndefined, z.enum(['extendida', 'minoritaria']).optional()),
    color: z.string(),
    colorAlt: z.string(),
    pueblos: z.array(z.string()).default([]),
    otrosPueblos: z.array(z.string()).default([]),
    // Galería de fotos de campo (carrusel de la ficha). Igual en ambos idiomas.
    fotos: z.array(z.object({ src: z.string(), pie: z.string().optional() })).default([]),
    // El idioma se deriva de la carpeta (es/ · eu/); el campo es opcional
    // para compatibilidad con el contenido creado desde Sveltia CMS.
    lang: z.enum(['es', 'eu']).optional(),

    // Bilingües (el valor concreto ya está en el idioma del fichero)
    extraStatus: z.string().optional(),
    antig: z.string().optional(),
    epocaLabel: z.string().optional(),
    tags: z.array(z.string()).default([]),
    estado: z.string().optional(),
    potencial: z.string().optional(),
    fruto: z.string().optional(),
    valoracion: z.string().optional(),
    quote: z.string().optional(),
    abundancia: z.string().optional(),
    origen: z.string().optional(),
    recogida: z.string().optional(),
    usos: z.string().optional(),
    otrasCar: z.string().optional(),
    molecular: z.string().optional(),
    obs: z.string().optional(),
  }),
});

/**
 * Colección de noticias / diario de campo.
 * Estructura en disco: src/content/noticias/{es,eu}/{slug}.md
 * El cuerpo de la noticia va en el body Markdown del fichero.
 */
const noticias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/noticias' }),
  schema: z.object({
    order: z.number(),
    date: z.string(),
    tag: z.string(),
    title: z.string(),
    // Texto corto para la tarjeta de la portada (si falta, se usa el principio del texto)
    resumen: z.string().optional(),
    lang: z.enum(['es', 'eu']).optional(),
  }),
});

export const collections = { variedades, noticias };
