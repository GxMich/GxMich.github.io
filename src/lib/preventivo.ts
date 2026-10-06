/**
 * Quello che l'incontro e la pagina del preventivo hanno in comune: il calcolo
 * dei totali, il modo di parlare al cliente e il pacchetto di dati che viaggia
 * nel link.
 *
 * Il calcolo sta qui, una volta sola, perché le due pagine devono dare la
 * stessa cifra al centesimo: una che arrotonda diversamente dall'altra farebbe
 * trovare al cliente un totale che non è quello che ho in mente io.
 *
 * I dati del preventivo viaggiano nel frammento dell'indirizzo, quello dopo il
 * `#`: il browser non lo manda mai al server, quindi i prezzi di un cliente non
 * finiscono in nessun archivio, né mio né di chi ospita il sito. Nel pacchetto
 * ci sono solo cose che il cliente può vedere. Niente ore, niente tariffa,
 * niente appunti.
 */

/* ------------------------------ come ci si parla ------------------------------ */

/** Poche parole cambiano fra tu, lei e voi: le tengo in una tabella sola. */
export const REGISTRI = {
  tu: { saluto: 'Ciao', te: 'te', ti: 'ti', paghi: 'paghi', tuoi: 'tuoi', mandi: 'mandi', hai: 'hai', vuoi: 'vuoi' },
  lei: { saluto: 'Buongiorno', te: 'lei', ti: 'le', paghi: 'paga', tuoi: 'suoi', mandi: 'manda', hai: 'ha', vuoi: 'vuole' },
  voi: { saluto: 'Buongiorno', te: 'voi', ti: 'vi', paghi: 'pagate', tuoi: 'vostri', mandi: 'mandate', hai: 'avete', vuoi: 'volete' },
} as const;

export type Registro = keyof typeof REGISTRI;

export const registroDi = (v: unknown): Registro => (v === 'lei' || v === 'voi' ? v : 'tu');

/* ------------------------------ il calcolo ------------------------------ */

export interface Sconto {
  tipo: 'euro' | 'perc' | '';
  /** euro o percentuale, non centesimi */
  val: number;
}

export interface Totali {
  subtotale: number;
  sconto: number;
  imponibile: number;
  iva: number;
  totale: number;
  ritenuta: number;
  netto: number;
  acconto: number;
  saldo: number;
}

/** Tutto in centesimi interi: 0,1 + 0,2 in virgola mobile non fa 0,3. */
export function totali(
  subtotale: number,
  sconto: Sconto,
  aliquotaIva: number,
  ritenuta: boolean,
  aliquotaRitenuta: number,
  accontoPerc: number
): Totali {
  const v = Math.max(sconto.val, 0);
  let scontato = 0;
  if (sconto.tipo === 'euro') scontato = Math.min(Math.round(v * 100), subtotale);
  if (sconto.tipo === 'perc') scontato = Math.round((subtotale * Math.min(v, 100)) / 100);

  const imponibile = subtotale - scontato;
  const iva = Math.round((imponibile * aliquotaIva) / 100);
  const totale = imponibile + iva;
  const trattenuta = ritenuta ? Math.round((imponibile * aliquotaRitenuta) / 100) : 0;
  const acconto = Math.round((totale * Math.min(100, Math.max(0, accontoPerc))) / 100);

  return {
    subtotale,
    sconto: scontato,
    imponibile,
    iva,
    totale,
    ritenuta: trattenuta,
    netto: totale - trattenuta,
    acconto,
    saldo: totale - acconto,
  };
}

/* ------------------------------ la suddivisione dei soldi ------------------------------ */

export interface Pagamento {
  nome: string;
  /** quanto vale il pagamento nel preventivo */
  lordo: number;
  /** ritenuta d'acconto che il cliente versa allo Stato */
  ritenuta: number;
  /** la mia quota di INPS, che il cliente mi trattiene */
  inps: number;
  /** quello che arriva a me, bollo escluso */
  netto: number;
  /** marca da bollo da rimborsare, 0 se non dovuta */
  bollo: number;
}

export interface Divisione {
  pagamenti: Pagamento[];
  ritenuta: number;
  /** contributo INPS totale, sulla parte oltre la franchigia */
  inps: number;
  inpsCliente: number;
  inpsMia: number;
  bolli: number;
  bollo: number;
  /** quello che incasso: netto più il bollo rimborsato */
  aMe: number;
  /** quello che il cliente versa allo Stato e all'INPS con l'F24 */
  alFisco: number;
  /** quello che il cliente spende in tutto */
  spesaCliente: number;
}

/**
 * Chi riceve cosa. Ritenuta e INPS si ripartiscono fra acconto e saldo in
 * proporzione, e l'ultimo pagamento prende il resto: così la somma torna al
 * centesimo con il totale, qualunque sia l'arrotondamento.
 *
 * @param inps contributo INPS totale in centesimi (0 se non dovuto)
 * @param bollo marca da bollo a carico del cliente, e quale importo/soglia
 */
export function divisione(
  t: Totali,
  inps: number,
  bollo: { attivo: boolean; importo: number; sopra: number }
): Divisione {
  const inpsMia = Math.round(inps / 3);
  const inpsCliente = inps - inpsMia;
  const parti: [string, number][] = [
    ['Acconto alla conferma', t.acconto],
    ['Saldo alla consegna', t.saldo],
  ];

  let ritDate = 0;
  let inpsDate = 0;
  const pagamenti: Pagamento[] = parti
    .filter(([, lordo]) => lordo > 0)
    .map(([nome, lordo], i, tutte) => {
      const ultimo = i === tutte.length - 1;
      const quota = t.totale > 0 ? lordo / t.totale : 0;
      const ritenuta = ultimo ? t.ritenuta - ritDate : Math.round(t.ritenuta * quota);
      const miaInps = ultimo ? inpsMia - inpsDate : Math.round(inpsMia * quota);
      ritDate += ritenuta;
      inpsDate += miaInps;
      return {
        nome,
        lordo,
        ritenuta,
        inps: miaInps,
        netto: lordo - ritenuta - miaInps,
        bollo: bollo.attivo && lordo > bollo.sopra ? bollo.importo : 0,
      };
    });

  const bolli = pagamenti.filter((p) => p.bollo > 0).length;
  const bolloTot = pagamenti.reduce((n, p) => n + p.bollo, 0);
  const aMe = pagamenti.reduce((n, p) => n + p.netto, 0) + bolloTot;
  const alFisco = t.ritenuta + inps;

  return {
    pagamenti,
    ritenuta: t.ritenuta,
    inps,
    inpsCliente,
    inpsMia,
    bolli,
    bollo: bolloTot,
    aMe,
    alFisco,
    spesaCliente: t.totale + inpsCliente + bolloTot,
  };
}

export const eur = (c: number) =>
  `${(c / 100).toLocaleString('it-IT', { minimumFractionDigits: c % 100 === 0 ? 0 : 2, maximumFractionDigits: 2 })} €`;

/* ------------------------------ il pacchetto nel link ------------------------------ */

/**
 * Chiavi corte di proposito: il link finisce in un messaggio WhatsApp e ogni
 * carattere in più è un'occasione di vederlo tagliato.
 * Tutti i prezzi sono in centesimi.
 */
export interface Proposta {
  v: 1;
  /** numero del preventivo */
  n: string;
  /** emesso il, AAAA-MM-GG */
  e: string;
  /** giorni di validità */
  g: number;
  /** nome dell'attività, referente, comune */
  a: string;
  r: string;
  c: string;
  /** registro */
  reg: Registro;
  /** indirizzo della versione di prova */
  u: string;
  /** regime fiscale, ritenuta */
  rg: string;
  rit: 0 | 1;
  /** acconto %, giri di modifica, giorni di assistenza, tempi a parole */
  ac: number;
  gi: number;
  as: number;
  t: string;
  /** i pacchetti in offerta */
  pk: { id: string; p: number }[];
  /** il pacchetto proposto: id, "misura" se si compone a voci, "" se non c'è */
  cons: string;
  /** gli extra: prezzo di una unità, quantità, se sono già nella proposta */
  ex: { id: string; p: number; q: number; on: 0 | 1 }[];
  /** voci a parte, già incluse e non modificabili dal cliente */
  vv: { d: string; q: number; p: number }[];
  /** sconto */
  sc: { tipo: 'euro' | 'perc' | ''; val: number; m: string };
  /** cosa serve dal cliente */
  sv: string[];
}

const base64url = (b: Uint8Array) => {
  let s = '';
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const daBase64url = (s: string) => {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};

const comprimi = async (dati: Uint8Array, formato: 'compress' | 'decompress') => {
  const T = formato === 'compress' ? CompressionStream : DecompressionStream;
  const flusso = new Blob([dati as BlobPart]).stream().pipeThrough(new T('deflate-raw'));
  return new Uint8Array(await new Response(flusso).arrayBuffer());
};

/**
 * "z." = compresso, "j." = JSON semplice. Dove il browser non sa comprimere si
 * ripiega sul secondo: il link è più lungo ma si legge ovunque.
 */
export async function codifica(p: Proposta): Promise<string> {
  const grezzo = new TextEncoder().encode(JSON.stringify(p));
  if (typeof CompressionStream !== 'undefined') {
    try {
      return `z.${base64url(await comprimi(grezzo, 'compress'))}`;
    } catch {
      /* si ripiega sul semplice */
    }
  }
  return `j.${base64url(grezzo)}`;
}

/** Restituisce null se il link è tagliato o non è un preventivo: mai un errore. */
export async function decodifica(frammento: string): Promise<Proposta | null> {
  try {
    const [tipo, corpo] = [frammento.slice(0, 2), frammento.slice(2)];
    let byte = daBase64url(corpo);
    if (tipo === 'z.') byte = await comprimi(byte, 'decompress');
    else if (tipo !== 'j.') return null;

    const p = JSON.parse(new TextDecoder().decode(byte)) as Proposta;
    if (!p || p.v !== 1 || !Array.isArray(p.pk) || !Array.isArray(p.ex) || !Array.isArray(p.vv)) return null;
    return p;
  } catch {
    return null;
  }
}
