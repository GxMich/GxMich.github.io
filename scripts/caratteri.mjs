/**
 * Riduce i caratteri al latino che il sito usa davvero.
 *
 * Geist e Geist Mono arrivano con l'intero repertorio: 69 e 71 KB, che sono
 * 140 KB precaricati prima ancora del primo disegno. Il sito è in italiano e
 * non mostrerà mai cirillico, greco o vietnamita.
 *
 * L'asse dei pesi resta variabile: il sottoinsieme tocca i glifi, non le
 * variazioni. `npm run caratteri`.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const qui = path.dirname(fileURLToPath(import.meta.url));
const cartella = path.join(qui, '..', 'public', 'fonts');

/**
 * Latino base più le lettere accentate che l'italiano usa davvero, la
 * punteggiatura tipografica (virgolette curve, trattini, ellissi) e i segni
 * che compaiono in pagina: euro, freccia, punto elenco, per mille.
 *
 * Le frecce → e ← sono nell'interfaccia: se le tolgo dal sottoinsieme il
 * browser va a pescarle da un carattere di sistema e la riga si disallinea.
 */
const GLIFI = [
  ' !"#$%&\'()*+,-./0123456789:;<=>?@',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`',
  'abcdefghijklmnopqrstuvwxyz{|}~',
  'àáâãäèéêëìíîïòóôõöùúûüçñÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÙÚÛÜÇÑ',
  '€£¥©®°·–—…‘’“”„«»†‡•‰′″→←↑↓×÷±≈≠≤≥',
].join('');

const FILE = [
  'geist-var.woff2',
  'geist-mono-var.woff2',
  'instrument-serif-400.woff2',
  'instrument-serif-400-italic.woff2',
];

let primaTot = 0;
let dopoTot = 0;

for (const nome of FILE) {
  const percorso = path.join(cartella, nome);
  const originale = await readFile(percorso);

  const ridotto = await subsetFont(originale, GLIFI, {
    targetFormat: 'woff2',
    // Senza questo, un sottoinsieme di un carattere variabile viene appiattito
    // su un peso solo e tutti i titoli in 700 tornano regolari.
    variationAxes: undefined,
  });

  primaTot += originale.length;
  dopoTot += ridotto.length;

  await writeFile(percorso, ridotto);
  console.log(
    `  ${nome.padEnd(32)} ${(originale.length / 1024).toFixed(0).padStart(3)} KB → ` +
      `${(ridotto.length / 1024).toFixed(0).padStart(3)} KB`
  );
}

console.log(
  `\n  totale ${(primaTot / 1024).toFixed(0)} KB → ${(dopoTot / 1024).toFixed(0)} KB ` +
    `(−${(100 - (dopoTot / primaTot) * 100).toFixed(0)}%)`
);
console.log('\n  I file in public/fonts/ sono stati sostituiti: sono già i sottoinsiemi.');
