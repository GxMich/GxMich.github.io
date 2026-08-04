/**
 * Budget di JavaScript, per pagina.
 *
 * Distingue due numeri, perché confonderli dà una risposta sbagliata:
 *
 *  - INIZIALE:    quello che il browser scarica comunque, prima di qualsiasi
 *                 interazione. È il numero che pesa sul primo disegno.
 *  - SU RICHIESTA: quello che arriva solo se la pagina lo chiede davvero —
 *                 GSAP entra con un import dinamico e su /servizi non viene
 *                 mai caricato, anche se il pezzo esiste nella cartella.
 *
 * La prima versione di questo script li sommava, e dava /servizi a 52 KB
 * contro un tetto di 12: un allarme falso che avrebbe fatto tagliare la cosa
 * sbagliata.
 *
 * Esce con codice 1 se una pagina sfora. `npm run peso`.
 */
import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const DIST = 'dist';

/** [pagina, tetto iniziale, tetto totale] in KB compressi. */
const TETTI = [
  ['/', 12, 55],
  ['/progetti', 12, 55],
  ['/servizi', 12, 55],
  ['/chi-sono', 12, 55],
  ['/contatti', 12, 55],
  ['/privacy', 12, 55],
];

const pesoDi = (percorso) => {
  const file = join(DIST, percorso.replace(/^\//, ''));
  return existsSync(file) ? gzipSync(readFileSync(file)).length : 0;
};

const normalizza = (grezzo) => '/_astro/' + grezzo.split('/').pop();

/** `import ... from "x"` e `import "x"`: arrivano sempre. */
const statici = (testo) =>
  [...testo.matchAll(/(?:\bfrom|\bimport)\s*["']([^"']+\.js)["']/g)].map((m) => normalizza(m[1]));

/** `import("x")` e le liste del precaricatore di Vite: arrivano su richiesta. */
const dinamici = (testo) => [
  ...[...testo.matchAll(/\bimport\s*\(\s*["']([^"']+\.js)["']\s*\)/g)].map((m) => normalizza(m[1])),
  ...[...testo.matchAll(/["']([A-Za-z0-9._-]+\.js)["']/g)].map((m) => normalizza(m[1])),
];

function grafoDi(pagina) {
  const indice = join(DIST, pagina === '/' ? 'index.html' : pagina.slice(1) + '/index.html');
  if (!existsSync(indice)) return null;

  const html = readFileSync(indice, 'utf8');
  const radici = [...new Set([...html.matchAll(/src="(\/_astro\/[^"]+\.js)"/g)].map((m) => m[1]))];

  const iniziale = new Set();
  const suRichiesta = new Set();

  // Prima passata: solo archi statici, a partire dagli script della pagina.
  const coda = [...radici];
  while (coda.length) {
    const p = coda.pop();
    if (iniziale.has(p)) continue;
    const file = join(DIST, p.replace(/^\//, ''));
    if (!existsSync(file)) continue;
    iniziale.add(p);
    statici(readFileSync(file, 'utf8')).forEach((r) => {
      if (!iniziale.has(r)) coda.push(r);
    });
  }

  // Seconda passata: tutto il resto raggiungibile, statico o dinamico.
  const coda2 = [...iniziale];
  const tutto = new Set(iniziale);
  while (coda2.length) {
    const p = coda2.pop();
    const file = join(DIST, p.replace(/^\//, ''));
    if (!existsSync(file)) continue;
    const testo = readFileSync(file, 'utf8');
    [...statici(testo), ...dinamici(testo)].forEach((r) => {
      if (!tutto.has(r) && existsSync(join(DIST, r.replace(/^\//, '')))) {
        tutto.add(r);
        coda2.push(r);
      }
    });
  }

  tutto.forEach((p) => {
    if (!iniziale.has(p)) suRichiesta.add(p);
  });

  return { iniziale, suRichiesta };
}

const somma = (insieme) => [...insieme].reduce((t, p) => t + pesoDi(p), 0) / 1024;

let sforate = 0;

for (const [pagina, tettoIniziale, tettoTotale] of TETTI) {
  const grafo = grafoDi(pagina);
  if (!grafo) {
    console.log(`??  ${pagina.padEnd(12)} pagina non costruita`);
    continue;
  }

  const iniziale = somma(grafo.iniziale);
  const richiesta = somma(grafo.suRichiesta);
  const totale = iniziale + richiesta;
  const passa = iniziale <= tettoIniziale && totale <= tettoTotale;
  if (!passa) sforate++;

  console.log(
    `${passa ? 'ok  ' : 'NO  '}${pagina.padEnd(12)} ` +
      `iniziale ${iniziale.toFixed(1).padStart(5)} KB (max ${tettoIniziale})   ` +
      `su richiesta ${richiesta.toFixed(1).padStart(5)} KB   ` +
      `totale ${totale.toFixed(1).padStart(5)} KB (max ${tettoTotale})`
  );

  if (!passa) {
    [...grafo.iniziale, ...grafo.suRichiesta]
      .map((p) => [p, pesoDi(p)])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .forEach(([p, b]) =>
        console.log(`       ${(b / 1024).toFixed(1).padStart(6)} KB  ${p.split('/').pop()}`)
      );
  }
}

console.log(sforate === 0 ? '\nTutte le pagine nel budget.' : `\n${sforate} pagine sopra il tetto.`);
process.exit(sforate === 0 ? 0 : 1);
