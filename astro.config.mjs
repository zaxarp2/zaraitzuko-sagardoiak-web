// @ts-check
import { defineConfig } from 'astro/config';
import { readdir, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Al publicar, las fotos de /fotos y /uploads se reducen (máx. 1600 px) y se
// re-codifican sin metadatos: nunca sale a la web el GPS de la cámara.
async function listar(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map((e) => (e.isDirectory() ? listar(join(dir, e.name)) : [join(dir, e.name)])));
    return files.flat();
  } catch {
    return [];
  }
}
function limpiarImagenes() {
  return {
    name: 'limpiar-imagenes',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        let sharp;
        try {
          sharp = (await import('sharp')).default;
        } catch {
          logger.warn('sharp no disponible: las fotos se publican tal cual');
          return;
        }
        const root = fileURLToPath(dir);
        let n = 0;
        for (const sub of ['fotos', 'uploads']) {
          for (const f of await listar(join(root, sub))) {
            const ext = extname(f).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
            const img = sharp(f).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });
            const out =
              ext === '.png' ? img.png({ compressionLevel: 9 }) : ext === '.webp' ? img.webp({ quality: 82 }) : img.jpeg({ quality: 80, mozjpeg: true });
            await writeFile(f, await out.toBuffer());
            n++;
          }
        }
        logger.info(`${n} fotos reducidas y sin metadatos`);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://zaraitzukosagardoiak.org',
  integrations: [limpiarImagenes()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'eu'],
    routing: {
      // El castellano es el idioma por defecto y va sin prefijo (/),
      // el euskera vive bajo /eu/.
      prefixDefaultLocale: false,
    },
  },
});
