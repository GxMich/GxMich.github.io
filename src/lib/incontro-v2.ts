/**
 * La pagina dell'incontro, versione 2 (/incontro-cliente-v2): porta con password,
 * questionario di scoperta, microfono con audio, appunti, calcolo del prezzo e
 * suddivisione dei soldi della prestazione occasionale. /incontro-cliente resta com'era.
 *
 * Tre cose da tenere a mente leggendo:
 *
 *  1. I prezzi arrivano dal listino cifrato e vivono solo in memoria (e nella
 *     sessione della scheda, per non ridigitare la password a ogni ricarica).
 *     Non finiscono mai nel codice della pagina né negli appunti salvati: un
 *     incontro salva i prezzi che HO scritto io a mano, non quelli di listino.
 *     Un campo prezzo vuoto vuol dire "usa il listino".
 *  2. Tutti i soldi sono in centesimi interi. Sommare 0,1 + 0,2 in virgola
 *     mobile dà 0,30000000000000004, e un preventivo non può avere quel difetto.
 *  3. Gli appunti stanno nel localStorage di questo browser e non vanno da
 *     nessuna parte. Sono in chiaro: la password protegge la pagina e i prezzi,
 *     non il contenuto di un dispositivo sbloccato.
 *  4. Le registrazioni audio stanno in IndexedDB, sempre su questo dispositivo
 *     e in chiaro, separate dagli appunti (un audio è troppo grande per
 *     localStorage). Si registrano solo con il consenso spuntato, e il
 *     «Pacchetto per l'AI» è il solo modo in cui escono, per scelta mia.
 */
import {
  EXTRA,
  PACCHETTI,
  CONDIZIONI,
  REGIMI,
  MATERIALI,
  STATI_MATERIALE,
  ALIQUOTA_RITENUTA,
  BOLLO,
  INPS,
  DICITURA_OCCASIONALE,
} from '../data/richiesta.js';
import { apri, cifraturaDisponibile, type Cifrato } from './cifratura.ts';
import {
  Sessione,
  registrazioneDisponibile,
  salvaPresa,
  preseDi,
  eliminaPresa,
  eliminaPreseDi,
  durataLeggibile,
  estensione,
  INCONTRO_INTERO,
  type Presa,
} from './voce.ts';
import { creaZip, type FileZip } from './zip.ts';
import { REGISTRI, registroDi, totali, divisione, eur, codifica, type Proposta, type Divisione } from './preventivo.ts';
import {
  leggiCampo,
  scriviCampo,
  leggiRichiesta,
  importaMessaggio,
  componiMessaggio,
  condizioneVera,
  campoPerId,
  linkWhatsApp,
  linkEmail,
  numeroInternazionale,
  copia,
  CAMPI,
  ELENCO,
  type Valore,
} from './richiesta.ts';

/* ============================== tipi ============================== */

interface VoceListino {
  prezzo: number;
  ore: number;
}

interface Listino {
  oraMinima: number;
  oraObiettivo: number;
  pacchetti: Record<string, VoceListino>;
  extra: Record<string, VoceListino>;
}

interface VoceLibera {
  d: string;
  q: string;
  p: string;
  h: string;
}

interface Azione {
  t: string;
  fatto: boolean;
}

interface Registrato {
  id: string;
  creato: number;
  aggiornato: number;
  campi: Record<string, Valore>;
  voci: VoceLibera[];
  azioni: Azione[];
}

interface Archivio {
  attivo: string;
  elenco: Registrato[];
}

interface Riga {
  d: string;
  q: number;
  /** centesimi, una unità */
  u: number;
  /** centesimi, riga intera */
  t: number;
  ore: number;
}

interface Calcolo {
  righe: Riga[];
  annue: Riga[];
  subtotale: number;
  sconto: number;
  imponibile: number;
  iva: number;
  totale: number;
  ritenuta: number;
  netto: number;
  accontoPerc: number;
  acconto: number;
  saldo: number;
  ore: number;
  oreManuali: boolean;
  tariffa: number | null;
  regime: (typeof REGIMI)[number];
  pacchetto: (typeof PACCHETTI)[number] | null;
  /** chi riceve cosa: me, lo Stato, il bollo */
  div: Divisione;
  /** incassato nell'anno con prestazioni occasionali, questo lavoro compreso */
  anno: number;
  controlli: string[];
}

type Istantanea = Record<string, Valore>;

/* ============================== costanti ============================== */

/** Le domande che non stanno nelle definizioni di richiesta.js, con il nome da mostrare. */
const ETICHETTE_I: Record<string, string> = {
  'i.luogo': 'Dove ci vediamo',
  'i.presenti': 'Chi c’è',
  'i.appunti': 'Appunti dell’incontro',
  'i.dubbi': 'Dubbi o obiezioni emersi',
  'i.risposta': 'Quando mi dà una risposta',
};

/* Archivio separato da /incontro-cliente: quella pagina riscrive i campi che conosce e
   perderebbe quelli della v2. Per passare gli incontri da una all'altra c'è Esporta/Importa. */
const CHIAVE_ARCHIVIO = 'incontri-v2';
const CHIAVE_SESSIONE = 'listino-aperto';

/** [minimo, massimo] in centesimi. */
const BUDGET: Record<string, [number, number]> = {
  'Fino a 400 €': [0, 40000],
  'Tra 400 e 800 €': [40000, 80000],
  'Tra 800 e 1.500 €': [80000, 150000],
  'Oltre 1.500 €': [150000, Infinity],
};

/* ============================== utilità ============================== */

const pad = (n: number, l = 2) => String(n).padStart(l, '0');

const oggi = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const dataIt = (iso: string) => (iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT') : '');

const piuGiorni = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const testo = (v: Valore | undefined) => (Array.isArray(v) ? v.join('; ') : (v ?? '')).toString().trim();
const lista = (v: Valore | undefined) => (Array.isArray(v) ? v : v ? [v] : []);
const vuoto = (v: Valore | undefined) => testo(v) === '';
const acceso = (v: Valore | undefined) => Array.isArray(v) && v.length > 0;

const numero = (v: Valore | undefined, predefinito = 0) => {
  const n = parseFloat(testo(v).replace(',', '.'));
  return Number.isFinite(n) ? n : predefinito;
};

const centesimi = (v: Valore | undefined) => {
  const n = numero(v);
  return n > 0 ? Math.round(n * 100) : 0;
};

const intero = (v: Valore | undefined, predefinito = 1) => Math.max(1, Math.floor(numero(v, predefinito)) || 1);

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));

const slug = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const nuovoId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

function leggiArchivio(): Archivio {
  try {
    const grezzo = localStorage.getItem(CHIAVE_ARCHIVIO);
    if (grezzo) {
      const a = JSON.parse(grezzo) as Archivio;
      if (a && Array.isArray(a.elenco)) return a;
    }
  } catch {
    /* archivio illeggibile: si riparte da vuoto */
  }
  return { attivo: '', elenco: [] };
}

function scriviArchivio(a: Archivio): boolean {
  try {
    localStorage.setItem(CHIAVE_ARCHIVIO, JSON.stringify(a));
    return true;
  } catch {
    return false;
  }
}

const listinoValido = (l: unknown): l is Listino => {
  const x = l as Listino;
  return Boolean(x && typeof x === 'object' && x.pacchetti && x.extra);
};

/* ============================== il pannello ============================== */

class Pannello {
  private readonly cifrato: Cifrato;
  private readonly porta: HTMLElement;
  private readonly strumento: HTMLElement;
  private readonly f: HTMLFormElement;
  private readonly nomi: string[];
  private readonly base: Record<string, Valore>;

  private listino: Listino | null = null;
  private archivio: Archivio = { attivo: '', elenco: [] };
  private corrente!: Registrato;
  private azioni: Azione[] = [];
  private tentativi = 0;
  private timerSalva: number | undefined;
  private timerElimina: number | undefined;
  private collegato = false;

  /* La voce: una sessione per volta, perché il microfono è uno. */
  private voce: Sessione | null = null;
  private campoVoce = '';
  private incontroVoce = '';
  private primoDettato = true;
  private fermando = false;
  private timerVoce: number | undefined;
  private prese: Presa[] = [];
  private urlAudio: string[] = [];
  private condizioni = new Map<HTMLElement, [string, string][]>();

  constructor(private readonly r: HTMLElement) {
    this.cifrato = JSON.parse(document.getElementById('listino-cifrato')!.textContent!) as Cifrato;
    this.porta = this.q('[data-porta]');
    this.strumento = this.q('[data-strumento]');
    this.f = this.q<HTMLFormElement>('[data-form]');

    this.nomi = [
      ...new Set(
        Array.from(this.f.elements)
          .map((el) => (el as HTMLInputElement).name)
          .filter(Boolean)
      ),
    ];

    this.base = {
      'i.registro': 'tu',
      'p.regime': REGIMI[0].id,
      'p.acconto': String(CONDIZIONI.accontoPercentuale),
      'p.validita': String(CONDIZIONI.validitaGiorni),
      'p.giri': String(CONDIZIONI.giriDiModifica),
      'p.assistenza': String(CONDIZIONI.assistenzaGiorni),
      'p.tempi': CONDIZIONI.tempi,
      'i.parla': 'Cliente',
      /* Su telefono la trascrizione in diretta può contendere il microfono alla
         registrazione: si parte con la sola registrazione, e si accende a mano. */
      'i.trascrivi': /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? [] : ['1'],
      'p.bollo': ['1'],
    };
  }

  private q<T extends HTMLElement = HTMLElement>(sel: string): T {
    return this.r.querySelector<T>(sel)!;
  }

  private tutti<T extends HTMLElement = HTMLElement>(sel: string): T[] {
    return Array.from(this.r.querySelectorAll<T>(sel));
  }

  /* ------------------------------ la porta ------------------------------ */

  avvia() {
    const modulo = this.q<HTMLFormElement>('[data-porta-form]');
    const campo = this.q<HTMLInputElement>('#parola');
    const errore = this.q('[data-porta-errore]');
    const bottone = modulo.querySelector<HTMLButtonElement>('button')!;

    modulo.addEventListener('submit', async (e) => {
      e.preventDefault();
      errore.hidden = true;

      if (!cifraturaDisponibile()) {
        errore.textContent =
          'Questo indirizzo non permette la cifratura: apri la pagina da https o da localhost.';
        errore.hidden = false;
        return;
      }

      bottone.disabled = true;
      const aperto = await apri<Listino>(this.cifrato, campo.value);

      if (!aperto || !listinoValido(aperto)) {
        /* Ogni errore costa più del precedente: non ferma chi ha il file in
           mano, ma rende scomodo indovinare a mano da questa pagina. */
        this.tentativi += 1;
        await pausa(Math.min(this.tentativi, 5) * 600);
        errore.textContent = 'Password sbagliata.';
        errore.hidden = false;
        bottone.disabled = false;
        campo.select();
        return;
      }

      try {
        sessionStorage.setItem(CHIAVE_SESSIONE, JSON.stringify(aperto));
      } catch {
        /* senza sessione chiederà la password a ogni ricarica */
      }
      campo.value = '';
      bottone.disabled = false;
      this.sblocca(aperto);
    });

    try {
      const salvato = sessionStorage.getItem(CHIAVE_SESSIONE);
      if (salvato) {
        const l = JSON.parse(salvato) as unknown;
        if (listinoValido(l)) this.sblocca(l);
      }
    } catch {
      /* resta la porta */
    }
  }

  private blocca() {
    void this.fermaVoce();
    window.clearTimeout(this.timerSalva);
    this.salva();
    try {
      sessionStorage.removeItem(CHIAVE_SESSIONE);
    } catch {
      /* niente da togliere */
    }
    this.listino = null;
    this.strumento.hidden = true;
    this.q('[data-barra-totale]').hidden = true;
    this.porta.hidden = false;
    this.q<HTMLInputElement>('#parola').focus();
  }

  private sblocca(listino: Listino) {
    this.listino = listino;
    this.porta.hidden = true;
    this.strumento.hidden = false;

    this.archivio = leggiArchivio();
    const attivo = this.archivio.elenco.find((m) => m.id === this.archivio.attivo) ?? this.archivio.elenco[0];

    this.listinoNellaPagina();
    if (!this.collegato) this.collega();
    this.carica(attivo ?? this.creaNuovo());
  }

  /** I prezzi di listino come suggerimento nei campi: il campo vuoto li usa. */
  private listinoNellaPagina() {
    const L = this.listino!;
    for (const [id, v] of Object.entries(L.pacchetti)) {
      const el = this.r.querySelector(`[data-prezzo-pacchetto="${id}"]`);
      if (el) el.textContent = eur(Math.round(v.prezzo * 100));
    }
    for (const e of EXTRA) {
      const campo = this.r.querySelector<HTMLInputElement>(`[data-prezzo-extra="${e.id}"]`);
      const v = L.extra[e.id];
      if (campo) campo.placeholder = v ? String(v.prezzo) : 'da definire';
    }
  }

  /* ------------------------------ archivio ------------------------------ */

  private creaNuovo(): Registrato {
    const anno = new Date().getFullYear();
    const usati = this.archivio.elenco
      .map((m) => /^(\d{4})-(\d+)$/.exec(testo(m.campi['i.numero'])))
      .filter((x): x is RegExpExecArray => Boolean(x) && Number(x![1]) === anno)
      .map((x) => Number(x[2]));
    const prossimo = (usati.length ? Math.max(...usati) : 0) + 1;

    const m: Registrato = {
      id: nuovoId(),
      creato: Date.now(),
      aggiornato: Date.now(),
      campi: { ...this.base, 'i.data': oggi(), 'i.numero': `${anno}-${pad(prossimo, 3)}` },
      voci: [],
      azioni: [],
    };
    this.archivio.elenco.unshift(m);
    return m;
  }

  private carica(m: Registrato) {
    /* La voce scrive nell'incontro aperto: cambiando incontro si ferma e si salva in quello. */
    void this.fermaVoce();
    this.corrente = m;
    this.azioni = m.azioni.map((a) => ({ ...a }));

    for (const nome of this.nomi) scriviCampo(this.f, nome, m.campi[nome] ?? this.base[nome] ?? '');
    this.renderVoci(m.voci);
    this.renderAzioni();

    this.archivio.attivo = m.id;
    this.salvaArchivio();
    this.aggiornaElenco();
    this.ricalcola();
    void this.caricaPrese();
  }

  private salva() {
    if (!this.listino || !this.corrente) return;
    this.corrente.campi = this.istantanea();
    this.corrente.voci = this.leggiVoci();
    this.corrente.azioni = this.azioni.map((a) => ({ ...a }));
    this.corrente.aggiornato = Date.now();
    this.salvaArchivio();
    this.aggiornaElenco();
  }

  private salvaArchivio() {
    const ok = scriviArchivio(this.archivio);
    const ora = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    this.stato(
      ok
        ? `Salvato su questo dispositivo alle ${ora}.`
        : 'Questo browser non permette di salvare: usa «Esporta» per non perdere gli appunti.'
    );
  }

  private stato(msg: string) {
    this.q('[data-stato]').textContent = msg;
  }

  private aggiornaElenco() {
    const sel = this.q<HTMLSelectElement>('[data-elenco]');
    sel.replaceChildren(
      ...this.archivio.elenco.map((m) => {
        const o = document.createElement('option');
        o.value = m.id;
        const nome = testo(m.campi.nome) || 'Senza nome';
        const data = dataIt(testo(m.campi['i.data']));
        o.textContent = `${nome}${data ? ` · ${data}` : ''}`;
        return o;
      })
    );
    sel.value = this.corrente?.id ?? '';
  }

  /* ------------------------------ lettura del modulo ------------------------------ */

  private istantanea(): Istantanea {
    const s: Istantanea = {};
    for (const nome of this.nomi) s[nome] = leggiCampo(this.f, nome);
    return s;
  }

  private leggiVoci(): VoceLibera[] {
    return this.tutti('[data-voci] .voce').map((li) => {
      const v = (k: string) => li.querySelector<HTMLInputElement>(`[data-vc="${k}"]`)!.value;
      return { d: v('d'), q: v('q'), p: v('p'), h: v('h') };
    });
  }

  private renderVoci(voci: VoceLibera[]) {
    const ul = this.q('[data-voci]');
    ul.replaceChildren();
    for (const v of voci) this.aggiungiVoce(v);
  }

  private aggiungiVoce(v?: VoceLibera) {
    const t = this.q<HTMLTemplateElement>('[data-t-voce]');
    const li = t.content.firstElementChild!.cloneNode(true) as HTMLElement;
    if (v) {
      for (const k of ['d', 'q', 'p', 'h'] as const) {
        li.querySelector<HTMLInputElement>(`[data-vc="${k}"]`)!.value = v[k];
      }
    }
    this.q('[data-voci]').appendChild(li);
    return li;
  }

  private renderAzioni() {
    const ul = this.q('[data-azioni]');
    ul.replaceChildren();
    this.azioni.forEach((a, i) => {
      const li = this.q<HTMLTemplateElement>('[data-t-azione]').content.firstElementChild!.cloneNode(true) as HTMLElement;
      li.dataset.i = String(i);
      li.querySelector('span')!.textContent = a.t;
      li.querySelector<HTMLInputElement>('input')!.checked = a.fatto;
      ul.appendChild(li);
    });
  }

  /* ------------------------------ il calcolo ------------------------------ */

  private calcola(s: Istantanea): Calcolo {
    const L = this.listino!;
    const righe: Riga[] = [];
    const annue: Riga[] = [];

    const pacchetto = PACCHETTI.find((p) => p.id === testo(s['p.pacchetto'])) ?? null;
    if (pacchetto && pacchetto.id !== 'misura') {
      const li = L.pacchetti[pacchetto.id];
      const u = vuoto(s['p.pk']) ? Math.round((li?.prezzo ?? 0) * 100) : centesimi(s['p.pk']);
      righe.push({
        d: `Sito ${pacchetto.nome} (${pacchetto.pagine === 1 ? 'una pagina' : `fino a ${pacchetto.pagine} pagine`})`,
        q: 1,
        u,
        t: u,
        ore: li?.ore ?? 0,
      });
    }

    for (const e of EXTRA) {
      if (!acceso(s[`x.${e.id}.on`])) continue;
      const q = e.unita ? intero(s[`x.${e.id}.q`]) : 1;
      const li = L.extra[e.id];
      const u = vuoto(s[`x.${e.id}.p`]) ? Math.round((li?.prezzo ?? 0) * 100) : centesimi(s[`x.${e.id}.p`]);
      (e.ricorrente ? annue : righe).push({ d: e.nome, q, u, t: u * q, ore: (li?.ore ?? 0) * q });
    }

    for (const v of this.leggiVoci()) {
      if (!v.d.trim() && !v.p.trim()) continue;
      const q = intero(v.q);
      const u = centesimi(v.p);
      righe.push({ d: v.d.trim() || 'Voce a parte', q, u, t: u * q, ore: Math.max(0, numero(v.h)) });
    }

    const subtotale = righe.reduce((n, r) => n + r.t, 0);

    const regime = REGIMI.find((r) => r.id === testo(s['p.regime'])) ?? REGIMI[0];
    const accontoPerc = Math.min(100, Math.max(0, numero(s['p.acconto'], CONDIZIONI.accontoPercentuale)));
    const tipo = testo(s['p.sconto-tipo']);
    const t = totali(
      subtotale,
      { tipo: tipo === 'euro' || tipo === 'perc' ? tipo : '', val: numero(s['p.sconto']) },
      regime.iva,
      regime.id === 'occasionale' && acceso(s['p.ritenuta']),
      ALIQUOTA_RITENUTA,
      accontoPerc
    );
    const { sconto, imponibile, iva, totale, ritenuta, acconto } = t;

    /* I contributi INPS scattano sopra 5.000 € incassati nell'anno, e solo sulla parte
       che li supera. Li versa il cliente se trattiene la ritenuta (cioè se è sostituto
       d'imposta): 2/3 suoi e 1/3 trattenuto a me. Con un cliente privato li verso io. */
    const anno = centesimi(s['p.incassato']) + imponibile;
    const oltre = Math.max(0, Math.min(imponibile, anno - INPS.franchigia));
    const sostituto = regime.id === 'occasionale' && ritenuta > 0;
    const inps = sostituto ? Math.round((oltre * INPS.aliquota) / 100) : 0;
    const div = divisione(t, inps, {
      attivo: regime.iva === 0 && acceso(s['p.bollo']),
      importo: BOLLO.importo,
      sopra: BOLLO.sopra,
    });

    const oreAuto = righe.reduce((n, r) => n + r.ore, 0);
    const oreManuali = !vuoto(s['p.ore']);
    const ore = oreManuali ? Math.max(0, numero(s['p.ore'])) : oreAuto;
    const tariffa = ore > 0 && imponibile > 0 ? imponibile / 100 / ore : null;

    const c: Calcolo = {
      righe,
      annue,
      subtotale,
      sconto,
      imponibile,
      iva,
      totale,
      ritenuta,
      netto: t.netto,
      accontoPerc,
      acconto,
      saldo: t.saldo,
      ore,
      oreManuali,
      tariffa,
      regime,
      pacchetto,
      div,
      anno,
      controlli: [],
    };
    c.controlli = this.controlli(s, c);
    return c;
  }

  /**
   * Le incongruenze fra quello che il cliente ha chiesto e quello che sto
   * prezzando. Sono promemoria per me: non compaiono mai nel preventivo.
   */
  private controlli(s: Istantanea, c: Calcolo): string[] {
    const L = this.listino!;
    const out: string[] = [];
    const ha = (campo: string, valore: string) => lista(s[campo]).includes(valore);
    const qtaExtra = (id: string) => (acceso(s[`x.${id}.on`]) ? intero(s[`x.${id}.q`]) : 0);

    if (!c.pacchetto && !c.righe.length) out.push('Nessun pacchetto e nessuna voce: il totale è zero.');

    const pagine = lista(s.pagine).length;
    if (c.pacchetto && c.pacchetto.id !== 'misura' && pagine > c.pacchetto.pagine) {
      const serve = pagine - c.pacchetto.pagine;
      if (qtaExtra('pagina') < serve) {
        out.push(
          `Ha segnato ${pagine} pagine e il pacchetto ${c.pacchetto.nome} ne include ${c.pacchetto.pagine}: servono ${serve} «Pagina aggiuntiva» (ora ${qtaExtra('pagina')}).`
        );
      }
    }

    if (ha('funzioni', 'Prenotazioni online con calendario') && !qtaExtra('prenotazioni')) {
      out.push('Vuole le prenotazioni online con calendario: manca l’extra «Prenotazione online».');
    }

    if (ha('funzioni', 'Vendita online con carrello') || ha('obiettivi', 'Vendere online')) {
      out.push(
        'Vendita online: un negozio con carrello, magazzino e spedizioni è fuori dal mio perimetro. Decidi se mandarlo da qualcun altro o preventivarlo a parte, a voci.'
      );
    }

    const altreLingue = lista(s.lingue).filter((l) => l !== 'Italiano').length || (ha('funzioni', 'Più lingue') ? 1 : 0);
    if (altreLingue > qtaExtra('lingua')) {
      out.push(`Lingue oltre all’italiano: ${altreLingue}. L’extra «Versione in un’altra lingua» è a ${qtaExtra('lingua')}.`);
    }

    if (testo(s.foto) === 'No, servono nuove foto') {
      out.push('Servono nuove foto e non sono nel prezzo: decidi chi le fa e scrivilo nel preventivo.');
    }

    if (testo(s.testi) === 'Preferisco che li scriva tu' && !qtaExtra('testi')) {
      out.push(`Vuole che scriva io i testi: manca l’extra «Testi scritti da me» (a pagina, ne ha segnate ${pagine || 'nessuna'}).`);
    }

    if (testo(s.sito) === 'Sì, ho già un sito' && !qtaExtra('migrazione')) {
      out.push('Ha già un sito: se i contenuti vanno spostati serve «Passaggio dal sito di oggi».');
    }

    if (testo(s.dominio) === 'No, è intestato a chi ha fatto il sito') {
      out.push('Il dominio non è suo: va recuperato prima di pubblicare, o il sito nuovo non può usare il suo indirizzo.');
    }

    const budget = BUDGET[testo(s.budget)];
    if (budget && c.imponibile > budget[1]) {
      out.push(`Il totale (${eur(c.imponibile)}) supera il budget che ha indicato («${testo(s.budget)}»).`);
    }

    if (c.regime.id === 'occasionale') {
      if (c.anno > INPS.franchigia) {
        out.push(
          c.ritenuta > 0
            ? `Con questo lavoro superi i 5.000 € incassati nell’anno (${eur(c.anno)}): scattano i contributi INPS sulla parte oltre i 5.000, ${eur(c.div.inps)}. Il cliente ne paga 2/3 in più del preventivo (${eur(c.div.inpsCliente)}) e ti trattiene 1/3 (${eur(c.div.inpsMia)}). Diglielo adesso: devi comunicargli tu il superamento.`
            : `Con questo lavoro superi i 5.000 € incassati nell’anno (${eur(c.anno)}): scattano i contributi INPS. Il cliente non trattiene la ritenuta, quindi li versi tu: chiedi al commercialista come.`
        );
      }
      if (c.ritenuta > 0) {
        out.push(
          'Il cliente è un’attività: se è un’impresa deve comunicare il tuo incarico all’Ispettorato del Lavoro prima che tu cominci (art. 14 D.Lgs. 81/2008, multa da 500 a 2.500 € se la omette). Diglielo adesso e verifica col commercialista se vale per il tuo caso.'
        );
      }
    }

    if (c.tariffa !== null && c.tariffa < L.oraMinima) {
      out.push(`Tariffa effettiva ${c.tariffa.toFixed(1).replace('.', ',')} €/h: sotto la tua soglia minima di ${L.oraMinima} €/h.`);
    }

    return out;
  }

  /* ------------------------------ il disegno ------------------------------ */

  private ricalcola() {
    if (!this.listino) return;
    const s = this.istantanea();
    const c = this.calcola(s);

    /* Le domande condizionali compaiono solo quando servono. */
    for (const el of this.tutti('[data-dom][data-se]')) {
      let se = this.condizioni.get(el);
      if (!se) {
        se = JSON.parse(el.dataset.se!) as [string, string][];
        this.condizioni.set(el, se);
      }
      el.hidden = !condizioneVera(se, s);
    }

    /* Il testo detto a voce sulle domande a scelta resta visibile finché c'è, o mentre si parla. */
    for (const nota of this.tutti('[data-voce-nota]')) {
      const campo = nota.dataset.voceNota!;
      nota.hidden = !testo(s[`v.${campo}`]) && this.campoVoce !== campo;
    }

    const set = (chiave: string, valore: string) =>
      this.tutti(`[data-v="${chiave}"]`).forEach((el) => (el.textContent = valore));
    const riga = (chiave: string, visibile: boolean) => {
      const el = this.r.querySelector<HTMLElement>(`[data-riga="${chiave}"]`);
      if (el) el.hidden = !visibile;
    };

    const nome = testo(s.nome);
    this.q('[data-titolo]').textContent = nome || 'Nuovo incontro';
    set('cliente', nome || 'Senza nome');
    set('numero', testo(s['i.numero']) ? `n. ${testo(s['i.numero'])}` : '');

    /* Le righe del riepilogo, dalle stesse che finiscono nel testo e in stampa. */
    this.riempiRighe(this.q('[data-righe]'), c.righe);
    this.q('[data-vuoto]').hidden = c.righe.length > 0;
    this.riempiRighe(this.q('[data-righe-annue]'), c.annue);
    this.q('[data-annue]').hidden = c.annue.length === 0;

    const conSconto = c.sconto > 0;
    const conIva = c.iva > 0;
    riga('subtotale', conSconto || conIva);
    riga('sconto', conSconto);
    riga('imponibile', conIva && conSconto);
    riga('iva', conIva);
    riga('ritenuta', c.ritenuta > 0);
    riga('netto', c.ritenuta > 0);

    set('subtotale', eur(c.subtotale));
    set('sconto-nome', testo(s['p.motivo']) ? `Sconto · ${testo(s['p.motivo'])}` : 'Sconto');
    set('sconto', `−${eur(c.sconto)}`);
    set('imponibile', eur(c.imponibile));
    set('iva', eur(c.iva));
    set('totale', eur(c.totale));
    set('totale-barra', eur(c.totale));
    set('ritenuta', `−${eur(c.ritenuta)}`);
    set('netto', eur(c.netto));
    set('acconto-nome', `Acconto alla conferma · ${c.accontoPerc.toString().replace('.', ',')}%`);
    set('acconto', eur(c.acconto));
    set('saldo', eur(c.saldo));

    set('ore', c.ore > 0 ? `${c.ore.toString().replace('.', ',')} h${c.oreManuali ? ' (a mano)' : ''}` : '—');
    set('tariffa', c.tariffa !== null ? `${c.tariffa.toFixed(1).replace('.', ',')} €/h` : '—');
    const L = this.listino;
    set(
      'tariffa-nota',
      c.tariffa === null
        ? 'Le ore si ricavano dal listino: serve almeno una voce con un prezzo.'
        : c.tariffa < L.oraMinima
          ? `Sotto la soglia minima di ${L.oraMinima} €/h.`
          : c.tariffa < L.oraObiettivo
            ? `Sopra la soglia minima (${L.oraMinima} €/h), sotto l’obiettivo di ${L.oraObiettivo} €/h.`
            : `In linea con l’obiettivo di ${L.oraObiettivo} €/h.`
    );

    const cx = this.complessita(s, c);
    set('complessita', `${cx.livello} · ${cx.punti}`);
    set('complessita-nota', cx.voci.map(([v, n]) => `${v} +${n}`).join(' · '));
    this.disegnaDivisione(c);
    this.disegnaChiusura(s);

    /* Controlli. */
    const ul = this.q('[data-avvisi]');
    ul.replaceChildren(
      ...c.controlli.map((t) => {
        const li = this.q<HTMLTemplateElement>('[data-t-avviso]').content.firstElementChild!.cloneNode(true) as HTMLElement;
        li.textContent = t;
        return li;
      })
    );
    this.q('[data-controlli-blocco]').hidden = c.controlli.length === 0;

    /* Totali delle righe extra e campi che hanno senso solo con certe scelte. */
    for (const e of EXTRA) {
      const out = this.r.querySelector<HTMLElement>(`[data-tot-extra="${e.id}"]`);
      if (!out) continue;
      const attivo = acceso(s[`x.${e.id}.on`]);
      const q = e.unita ? intero(s[`x.${e.id}.q`]) : 1;
      const li = this.listino.extra[e.id];
      const u = vuoto(s[`x.${e.id}.p`]) ? Math.round((li?.prezzo ?? 0) * 100) : centesimi(s[`x.${e.id}.p`]);
      out.textContent = attivo ? eur(u * q) : '';
    }

    const campoPk = this.q('[data-campo-pk]');
    campoPk.hidden = !c.pacchetto || c.pacchetto.id === 'misura';
    if (c.pacchetto && c.pacchetto.id !== 'misura') {
      this.q<HTMLInputElement>('#p-pk').placeholder = String(this.listino.pacchetti[c.pacchetto.id]?.prezzo ?? '');
    }
    this.q('[data-ritenuta]').hidden = c.regime.id !== 'occasionale';
    this.q('[data-incassato]').hidden = c.regime.id !== 'occasionale';
    this.q('[data-bollo]').hidden = c.regime.iva !== 0;

    /* Destinatario dei messaggi. */
    const num = numeroInternazionale(testo(s.telefono));
    this.q('[data-dest]').textContent = num
      ? `Si apre la chat con +${num}.`
      : 'Segna il telefono del cliente (sezione 02) per scrivergli da qui.';
    this.q<HTMLButtonElement>('[data-azione="wa-cliente"]').disabled = !num;
    this.q<HTMLButtonElement>('[data-azione="email-cliente"]').disabled = !testo(s.email);
    const senzaRighe = c.righe.length === 0;
    this.q<HTMLButtonElement>('[data-azione="wa-link"]').disabled = !num || senzaRighe;
    this.q<HTMLButtonElement>('[data-azione="copia-link"]').disabled = senzaRighe;
    this.q<HTMLButtonElement>('[data-azione="apri-proposta"]').disabled = senzaRighe;

    this.q('[data-barra-totale]').hidden = false;
    this.q('[data-foglio]').innerHTML = this.foglio(s, c);
  }

  /** Chi riceve cosa, pagamento per pagamento: il blocco che spiega i soldi a me e al cliente. */
  private disegnaDivisione(c: Calcolo) {
    const blocco = this.q('[data-divisione]');
    const attivo = c.righe.length > 0 && c.regime.iva === 0;
    blocco.hidden = !attivo;
    if (!attivo) return;

    const d = c.div;
    const occasionale = c.regime.id === 'occasionale';
    const riga = (nome: string, valore: string, mia = false) =>
      `<p class="dv-riga${mia ? ' mia' : ''}"><span>${nome}</span><b>${valore}</b></p>`;

    const intro = !occasionale
      ? 'Regime forfettario: niente IVA e niente ritenuta. Il compenso arriva intero a me.'
      : d.ritenuta > 0
        ? `Il cliente è un’attività: trattiene il ${ALIQUOTA_RITENUTA}% e lo versa allo Stato con l’F24 (codice tributo 1040) entro il 16 del mese dopo ogni pagamento. A me arriva il resto.`
        : 'Il cliente non trattiene la ritenuta (è un privato): niente F24 per lui, il compenso arriva intero a me e lo dichiaro io.';

    const pagamenti = d.pagamenti
      .map(
        (p) => `<div class="dv-pag">
          <p class="dv-titolo"><span>${p.nome}</span><span>${eur(p.lordo)}</span></p>
          ${riga('A me', eur(p.netto), true)}
          ${p.ritenuta > 0 ? riga(`Allo Stato · ritenuta ${ALIQUOTA_RITENUTA}%`, eur(p.ritenuta)) : ''}
          ${p.inps > 0 ? riga('All’INPS · mia quota, trattenuta', eur(p.inps)) : ''}
          ${p.bollo > 0 ? riga('A me · rimborso del bollo', eur(p.bollo), true) : ''}
        </div>`
      )
      .join('');

    const note: string[] = [];
    if (d.inps > 0) {
      note.push(
        `Contributo INPS ${eur(d.inps)} sulla parte oltre i 5.000 €: il cliente ne paga 2/3 (${eur(d.inpsCliente)}) oltre al preventivo e mi trattiene 1/3 (${eur(d.inpsMia)}).`
      );
    }
    if (d.bolli > 0) {
      note.push(
        `Bollo: ${d.bolli === 1 ? 'una ricevuta' : `${d.bolli} ricevute`} da ${eur(BOLLO.importo)}, una per ogni incasso sopra 77,47 €. Il cliente lo rimborsa fuori dal totale.`
      );
    }
    if (d.ritenuta > 0) note.push('Il cliente mi dà la Certificazione Unica entro il 16 marzo dell’anno dopo: la ritenuta si scala dalle mie imposte nella dichiarazione.');

    this.q('[data-div-corpo]').innerHTML = `
      <p class="dv-nota">${intro}</p>
      ${pagamenti}
      <div class="dv-somma">
        ${riga('In tutto a me', eur(d.aMe), true)}
        ${d.alFisco > 0 ? riga(d.inps > 0 ? 'In tutto allo Stato e all’INPS' : 'In tutto allo Stato', eur(d.alFisco)) : ''}
        ${riga('Il cliente spende in tutto', eur(d.spesaCliente))}
      </div>
      ${note.map((n) => `<p class="dv-nota">${n}</p>`).join('')}`;
  }

  /** Cosa è rimasto da chiedere, dalla lista «Prima di lasciare l'incontro» del questionario. */
  private disegnaChiusura(s: Istantanea) {
    const ha = (id: string) => !vuoto(s[id]);
    const materiali = MATERIALI.filter((m) => !vuoto(s[`m.${m.id}`])).length;

    const controlli: [string, boolean][] = [
      ['Chi è il cliente', ha('nome') && ha('referente')],
      ['Chi decide', ha('i.decide')],
      ['Qual è il problema', ha('unProblema') || ha('problemi') || ha('nonVa')],
      ['Qual è l’obiettivo', ha('obiettivi')],
      ['Chi sono i suoi clienti', ha('tipoClienti') || ha('clienti')],
      ['L’azione principale del sito', ha('cta')],
      ['Servizi o prodotti da spingere', ha('servizi') || ha('daSpingere')],
      ['Quali pagine servono', ha('pagine')],
      ['Quali funzioni servono', ha('funzioni')],
      ['Quali materiali ha (segnali nella lista)', materiali >= 5],
      ['Chi prepara i testi', ha('testi')],
      ['Chi prepara le foto', ha('foto')],
      ['Se il logo è utilizzabile', ha('logo')],
      ['Se esiste un sito, e di chi è il dominio', ha('sito') && ha('dominio')],
      ['Se serve la scheda Google / SEO locale', ha('googleCosa') || ha('schedaGoogle')],
      ['Chi aggiornerà il sito', ha('chiAggiorna')],
      ['La fascia di budget', ha('budget')],
      ['Le tempistiche', ha('quando')],
      ['Assistenza e costi ricorrenti', ha('assistenzaTipo')],
      ['Come approva e in quanto tempo', ha('approvazione')],
      ['Il prossimo passo', ha('i.esito') || ha('i.risposta') || this.azioni.length > 0],
    ];

    const mancano = controlli.filter(([, fatto]) => !fatto).map(([nome]) => nome);
    this.q('[data-chiusura-testo]').textContent = mancano.length
      ? `Ti mancano ${mancano.length} cose su ${controlli.length}. Chiedile prima di salutare.`
      : 'Hai tutto quello che serve per il preventivo.';
    this.q('[data-chiusura-lista]').replaceChildren(
      ...mancano.map((t) => {
        const li = this.q<HTMLTemplateElement>('[data-t-avviso]').content.firstElementChild!.cloneNode(true) as HTMLElement;
        li.textContent = t;
        return li;
      })
    );
  }

  /** Il punteggio interno del questionario: serve a me, non va mai al cliente. */
  private complessita(s: Istantanea, c: Calcolo): { punti: number; livello: string; voci: [string, number][] } {
    const voci: [string, number][] = [['sito semplice', 1]];
    const ha = (campo: string, valore: string) => lista(s[campo]).includes(valore);
    const altreLingue = lista(s.lingue).filter((l) => l !== 'Italiano').length || (ha('funzioni', 'Più lingue') ? 1 : 0);

    if (lista(s.pagine).length >= 5) voci.push(['cinque pagine o più', 1]);
    if (['Preferisco che li scriva tu', 'Ho già dei testi da sistemare'].includes(testo(s.testi))) voci.push(['testi da scrivere', 1]);
    if (testo(s.foto) && testo(s.foto) !== 'Sì, buone') voci.push(['foto da gestire', 1]);
    if (altreLingue > 0) voci.push(['più lingue', 2]);
    if (ha('funzioni', 'Vendita online con carrello') || ha('obiettivi', 'Vendere online')) voci.push(['vendita online', 3]);
    if (ha('funzioni', 'Prenotazioni online con calendario')) voci.push(['prenotazioni', 2]);
    if (testo(s.sito) === 'Sì, ho già un sito') voci.push(['passaggio dal sito', 2]);
    if (ha('strumenti', 'Gestionale o fatturazione')) voci.push(['gestionale', 3]);

    const punti = voci.reduce((n, [, v]) => n + v, 0);
    const livello = punti <= 4 ? 'semplice' : punti <= 8 ? 'medio' : punti <= 14 ? 'complesso' : 'avanzato';
    void c;
    return { punti, livello, voci };
  }

  /**
   * Dalle risposte al preventivo, in un tocco: sceglie il pacchetto se non l'ho
   * ancora scelto e accende gli extra che le risposte richiedono. Non spegne
   * mai niente e non abbassa mai una quantità: parte da quello che ho già messo.
   */
  private suggerisci() {
    const s = this.istantanea();
    const esito = this.q('[data-suggerisci-esito]');
    const fatto: string[] = [];
    const ha = (campo: string, valore: string) => lista(s[campo]).includes(valore);
    const pagine = lista(s.pagine).length;

    let pk = PACCHETTI.find((x) => x.id === testo(s['p.pacchetto'])) ?? null;
    if (!pk) {
      const completo =
        pagine > 1 ||
        ha('pagine', 'Galleria foto') ||
        ha('funzioni', 'Modulo di contatto') ||
        (pagine === 0 && testo(s.budget) !== 'Fino a 400 €');
      pk = PACCHETTI.find((x) => x.id === (completo ? 'completo' : 'essenziale'))!;
      scriviCampo(this.f, 'p.pacchetto', pk.id);
      scriviCampo(this.f, 'p.pk', '');
      fatto.push(`pacchetto ${pk.nome}`);
    }

    const accendi = (id: string, quantita: number | null) => {
      const extra = EXTRA.find((x) => x.id === id)!;
      const era = acceso(s[`x.${id}.on`]);
      if (!era) scriviCampo(this.f, `x.${id}.on`, ['1']);

      let cambiata = false;
      if (extra.unita && quantita !== null) {
        const attuale = vuoto(s[`x.${id}.q`]) ? 0 : intero(s[`x.${id}.q`]);
        if (quantita > attuale) {
          scriviCampo(this.f, `x.${id}.q`, String(quantita));
          cambiata = true;
        }
      }
      if (!era || cambiata) fatto.push(`${extra.nome[0].toLowerCase()}${extra.nome.slice(1)}${quantita && extra.unita ? ` (${quantita})` : ''}`);
    };

    if (pk.pagine > 0 && pagine > pk.pagine) accendi('pagina', pagine - pk.pagine);
    if (ha('funzioni', 'Prenotazioni online con calendario')) accendi('prenotazioni', null);
    if (testo(s.testi) === 'Preferisco che li scriva tu') accendi('testi', Math.max(pagine, 1));
    const altreLingue = lista(s.lingue).filter((l) => l !== 'Italiano').length || (ha('funzioni', 'Più lingue') ? 1 : 0);
    if (altreLingue > 0) accendi('lingua', altreLingue);
    if (testo(s.sito) === 'Sì, ho già un sito') accendi('migrazione', null);
    if (['Non c’è', 'C’è ma trascurata'].includes(testo(s.schedaGoogle))) accendi('scheda-google', null);
    if (testo(s.assistenzaTipo) === 'Un canone annuale') accendi('assistenza', null);

    const vendita = ha('funzioni', 'Vendita online con carrello') || ha('obiettivi', 'Vendere online');
    esito.textContent =
      (fatto.length
        ? `Ho messo: ${fatto.join(', ')}. Controlla prezzi e quantità: sono quelli del listino.`
        : 'Pacchetto e extra coprono già le risposte: non c’è niente da aggiungere.') +
      (vendita ? ' La vendita online non l’ho preventivata: è fuori dal tuo perimetro, decidi tu.' : '');
    this.cambiato();
  }

  private riempiRighe(ul: HTMLElement, righe: Riga[]) {
    ul.replaceChildren(
      ...righe.map((r) => {
        const li = this.q<HTMLTemplateElement>('[data-t-riga]').content.firstElementChild!.cloneNode(true) as HTMLElement;
        li.querySelector('.r-d')!.textContent = r.q > 1 ? `${r.q} × ${r.d}` : r.d;
        li.querySelector('.r-t')!.textContent = r.u === 0 ? 'da definire' : eur(r.t);
        return li;
      })
    );
  }

  /* ------------------------------ i testi ------------------------------ */

  private contesto(s: Istantanea, c: Calcolo) {
    const reg = REGISTRI[registroDi(testo(s['i.registro']))];
    const emesso = testo(s['i.data']) || oggi();
    const validita = Math.max(1, Math.floor(numero(s['p.validita'], CONDIZIONI.validitaGiorni)));
    return {
      reg,
      nome: testo(s.nome),
      referente: testo(s.referente),
      comune: testo(s.comune),
      numero: testo(s['i.numero']),
      emesso: dataIt(emesso),
      scadenza: dataIt(piuGiorni(emesso, validita)),
      validita,
      giri: Math.max(0, Math.floor(numero(s['p.giri'], CONDIZIONI.giriDiModifica))),
      assistenza: Math.max(0, Math.floor(numero(s['p.assistenza'], CONDIZIONI.assistenzaGiorni))),
      tempi: testo(s['p.tempi']) || CONDIZIONI.tempi,
      mancanti: MATERIALI.filter((m) => ['da-chiedere', 'in-parte'].includes(testo(s[`m.${m.id}`]))),
      motivo: testo(s['p.motivo']),
      c,
    };
  }

  /** Il preventivo come testo, da incollare in WhatsApp o in una mail. */
  private testoPreventivo(s: Istantanea, c: Calcolo): string {
    const x = this.contesto(s, c);
    const { reg } = x;
    const righe: string[] = [];

    righe.push(`${reg.saluto}${x.referente ? ` ${x.referente}` : ''},`);
    righe.push(`ecco il preventivo${x.numero ? ` n. ${x.numero}` : ''}${x.nome ? ` per ${x.nome}` : ''}.`);
    righe.push('');

    for (const r of c.righe) {
      righe.push(`• ${r.q > 1 ? `${r.q} × ` : ''}${r.d}: ${r.u === 0 ? 'da definire' : eur(r.t)}`);
    }
    if (c.sconto > 0) righe.push(`• Sconto${x.motivo ? ` (${x.motivo})` : ''}: −${eur(c.sconto)}`);
    if (c.iva > 0) righe.push(`• IVA ${c.regime.iva}%: ${eur(c.iva)}`);
    righe.push(`TOTALE: ${eur(c.totale)}${c.iva === 0 ? ` (${c.regime.id === 'ordinario' ? 'IVA esclusa' : 'senza IVA'})` : ''}`);
    if (c.ritenuta > 0) {
      righe.push(
        `Ritenuta d’acconto ${ALIQUOTA_RITENUTA}%: ${eur(c.ritenuta)}, che ${reg.paghi} direttamente allo Stato con F24 (codice tributo 1040) entro il 16 del mese dopo ogni pagamento. A me arrivano ${eur(c.netto)}; per ${reg.te} la spesa resta ${eur(c.totale)}.`
      );
    }
    if (c.div.bolli > 0) {
      righe.push(`Più ${eur(c.div.bollo)} di marche da bollo (${eur(BOLLO.importo)} su ogni ricevuta sopra 77,47 €).`);
    }
    if (c.div.inps > 0) {
      righe.push(
        `Contributi INPS: con questo lavoro l’incasso annuale supera i 5.000 €. Sulla parte oltre, i contributi sono ${eur(c.div.inps)}: ${eur(c.div.inpsCliente)} a carico ${reg.te}, da versare con F24, e ${eur(c.div.inpsMia)} che trattengo dal compenso.`
      );
    }
    righe.push(`Alla conferma ${c.accontoPerc.toString().replace('.', ',')}%: ${eur(c.acconto)}. Il resto, ${eur(c.saldo)}, alla consegna.`);
    righe.push('');
    righe.push(`Tempi: ${x.tempi}.`);
    righe.push(`Modifiche incluse: ${x.giri}. Assistenza dopo la pubblicazione: ${x.assistenza} giorni.`);
    righe.push(`Il preventivo vale fino al ${x.scadenza}.`);

    if (c.annue.length) {
      righe.push('');
      for (const r of c.annue) righe.push(`Facoltativo: ${r.d.toLowerCase()}, ${eur(r.t)} l’anno.`);
    }
    righe.push(
      `Dominio e hosting restano fuori dal prezzo: circa 50–120 € l’anno, che ${reg.paghi} direttamente al fornitore e restano intestati a ${reg.te}.`
    );

    if (x.mancanti.length) {
      righe.push('');
      righe.push('Per partire mi servono:');
      for (const m of x.mancanti) righe.push(`– ${m.nome}`);
    }

    righe.push('');
    righe.push(
      `Per procedere basta rispondere a questo messaggio. L’accordo è completo quando ${reg.ti} rispondo e arriva l’acconto: fino a quel momento non c’è nessun impegno.`
    );
    return righe.join('\n');
  }

  /** Gli appunti per me: tutto, comprese le cose che al cliente non si dicono. */
  private testoAppunti(s: Istantanea, c: Calcolo): string {
    const x = this.contesto(s, c);
    const out: string[] = [];

    out.push(`INCONTRO${x.numero ? ` n. ${x.numero}` : ''} · ${x.emesso}${testo(s['i.luogo']) ? ` · ${testo(s['i.luogo'])}` : ''}`);
    if (testo(s['i.presenti'])) out.push(`Presenti: ${testo(s['i.presenti'])}`);

    out.push('', componiMessaggio(leggiRichiesta(this.f), '').trim());

    /* Quello che ha detto a voce sulle domande a caselle, che non hanno un campo in cui scriverlo. */
    const dette = CAMPI.filter((cm) => testo(s[`v.${cm.id}`])).map((cm) => `${cm.corta}: ${testo(s[`v.${cm.id}`])}`);
    if (dette.length) out.push('', 'DETTO A VOCE SULLE DOMANDE A SCELTA', ...dette);

    const stati = new Map(STATI_MATERIALE as unknown as [string, string][]);
    const mat = MATERIALI.filter((m) => testo(s[`m.${m.id}`])).map(
      (m) => `${m.nome}: ${stati.get(testo(s[`m.${m.id}`])) ?? ''}`
    );
    if (mat.length) out.push('', 'COSA MI SERVE DA LUI', ...mat);

    const note: string[] = [];
    if (testo(s['i.appunti'])) note.push(testo(s['i.appunti']));
    if (testo(s['i.dubbi'])) note.push(`Dubbi: ${testo(s['i.dubbi'])}`);
    if (testo(s['i.decide'])) note.push(`Chi decide: ${testo(s['i.decide'])}`);
    if (testo(s['i.esito'])) note.push(`Com’è andata: ${testo(s['i.esito'])}`);
    if (testo(s['i.risposta'])) note.push(`Risposta entro: ${testo(s['i.risposta'])}`);
    if (note.length) out.push('', 'APPUNTI', ...note);

    if (testo(s['i.trascrizione'])) out.push('', 'TRASCRIZIONE', testo(s['i.trascrizione']));

    if (this.azioni.length) {
      out.push('', 'DA FARE', ...this.azioni.map((a) => `${a.fatto ? '[x]' : '[ ]'} ${a.t}`));
    }

    out.push('', 'PREZZO');
    for (const r of c.righe) out.push(`${r.q > 1 ? `${r.q} × ` : ''}${r.d}: ${eur(r.t)}`);
    if (c.sconto > 0) out.push(`Sconto: −${eur(c.sconto)}`);
    out.push(`Totale: ${eur(c.totale)} · acconto ${eur(c.acconto)}`);
    if (c.tariffa !== null) out.push(`Ore stimate ${c.ore} · tariffa effettiva ${c.tariffa.toFixed(1).replace('.', ',')} €/h`);

    return out.join('\n');
  }

  /** Il foglio che esce in stampa: il preventivo, senza niente di interno. */
  private foglio(s: Istantanea, c: Calcolo): string {
    const x = this.contesto(s, c);
    const { reg } = x;
    const r = this.r;
    const mittente = r.dataset.mittente ?? '';
    const sede = r.dataset.sede ?? '';
    const email = r.dataset.email ?? '';
    const tel = r.dataset.telefono ?? '';
    const pc = Math.round(c.accontoPerc * 10) / 10;

    const righe = c.righe
      .map(
        (v) =>
          `<tr><td>${v.q > 1 ? `${v.q} × ` : ''}${esc(v.d)}</td><td>${v.u === 0 ? 'da definire' : eur(v.t)}</td></tr>`
      )
      .join('');

    const extra: string[] = [];
    if (c.sconto > 0) extra.push(`<tr><td>Sconto${x.motivo ? ` · ${esc(x.motivo)}` : ''}</td><td>−${eur(c.sconto)}</td></tr>`);
    if (c.iva > 0) {
      extra.push(`<tr><td>Imponibile</td><td>${eur(c.imponibile)}</td></tr>`);
      extra.push(`<tr><td>IVA ${c.regime.iva}%</td><td>${eur(c.iva)}</td></tr>`);
    }

    const incluso = c.pacchetto && c.pacchetto.id !== 'misura' ? c.pacchetto.include : [];
    const passi = [
      `<b>Conferma e acconto.</b> Si conferma rispondendo a questo preventivo e si versa l’acconto del ${pc}%.`,
      '<b>Materiale.</b> Logo, foto e informazioni.',
      `<b>Bozza.</b> Il sito vero, ${esc(x.tempi)}.`,
      `<b>Modifiche.</b> ${x.giri} giri inclusi: si dice cosa cambiare, lo cambio.`,
      `<b>Pubblicazione.</b> Saldo e sito online. Poi ${x.assistenza} giorni di assistenza inclusa.`,
    ];

    return `
      <div class="fg-testata">
        <div>
          <div class="fg-et">Preventivo</div>
          <h2 class="fg-titolo">${esc(x.nome || 'Sito web')}</h2>
        </div>
        <div class="fg-meta">${x.numero ? `n. ${esc(x.numero)}<br>` : ''}Emesso il ${x.emesso}<br>Valido fino al ${x.scadenza}</div>
      </div>

      <div class="fg-parti">
        <div>
          <div class="fg-et">Per</div>
          ${esc(x.nome || '—')}${x.referente ? `<br>${esc(x.referente)}` : ''}${x.comune ? `<br>${esc(x.comune)}` : ''}
        </div>
        <div>
          <div class="fg-et">Da</div>
          ${esc(mittente)}, sviluppatore web<br>${esc(sede)}<br>${esc(email)}${tel ? ` · ${esc(tel)}` : ''}
        </div>
      </div>

      <table class="fg-tabella">
        ${righe}
        ${extra.join('')}
        <tr class="fg-tot"><td>Totale</td><td>${eur(c.totale)}</td></tr>
      </table>
      <p class="fg-piccolo">${esc(c.regime.id === 'occasionale' ? DICITURA_OCCASIONALE : c.regime.dicitura)}</p>

      <div class="fg-sez">
        <div class="fg-et">Come si paga</div>
        <p>Alla conferma ${pc}%: <b>${eur(c.acconto)}</b>. Alla consegna il resto: <b>${eur(c.saldo)}</b>. Pagamento con bonifico.</p>
      </div>

      ${this.foglioDivisione(c)}

      ${incluso.length ? `<div class="fg-sez"><div class="fg-et">Cosa comprende il pacchetto ${esc(c.pacchetto!.nome)}</div><ul>${incluso.map((i: string) => `<li>${esc(i)}</li>`).join('')}</ul></div>` : ''}

      ${x.mancanti.length ? `<div class="fg-sez"><div class="fg-et">Per partire mi servono</div><ul>${x.mancanti.map((m) => `<li>${esc(m.nome)}</li>`).join('')}</ul><p class="fg-piccolo">Se non c’è tutto si parte con quello che c’è: dove manca qualcosa metto un segnaposto ben visibile, non invento niente.</p></div>` : ''}

      <div class="fg-sez">
        <div class="fg-et">Costi fuori dal prezzo</div>
        <ul>
          <li>Dominio e hosting: circa 50–120 € l’anno, che ${reg.paghi} direttamente al fornitore e restano intestati a ${reg.te}.</li>
          ${c.annue.map((a) => `<li>Facoltativo: ${esc(a.d.toLowerCase())}, ${eur(a.t)} l’anno.</li>`).join('')}
        </ul>
      </div>

      <div class="fg-sez">
        <div class="fg-et">Come si lavora</div>
        <ol>${passi.map((p) => `<li>${p}</li>`).join('')}</ol>
      </div>

      <div class="fg-sez">
        <div class="fg-et">Condizioni</div>
        <ul>
          <li><b>Validità:</b> ${x.validita} giorni dalla data del preventivo.</li>
          <li><b>Tempi:</b> ${esc(x.tempi)}.</li>
          <li><b>Modifiche:</b> ${x.giri} giri inclusi; richieste ulteriori da concordare.</li>
          <li><b>Proprietà:</b> a saldo avvenuto il sito e i contenuti forniti sono ${reg.tuoi}. Resta il diritto di mostrare il lavoro nel portfolio, salvo diversa indicazione scritta.</li>
          <li><b>Materiali:</b> foto, testi e marchi forniti devono essere ${reg.tuoi} o usabili da ${reg.te}. Per le foto di persone serve il loro consenso.</li>
          <li><b>Privacy:</b> i dati forniti servono solo a fare il sito, che avrà la sua informativa.</li>
        </ul>
      </div>

      <p class="fg-sez">L’accordo è completo quando ${reg.ti} rispondo e arriva l’acconto: fino a quel momento non c’è nessun impegno.</p>
    `;
  }

  /** Come si divide ogni pagamento, per il cliente: ritenuta, bollo e INPS, senza il resto dei miei conti. */
  private foglioDivisione(c: Calcolo): string {
    const d = c.div;
    if (c.regime.iva !== 0 || (d.ritenuta === 0 && d.bolli === 0 && d.inps === 0)) return '';

    const righe = d.pagamenti
      .map((p) => {
        const parti = [`${eur(p.netto)} a me`];
        if (p.ritenuta > 0) parti.push(`${eur(p.ritenuta)} di ritenuta d’acconto, versata allo Stato`);
        if (p.inps > 0) parti.push(`${eur(p.inps)} di contributi INPS, trattenuti`);
        return `<li><b>${esc(p.nome)}</b>, ${eur(p.lordo)}: ${parti.join(' · ')}.</li>`;
      })
      .join('');

    const note: string[] = [];
    if (d.ritenuta > 0) {
      note.push(
        `La ritenuta d’acconto non è un costo in più: è una parte del compenso che il committente versa allo Stato per conto mio, con F24 (codice tributo 1040) entro il 16 del mese successivo al pagamento, e certifica con la Certificazione Unica.`
      );
    }
    if (d.inps > 0) {
      note.push(
        `Il compenso porta l’incasso annuale oltre i 5.000 €: sulla parte eccedente il contributo INPS è di ${eur(d.inps)}. Due terzi (${eur(d.inpsCliente)}) sono a carico del committente e si aggiungono al preventivo; un terzo (${eur(d.inpsMia)}) è trattenuto dal compenso. Il committente versa tutto con F24.`
      );
    }
    if (d.bolli > 0) {
      note.push(
        `Su ${d.bolli === 1 ? 'la ricevuta' : `ognuna delle ${d.bolli} ricevute`} sopra 77,47 € va una marca da bollo da ${eur(BOLLO.importo)}, rimborsata dal committente: ${eur(d.bollo)} in più rispetto al totale.`
      );
    }
    if (d.inps > 0 || d.bolli > 0) note.push(`Il committente spende in tutto ${eur(d.spesaCliente)}.`);

    return `<div class="fg-sez">
        <div class="fg-et">Come si divide ogni pagamento</div>
        <ul>${righe}</ul>
        ${note.map((n) => `<p class="fg-piccolo">${n}</p>`).join('')}
      </div>`;
  }

  /**
   * Il pacchetto di dati che viaggia nel link del preventivo: tutto quello che
   * il cliente può vedere e niente di quello che è mio (ore, tariffa, appunti).
   */
  private proposta(s: Istantanea, c: Calcolo): Proposta {
    const L = this.listino!;
    const x = this.contesto(s, c);
    const scelto = c.pacchetto && c.pacchetto.id !== 'misura' ? c.pacchetto : null;
    const prova = testo(s['i.prova']);
    const tipo = testo(s['p.sconto-tipo']);

    return {
      v: 1,
      n: x.numero,
      e: testo(s['i.data']) || oggi(),
      g: x.validita,
      a: x.nome,
      r: x.referente,
      c: x.comune,
      reg: registroDi(testo(s['i.registro'])),
      u: prova ? (/^https?:\/\//i.test(prova) ? prova : `https://${prova}`) : '',
      rg: c.regime.id,
      rit: c.ritenuta > 0 ? 1 : 0,
      ac: c.accontoPerc,
      gi: x.giri,
      as: x.assistenza,
      t: x.tempi,
      pk: PACCHETTI.filter((p) => p.id !== 'misura').map((p) => ({
        id: p.id,
        /* Il pacchetto scelto porta il prezzo che ho scritto io; l'altro, quello di listino. */
        p: scelto?.id === p.id && c.righe[0] ? c.righe[0].u : Math.round((L.pacchetti[p.id]?.prezzo ?? 0) * 100),
      })),
      cons: c.pacchetto?.id ?? '',
      ex: EXTRA.map((e) => {
        const on = acceso(s[`x.${e.id}.on`]);
        const q = e.unita ? intero(s[`x.${e.id}.q`]) : 1;
        const p = vuoto(s[`x.${e.id}.p`]) ? Math.round((L.extra[e.id]?.prezzo ?? 0) * 100) : centesimi(s[`x.${e.id}.p`]);
        return { id: e.id, p, q, on: on ? (1 as const) : (0 as const) };
      }).filter((e) => e.p > 0 || e.on),
      vv: this.leggiVoci()
        .filter((v) => v.d.trim() || v.p.trim())
        .map((v) => ({ d: v.d.trim() || 'Voce a parte', q: intero(v.q), p: centesimi(v.p) })),
      sc: {
        tipo: tipo === 'euro' || tipo === 'perc' ? tipo : '',
        val: numero(s['p.sconto']),
        m: x.motivo,
      },
      sv: x.mancanti.map((m) => m.nome),
    };
  }

  private async linkProposta(s: Istantanea, c: Calcolo): Promise<string> {
    return `${window.location.origin}/preventivo-proposta#${await codifica(this.proposta(s, c))}`;
  }

  /* ------------------------------ la voce ------------------------------ */

  /** Dove finisce quello che si dice: il campo stesso, o «Cosa ha detto» per le domande a caselle. */
  private bersaglio(campo: string): HTMLInputElement | HTMLTextAreaElement | null {
    if (campo === INCONTRO_INTERO) return this.f.querySelector<HTMLTextAreaElement>('[name="i.trascrizione"]');
    const el = this.f.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${CSS.escape(campo)}"]`);
    if (!el) return null;
    if (el instanceof HTMLInputElement && (el.type === 'radio' || el.type === 'checkbox')) {
      return this.f.querySelector<HTMLTextAreaElement>(`[name="${CSS.escape(`v.${campo}`)}"]`);
    }
    return el;
  }

  private domanda(campo: string): string {
    if (campo === INCONTRO_INTERO) return 'L’intero incontro';
    return ETICHETTE_I[campo] ?? campoPerId(campo)?.label ?? campo;
  }

  /** Lo stato della voce, sulla riga della sezione 01 e sulla pillola che segue la pagina. */
  private dettoVoce(msg: string, attiva: boolean) {
    this.q('[data-voce-stato]').textContent = msg;

    const pillola = this.q('[data-pillola]');
    this.q('[data-pillola-testo]').textContent = attiva ? `${this.domanda(this.campoVoce)} · ${msg}` : msg;
    this.q('[data-azione="mic-ferma"]').hidden = !attiva;
    pillola.hidden = !attiva && !msg;

    window.clearTimeout(this.timerVoce);
    if (!attiva && msg) this.timerVoce = window.setTimeout(() => (pillola.hidden = true), 7000);
  }

  private segnaMic(campo: string) {
    for (const b of this.tutti('[data-azione="mic"]')) {
      const acceso = campo !== '' && b.dataset.campo === campo;
      b.classList.toggle('attiva', acceso);
      b.setAttribute('aria-pressed', String(acceso));
    }
    this.q('[data-trascr-etichetta]').textContent =
      campo === INCONTRO_INTERO ? 'Ferma la registrazione' : 'Accendi la registrazione';
  }

  private async avviaVoce(campo: string) {
    const s = this.istantanea();

    /* Senza il consenso del cliente non si registra: è la sola condizione, e vale per ogni microfono. */
    if (!acceso(s['i.consenso'])) {
      this.dettoVoce('Prima chiedi al cliente il permesso di registrare, poi spunta la casella nella sezione 01.', false);
      const casella = this.q<HTMLInputElement>('[data-consenso]');
      casella.scrollIntoView({ behavior: 'smooth', block: 'center' });
      casella.focus();
      return;
    }
    if (!registrazioneDisponibile()) {
      this.dettoVoce('Questo browser non sa registrare l’audio: usa Chrome, Edge o Safari, da https o da localhost.', false);
      return;
    }

    const el = this.bersaglio(campo);
    if (!el) return;
    this.campoVoce = campo;
    this.incontroVoce = this.corrente.id;
    this.primoDettato = true;

    const sessione = new Sessione(
      {
        finale: (t) => this.dettato(campo, el, t),
        provvisorio: (t) => {
          const riga = this.r.querySelector<HTMLElement>(`[data-voce-prov="${CSS.escape(campo)}"]`);
          if (riga) riga.textContent = t;
        },
        stato: (attiva, msg) => this.dettoVoce(msg, attiva),
      },
      acceso(s['i.trascrivi'])
    );
    this.voce = sessione;

    if (await sessione.avvia()) {
      this.segnaMic(campo);
    } else {
      this.voce = null;
      this.campoVoce = '';
    }
  }

  /** Ferma la registrazione in corso e la salva nell'incontro in cui è cominciata. */
  private async fermaVoce() {
    const sessione = this.voce;
    if (!sessione || this.fermando) return;
    this.fermando = true;

    const campo = this.campoVoce;
    const incontro = this.incontroVoce;
    try {
      const r = await sessione.ferma();
      this.segnaMic('');

      if (r && r.blob.size > 0) {
        const presa: Presa = {
          id: nuovoId(),
          incontro,
          campo,
          creato: Date.now(),
          durata: r.durata,
          mime: r.mime,
          blob: r.blob,
          testo: r.testo,
          incompleta: r.incompleta,
        };
        try {
          await salvaPresa(presa);
          if (this.corrente?.id === incontro) {
            this.prese.push(presa);
            this.disegnaPrese();
          }
        } catch {
          this.dettoVoce('Non riesco a salvare l’audio su questo dispositivo: lo spazio del browser potrebbe essere pieno.', false);
        }
      }
    } finally {
      this.voce = null;
      this.campoVoce = '';
      this.fermando = false;
    }
  }

  /** Scrive nel campo quello che ha capito il riconoscitore. */
  private dettato(campo: string, el: HTMLInputElement | HTMLTextAreaElement, t: string) {
    const maiuscola = `${t[0].toUpperCase()}${t.slice(1)}`;

    if (campo === INCONTRO_INTERO) {
      const chi = leggiCampo(this.f, 'i.parla') === 'Io' ? 'Io' : 'Cliente';
      /* Il riconoscitore italiano non mette punti. */
      const frase = /[.!?…]$/.test(maiuscola) ? maiuscola : `${maiuscola}.`;
      el.value += `${el.value && !el.value.endsWith('\n') ? '\n' : ''}${chi}: ${frase}`;
    } else if (el.type === 'email') {
      /* «mario chiocciola gmail punto com» → mario@gmail.com. La prima volta sostituisce, poi accoda. */
      const mail = t.toLowerCase().replace(/\s*chiocciola\s*/g, '@').replace(/\s*punto\s*/g, '.').replace(/\s+/g, '');
      el.value = this.primoDettato ? mail : el.value + mail;
    } else if (el.type === 'tel') {
      const numero = t.replace(/[^\d+]/g, '');
      el.value = this.primoDettato ? numero : el.value + numero;
    } else {
      const frase = el instanceof HTMLTextAreaElement && !/[.!?…]$/.test(maiuscola) ? `${maiuscola}.` : maiuscola;
      el.value = `${el.value ? `${el.value.trimEnd()} ` : ''}${frase}`;
    }

    this.primoDettato = false;
    el.scrollTop = el.scrollHeight;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private async caricaPrese() {
    const id = this.corrente.id;
    let trovate: Presa[] = [];
    try {
      trovate = await preseDi(id);
    } catch {
      /* senza IndexedDB non ci sono registrazioni da mostrare */
    }
    if (this.corrente?.id !== id) return;
    this.prese = trovate;
    this.disegnaPrese();
  }

  private disegnaPrese() {
    for (const u of this.urlAudio) URL.revokeObjectURL(u);
    this.urlAudio = [];

    for (const ul of this.tutti('[data-prese]')) {
      const mie = this.prese.filter((p) => p.campo === ul.dataset.prese);
      ul.hidden = mie.length === 0;
      ul.replaceChildren(...mie.map((p) => this.rigaPresa(p)));
    }

    const durata = this.prese.reduce((n, p) => n + p.durata, 0);
    const mega = this.prese.reduce((n, p) => n + p.blob.size, 0) / 1048576;
    this.q('[data-audio-riepilogo]').textContent = this.prese.length
      ? `${this.prese.length} registrazion${this.prese.length === 1 ? 'e' : 'i'} · ${durataLeggibile(durata)} · ${mega.toFixed(1).replace('.', ',')} MB, su questo dispositivo.`
      : 'Nessuna registrazione per questo incontro.';
    this.q<HTMLButtonElement>('[data-azione="pacchetto-ai"]').disabled = this.prese.length === 0;
    this.q<HTMLButtonElement>('[data-azione="elimina-audio"]').disabled = this.prese.length === 0;
  }

  private rigaPresa(p: Presa): HTMLElement {
    const li = document.createElement('li');
    li.className = 'presa';

    const audio = document.createElement('audio');
    audio.controls = true;
    audio.preload = 'metadata';
    const url = URL.createObjectURL(p.blob);
    this.urlAudio.push(url);
    audio.src = url;

    const info = document.createElement('span');
    info.className = 'dato';
    info.textContent = `${durataLeggibile(p.durata)} · ${new Date(p.creato).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;

    const togli = document.createElement('button');
    togli.type = 'button';
    togli.className = 'f-bottone secondario piccolo';
    togli.dataset.azione = 'togli-presa';
    togli.dataset.id = p.id;
    togli.textContent = 'Elimina';

    li.append(audio, info, togli);
    if (p.incompleta) {
      const avviso = document.createElement('span');
      avviso.className = 'avviso-presa';
      avviso.textContent = 'Il microfono si è interrotto mentre registrava: l’audio può avere dei buchi.';
      li.append(avviso);
    }
    return li;
  }

  /** Due tocchi invece di una finestra di conferma: la finestra del browser blocca tutto il resto. */
  private doppioTocco(el: HTMLElement, etichetta: string): boolean {
    if (el.dataset.conferma === 'si') {
      delete el.dataset.conferma;
      el.textContent = etichetta;
      return true;
    }
    el.dataset.conferma = 'si';
    el.textContent = 'Sicuro?';
    window.setTimeout(() => {
      if (el.dataset.conferma !== 'si') return;
      delete el.dataset.conferma;
      el.textContent = etichetta;
    }, 4000);
    return false;
  }

  /**
   * Il pacchetto da dare a un'AI: gli audio, le risposte, le trascrizioni e le
   * istruzioni, in un file solo. È l'unica strada da cui l'audio esce da qui, e
   * parte solo quando premo io.
   */
  private async pacchettoAi() {
    this.salva();
    const s = this.istantanea();
    const c = this.calcola(s);
    const nome = testo(s.nome) || 'cliente';
    const codifica = new TextEncoder();
    const file = (n: string, t: string): FileZip => ({ nome: n, dati: codifica.encode(t) });

    const prese = await preseDi(this.corrente.id);
    const audio: FileZip[] = [];
    const elenco = [];
    for (const [i, p] of prese.entries()) {
      const nomeFile = `audio/${String(i + 1).padStart(2, '0')}-${slug(p.campo === INCONTRO_INTERO ? 'incontro-intero' : p.campo)}.${estensione(p.mime)}`;
      audio.push({ nome: nomeFile, dati: new Uint8Array(await p.blob.arrayBuffer()) });
      elenco.push({
        file: nomeFile,
        domanda: this.domanda(p.campo),
        campo: p.campo,
        registrata: new Date(p.creato).toISOString(),
        durataSecondi: Math.round(p.durata / 1000),
        trascrizioneInDiretta: p.testo,
        audioIncompleto: p.incompleta,
      });
    }

    const registrazioni = elenco.length
      ? elenco
          .map((e) => `- ${e.file} · ${e.domanda} · ${durataLeggibile(e.durataSecondi * 1000)}${e.trascrizioneInDiretta ? `\n  Trascrizione in diretta: ${e.trascrizioneInDiretta}` : ''}${e.audioIncompleto ? '\n  ATTENZIONE: audio incompleto.' : ''}`)
          .join('\n')
      : 'Nessuna registrazione.';

    const leggimi = `# Incontro con ${nome} · ${dataIt(testo(s['i.data']) || oggi())}

Questa cartella contiene un incontro con un cliente per un sito web, raccolto con il questionario di scoperta.

- \`incontro.md\`: le risposte, gli appunti, il testo detto a voce e il preventivo calcolato.
- \`incontro.json\`: gli stessi dati in forma strutturata, con l'elenco delle registrazioni.
- \`audio/\`: le registrazioni. Il nome del file dice a quale domanda appartiene; \`incontro-intero\` è tutta la conversazione.

## Cosa chiedere all'AI

> Ti passo un incontro con un cliente (un'attività locale che vuole un sito). Sono un web developer freelance. Leggi \`incontro.md\` e \`incontro.json\`, e se ci sono gli audio ascoltali o trascrivili.
>
> 1. Confronta quello che il cliente ha detto a voce con quello che ho segnato per iscritto, e dimmi dove c'è una differenza o qualcosa in più.
> 2. Riassumi in poche righe: obiettivo, problema di oggi, pubblico, cosa vende, stile desiderato.
> 3. Elenca i requisiti: pagine, funzioni, contenuti, e cosa manca per partire.
> 4. Segnala obiezioni, paure, dubbi e le promesse che devo evitare.
> 5. Dimmi se il pacchetto e gli extra del preventivo in \`incontro.md\` vanno corretti, e perché. Non inventare prezzi: usa solo quelli che trovi.
> 6. Scrivimi le domande da fare al cliente nel messaggio di follow-up.
>
> Non inventare niente: se un'informazione non c'è, scrivi «non detto».

## Attenzione

Contiene dati e voce di una persona. Il cliente ha acconsentito alla registrazione, ma non necessariamente a farla ascoltare a un servizio esterno: se usi un'AI online, dillo al cliente. Cancella il pacchetto e gli audio quando hai finito.
`;

    const md = `${this.testoAppunti(s, c)}\n\nREGISTRAZIONI\n${registrazioni}\n`;
    const json = JSON.stringify(
      {
        incontro: { id: this.corrente.id, numero: testo(s['i.numero']), data: testo(s['i.data']) },
        risposte: Object.fromEntries(
          CAMPI.filter((cm) => !vuoto(s[cm.id]) || !vuoto(s[`v.${cm.id}`])).map((cm) => [
            cm.id,
            { domanda: cm.label, risposta: s[cm.id], dettoAVoce: testo(s[`v.${cm.id}`]) || undefined },
          ])
        ),
        note: {
          trascrizioneIntera: testo(s['i.trascrizione']),
          appunti: testo(s['i.appunti']),
          dubbi: testo(s['i.dubbi']),
          chiDecide: testo(s['i.decide']),
          esito: testo(s['i.esito']),
        },
        daFare: this.azioni,
        preventivo: {
          righe: c.righe.map((r) => ({ voce: r.d, quantita: r.q, totaleEuro: r.t / 100 })),
          totaleEuro: c.totale / 100,
          regime: c.regime.nome,
        },
        registrazioni: elenco,
      },
      null,
      2
    );

    const zip = creaZip([file('LEGGIMI.md', leggimi), file('incontro.md', md), file('incontro.json', json), ...audio]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([zip as BlobPart], { type: 'application/zip' }));
    a.download = `incontro-${slug(nome) || 'cliente'}-${oggi()}.zip`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);

    const mega = audio.reduce((n, f) => n + f.dati.length, 0) / 1048576;
    this.q('[data-esito]').textContent = `Pacchetto scaricato: ${audio.length} audio, ${mega.toFixed(1).replace('.', ',')} MB. Contiene dati e voce del cliente: tienilo al sicuro e cancellalo dopo l’analisi.`;
  }

  /* ------------------------------ gli eventi ------------------------------ */

  private cambiato() {
    this.ricalcola();
    window.clearTimeout(this.timerSalva);
    this.timerSalva = window.setTimeout(() => this.salva(), 300);
  }

  private collega() {
    this.collegato = true;

    this.f.addEventListener('submit', (e) => e.preventDefault());

    this.f.addEventListener('input', () => this.cambiato());
    this.f.addEventListener('change', (e) => {
      const el = e.target as HTMLInputElement;
      /* Cambiando pacchetto, il prezzo scritto a mano per il precedente non vale più. */
      if (el.name === 'p.pacchetto') scriviCampo(this.f, 'p.pk', '');
      this.cambiato();
    });

    /* Salva quando si lascia la pagina, senza aspettare il ritardo. */
    const alNascondere = () => {
      if (!this.r.isConnected) return document.removeEventListener('visibilitychange', alNascondere);
      if (document.visibilityState === 'hidden') {
        window.clearTimeout(this.timerSalva);
        this.salva();
      }
    };
    document.addEventListener('visibilitychange', alNascondere);

    this.q<HTMLSelectElement>('[data-elenco]').addEventListener('change', (e) => {
      this.salva();
      const m = this.archivio.elenco.find((x) => x.id === (e.target as HTMLSelectElement).value);
      if (m) this.carica(m);
    });

    this.q<HTMLInputElement>('[data-importa]').addEventListener('change', (e) => this.importaFile(e));

    this.q<HTMLInputElement>('[data-azione-testo]').addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      this.nuovaAzione();
    });

    this.r.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-azione]');
      if (!b || !this.listino) return;
      void this.azione(b.dataset.azione!, b);
    });

    /* Gli elementi di un elenco si segnano da spuntati senza passare dal clic sul pulsante. */
    this.q('[data-azioni]').addEventListener('change', (e) => {
      const li = (e.target as HTMLElement).closest<HTMLElement>('.azione');
      if (!li) return;
      const a = this.azioni[Number(li.dataset.i)];
      if (a) a.fatto = (e.target as HTMLInputElement).checked;
    });

    window.addEventListener('beforeprint', () => this.ricalcola());
    window.addEventListener('pagehide', () => void this.fermaVoce());
  }

  private nuovaAzione() {
    const campo = this.q<HTMLInputElement>('[data-azione-testo]');
    const t = campo.value.trim();
    if (!t) return;
    this.azioni.push({ t, fatto: false });
    campo.value = '';
    this.renderAzioni();
    this.cambiato();
  }

  private async azione(nome: string, el: HTMLElement) {
    const esito = this.q('[data-esito]');
    const dirne = (msg: string) => (esito.textContent = msg);

    switch (nome) {
      case 'nuovo': {
        this.salva();
        this.carica(this.creaNuovo());
        this.q('#sez-incontro').scrollIntoView({ behavior: 'smooth' });
        break;
      }

      case 'elimina': {
        /* Due tocchi invece di una finestra di conferma: la finestra del
           browser blocca tutto il resto finché non la si chiude. */
        if (el.dataset.conferma !== 'si') {
          el.dataset.conferma = 'si';
          el.textContent = 'Sicuro?';
          window.clearTimeout(this.timerElimina);
          this.timerElimina = window.setTimeout(() => {
            delete el.dataset.conferma;
            el.textContent = 'Elimina';
          }, 4000);
          break;
        }
        window.clearTimeout(this.timerElimina);
        delete el.dataset.conferma;
        el.textContent = 'Elimina';
        /* Gli audio di un incontro eliminato non devono restare orfani sul dispositivo. */
        await this.fermaVoce();
        await eliminaPreseDi(this.corrente.id).catch(() => undefined);
        this.archivio.elenco = this.archivio.elenco.filter((m) => m.id !== this.corrente.id);
        this.carica(this.archivio.elenco[0] ?? this.creaNuovo());
        this.stato('Incontro eliminato da questo dispositivo.');
        break;
      }

      case 'esporta': {
        this.salva();
        const blob = new Blob([JSON.stringify(this.archivio, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `incontri-${oggi()}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
        this.stato('Copia scaricata. Contiene gli appunti in chiaro: tienila al sicuro.');
        break;
      }

      case 'blocca':
        this.blocca();
        break;

      case 'mic': {
        if (this.fermando) break;
        const campo = el.dataset.campo!;
        const stessa = this.voce?.attiva && this.campoVoce === campo;
        await this.fermaVoce();
        if (!stessa) await this.avviaVoce(campo);
        break;
      }

      case 'mic-ferma':
        await this.fermaVoce();
        break;

      case 'suggerisci':
        this.suggerisci();
        break;

      case 'pacchetto-ai':
        await this.pacchettoAi();
        break;

      case 'elimina-audio': {
        if (!this.doppioTocco(el, 'Elimina gli audio di questo incontro')) break;
        await this.fermaVoce();
        await eliminaPreseDi(this.corrente.id);
        this.prese = [];
        this.disegnaPrese();
        dirne('Audio eliminati da questo dispositivo.');
        break;
      }

      case 'togli-presa': {
        if (!this.doppioTocco(el, 'Elimina')) break;
        await eliminaPresa(el.dataset.id!);
        this.prese = this.prese.filter((x) => x.id !== el.dataset.id);
        this.disegnaPrese();
        break;
      }

      case 'importa-richiesta':
        this.importaRichiesta();
        break;

      case 'aggiungi-voce':
        this.aggiungiVoce().querySelector<HTMLInputElement>('[data-vc="d"]')!.focus();
        break;

      case 'togli-voce':
        el.closest('.voce')?.remove();
        this.cambiato();
        break;

      case 'aggiungi-azione':
        this.nuovaAzione();
        break;

      case 'togli-azione': {
        const i = Number(el.closest<HTMLElement>('.azione')?.dataset.i);
        if (Number.isInteger(i)) this.azioni.splice(i, 1);
        this.renderAzioni();
        this.cambiato();
        break;
      }

      case 'apri-proposta': {
        const s = this.istantanea();
        window.open(await this.linkProposta(s, this.calcola(s)), '_blank', 'noopener');
        break;
      }

      case 'copia-link': {
        const s = this.istantanea();
        const ok = await copia(await this.linkProposta(s, this.calcola(s)));
        dirne(ok ? 'Link copiato: incollalo in WhatsApp o in una mail.' : 'Non riesco a copiare: apri la pagina da https o da localhost.');
        break;
      }

      case 'wa-link': {
        const s = this.istantanea();
        const c = this.calcola(s);
        const num = numeroInternazionale(testo(s.telefono));
        if (!num) break;
        const x = this.contesto(s, c);
        const link = await this.linkProposta(s, c);
        const messaggio = [
          `${x.reg.saluto}${x.referente ? ` ${x.referente}` : ''}, ecco il preventivo${x.nome ? ` per ${x.nome}` : ''}.`,
          'Dentro ci sono la versione di prova, i pacchetti e i costi, e da lì si può rispondere.',
          '',
          link,
        ].join('\n');
        window.open(linkWhatsApp(num, messaggio), '_blank', 'noopener');
        dirne('Si apre WhatsApp con il link della pagina del preventivo.');
        break;
      }

      case 'wa-cliente': {
        const s = this.istantanea();
        const num = numeroInternazionale(testo(s.telefono));
        if (!num) break;
        window.open(linkWhatsApp(num, this.testoPreventivo(s, this.calcola(s))), '_blank', 'noopener');
        dirne('Si apre WhatsApp con il preventivo già scritto: premi invio per mandarlo.');
        break;
      }

      case 'email-cliente': {
        const s = this.istantanea();
        const c = this.calcola(s);
        const oggetto = `Preventivo${testo(s['i.numero']) ? ` n. ${testo(s['i.numero'])}` : ''}${testo(s.nome) ? ` per ${testo(s.nome)}` : ''}`;
        window.location.href = linkEmail(testo(s.email), oggetto, this.testoPreventivo(s, c));
        dirne('Si apre la posta con il preventivo già scritto.');
        break;
      }

      case 'copia-preventivo': {
        const s = this.istantanea();
        const ok = await copia(this.testoPreventivo(s, this.calcola(s)));
        dirne(ok ? 'Preventivo copiato.' : 'Non riesco a copiare: apri la pagina da https o da localhost.');
        break;
      }

      case 'copia-appunti': {
        const s = this.istantanea();
        const ok = await copia(this.testoAppunti(s, this.calcola(s)));
        dirne(ok ? 'Appunti copiati.' : 'Non riesco a copiare: apri la pagina da https o da localhost.');
        break;
      }

      case 'stampa':
        this.ricalcola();
        window.print();
        break;
    }
  }

  private importaRichiesta() {
    const area = this.q<HTMLTextAreaElement>('[data-importa-testo]');
    const esito = this.q('[data-importa-esito]');
    const { valori, restanti } = importaMessaggio(area.value);
    const n = Object.keys(valori).length;

    if (!n) {
      esito.textContent = 'Non ho riconosciuto nessuna risposta: il messaggio è quello composto dal modulo?';
      return;
    }

    for (const [id, v] of Object.entries(valori)) scriviCampo(this.f, id, v);

    if (restanti.length) {
      const appunti = this.f.querySelector<HTMLTextAreaElement>('[name="i.appunti"]')!;
      appunti.value = `${appunti.value ? `${appunti.value}\n\n` : ''}Dal messaggio del cliente, non riconosciuto:\n${restanti.join('\n')}`;
    }

    esito.textContent = `${n} risposte importate${restanti.length ? `, ${restanti.length} righe messe negli appunti` : ''}. Controllale: le scelte non riconosciute restano vuote.`;
    area.value = '';
    this.cambiato();
  }

  private async importaFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    try {
      const dati = JSON.parse(await file.text()) as Archivio;
      if (!dati || !Array.isArray(dati.elenco)) throw new Error('formato');

      this.salva();
      let nuovi = 0;
      let aggiornati = 0;
      for (const m of dati.elenco) {
        if (!m || typeof m.id !== 'string' || typeof m.campi !== 'object') continue;
        const gia = this.archivio.elenco.find((x) => x.id === m.id);
        if (!gia) {
          this.archivio.elenco.push({ ...m, voci: m.voci ?? [], azioni: m.azioni ?? [] });
          nuovi += 1;
        } else if ((m.aggiornato ?? 0) > gia.aggiornato) {
          Object.assign(gia, { ...m, voci: m.voci ?? [], azioni: m.azioni ?? [] });
          aggiornati += 1;
        }
      }
      this.archivio.elenco.sort((a, b) => b.creato - a.creato);
      this.carica(this.archivio.elenco.find((m) => m.id === this.corrente.id) ?? this.archivio.elenco[0]);
      this.stato(`Importati ${nuovi} incontri nuovi e ${aggiornati} aggiornati.`);
    } catch {
      this.stato('Il file non è un’esportazione di questa pagina.');
    }
  }
}

export function avviaIncontroV2() {
  const radice = document.querySelector<HTMLElement>('[data-incontro]');
  if (!radice || radice.dataset.montato !== undefined) return;
  radice.dataset.montato = 'si';
  new Pannello(radice).avvia();
}
