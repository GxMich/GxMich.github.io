/**
 * Misura dei contatti: chi chiama, chi scrive, chi chiede l'analisi.
 *
 * Gli eventi partono solo se il visitatore ha detto sì alle misure: `gtag`
 * esiste solo dopo il consenso (Consenso.astro), quindi senza consenso
 * `segnaContatto` non fa niente e non chiama nessuno.
 *
 * Nomi degli eventi in GA4:
 *  - `contatto_telefono`  clic su un link tel:
 *  - `contatto_email`     clic su un link mailto:
 *  - `contatto_whatsapp`  solo per i moduli che aprono WhatsApp da script.
 *    I clic sui link wa.me li conta già GA4 da solo (misurazione avanzata,
 *    clic in uscita) e li trasforma nello stesso evento con una regola creata
 *    nella proprietà: mandarli anche da qui li conterebbe due volte.
 *
 * In GA4 `contatto_telefono` e `contatto_email` vanno segnati come eventi
 * chiave a mano, la prima volta che compaiono.
 *
 * La provenienza (pagina e canale) invece non dipende dal consenso: non va a
 * nessuno strumento, finisce solo nel testo del messaggio che il visitatore
 * vede, può cambiare e decide lui se mandare.
 */

type Parametri = Record<string, string>;

export function segnaContatto(evento: string, parametri: Parametri = {}) {
  const w = window as any;
  if (typeof w.gtag !== 'function') return;
  w.gtag('event', evento, { pagina: location.pathname, ...parametri });
}

/* ------------------------------ provenienza ------------------------------ */

const CHIAVE_ARRIVO = 'arrivo-da';

/** Nomi leggibili per le fonti più comuni; il resto resta il dominio. */
const FONTI: [RegExp, string][] = [
  [/(^|\.)google\./, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo'],
  [/(^|\.)(chatgpt\.com|openai\.com)$/, 'ChatGPT'],
  [/(^|\.)perplexity\.ai$/, 'Perplexity'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)(facebook\.com|fb\.com)$/, 'Facebook'],
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, 'LinkedIn'],
  [/(^|\.)github\.com$/, 'GitHub'],
];

function nomeFonte(valore: string) {
  const v = valore.toLowerCase();
  for (const [re, nome] of FONTI) if (re.test(v)) return nome;
  return v;
}

/**
 * Da dove è arrivato il visitatore, letto una volta all'inizio della visita:
 * prima i parametri UTM (es. la scheda Google con utm_campaign=scheda-google),
 * poi il sito da cui viene. Resta solo in sessionStorage, quindi sparisce
 * chiudendo la scheda.
 */
function leggiArrivo() {
  try {
    const salvato = sessionStorage.getItem(CHIAVE_ARRIVO);
    if (salvato !== null) return salvato;

    const p = new URLSearchParams(location.search);
    const fonte = p.get('utm_source');
    const campagna = p.get('utm_campaign');
    let arrivo = '';

    if (campagna === 'scheda-google' || fonte === 'gbp') arrivo = 'scheda Google';
    else if (fonte) arrivo = nomeFonte(fonte);
    else if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      const mio = location.hostname.replace(/^www\./, '');
      if (host && !host.endsWith(mio)) arrivo = nomeFonte(host);
    }

    arrivo = arrivo.slice(0, 40);
    sessionStorage.setItem(CHIAVE_ARRIVO, arrivo);
    return arrivo;
  } catch {
    return '';
  }
}

/** Il nome della pagina come lo legge una persona, non come un percorso. */
export function nomePagina() {
  if (location.pathname === '/' || location.pathname === '') return 'home';
  const titolo = document.title.split(' | ')[0].split(' — ')[0].trim();
  return titolo || location.pathname;
}

/** «(pagina: Siti web nel Monferrato · arrivo da: Google)» */
export function rigaProvenienza() {
  const arrivo = leggiArrivo();
  return `(pagina: ${nomePagina()}${arrivo ? ` · arrivo da: ${arrivo}` : ''})`;
}

/**
 * I link diretti a WhatsApp nascono senza testo, così funzionano anche senza
 * JavaScript. Al clic, se il testo non c'è, lo aggiungo: chi scrive trova la
 * chat già aperta con un saluto, e io so da quale pagina arriva.
 */
function completaWhatsApp(link: HTMLAnchorElement) {
  /* L'indirizzo di partenza si tiene da parte: la barra in fondo resta la
     stessa fra una pagina e l'altra, e il testo va rifatto ogni volta con la
     pagina giusta. */
  const base = link.dataset.waBase ?? link.href;
  link.dataset.waBase = base;
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return;
  }
  if (url.hostname !== 'wa.me' || url.searchParams.has('text')) return;
  /* encodeURIComponent e non searchParams: quello scrive gli spazi come «+»,
     e WhatsApp in qualche versione li lascia così nel messaggio. */
  const testo = `Ciao Michele, ti scrivo dal tuo sito ${rigaProvenienza()}.\n\n`;
  link.href = `${base}${url.search ? '&' : '?'}text=${encodeURIComponent(testo)}`;
}

/* ------------------------------ ascoltatore ------------------------------ */

/**
 * Un solo ascoltatore sul documento, montato una volta per visita: con le
 * transizioni di pagina il documento resta lo stesso, quindi rimontarlo a
 * ogni pagina conterebbe ogni clic più volte.
 */
export function montaMisureContatti() {
  const w = window as any;
  leggiArrivo();
  if (w.__misureContatti) return;
  w.__misureContatti = true;

  document.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    const dove = link.closest('[data-barra-contatti]')
      ? 'barra'
      : link.closest('footer')
        ? 'piede'
        : link.closest('[data-menu]')
          ? 'menu'
          : 'pagina';

    if (href.startsWith('tel:')) segnaContatto('contatto_telefono', { posizione: dove });
    else if (href.startsWith('mailto:')) segnaContatto('contatto_email', { posizione: dove });
    else if (href.includes('wa.me/')) completaWhatsApp(link);
  });
}
