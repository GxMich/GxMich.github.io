/**
 * Trascrivere un'audio registrata, sul dispositivo (vedi trascrivi-worker.ts).
 *
 * Una trascrizione alla volta: il modello è uno, e due insieme si rubano la memoria,
 * che su un telefono è poca. Le richieste si mettono in fila.
 */

export const MODELLI = {
  veloce: { id: 'onnx-community/whisper-base', descrizione: 'Veloce · scarica circa 80 MB la prima volta' },
  migliore: { id: 'onnx-community/whisper-small', descrizione: 'Più precisa · circa 250 MB, più lenta' },
} as const;

export type ModelloScelto = keyof typeof MODELLI;

export const trascrizioneLocaleDisponibile = () =>
  typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined' && typeof AudioContext !== 'undefined';

/** Whisper vuole l'audio a 16.000 Hz, un solo canale: lo decodifica e ricampiona il browser. */
async function decodifica(blob: Blob): Promise<Float32Array> {
  const contesto = new AudioContext({ sampleRate: 16000 });
  try {
    const buffer = await contesto.decodeAudioData(await blob.arrayBuffer());
    const canali = Array.from({ length: buffer.numberOfChannels }, (_, i) => buffer.getChannelData(i));
    if (canali.length === 1) return new Float32Array(canali[0]);

    const mono = new Float32Array(buffer.length);
    for (const c of canali) for (let i = 0; i < mono.length; i += 1) mono[i] += c[i] / canali.length;
    return mono;
  } finally {
    void contesto.close();
  }
}

type Avanzamento = (messaggio: string, percento: number | null) => void;

export class Trascrittore {
  private worker: Worker | null = null;
  private numero = 0;
  private fila: Promise<unknown> = Promise.resolve();

  trascrivi(blob: Blob, modello: ModelloScelto, avanzamento: Avanzamento): Promise<string> {
    const lavoro = this.fila.then(() => this.esegui(blob, modello, avanzamento));
    /* Un errore non deve bloccare le trascrizioni dopo: la fila va avanti. */
    this.fila = lavoro.catch(() => undefined);
    return lavoro;
  }

  private async esegui(blob: Blob, modello: ModelloScelto, avanzamento: Avanzamento): Promise<string> {
    avanzamento('Preparo l’audio…', null);
    const audio = await decodifica(blob);
    if (audio.length < 1600) return '';

    this.worker ??= new Worker(new URL('./trascrivi-worker.ts', import.meta.url), { type: 'module' });
    const worker = this.worker;
    this.numero += 1;
    const id = this.numero;

    return new Promise<string>((ok, no) => {
      const ascolta = (e: MessageEvent<{ id: number; tipo: string; msg?: string; percento?: number; testo?: string }>) => {
        const m = e.data;
        if (m.id !== id) return;
        if (m.tipo === 'stato') avanzamento(m.msg ?? '', null);
        else if (m.tipo === 'progresso') avanzamento('Scarico il modello', m.percento ?? 0);
        else {
          worker.removeEventListener('message', ascolta);
          worker.removeEventListener('error', errore);
          if (m.tipo === 'fine') ok(m.testo ?? '');
          else no(new Error(m.msg ?? 'errore sconosciuto'));
        }
      };
      const errore = (e: ErrorEvent) => {
        worker.removeEventListener('message', ascolta);
        worker.removeEventListener('error', errore);
        /* Un worker caduto non si riusa: la prossima volta se ne crea uno nuovo. */
        worker.terminate();
        this.worker = null;
        no(new Error(e.message || 'il trascrittore si è fermato'));
      };
      worker.addEventListener('message', ascolta);
      worker.addEventListener('error', errore);
      worker.postMessage({ id, modello: MODELLI[modello].id, audio }, [audio.buffer]);
    });
  }
}
