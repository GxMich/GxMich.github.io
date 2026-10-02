/**
 * La pagina dell'incontro: porta con password, appunti, calcolo del prezzo.
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
 */
import {
  EXTRA,
  PACCHETTI,
  CONDIZIONI,
  REGIMI,
  MATERIALI,
  STATI_MATERIALE,
  ALIQUOTA_RITENUTA,
} from '../data/richiesta.js';
import { apri, cifraturaDisponibile, type Cifrato } from './cifratura.ts';
import { REGISTRI, registroDi, totali, eur, codifica, type Proposta } from './preventivo.ts';
import {
  leggiCampo,
  scriviCampo,
  leggiRichiesta,
  importaMessaggio,
  componiMessaggio,
  linkWhatsApp,
  linkEmail,
  numeroInternazionale,
  copia,
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
  controlli: string[];
}

type Istantanea = Record<string, Valore>;

/* ============================== costanti ============================== */

const CHIAVE_ARCHIVIO = 'incontri-v1';
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
    this.corrente = m;
    this.azioni = m.azioni.map((a) => ({ ...a }));

    for (const nome of this.nomi) scriviCampo(this.f, nome, m.campi[nome] ?? this.base[nome] ?? '');
    this.renderVoci(m.voci);
    this.renderAzioni();

    this.archivio.attivo = m.id;
    this.salvaArchivio();
    this.aggiornaElenco();
    this.ricalcola();
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
      righe.push(`Ritenuta d’acconto ${ALIQUOTA_RITENUTA}%: −${eur(c.ritenuta)}, netto da pagare ${eur(c.netto)}.`);
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
      <p class="fg-piccolo">${esc(c.regime.dicitura)}${c.ritenuta > 0 ? ` Ritenuta d’acconto ${ALIQUOTA_RITENUTA}%: ${eur(c.ritenuta)}; netto da pagare ${eur(c.netto)}.` : ''}</p>

      <div class="fg-sez">
        <div class="fg-et">Come si paga</div>
        <p>Alla conferma ${pc}%: <b>${eur(c.acconto)}</b>. Alla consegna il resto: <b>${eur(c.saldo)}</b>. Pagamento con bonifico.</p>
      </div>

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

export function avviaIncontro() {
  const radice = document.querySelector<HTMLElement>('[data-incontro]');
  if (!radice || radice.dataset.montato !== undefined) return;
  radice.dataset.montato = 'si';
  new Pannello(radice).avvia();
}
