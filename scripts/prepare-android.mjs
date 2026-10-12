import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=path.join(root,'android/app/src/main/assets');
fs.mkdirSync(target,{recursive:true});
fs.copyFileSync(path.join(root,'dist/index.html'),path.join(target,'index.html'));
console.log('Android local game assets prepared');
