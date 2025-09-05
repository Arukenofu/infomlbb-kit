import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const folders = ['commands', 'middlewares', 'events', 'filters'];
const generatedDir = join('src', '.generated');

if (!existsSync(generatedDir)) {
  mkdirSync(generatedDir);
}

folders.forEach(folder => {
  const folderPath = join('src', folder);
  const files = readdirSync(folderPath).filter(f => f.endsWith('.ts'));

  function name(str: string) {
    return str.replace('.ts', '').replace('-', '_')
  }

  const imports = files.map((file) => {
    const varName = name(file);
    return `import ${varName} from '../${folder}/${file.replace('.ts', '')}';`;
  });

  const exportLine = `export const ${folder} = [ ${files.map(name).join(', ')} ];`;

  const content = imports.join('\n') + '\n\n' + exportLine;

  writeFileSync(join(generatedDir, `${folder}.ts`), content);
  console.log(`src/.generated/${folder}.ts created!`);
});
