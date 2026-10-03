/**
 * Il lato browser della pagina del preventivo (`/preventivo-proposta`).
 *
 * Legge i dati dal frammento dell'indirizzo, disegna le sezioni e tiene il
 * totale aggiornato mentre il cliente sceglie. Non invia niente: i pulsanti
 * aprono WhatsApp o la posta con il messaggio già scritto, e il messaggio parte
 * quando il cliente preme invio.
 *
 * Nel messaggio che torna a me ci sono SEMPRE la scelta e il totale: se
 * qualcuno modificasse i prezzi nel link, li confronto con i miei e lo vedo
 * subito. Il link, da solo, non è mai la fonte di verità.
 */
import { PACCHETTI, EXTRA, REGIMI, ALIQUOTA_RITENUTA } from '../data/richiesta.js';
import { decodifica, totali, eur, REGISTRI, registroDi, type Proposta } from './preventivo.ts';
import { copia, linkWhatsApp, linkEmail, LIMITE_WHATSAPP } from './richiesta.ts';

interface Riga {
  d: string;
  q: number;
  u: number;
  t: number;
}

const UNITA: Record<string, string> = { pagine: 'a pagina', lingue: 'a lingua', giri: 'a giro' };

const PACCHETTI_REALI = PACCHETTI.filter((p) => p.id !== 'misura').map((p) => p.id);

const SERVE_DI_BASE = [
  'Logo in alta qualità',
  'Foto del locale, dell’attività o dei lavori',
  'Orari e giorni di chiusura',
  'Menù, listino o elenco dei servizi',
];

const dataIt = (iso: string) => (iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT') : '');

const piuGiorni = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return d;
};

class Proposta_ {
  private readonly reg;
  private readonly regime;
  private readonly conPacchetti: boolean;
  private scelto = '';
  private readonly extra = new Map<string, { on: boolean; q: number }>();

  constructor(
    private readonly r: HTMLElement,
    private readonly p: Proposta
  ) {
    this.reg = REGISTRI[registroDi(p.reg)];
    this.regime = REGIMI.find((x) => x.id === p.rg) ?? REGIMI[0];
    this.conPacchetti = PACCHETTI_REALI.includes(p.cons);
    for (const e of p.ex) this.extra.set(e.id, { on: e.on === 1, q: Math.max(1, e.q) });
  }

  private q<T extends HTMLElement = HTMLElement>(sel: string): T {
    return this.r.querySelector<T>(sel)!;
  }

  private tutti<T extends HTMLElement = HTMLElement>(sel: string): T[] {
    return Array.from(this.r.querySelectorAll<T>(sel));
  }

  private modello(sel: string): HTMLElement {
    return this.q<HTMLTemplateElement>(sel).content.firstElementChild!.cloneNode(true) as HTMLElement;
  }

  private set(chiave: string, valore: string) {
    this.tutti(`[data-v="${chiave}"]`).forEach((el) => (el.textContent = valore));
  }

  /* ------------------------------ il disegno fisso ------------------------------ */

  monta() {
    const { p, reg } = this;

    /* Le parole che cambiano fra tu, lei e voi. */
    this.tutti('[data-r]').forEach((el) => {
      const k = el.dataset.r as keyof typeof reg;
      if (k in reg) el.textContent = reg[k];
    });

    const scadenza = piuGiorni(p.e, p.g);
    this.set('meta', `Preventivo${p.n ? ` n. ${p.n}` : ''} · emesso il ${dataIt(p.e)} · valido fino al ${scadenza.toLocaleDateString('it-IT')}`);
    this.set('titolo', p.a ? `Preventivo per ${p.a}.` : 'Preventivo.');
    this.set(
      'presentazione',
      `${reg.saluto}${p.r ? ` ${p.r}` : ''}. Qui c’è tutto: cosa si riceve, quanto costa, cosa serve da ${reg.te} e come si va avanti. Michele Modica, sviluppatore web a ${this.r.dataset.sede?.split(' (')[0] ?? ''}.`
    );

    if (scadenza.getTime() + 86_400_000 < Date.now()) {
      const el = this.q('[data-scaduto]');
      el.textContent = `Questo preventivo era valido fino al ${scadenza.toLocaleDateString('it-IT')}. Per confermare i prezzi basta un messaggio.`;
      el.hidden = false;
    }

    this.set('cosa', `Un sito per ${p.a || 'la tua attività'}, pensato per il telefono${p.u ? `, con la versione di prova che ${reg.hai} già visto` : ''}.`);
    this.set('quando', `Online in ${p.t}.`);
    this.set('giri', String(p.gi));
    this.set('validita', String(p.g));
    this.set('tempi-nota', `Tempi: ${p.t}.`);
    this.set('tempi-faq', `Di solito ${p.t}. Sotto la settimana non lavoro: comprimere si vede nel risultato.`);

    if (/^https?:\/\//i.test(p.u)) {
      this.q<HTMLAnchorElement>('[data-prova-link]').href = p.u;
      this.q('[data-prova]').hidden = false;
    }

    this.montaPacchetti();
    this.montaVoci();
    this.montaExtra();

    const serve = p.sv.length ? p.sv : SERVE_DI_BASE;
    this.q('[data-serve]').replaceChildren(
      ...serve.map((t) => Object.assign(document.createElement('li'), { textContent: t }))
    );

    const cond: [string, string][] = [
      ['Validità', `${p.g} giorni dalla data del preventivo.`],
      ['Pagamento', `${p.ac.toString().replace('.', ',')}% alla conferma, il resto alla consegna. Bonifico.`],
      ['Tempi', 'partono dal ricevimento del materiale.'],
      ['Modifiche', `${p.gi} giri inclusi; richieste ulteriori da concordare.`],
      ['Assistenza', `${p.as} giorni dopo la pubblicazione, inclusa.`],
      ['Proprietà', `a saldo avvenuto il sito e i contenuti forniti sono ${reg.tuoi}. Resta mio il diritto di mostrare il lavoro nel portfolio, salvo diversa indicazione scritta.`],
      ['Materiali', `foto, testi e marchi che ${reg.mandi} devono essere ${reg.tuoi} o usabili da ${reg.te}. Foto di persone: serve il loro consenso.`],
      ['Privacy', 'i dati che mi vengono dati servono solo a fare il sito. Il sito avrà la sua informativa, che preparo io.'],
    ];
    this.q('[data-condizioni]').replaceChildren(
      ...cond.map(([t, d]) => {
        const li = document.createElement('li');
        const b = document.createElement('strong');
        b.textContent = `${t}: `;
        li.append(b, d);
        return li;
      })
    );
    this.set('fiscale', `${this.regime.dicitura}${p.rit ? ` Compenso soggetto a ritenuta d’acconto del ${ALIQUOTA_RITENUTA}%.` : ''}`);

    const ass = p.ex.find((e) => e.id === 'assistenza' && e.p > 0);
    if (ass) {
      this.set('assistenza-prezzo', `${eur(ass.p)} l’anno`);
      this.q('[data-riga-assistenza]').hidden = false;
    }

    /* I numeri delle sezioni seguono quelle che si vedono davvero. */
    this.tutti('.sezione:not([hidden]) .titolo-sez .dato').forEach((el, i) => {
      el.textContent = String(i + 1).padStart(2, '0');
    });

    this.collega();
    this.ricalcola();

    this.q('[data-incompleto]').hidden = true;
    this.q('[data-contenuto]').hidden = false;
    this.q('[data-barra]').hidden = false;
  }

  private montaPacchetti() {
    if (!this.conPacchetti) return;
    const lista = this.q('[data-pacchetti]');

    for (const o of this.p.pk.filter((x) => x.p > 0)) {
      const def = PACCHETTI.find((x) => x.id === o.id);
      if (!def) continue;
      const el = this.modello('[data-t-pacchetto]');
      const campo = <T extends HTMLElement>(k: string) => el.querySelector<T>(`[data-p="${k}"]`)!;

      campo('nome').textContent = def.nome;
      campo('per').textContent = def.perChi;
      campo('prezzo').textContent = eur(o.p);
      campo('consigliato').textContent = o.id === this.p.cons ? `Consigliato per ${this.reg.te}` : '';
      campo('include').replaceChildren(
        ...def.include.map((t: string) => Object.assign(document.createElement('li'), { textContent: t }))
      );

      const input = el.querySelector<HTMLInputElement>('input')!;
      input.value = o.id;
      input.addEventListener('change', () => {
        this.scelto = o.id;
        this.ricalcola();
      });
      lista.appendChild(el);
    }

    this.q('[data-sez-pacchetti]').hidden = false;
  }

  private montaVoci() {
    if (!this.p.vv.length) return;
    this.q('[data-sez-voci] .titolo-sez').lastChild!.textContent = this.conPacchetti
      ? ' Incluso oltre al pacchetto'
      : ' Cosa comprende';

    this.q('[data-voci]').replaceChildren(
      ...this.p.vv.map((v) => {
        const li = this.modello('[data-t-riga]');
        li.querySelector('.r-d')!.textContent = v.q > 1 ? `${v.q} × ${v.d}` : v.d;
        li.querySelector('.r-t')!.textContent = eur(v.p * v.q);
        return li;
      })
    );
    this.q('[data-sez-voci]').hidden = false;
  }

  private montaExtra() {
    const offerti = this.p.ex.filter((e) => EXTRA.some((x) => x.id === e.id));
    if (!offerti.length) return;

    this.q('[data-extra]').replaceChildren(
      ...offerti.map((o) => {
        const def = EXTRA.find((x) => x.id === o.id)!;
        const el = this.modello('[data-t-extra]');
        const stato = this.extra.get(o.id)!;

        el.querySelector('[data-e="nome"]')!.textContent = def.nome;
        el.querySelector('[data-e="nota"]')!.textContent = def.nota ?? '';
        el.querySelector('[data-e="prezzo"]')!.textContent = `${eur(o.p)} ${
          def.ricorrente ? 'l’anno' : def.unita ? UNITA[def.unita] : 'una tantum'
        }`;

        const spunta = el.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
        spunta.checked = stato.on;
        spunta.addEventListener('change', () => {
          stato.on = spunta.checked;
          this.ricalcola();
        });

        const qta = el.querySelector<HTMLInputElement>('input[type="number"]')!;
        const riga = el.querySelector<HTMLElement>('.extra-q')!;
        if (def.unita) {
          qta.value = String(stato.q);
          qta.id = `q-${o.id}`;
          el.querySelector<HTMLElement>('[data-e="q-etichetta"]')!.setAttribute('for', qta.id);
          el.querySelector('[data-e="q-etichetta"]')!.textContent = `Quantità: ${def.nome}`;
          qta.addEventListener('input', () => {
            stato.q = Math.max(1, Math.floor(Number(qta.value)) || 1);
            this.ricalcola();
          });
        } else {
          riga.hidden = true;
        }
        return el;
      })
    );
    this.q('[data-sez-extra]').hidden = false;
  }

  /* ------------------------------ il calcolo ------------------------------ */

  /**
   * Lo sconto l'ho pensato per il pacchetto che ho proposto io: se il cliente ne
   * sceglie un altro, ad esempio uno che costa quanto lo sconto, non vale più.
   * Senza pacchetti da scegliere (a misura) vale sempre.
   */
  private scontoValido(pacchetto: string) {
    return !this.conPacchetti || pacchetto === this.p.cons;
  }

  private calcola(pacchetto: string) {
    const { p } = this;
    const righe: Riga[] = [];
    const annue: Riga[] = [];

    const def = PACCHETTI.find((x) => x.id === pacchetto);
    const prezzo = p.pk.find((x) => x.id === pacchetto);
    if (def && prezzo) {
      righe.push({
        d: `Sito ${def.nome} (${def.pagine === 1 ? 'una pagina' : `fino a ${def.pagine} pagine`})`,
        q: 1,
        u: prezzo.p,
        t: prezzo.p,
      });
    }
    for (const v of p.vv) righe.push({ d: v.d, q: v.q, u: v.p, t: v.p * v.q });

    for (const o of p.ex) {
      const e = EXTRA.find((x) => x.id === o.id);
      const s = this.extra.get(o.id);
      if (!e || !s?.on) continue;
      const q = e.unita ? s.q : 1;
      (e.ricorrente ? annue : righe).push({ d: e.nome, q, u: o.p, t: o.p * q });
    }

    const subtotale = righe.reduce((n, x) => n + x.t, 0);
    const t = totali(
      subtotale,
      this.scontoValido(pacchetto) ? { tipo: p.sc.tipo, val: p.sc.val } : { tipo: '', val: 0 },
      this.regime.iva,
      p.rit === 1 && this.regime.id === 'occasionale',
      ALIQUOTA_RITENUTA,
      p.ac
    );
    return { righe, annue, t, def };
  }

  private get puoAccettare() {
    return this.conPacchetti ? Boolean(this.scelto) : true;
  }

  private notaIva() {
    return this.regime.id === 'ordinario' ? 'IVA 22% inclusa' : 'senza IVA';
  }

  private ricalcola() {
    const { p } = this;
    const pronto = this.puoAccettare;
    const c = this.calcola(this.scelto);

    this.q('[data-attesa]').hidden = pronto;
    this.q('[data-conto]').hidden = !pronto;

    /* Il "Quanto" in cima e la barra: prima della scelta, il prezzo di partenza. */
    const consigliato = p.pk.find((x) => x.id === p.cons);
    const daPrezzo = consigliato ? `da ${eur(consigliato.p)}` : '—';
    const cifra = pronto ? eur(c.t.totale) : daPrezzo;
    this.set('quanto', `${cifra}${pronto || consigliato ? ` · ${this.notaIva()}` : ''}`);
    this.set('barra-etichetta', pronto ? 'Totale' : 'Prezzo');
    this.set('barra-cifra', cifra);

    this.tutti<HTMLButtonElement>('[data-azione="accetto"]').forEach((b) => (b.disabled = !pronto));
    this.q('[data-barra-accetto]').hidden = !pronto;
    this.q('[data-barra-pacchetti]').hidden = pronto;

    if (!pronto) return;

    const riempi = (ul: HTMLElement, righe: Riga[]) =>
      ul.replaceChildren(
        ...righe.map((x) => {
          const li = this.modello('[data-t-riga]');
          li.querySelector('.r-d')!.textContent = x.q > 1 ? `${x.q} × ${x.d}` : x.d;
          li.querySelector('.r-t')!.textContent = eur(x.t);
          return li;
        })
      );
    riempi(this.q('[data-righe]'), c.righe);
    riempi(this.q('[data-righe-annue]'), c.annue);
    this.q('[data-annue]').hidden = c.annue.length === 0;

    const riga = (k: string, visibile: boolean) => {
      this.q(`[data-riga="${k}"]`).hidden = !visibile;
    };
    const conSconto = c.t.sconto > 0;
    const conIva = c.t.iva > 0;
    this.q('[data-nota-sconto]').hidden = conSconto || p.sc.tipo === '' || p.sc.val <= 0;
    riga('subtotale', conSconto || conIva);
    riga('sconto', conSconto);
    riga('imponibile', conIva && conSconto);
    riga('iva', conIva);
    riga('ritenuta', c.t.ritenuta > 0);
    riga('netto', c.t.ritenuta > 0);

    this.set('subtotale', eur(c.t.subtotale));
    this.set('sconto-nome', p.sc.m ? `Sconto · ${p.sc.m}` : 'Sconto');
    this.set('sconto', `−${eur(c.t.sconto)}`);
    this.set('imponibile', eur(c.t.imponibile));
    this.set('iva-nome', `IVA ${this.regime.iva}%`);
    this.set('iva', eur(c.t.iva));
    this.set('totale', eur(c.t.totale));
    this.set('ritenuta', `−${eur(c.t.ritenuta)}`);
    this.set('netto', eur(c.t.netto));
    this.set('acconto-nome', `Acconto alla conferma · ${p.ac.toString().replace('.', ',')}%`);
    this.set('acconto', eur(c.t.acconto));
    this.set('saldo', eur(c.t.saldo));
    this.set('regime', `Totale ${this.notaIva()}.`);
  }

  /* ------------------------------ i messaggi ------------------------------ */

  private riferimento() {
    const { p } = this;
    return `${p.n ? `n. ${p.n} ` : ''}per ${p.a || 'la mia attività'}`.trim();
  }

  private messaggioAccetto(conLink: boolean) {
    const { p } = this;
    const c = this.calcola(this.scelto);
    const def = c.def;
    const scelti = p.ex.flatMap((o) => {
      const e = EXTRA.find((x) => x.id === o.id);
      const st = this.extra.get(o.id);
      return e && st?.on ? [{ e, q: e.unita ? st.q : 1 }] : [];
    });
    const extra = scelti
      .filter((x) => !x.e.ricorrente)
      .map((x) => `${x.q > 1 ? `${x.q} × ` : ''}${x.e.nome}`);
    const voci = p.vv.map((v) => `${v.q > 1 ? `${v.q} × ` : ''}${v.d}`);
    const annue = scelti.filter((x) => x.e.ricorrente).map((x) => x.e.nome);

    const righe = [
      `Buongiorno Michele, ho letto il preventivo ${this.riferimento()} e vorrei procedere.`,
      '',
      ...(def ? [`Pacchetto: ${def.nome}`] : []),
      `Extra: ${extra.length ? extra.join(', ') : 'nessuno'}`,
      ...(voci.length ? [`Voci a parte: ${voci.join(', ')}`] : []),
      ...(annue.length ? [`Facoltativi annuali: ${annue.join(', ')}`] : []),
      `Totale: ${eur(c.t.totale)} (${this.notaIva()})`,
      ...(c.t.ritenuta > 0 ? [`Netto da pagare: ${eur(c.t.netto)}`] : []),
      '',
      'Come facciamo per l’acconto?',
    ];
    if (conLink) righe.push('', `Preventivo: ${window.location.href}`);
    return righe.join('\n');
  }

  /* ------------------------------ gli eventi ------------------------------ */

  private mostra(testo: string, nota: string) {
    this.q<HTMLTextAreaElement>('[data-uscita-testo]').value = testo;
    this.q('[data-uscita-stato]').textContent = nota;
    const uscita = this.q('[data-uscita]');
    uscita.hidden = false;
    uscita.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private collega() {
    this.r.addEventListener('click', async (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-azione]');
      if (!b) return;
      const azione = b.dataset.azione;
      const numero = this.r.dataset.whatsapp!;

      switch (azione) {
        case 'accetto': {
          if (!this.puoAccettare) break;
          /* Il link dentro il messaggio è comodo ma facoltativo: se lo fa
             superare la soglia di WhatsApp, si manda senza. La scelta e il
             totale, che sono quelli che contano, ci sono sempre. */
          let testo = this.messaggioAccetto(true);
          if (testo.length > LIMITE_WHATSAPP) testo = this.messaggioAccetto(false);
          this.mostra(testo, 'Si sta aprendo WhatsApp con il messaggio già scritto: premi invio per mandarlo.');
          window.location.href = linkWhatsApp(numero, testo);
          break;
        }

        case 'email': {
          const base = this.puoAccettare
            ? `${this.messaggioAccetto(false)}\n\nCordiali saluti,\n${this.p.r || this.p.a}`
            : `Buongiorno Michele, scrivo per il preventivo ${this.riferimento()}.\n\n`;
          const oggetto = this.puoAccettare
            ? `Preventivo ${this.riferimento()}: vorrei procedere`
            : `Preventivo ${this.riferimento()}`;
          this.mostra(base, 'Si sta aprendo la tua posta con il messaggio già scritto: premi invia.');
          window.location.href = linkEmail(this.r.dataset.email!, oggetto, base);
          break;
        }

        case 'domanda': {
          /* La riga finisce con un'a capo vuota, così si scrive subito sotto. */
          const testo = `Buongiorno Michele, ho una domanda sul preventivo ${this.riferimento()}:\n\n`;
          this.mostra(testo, 'Si sta aprendo WhatsApp: scrivi la domanda sotto la prima riga.');
          window.location.href = linkWhatsApp(numero, testo);
          break;
        }

        case 'copia-uscita': {
          const ok = await copia(this.q<HTMLTextAreaElement>('[data-uscita-testo]').value);
          this.q('[data-uscita-stato]').textContent = ok
            ? 'Copiato. Incollalo nella chat o nella mail.'
            : 'Non riesco a copiare da solo: seleziona il testo qui sotto e copialo.';
          break;
        }

        case 'stampa':
          window.print();
          break;
      }
    });

    this.q('[data-barra-pacchetti]').addEventListener('click', () => {
      this.q('#pacchetti').scrollIntoView({ behavior: 'smooth' });
    });

    /* Su carta le domande chiuse non si leggono: si aprono tutte. */
    window.addEventListener('beforeprint', () => {
      this.tutti<HTMLDetailsElement>('.faq details').forEach((d) => (d.open = true));
    });
  }
}

export async function avviaProposta() {
  const radice = document.querySelector<HTMLElement>('[data-proposta]');
  if (!radice || radice.dataset.montato !== undefined) return;
  radice.dataset.montato = 'si';

  const frammento = window.location.hash.slice(1);
  const proposta = await decodifica(frammento);
  if (!proposta) {
    /* Tre cose diverse, e dirle bene serve a chi legge: un indirizzo aperto
       senza il suo link non è un link rotto, e un browser vecchio non è colpa
       di nessuno. */
    const titolo = radice.querySelector('[data-incompleto-titolo]')!;
    const testo = radice.querySelector('[data-incompleto-testo]')!;
    if (frammento.startsWith('z.') && typeof DecompressionStream === 'undefined') {
      titolo.textContent = 'Questo browser non riesce ad aprirlo.';
      testo.textContent =
        'Il preventivo si legge con una versione recente di Chrome, Safari, Edge o Firefox. Aprilo da lì, oppure scrivimi e ti mando il testo.';
    } else if (frammento) {
      titolo.textContent = 'Questo link non è completo.';
      testo.textContent =
        'Succede quando un link lungo viene tagliato da un’app. Scrivimi e te lo rimando.';
    }
    return;
  }

  new Proposta_(radice, proposta).monta();
}
