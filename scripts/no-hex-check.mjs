import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const ignoreDirs = new Set(['node_modules', 'dist', 'coverage', '.git']);
const ignorePaths = new Set([
  path.join(srcDir, 'styles', 'scss', '_dm.tokens.scss')
]);
const ignoreFolders = [path.join(srcDir, 'assets')];

const hexRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

function shouldIgnorePath(filePath) {
  if (ignorePaths.has(filePath)) {
    return true;
  }
  return ignoreFolders.some((folder) => filePath.startsWith(folder + path.sep));
}

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) {
        walk(fullPath, results);
      }
      continue;
    }
    if (shouldIgnorePath(fullPath)) {
      continue;
    }
    results.push(fullPath);
  }
  return results;
}

const files = walk(srcDir);
const matches = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (hexRegex.test(line)) {
      matches.push(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}

if (matches.length) {
  console.error('Se encontraron HEX directos fuera de _dm.tokens.scss:');
  for (const match of matches) {
    console.error(match);
  }
  process.exit(1);
}

console.log('OK: no hay HEX directos en src/ (excepto tokens).');