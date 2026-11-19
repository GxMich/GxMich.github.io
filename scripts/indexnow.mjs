/**
 * Avvisa Bing (e gli altri motori che usano IndexNow) delle pagine nuove o
 * cambiate. Bing è anche la fonte di Copilot e di una parte delle ricerche
 * di ChatGPT: farsi rileggere in fretta lì conta.
 *
 * Si lancia DOPO aver caricato il sito su Aruba, non prima: Bing va subito a
 * leggere le pagine, e deve trovare quelle nuove.
 *
 *   npm run indexnow                       tutte le pagine della sitemap
 *   npm run indexnow -- /siti-web-monferrato /contatti   solo queste
 *
 * La chiave è il file public/<chiave>.txt, già online: è quello che dimostra
 * a Bing che il sito è nostro. Se lo si cambia, va cambiato anche qui.
 */
import { readFile } from 'node:fs/promises';

const SITO = 'https://www.modicamichele.it';
const CHIAVE = '8cee197230712acae893a0faf6357932';

const argomenti = process.argv.slice(2);
let indirizzi;

if (argomenti.length > 0) {
  indirizzi = argomenti.map((a) => (a.startsWith('http') ? a : SITO + (a.startsWith('/') ? a : '/' + a)));
} else {
  const sitemap = await readFile(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8').catch(() => {
    console.error('Manca dist/sitemap-0.xml: lancia prima npm run build.');
    process.exit(1);
  });
  indirizzi = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const risposta = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITO).host,
    key: CHIAVE,
    keyLocation: `${SITO}/${CHIAVE}.txt`,
    urlList: indirizzi,
  }),
});

/* 200 e 202 vogliono dire «ricevuto». 403: la chiave online non corrisponde.
   422: qualche indirizzo non è di questo sito. 429: troppe richieste. */
const esito = {
  200: 'ricevuto',
  202: 'ricevuto, la chiave verrà controllata',
  400: 'richiesta non valida',
  403: 'chiave non trovata o diversa da quella online',
  422: 'indirizzi non validi per questo sito',
  429: 'troppe richieste, riprova più tardi',
}[risposta.status] ?? 'risposta inattesa';

console.log(`IndexNow: ${risposta.status} — ${esito} (${indirizzi.length} indirizzi)`);
if (risposta.status >= 300) process.exit(1);
