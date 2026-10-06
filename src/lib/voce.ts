/**
 * La voce nell'incontro: registra l'audio e, dove il browser lo permette, lo
 * trascrive in diretta. Le due cose sono separate di proposito.
 *
 *  - L'AUDIO è la cosa che conta: è quello che si dà a un'AI in un secondo
 *    momento, e non dipende da nessun servizio. Lo registra MediaRecorder e
 *    resta in IndexedDB, su questo dispositivo.
 *  - La TRASCRIZIONE LIVE è un di più, e serve a riempire i campi mentre si parla.
 *    Usa il riconoscimento del browser (vedi trascrizione.ts), che manda
 *    l'audio al servizio del produttore del browser. Se non parte, o se su
 *    telefono il microfono non si lascia dividere con la registrazione, l'audio
 *    si registra lo stesso: è per questo che si può spegnere (`trascrivi: false`).
 *
 * Una registrazione alla volta: il microfono è uno.
 */
import { Trascrizione, trascrizioneDisponibile } from './trascrizione.ts';

/* ------------------------------ le registrazioni ------------------------------ */

export interface Presa {
  id: string;
  incontro: string;
  /** id del campo a cui appartiene, o `_incontro` per quella dell'intero incontro */
  campo: string;
  creato: number;
  /** millisecondi */
  durata: number;
  mime: string;
  blob: Blob;
  testo: string;
  /** il microfono si è interrotto mentre registrava: l'audio può avere buchi */
  incompleta: boolean;
}

export const INCONTRO_INTERO = '_incontro';

const NOME_DB = 'incontri-audio';
const NEGOZIO = 'prese';

export const registrazioneDisponibile = () =>
  typeof indexedDB !== 'undefined' &&
  typeof MediaRecorder !== 'undefined' &&
  Boolean(navigator.mediaDevices?.getUserMedia);

export { trascrizioneDisponibile };

const apriDb = () =>
  new Promise<IDBDatabase>((ok, no) => {
    const r = indexedDB.open(NOME_DB, 1);
    r.onupgradeneeded = () => {
      const negozio = r.result.createObjectStore(NEGOZIO, { keyPath: 'id' });
      negozio.createIndex('incontro', 'incontro');
    };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  });

const transazione = async <T>(modo: IDBTransactionMode, uso: (n: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
  const db = await apriDb();
  try {
    return await new Promise<T>((ok, no) => {
      const t = db.transaction(NEGOZIO, modo);
      const q = uso(t.objectStore(NEGOZIO));
      t.oncomplete = () => ok(q.result);
      t.onerror = () => no(t.error);
      t.onabort = () => no(t.error);
    });
  } finally {
    db.close();
  }
};

export const salvaPresa = (p: Presa) => transazione('readwrite', (n) => n.put(p));

export const preseDi = async (incontro: string): Promise<Presa[]> => {
  const tutte = await transazione('readonly', (n) => n.index('incontro').getAll(incontro) as IDBRequest<Presa[]>);
  return tutte.sort((a, b) => a.creato - b.creato);
};

export const eliminaPresa = (id: string) => transazione('readwrite', (n) => n.delete(id));

export async function eliminaPreseDi(incontro: string) {
  for (const p of await preseDi(incontro)) await eliminaPresa(p.id);
}

/* ------------------------------ piccole utilità ------------------------------ */

export const durataLeggibile = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export const estensione = (mime: string) =>
  mime.includes('mp4') || mime.includes('aac') ? 'm4a' : mime.includes('ogg') ? 'ogg' : 'webm';

const scegliMime = () =>
  ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find((m) => MediaRecorder.isTypeSupported(m)) ??
  '';

const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------ la sessione ------------------------------ */

interface Callback {
  /** Una frase conclusa dal riconoscitore. */
  finale: (testo: string) => void;
  /** Quello che sta dicendo adesso, ancora provvisorio. */
  provvisorio: (testo: string) => void;
  /** `attiva` = sto registrando. Il messaggio dice cosa succede, anche a trascrizione ferma. */
  stato: (attiva: boolean, messaggio: string) => void;
}

export interface Risultato {
  blob: Blob;
  mime: string;
  durata: number;
  testo: string;
  incompleta: boolean;
}

export class Sessione {
  attiva = false;
  private stream: MediaStream | null = null;
  private rec: MediaRecorder | null = null;
  private pezzi: Blob[] = [];
  private inizio = 0;
  private incompleta = false;
  private frasi: string[] = [];
  private trascr: Trascrizione | null = null;

  constructor(
    private readonly cb: Callback,
    private readonly trascrivi: boolean
  ) {}

  async avvia(): Promise<boolean> {
    if (!registrazioneDisponibile()) {
      this.cb.stato(false, 'Questo browser non sa registrare l’audio: usa Chrome, Edge o Safari.');
      return false;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch (e) {
      const nome = (e as DOMException).name;
      this.cb.stato(
        false,
        nome === 'NotAllowedError' || nome === 'SecurityError'
          ? 'Il microfono è bloccato: consentilo dal lucchetto vicino all’indirizzo e riprova.'
          : nome === 'NotFoundError'
            ? 'Non trovo nessun microfono.'
            : 'Non riesco ad accendere il microfono: controlla che nessun’altra app lo stia usando.'
      );
      return false;
    }

    const mime = scegliMime();
    try {
      this.rec = new MediaRecorder(this.stream, mime ? { mimeType: mime, audioBitsPerSecond: 32000 } : undefined);
    } catch {
      this.chiudiMicrofono();
      this.cb.stato(false, 'Questo browser non sa registrare l’audio.');
      return false;
    }

    this.pezzi = [];
    this.frasi = [];
    this.incompleta = false;
    this.rec.ondataavailable = (e) => {
      if (e.data.size) this.pezzi.push(e.data);
    };

    /* Se un'altra app (o il riconoscimento vocale, su telefono) si prende il
       microfono, la traccia si ferma e l'audio avrebbe un buco. Lo segno, così
       la registrazione dice che è incompleta invece di sembrare buona. */
    for (const traccia of this.stream.getAudioTracks()) {
      const segna = () => {
        if (!this.attiva) return;
        this.incompleta = true;
        this.cb.stato(true, 'Il microfono si è interrotto: l’audio può avere dei buchi. Se succede sempre, spegni «Trascrivi mentre registro».');
      };
      traccia.onmute = segna;
      traccia.onended = segna;
    }

    this.inizio = Date.now();
    this.rec.start(1000);
    this.attiva = true;

    if (this.trascrivi && trascrizioneDisponibile()) {
      this.trascr = new Trascrizione({
        finale: (t) => {
          this.frasi.push(t);
          this.cb.finale(t);
        },
        provvisorio: this.cb.provvisorio,
        stato: (attiva, messaggio) => {
          if (!this.attiva) return;
          /* La trascrizione può cadere senza che cada l'audio: lo si dice, e si continua. */
          this.cb.stato(
            true,
            attiva ? 'Registro e trascrivo…' : `Registro l’audio, ma la trascrizione in diretta si è fermata: ${messaggio}`
          );
        },
      });
      this.trascr.avvia();
      this.cb.stato(true, 'Registro e trascrivo…');
    } else {
      this.cb.stato(
        true,
        this.trascrivi ? 'Registro l’audio. Questo browser non trascrive in diretta.' : 'Registro l’audio, senza trascrizione in diretta.'
      );
    }
    return true;
  }

  async ferma(): Promise<Risultato | null> {
    if (!this.attiva || !this.rec) return null;
    this.attiva = false;
    this.trascr?.ferma();

    const rec = this.rec;
    const finito = new Promise<void>((ok) => {
      if (rec.state === 'inactive') return ok();
      rec.onstop = () => ok();
    });
    try {
      rec.stop();
    } catch {
      /* già fermo */
    }
    await finito;
    this.chiudiMicrofono();

    /* Il riconoscitore può consegnare l'ultima frase dopo lo stop. */
    if (this.trascr) await pausa(400);
    this.cb.provvisorio('');
    this.cb.stato(false, 'Registrazione salvata.');

    const tipo = rec.mimeType || 'audio/webm';
    return {
      blob: new Blob(this.pezzi, { type: tipo }),
      mime: tipo,
      durata: Date.now() - this.inizio,
      testo: this.frasi.join(' '),
      incompleta: this.incompleta,
    };
  }

  private chiudiMicrofono() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }
}
