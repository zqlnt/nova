#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const folder = root.split(/[/\\]/).pop();

console.log('');
console.log('  ═══════════════════════════════════════════════════════');
console.log(`    Nova e-learning  (folder: ${folder})`);
console.log('    Dev URL:          http://127.0.0.1:3010');
console.log(`    Project root:     ${root}`);
console.log('  ═══════════════════════════════════════════════════════');
console.log('    Run `npm run dev` only from this folder so you do not');
console.log('    start another app by mistake.');
console.log('  ═══════════════════════════════════════════════════════');
console.log('');
