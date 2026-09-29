import { readFile, writeFile } from 'node:fs/promises';
import prettier from 'prettier';

const packageRoot = new URL('../', import.meta.url);
const tokens = JSON.parse(
  await readFile(new URL('tokens.json', packageRoot), 'utf8'),
);
const outputPath = new URL('../../../apps/web/src/tokens.css', import.meta.url);

function colorVariables(theme) {
  return Object.entries(tokens.color[theme])
    .map(([name, value]) => `    --color-${name}: ${value};`)
    .join('\n');
}

const typographyVariables = Object.entries(tokens.typography)
  .filter(([name]) => name !== 'fontFamily')
  .flatMap(([name, value]) => [
    `  --type-${name}-size: ${value.fontSize}px;`,
    `  --type-${name}-line: ${value.lineHeight}px;`,
    `  --type-${name}-weight: ${value.fontWeight};`,
    `  --type-${name}-tracking: ${value.letterSpacingEm}em;`,
  ])
  .join('\n');

const spacingVariables = Object.entries(tokens.space)
  .map(([name, value]) => `  --space-${name}: ${value}px;`)
  .join('\n');

const radiusVariables = Object.entries(tokens.radius)
  .map(([name, value]) => `  --radius-${name}: ${value}px;`)
  .join('\n');

const rawOutput = `/* Generated from packages/shared/tokens.json. Run pnpm tokens:generate. */
:root {
  --font-family: '${tokens.typography.fontFamily}', system-ui, sans-serif;
${colorVariables('light').replaceAll('    ', '  ')}
${typographyVariables}
${spacingVariables}
${radiusVariables}
}

@media (prefers-color-scheme: dark) {
  :root {
${colorVariables('dark')}
  }
}
`;
const output = await prettier.format(rawOutput, {
  parser: 'css',
  singleQuote: true,
});

if (process.argv.includes('--check')) {
  const current = await readFile(outputPath, 'utf8').catch(() => '');
  if (current !== output) {
    console.error(
      '웹 토큰 CSS가 tokens.json과 다릅니다. pnpm tokens:generate를 실행하세요.',
    );
    process.exitCode = 1;
  }
} else {
  await writeFile(outputPath, output);
}
