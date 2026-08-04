/**
 * Budget di JavaScript, per pagina.
 *
 * Segue il grafo dei moduli a partire dagli script che la pagina carica
 * davvero, import dinamici compresi: contare i file dentro _astro non serve a
 * niente, perché lì dentro c'è anche la roba delle altre pagine.
 *
 * Esce con codice 1 se una pagina sfora. `npm run peso`.
 */
import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const DIST = 'dist';

/** Tetti dichiarati in Fase 4, in KB compressi. */
const TETTI = [
  ['/', 55],
  ['/servizi', 12],
  ['/contatti', 12],
  ['/privacy', 12],
];

const pesoDi = (percorso) => {
  const file = join(DIST, percorso.replace(/^\//, ''));
  return existsSync(file) ? gzipSync(readFileSync(file)).length : 0;
};

/**
 * Ogni riferimento a un altro pezzo, statico o dinamico.
 *
 * Gli import dinamici non escono come "/_astro/nome.js" ma come "./nome.js"
 * relativi al pezzo che li contiene: cercare solo la cartella lasciava fuori
 * proprio GSAP e Lenis, cioè quasi tutto il peso vero della home.
 *
 * Qualche falso positivo è possibile — una stringa che finisce in .js dentro
 * del testo — ma i nomi che non esistono su disco vengono scartati dopo.
 */
const riferimenti = (testo) =>
  [...testo.matchAll(/["'`](?:[^"'`]*\/)?([A-Za-z0-9._-]+\.js)["'`]/g)].map(
    (m) => '/_astro/' + m[1]
  );

function grafoDi(pagina) {
  const indice = join(DIST, pagina === '/' ? 'index.html' : pagina.slice(1) + '/index.html');
  if (!existsSync(indice)) return null;

  const html = readFileSync(indice, 'utf8');
  const coda = [...new Set([...html.matchAll(/src="(\/_astro\/[^"]+\.js)"/g)].map((m) => m[1]))];
  const visti = new Set();

  while (coda.length) {
    const p = coda.pop();
    if (visti.has(p)) continue;
    const file = join(DIST, p.replace(/^\//, ''));
    if (!existsSync(file)) continue;
    visti.add(p);
    riferimenti(readFileSync(file, 'utf8')).forEach((r) => {
      if (!visti.has(r)) coda.push(r);
    });
  }

  return visti;
}

let sforate = 0;

for (const [pagina, tetto] of TETTI) {
  const grafo = grafoDi(pagina);
  if (!grafo) {
    console.log(`??  ${pagina.padEnd(12)} pagina non costruita`);
    continue;
  }

  const totale = [...grafo].reduce((somma, p) => somma + pesoDi(p), 0) / 1024;
  const passa = totale <= tetto;
  if (!passa) sforate++;

  console.log(
    `${passa ? 'ok  ' : 'NO  '}${pagina.padEnd(12)} ${totale.toFixed(1).padStart(6)} KB gz  ` +
      `(tetto ${tetto})  ${grafo.size} moduli`
  );

  if (!passa) {
    [...grafo]
      .map((p) => [p, pesoDi(p)])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([p, b]) =>
        console.log(`       ${(b / 1024).toFixed(1).padStart(6)} KB  ${p.split('/').pop()}`)
      );
  }
}

console.log(sforate === 0 ? '\nTutte le pagine nel budget.' : `\n${sforate} pagine sopra il tetto.`);
process.exit(sforate === 0 ? 0 : 1);
