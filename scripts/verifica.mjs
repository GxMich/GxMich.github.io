/**
 * Verifica del sito costruito.
 *
 * Controlla quello che si può controllare da fermo: struttura dei titoli,
 * testi alternativi, meta, dati strutturati, collegamenti interni, sitemap.
 * Non sostituisce Lighthouse e non misura la velocità reale — misura le cose
 * che si rompono in silenzio e che nessuno si accorge finché non è tardi.
 *
 * `npm run verifica`. Esce con codice 1 se trova un errore.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { SITE } from '../src/config.js';

const DIST = 'dist';
const errori = [];
const avvisi = [];

const err = (pagina, msg) => errori.push(`${pagina} — ${msg}`);
const avv = (pagina, msg) => avvisi.push(`${pagina} — ${msg}`);

/** Tutte le pagine costruite. */
function pagine(dir = DIST, trovate = []) {
  for (const voce of readdirSync(dir)) {
    const p = join(dir, voce);
    if (statSync(p).isDirectory()) {
      if (voce === '_astro') continue;
      pagine(p, trovate);
    } else if (voce.endsWith('.html')) {
      trovate.push(p);
    }
  }
  return trovate;
}

const percorsoDi = (file) => {
  const rel = relative(DIST, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404';
  return '/' + rel.replace(/\/index\.html$/, '');
};

const fra = (html, re) => html.match(re)?.[1]?.trim();

const titoli = new Map();
const descrizioni = new Map();
const percorsiEsistenti = new Set();

const file = pagine();
file.forEach((f) => percorsiEsistenti.add(percorsoDi(f)));

for (const f of file) {
  const pagina = percorsoDi(f);
  const html = readFileSync(f, 'utf8');
  const noindex = /name="robots"[^>]*noindex/.test(html);

  /* ------------------------------ lingua ------------------------------ */
  if (!/<html[^>]+lang="it"/.test(html)) err(pagina, 'manca lang="it" sull\'elemento html');

  /* ------------------------------ titolo ------------------------------ */
  const titolo = fra(html, /<title>([^<]*)<\/title>/);
  if (!titolo) err(pagina, 'manca il titolo');
  else if (!noindex) {
    if (titolo.length < 25) avv(pagina, `titolo corto (${titolo.length} caratteri)`);
    if (titolo.length > 65) avv(pagina, `titolo lungo (${titolo.length} caratteri, si taglia)`);
    if (titoli.has(titolo)) err(pagina, `titolo uguale a ${titoli.get(titolo)}`);
    titoli.set(titolo, pagina);
  }

  /* --------------------------- descrizione ---------------------------- */
  const descr = fra(html, /<meta name="description" content="([^"]*)"/);
  if (!descr) err(pagina, 'manca la meta descrizione');
  else if (!noindex) {
    if (descr.length < 70) avv(pagina, `descrizione corta (${descr.length} caratteri)`);
    if (descr.length > 165) avv(pagina, `descrizione lunga (${descr.length} caratteri, si taglia)`);
    if (descrizioni.has(descr)) err(pagina, `descrizione uguale a ${descrizioni.get(descr)}`);
    descrizioni.set(descr, pagina);
  }

  /* ----------------------------- canonico ----------------------------- */
  const canonico = fra(html, /<link rel="canonical" href="([^"]*)"/);
  if (!canonico) err(pagina, 'manca il canonico');
  else if (!canonico.startsWith(SITE.url)) err(pagina, `canonico su un altro dominio: ${canonico}`);

  /* ------------------------- immagini social -------------------------- */
  for (const prop of ['og:title', 'og:description', 'og:image', 'og:url']) {
    if (!new RegExp(`property="${prop}"`).test(html)) err(pagina, `manca ${prop}`);
  }
  const og = fra(html, /property="og:image" content="([^"]*)"/);
  if (og) {
    const locale = og.replace(SITE.url, '');
    if (locale.startsWith('/') && !existsSync(join('public', locale))) {
      err(pagina, `l'immagine social non esiste: ${locale}`);
    }
  }

  /* ------------------------------ titoli ------------------------------ */
  const intestazioni = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    livello: Number(m[1]),
    testo: m[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
  }));

  const h1 = intestazioni.filter((i) => i.livello === 1);
  if (h1.length === 0) err(pagina, 'nessun h1');
  if (h1.length > 1) err(pagina, `${h1.length} h1: deve essere uno solo`);
  if (h1[0] && h1[0].testo.length === 0) err(pagina, 'h1 vuoto');

  let precedente = 0;
  for (const i of intestazioni) {
    if (precedente && i.livello > precedente + 1) {
      avv(pagina, `salto da h${precedente} a h${i.livello} ("${i.testo.slice(0, 34)}")`);
    }
    precedente = i.livello;
  }

  /* ----------------------------- immagini ----------------------------- */
  for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
    const tag = m[1];
    /* `alt` senza valore è HTML valido e vale quanto `alt=""`: è come esce
       un'immagine decorativa dall'ottimizzatore di Astro. Cercare solo `alt=`
       la dichiarava priva di testo alternativo, che è il contrario del vero. */
    if (!/\balt(=|[\s>]|$)/.test(tag)) {
      const src = tag.match(/src="([^"]{0,60})/)?.[1] ?? '?';
      err(pagina, `immagine senza alt: ${src}`);
    }
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) {
      const src = tag.match(/src="([^"]{0,60})/)?.[1] ?? '?';
      avv(pagina, `immagine senza width/height, la pagina sobbalza: ${src}`);
    }
  }

  /* -------------------------- dati strutturati ------------------------ */
  const blocchi = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!noindex && blocchi.length === 0) avv(pagina, 'nessun dato strutturato');
  for (const b of blocchi) {
    try {
      const dato = JSON.parse(b[1]);
      if (!dato['@context']) err(pagina, 'dato strutturato senza @context');
      if (!dato['@type']) err(pagina, 'dato strutturato senza @type');
    } catch (e) {
      err(pagina, `dato strutturato non valido: ${e.message}`);
    }
  }

  /* ------------------------ collegamenti interni ---------------------- */
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const meta = m[1].replace(/\/$/, '') || '/';
    /* Fogli di stile e moduli sono risorse, non pagine: senza questi due nel
       filtro il controllo li cercava fra le pagine costruite e li dichiarava
       tutti rotti — venticinque errori inventati che nascondevano quello vero. */
    if (/\.(css|m?js|png|jpe?g|webp|avif|svg|xml|txt|ico|woff2?|pdf|mp4|webm)$/i.test(meta)) {
      if (!existsSync(join(DIST, meta.slice(1))) && !existsSync(join('public', meta.slice(1)))) {
        err(pagina, `risorsa che non esiste: ${meta}`);
      }
      continue;
    }
    if (!percorsiEsistenti.has(meta)) err(pagina, `collegamento rotto: ${meta}`);
  }

  /* --------------------------- testo di riempimento ------------------- */
  /* I confini di parola servono: senza, «metodo» conteneva «todo» e ogni
     pagina con quella sezione risultava incompleta. */
  if (/lorem ipsum|placeholder|TODO|da completare/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) {
    avv(pagina, 'contiene testo segnaposto o marcato da completare');
  }
}

/* ------------------------------- robots -------------------------------- */
const robots = existsSync('public/robots.txt') ? readFileSync('public/robots.txt', 'utf8') : '';
if (!robots) errori.push('robots.txt — non esiste');
else {
  const sitemap = robots.match(/Sitemap:\s*(\S+)/i)?.[1];
  if (!sitemap) errori.push('robots.txt — manca la riga Sitemap');
  else if (!sitemap.startsWith(SITE.url)) {
    errori.push(`robots.txt — la sitemap punta a un altro dominio: ${sitemap}`);
  }
}

/* ------------------------------- sitemap ------------------------------- */
const indice = join(DIST, 'sitemap-0.xml');
if (!existsSync(indice)) errori.push('sitemap — non generata');
else {
  const xml = readFileSync(indice, 'utf8');
  const dentro = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].replace(SITE.url, '').replace(/\/$/, '') || '/'
  );
  for (const attesa of ['/', '/progetti', '/servizi', '/chi-sono', '/contatti']) {
    if (!dentro.includes(attesa)) errori.push(`sitemap — manca ${attesa}`);
  }
  for (const fuori of ['/stile', '/privacy']) {
    if (dentro.includes(fuori)) errori.push(`sitemap — ${fuori} non dovrebbe esserci`);
  }
}

/* ------------------------------ risultato ------------------------------ */
console.log(`Pagine controllate: ${file.length}\n`);

if (avvisi.length) {
  console.log(`Avvisi (${avvisi.length}):`);
  avvisi.forEach((a) => console.log(`  ~ ${a}`));
  console.log('');
}

if (errori.length) {
  console.log(`Errori (${errori.length}):`);
  errori.forEach((e) => console.log(`  ! ${e}`));
  console.log('');
} else {
  console.log('Nessun errore.\n');
}

process.exit(errori.length === 0 ? 0 : 1);
