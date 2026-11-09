/**
 * La voce nell'incontro: registra l'audio e lo conserva su questo dispositivo.
 *
 * L'AUDIO è la cosa che conta: è quello che si dà a un'AI in un secondo momento.
 * Lo registra MediaRecorder e resta in IndexedDB. La trascrizione NON si fa qui e
 * non si fa mentre si parla: il riconoscimento vocale del browser si contende il
 * microfono con la registrazione (su telefono, soprattutto) e mandava l'audio a
 * Google o Apple. Si fa dopo, sull'audio già salvato (vedi trascrivi.ts).
 *
 * Una registrazione alla volta: il microfono è uno.
 */

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
  /** il testo trascritto dall'audio, vuoto se non è ancora stata trascritta (o se era silenzio) */
  testo: string;
  trascritta: boolean;
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
  /* Le registrazioni fatte prima che esistesse la trascrizione dall'audio non hanno `trascritta`. */
  return tutte.map((p) => ({ ...p, trascritta: p.trascritta === true })).sort((a, b) => a.creato - b.creato);
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

/* ------------------------------ la sessione ------------------------------ */

interface Callback {
  /** `attiva` = sto registrando. Il messaggio dice cosa succede. */
  stato: (attiva: boolean, messaggio: string) => void;
}

export interface Risultato {
  blob: Blob;
  mime: string;
  durata: number;
  incompleta: boolean;
}

export class Sessione {
  attiva = false;
  private stream: MediaStream | null = null;
  private rec: MediaRecorder | null = null;
  private pezzi: Blob[] = [];
  private inizio = 0;
  private incompleta = false;

  constructor(private readonly cb: Callback) {}

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
    this.incompleta = false;
    this.rec.ondataavailable = (e) => {
      if (e.data.size) this.pezzi.push(e.data);
    };

    /* Se un'altra app si prende il microfono la traccia si ferma e l'audio avrebbe un
       buco. Lo segno, così la registrazione dice che è incompleta invece di sembrare buona. */
    for (const traccia of this.stream.getAudioTracks()) {
      const segna = () => {
        if (!this.attiva) return;
        this.incompleta = true;
        this.cb.stato(true, 'Il microfono si è interrotto: l’audio può avere dei buchi.');
      };
      traccia.onmute = segna;
      traccia.onended = segna;
    }

    this.inizio = Date.now();
    this.rec.start(1000);
    this.attiva = true;
    this.cb.stato(true, 'Sto registrando.');
    return true;
  }

  async ferma(): Promise<Risultato | null> {
    if (!this.attiva || !this.rec) return null;
    this.attiva = false;

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
    this.cb.stato(false, 'Registrazione salvata.');

    const tipo = rec.mimeType || 'audio/webm';
    return {
      blob: new Blob(this.pezzi, { type: tipo }),
      mime: tipo,
      durata: Date.now() - this.inizio,
      incompleta: this.incompleta,
    };
  }

  private chiudiMicrofono() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }
}
