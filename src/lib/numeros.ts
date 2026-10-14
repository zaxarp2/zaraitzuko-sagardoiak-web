import { getCollection } from 'astro:content';

/**
 * Numeración automática del catálogo.
 * Ester ordena las variedades con el campo «Orden» (`n`, admite decimales);
 * la web numera 1, 2, 3… por especie siguiendo ese orden.
 */
export const slugDe = (id: string) => id.split('/').pop() as string;

export function ordenar(a: any, b: any) {
  return a.data.n - b.data.n || String(a.data.name).localeCompare(String(b.data.name), 'es');
}

const cache = new Map<string, Promise<Map<string, number>>>();

export function numeros(lang: 'es' | 'eu'): Promise<Map<string, number>> {
  if (!cache.has(lang)) {
    cache.set(
      lang,
      (async () => {
        const todas = (await getCollection('variedades', (e) => e.id.startsWith(lang + '/'))).sort(ordenar);
        const cont: Record<string, number> = {};
        const m = new Map<string, number>();
        for (const v of todas) {
          const esp = v.data.especie ?? 'manzana';
          cont[esp] = (cont[esp] ?? 0) + 1;
          m.set(slugDe(v.id), cont[esp]);
        }
        return m;
      })()
    );
  }
  return cache.get(lang)!;
}

export const dos = (n: number | undefined) => String(n ?? '').padStart(2, '0');

/** Clase CSS de la etiqueta de estado */
export const statusClass = (s: string) =>
  ({ confirmed: 'status-confirmed', pending: 'status-pending', fruto: 'status-fruto', info: 'status-info' } as Record<string, string>)[s] ??
  'status-info';

/** Estados de una variedad como lista (admite el formato antiguo de un solo valor) */
export const estados = (s: unknown): string[] => (Array.isArray(s) ? s : s ? [String(s)] : []);
