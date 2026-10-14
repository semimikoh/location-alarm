import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = resolve(root, 'apps/web/dist/index.html');
const destination = resolve(root, 'apps/mobile/assets/editor/index.html');
const html = await readFile(source, 'utf8');

if (
  !html.includes('<script') ||
  !html.includes('<style') ||
  /<(?:script|link)\b[^>]+(?:src|href)\s*=/.test(html)
) {
  throw new Error('Editor build must inline its JavaScript and CSS.');
}

await mkdir(resolve(root, 'apps/mobile/assets/editor'), { recursive: true });
await copyFile(source, destination);
console.info(`Bundled editor: ${destination}`);
