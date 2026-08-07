/**
 * Genera le immagini Open Graph, una per pagina, dentro public/og/.
 * Gira da sola prima di ogni build (`npm run build`).
 *
 * Usa gli stessi token del sito. Se cambia la palette in src/styles/token.css,
 * cambiano i valori qui sotto e si rilancia `npm run og`.
 *
 * Niente rete. La versione precedente scaricava un .ttf da Google Fonts
 * fingendosi Android 2.2 — un trucco che funzionava finché funzionava, e che
 * faceva dipendere una build dalla disponibilità di un servizio esterno. Qui i
 * caratteri sono quelli che il sito già ospita in public/fonts/: si
 * decomprimono da woff2 a ttf al volo, perché il disegnatore SVG non legge
 * woff2, e non tocca nessuno scaricare niente.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { decompress } from 'wawoff2';
import subsetFont from 'subset-font';

const qui = path.dirname(fileURLToPath(import.meta.url));
const cartellaFont = path.join(qui, 'fonts');
const cartellaWoff = path.join(qui, '..', 'public', 'fonts');
const cartellaOut = path.join(qui, '..', 'public', 'og');

/** Gli stessi valori di src/styles/token.css. */
const COLORI = {
  carta: '#FAFAFA',
  inchiostro: '#0A0A0B',
  spento: '#686A70',
  filetto: '#E2E2E1',
  segnale: '#FF5C33',
};

const CARATTERI = [
  { woff2: 'geist-var.woff2', ttf: 'Geist.ttf', peso: 700 },
  { woff2: 'geist-mono-var.woff2', ttf: 'GeistMono.ttf' },
];

/** Quello che compare nelle schede: lettere, accenti, punteggiatura, segni. */
const ALFABETO = [
  " !\"#$%&'()*+,-./0123456789:;<=>?@",
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`',
  'abcdefghijklmnopqrstuvwxyz{|}~',
  'àáâäèéêëìíîïòóôöùúûüçñÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÙÚÛÜÇÑ',
  '€£©®°·–—…‘’“”«»•→←',
].join('');

const PAGINE = [
  {
    file: 'home',
    etichetta: 'Siti su misura — Vercelli · Casale Monferrato · Novara',
    righe: ['Il tuo locale ha una faccia.', 'Il sito deve avere quella.'],
  },
  {
    file: 'chi-sono',
    etichetta: 'Chi sono e come lavoro',
    righe: ['Risolvo problemi in magazzino.', 'Poi li risolvo in codice.'],
  },
  {
    file: 'progetti',
    etichetta: 'Lavori — siti e sistemi su misura',
    righe: ['Sei progetti,', 'raccontati per intero.'],
  },
  {
    file: 'servizi',
    etichetta: 'Cosa comprende un sito su misura',
    righe: ['Cosa comprende.', 'E cosa no.'],
  },
  {
    file: 'contatti',
    etichetta: 'Contatti — rispondo io',
    righe: ['Scrivimi.', 'La prima mezz’ora non si paga.'],
  },
];

/**
 * Il disegnatore SVG legge ttf e otf, non woff2.
 *
 * E non applica l'asse dei pesi di un carattere variabile: `font-weight="700"`
 * nell'SVG viene ignorato e il titolo esce in regolare, che accanto al sito è
 * un'immagine sbagliata. Quindi il peso lo fisso qui, nel carattere: quello dei
 * titoli è un'istanza a 700, il mono resta al suo peso normale.
 */
async function preparaCaratteri() {
  await mkdir(cartellaFont, { recursive: true });
  for (const c of CARATTERI) {
    const compresso = await readFile(path.join(cartellaWoff, c.woff2));
    const ttf = Buffer.from(await decompress(compresso));

    const finale = c.peso
      ? await subsetFont(ttf, ALFABETO, {
          targetFormat: 'truetype',
          variationAxes: { wght: { min: c.peso, max: c.peso, default: c.peso } },
        })
      : ttf;

    await writeFile(path.join(cartellaFont, c.ttf), finale);
  }
}

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function scheda(pagina) {
  const titolo = pagina.righe
    .map(
      (riga, i) =>
        `<text x="80" y="${312 + i * 92}" font-family="Geist" font-weight="700" font-size="76" letter-spacing="-3.4" fill="${COLORI.inchiostro}">${esc(riga)}</text>`
    )
    .join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${COLORI.carta}"/>

  <rect x="80" y="72" width="8" height="8" fill="${COLORI.segnale}"/>
  <text x="104" y="80" font-family="GeistMono" font-size="17" letter-spacing="2.2" fill="${COLORI.spento}">${esc(pagina.etichetta.toUpperCase())}</text>
  <rect x="80" y="108" width="1040" height="1" fill="${COLORI.filetto}"/>

  ${titolo}

  <rect x="80" y="486" width="1040" height="1" fill="${COLORI.inchiostro}"/>
  <text x="80" y="540" font-family="GeistMono" font-size="17" letter-spacing="2" fill="${COLORI.spento}">MICHELE MODICA — TRINO (VC)</text>
  <text x="1120" y="540" text-anchor="end" font-family="GeistMono" font-size="17" letter-spacing="2" fill="${COLORI.spento}">SITI · SISTEMI · AUTOMAZIONI</text>
</svg>`;
}

async function main() {
  console.log('Immagini Open Graph:');
  await preparaCaratteri();
  await mkdir(cartellaOut, { recursive: true });

  for (const pagina of PAGINE) {
    const png = new Resvg(scheda(pagina), {
      font: { fontDirs: [cartellaFont], loadSystemFonts: false, defaultFontFamily: 'Geist' },
      fitTo: { mode: 'width', value: 1200 },
    })
      .render()
      .asPng();
    await writeFile(path.join(cartellaOut, `${pagina.file}.png`), png);
    console.log(`  ✓ og/${pagina.file}.png`);
  }
}

main().catch((e) => {
  console.error('Generazione Open Graph fallita:', e);
  process.exitCode = 1;
});
