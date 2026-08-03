/**
 * Genera le immagini Open Graph, una per pagina, dentro public/og/.
 * Gira da sola prima di ogni build (`npm run build`).
 *
 * Usa gli stessi colori e caratteri del sito. Se cambi la palette in
 * global.css, cambia i valori qui sotto e rilancia `npm run og`.
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const qui = path.dirname(fileURLToPath(import.meta.url));
const cartellaFont = path.join(qui, 'fonts');
const cartellaOut = path.join(qui, '..', 'public', 'og');

const COLORI = {
  fondo: '#050505',
  testo: '#FAFAFA',
  spento: '#8A8A8A',
  bordo: '#1F1F1F',
};

/** JetBrains Mono serve solo qui: General Sans è già in scripts/fonts. */
const MONO = {
  file: 'JetBrainsMono-500.ttf',
  famiglia: 'JetBrains Mono:500',
};
// Android 2.2 è l'unica finestra in cui Google Fonts risponde con un .ttf
const UA_VECCHIO =
  'Mozilla/5.0 (Linux; U; Android 2.2; en-us; DROID2 GLOBAL Build/S273) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';

const PAGINE = [
  {
    file: 'home',
    etichetta: 'Sviluppatore web — Casale Monferrato · Vercelli · Novara',
    righe: ['Dieci strade esplorate,', 'una scelta a mano.'],
  },
  {
    file: 'chi-sono',
    etichetta: 'Chi sono e come lavoro',
    righe: ['Dove entra la macchina,', 'dove entro io.'],
  },
  {
    file: 'progetti',
    etichetta: 'Progetti — siti, tool e automazioni',
    righe: ['Ogni progetto parte', 'da un problema preciso.'],
  },
  {
    file: 'servizi',
    etichetta: 'Servizi e prezzi',
    righe: ['Cosa comprende, cosa no,', 'quanto costa.'],
  },
  {
    file: 'contatti',
    etichetta: 'Contatti',
    righe: ['Dimmi cosa ti serve,', 'anche se non è chiaro.'],
  },
];

async function esiste(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function assicuraMono() {
  await mkdir(cartellaFont, { recursive: true });
  const percorso = path.join(cartellaFont, MONO.file);
  if (await esiste(percorso)) return;

  console.log(`  scarico ${MONO.file}…`);
  const css = await fetch(
    `https://fonts.googleapis.com/css?family=${encodeURIComponent(MONO.famiglia)}`,
    { headers: { 'User-Agent': UA_VECCHIO } }
  );
  if (!css.ok) throw new Error(`CSS HTTP ${css.status}`);
  const indirizzo = (await css.text()).match(/src:\s*url\(([^)]+)\)/)?.[1];
  if (!indirizzo) throw new Error('nessun .ttf nella risposta');

  const risposta = await fetch(indirizzo, { headers: { 'User-Agent': UA_VECCHIO } });
  if (!risposta.ok) throw new Error(`HTTP ${risposta.status}`);
  await writeFile(percorso, Buffer.from(await risposta.arrayBuffer()));
}

function esc(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function scheda(pagina) {
  const titolo = pagina.righe
    .map(
      (riga, i) =>
        `<text x="72" y="${300 + i * 96}" font-family="General Sans" font-weight="700" font-size="82" letter-spacing="-3.4" fill="${COLORI.testo}">${esc(riga)}</text>`
    )
    .join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${COLORI.fondo}"/>
  <defs>
    <radialGradient id="alone" cx="0.5" cy="0" r="0.85">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#alone)"/>

  <rect x="72" y="72" width="26" height="1" fill="${COLORI.spento}"/>
  <text x="112" y="77" font-family="JetBrains Mono" font-size="18" letter-spacing="2.2" fill="${COLORI.spento}">${esc(pagina.etichetta.toUpperCase())}</text>

  ${titolo}

  <rect x="72" y="470" width="1056" height="1" fill="${COLORI.bordo}"/>
  <rect x="72" y="464" width="1" height="14" fill="${COLORI.testo}"/>

  <text x="72" y="536" font-family="JetBrains Mono" font-size="18" letter-spacing="2" fill="${COLORI.spento}">MICHELE — SVILUPPATORE WEB &amp; SOFTWARE</text>
  <text x="1128" y="536" text-anchor="end" font-family="JetBrains Mono" font-size="18" letter-spacing="2" fill="${COLORI.spento}">SITI · TOOL · AUTOMAZIONI</text>
</svg>`;
}

async function main() {
  console.log('Immagini Open Graph:');
  try {
    await assicuraMono();
  } catch (e) {
    console.warn(`  ! font mono non disponibile (${e.message}). Salto la generazione.`);
    return;
  }

  await mkdir(cartellaOut, { recursive: true });

  for (const pagina of PAGINE) {
    const png = new Resvg(scheda(pagina), {
      font: { fontDirs: [cartellaFont], loadSystemFonts: false, defaultFontFamily: 'General Sans' },
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
