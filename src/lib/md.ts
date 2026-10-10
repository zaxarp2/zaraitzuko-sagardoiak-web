import { marked } from 'marked';

/** Convierte el Markdown de los campos del editor (negritas, cursivas, enlaces, párrafos) en HTML. */
export function md(s?: string): string {
  if (!s) return '';
  return marked.parse(s, { async: false, breaks: true }) as string;
}
