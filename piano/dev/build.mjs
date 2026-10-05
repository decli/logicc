// Build 彩虹钢琴 for the logicc site:  dev/src/*  →  piano/index.html + piano/app.js
//   node piano/dev/build.mjs            one build
//   node piano/dev/build.mjs --watch    rebuild on save
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dev = dirname(fileURLToPath(import.meta.url));
const site = dirname(dev);
const watch = process.argv.includes('--watch');

function writeShell() {
  const js = readFileSync(join(site, 'app.js'));
  const v = createHash('sha1').update(js).digest('hex').slice(0, 8);
  const shell = readFileSync(join(dev, 'src', 'shell.html'), 'utf8')
    .replace('/*__CSS__*/', readFileSync(join(dev, 'src', 'style.css'), 'utf8'))
    .replace('__APP__', `app.js?v=${v}`);
  writeFileSync(join(site, 'index.html'), shell);
  console.log(`built piano/app.js (${(js.length / 1024).toFixed(0)} KB) + index.html  v=${v}`);
}

const opts = {
  entryPoints: [join(dev, 'src', 'main.js')],
  bundle: true, format: 'esm', target: ['safari15', 'chrome100'],
  minify: !watch, sourcemap: false, legalComments: 'none',
  outfile: join(site, 'app.js'),
  plugins: [{ name: 'shell', setup(b) { b.onEnd(r => { if (!r.errors.length) writeShell(); }); } }],
};
if (watch) { const c = await esbuild.context(opts); await c.watch(); console.log('watching…'); }
else await esbuild.build(opts);
