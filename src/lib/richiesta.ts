/**
 * Il lato browser delle due pagine riservate: leggere e scrivere i moduli,
 * comporre il messaggio, rileggerlo, costruire i link.
 *
 * Niente parte da qui verso un server. Tutto quello che esce, esce perché
 * chi usa la pagina preme un pulsante che apre WhatsApp o la posta con il
 * testo già pronto.
 */
import { SEZIONI } from '../data/richiesta.js';

export type Valore = string | string[];
export type Valori = Record<string, Valore>;

export interface Campo {
  id: string;
  label: string;
  corta: string;
  tipo: 'testo' | 'tel' | 'email' | 'area' | 'scelta' | 'multi';
  opzioni?: string[];
  obbl?: boolean;
  fac?: boolean;
  placeholder?: string;
  autocomplete?: string;
  chiedi?: string;
  /** Esiste solo nell'incontro: il cliente non la vede nel suo modulo. */
  solo?: boolean;
  /** Compare solo se uno di questi campi ha quel valore. */
  se?: [string, string][];
}

export interface Sezione {
  id: string;
  sigla: string;
  t3?: string;
  titolo: string;
  intro?: string;
  solo?: boolean;
  campi: Campo[];
}

export const ELENCO = SEZIONI as Sezione[];
export const CAMPI: Campo[] = ELENCO.flatMap((s) => s.campi);
const PER_ID = new Map(CAMPI.map((c) => [c.id, c]));

/** WhatsApp taglia i messaggi lunghi: sopra questa soglia si copia il testo. */
export const LIMITE_WHATSAPP = 1500;

const SEPARATORE = '; ';

/* ------------------------------ lettura e scrittura ------------------------------ */

type Controllo = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const controlli = (radice: ParentNode, nome: string) =>
  Array.from(radice.querySelectorAll<Controllo>(`[name="${CSS.escape(nome)}"]`));

/** Il valore di un campo, qualunque sia il tipo. Vuoto = stringa o lista vuota. */
export function leggiCampo(radice: ParentNode, nome: string): Valore {
  const lista = controlli(radice, nome);
  if (!lista.length) return '';
  const primo = lista[0];

  if (primo instanceof HTMLInputElement && primo.type === 'checkbox') {
    return (lista as HTMLInputElement[]).filter((c) => c.checked).map((c) => c.value);
  }
  if (primo instanceof HTMLInputElement && primo.type === 'radio') {
    return (lista as HTMLInputElement[]).find((c) => c.checked)?.value ?? '';
  }
  return primo.value.trim();
}

export function scriviCampo(radice: ParentNode, nome: string, valore: Valore | undefined) {
  const lista = controlli(radice, nome);
  if (!lista.length) return;
  const v = valore ?? '';

  for (const c of lista) {
    if (c instanceof HTMLInputElement && c.type === 'checkbox') {
      c.checked = Array.isArray(v) ? v.includes(c.value) : v === c.value;
    } else if (c instanceof HTMLInputElement && c.type === 'radio') {
      c.checked = !Array.isArray(v) && v === c.value;
    } else {
      c.value = Array.isArray(v) ? v.join(SEPARATORE) : v;
    }
  }
}

/** Solo i campi della richiesta (quelli definiti in SEZIONI). */
export function leggiRichiesta(radice: ParentNode): Valori {
  const fuori: Valori = {};
  for (const c of CAMPI) fuori[c.id] = leggiCampo(radice, c.id);
  return fuori;
}

export function scriviRichiesta(radice: ParentNode, valori: Valori) {
  for (const c of CAMPI) scriviCampo(radice, c.id, valori[c.id]);
}

/** Una domanda condizionale è visibile se una delle sue condizioni è vera. */
export function condizioneVera(se: Campo['se'], valori: Valori): boolean {
  if (!se?.length) return true;
  return se.some(([campo, valore]) => {
    const v = valori[campo];
    return Array.isArray(v) ? v.includes(valore) : v === valore;
  });
}

const pieno = (v: Valore | undefined) => (Array.isArray(v) ? v.length > 0 : Boolean(v));

/* ------------------------------ il messaggio ------------------------------ */

/**
 * Una riga per campo compilato, raggruppate per sezione. I campi vuoti non
 * compaiono: "Budget: -" non dice niente a chi legge e allunga il messaggio.
 */
export function componiMessaggio(valori: Valori, apertura: string): string {
  const blocchi: string[] = [];

  for (const s of ELENCO) {
    const righe = s.campi
      .filter((c) => pieno(valori[c.id]))
      .map((c) => {
        const v = valori[c.id];
        /* Un'a capo dentro un valore spezzerebbe la riga: si rilegge male. */
        return `${c.corta}: ${Array.isArray(v) ? v.join(SEPARATORE) : v.replace(/\s*\n+\s*/g, ' / ')}`;
      });
    if (righe.length) blocchi.push(`${s.sigla.toUpperCase()}\n${righe.join('\n')}`);
  }

  return [apertura, ...blocchi].join('\n\n');
}

const normalizza = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const PER_ETICHETTA = new Map<string, Campo>();
for (const c of CAMPI) {
  PER_ETICHETTA.set(normalizza(c.corta), c);
  PER_ETICHETTA.set(normalizza(c.label), c);
}

/**
 * Rilegge un messaggio composto da `componiMessaggio`. Tollera le modifiche a
 * mano: riconosce le righe "Etichetta: valore" e mette da parte quelle che non
 * capisce, così non si perde niente di quello che il cliente ha aggiunto.
 */
export function importaMessaggio(testo: string): { valori: Valori; restanti: string[] } {
  const valori: Valori = {};
  const restanti: string[] = [];
  const intestazioni = new Set(ELENCO.map((s) => normalizza(s.sigla)));

  for (const grezza of testo.split(/\r?\n/)) {
    const riga = grezza.trim();
    if (!riga) continue;
    if (intestazioni.has(normalizza(riga))) continue;
    /* La riga di apertura scritta dal modulo non è una risposta. */
    if (/^salve michele/i.test(riga)) continue;

    const i = riga.indexOf(':');
    const campo = i > 0 ? PER_ETICHETTA.get(normalizza(riga.slice(0, i))) : undefined;
    if (!campo) {
      restanti.push(riga);
      continue;
    }

    const valore = riga.slice(i + 1).trim();
    if (!valore) continue;

    if (campo.tipo === 'multi') {
      valori[campo.id] = valore
        .split(/\s*;\s*/)
        .map((p) => (campo.opzioni ?? []).find((o) => normalizza(o) === normalizza(p)))
        .filter((o): o is string => Boolean(o));
      if (!(valori[campo.id] as string[]).length) {
        delete valori[campo.id];
        restanti.push(riga);
      }
    } else if (campo.tipo === 'scelta') {
      const o = (campo.opzioni ?? []).find((x) => normalizza(x) === normalizza(valore));
      if (o) valori[campo.id] = o;
      else restanti.push(riga);
    } else {
      valori[campo.id] = valore;
    }
  }

  return { valori, restanti };
}

/* ------------------------------ i link ------------------------------ */

/** Numero: solo cifre, con prefisso internazionale e senza + né 00. */
export const linkWhatsApp = (numero: string, testo = '') =>
  testo ? `https://wa.me/${numero}?text=${encodeURIComponent(testo)}` : `https://wa.me/${numero}`;

/** Le a capo nei messaggi email vogliono \r\n. */
export const linkEmail = (indirizzo: string, oggetto: string, corpo: string) =>
  `mailto:${indirizzo}?subject=${encodeURIComponent(oggetto)}&body=${encodeURIComponent(corpo.replace(/\n/g, '\r\n'))}`;

/**
 * Da quello che scrive il cliente al formato di wa.me. Un numero italiano
 * senza prefisso prende il 39; se non torna niente, meglio nessun link che
 * un link a una persona sbagliata.
 */
export function numeroInternazionale(grezzo: string): string | null {
  let cifre = grezzo.replace(/[^\d+]/g, '');
  if (cifre.startsWith('+')) cifre = cifre.slice(1);
  else if (cifre.startsWith('00')) cifre = cifre.slice(2);
  else if (/^[03]/.test(cifre) && cifre.length >= 9 && cifre.length <= 11) cifre = '39' + cifre;

  return /^\d{10,15}$/.test(cifre) ? cifre : null;
}

/* ------------------------------ appunti ------------------------------ */

/** Copia negli appunti; ripiega sul vecchio metodo dove l'API non c'è (http, WebView). */
export async function copia(testo: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(testo);
    return true;
  } catch {
    const t = document.createElement('textarea');
    t.value = testo;
    t.setAttribute('readonly', '');
    t.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(t);
    t.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    t.remove();
    return ok;
  }
}

export const campoPerId = (id: string) => PER_ID.get(id);
