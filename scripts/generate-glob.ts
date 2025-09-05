import { readdirSync } from 'node:fs';

const files = readdirSync('src/commands').filter(f => f.endsWith('.ts'));
const lines = files.map((f, i) => `import ${`a${i}`.replace('.ts', '')} from './commands/${f}';`).join('\n');
const exportLine = `export const modules = { ${files.map((f,i) => `a${i}`.replace('.ts', '')).join(', ')} };`;

require('fs').writeFileSync('src/modules.generated.ts', lines + '\n' + exportLine);