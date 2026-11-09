/**
 * Il lavoratore che trascrive: gira in un Web Worker, così la pagina non si blocca.
 *
 * Usa transformers.js con Whisper, che gira nel browser (WebAssembly): l'audio resta
 * sul dispositivo. Da internet arrivano solo il codice della libreria (jsDelivr) e,
 * la prima volta, i file del modello (Hugging Face), poi il browser li tiene in cache.
 * La versione è fissata: un aggiornamento della libreria non deve cambiare niente
 * senza che me ne accorga.
 *
 * Si carica con un import dinamico dall'indirizzo, e non dal pacchetto npm, perché
 * la libreria con i suoi file WebAssembly pesa più di tutto il resto del sito.
 */

const VERSIONE = '3.8.1';
const INDIRIZZO_LIBRERIA = `https://cdn.jsdelivr.net/npm/@huggingface/transformers@${VERSIONE}/+esm`;

interface Richiesta {
  id: number;
  modello: string;
  audio: Float32Array;
}

/* La libreria e il modello, caricati una volta sola. */
let libreria: { pipeline: (...a: unknown[]) => Promise<(audio: Float32Array, opz: unknown) => Promise<unknown>> } | null = null;
let motore: ((audio: Float32Array, opz: unknown) => Promise<unknown>) | null = null;
let modelloCaricato = '';

const invia = (m: unknown) => (self as unknown as { postMessage(m: unknown): void }).postMessage(m);

self.onmessage = async (e: MessageEvent<Richiesta>) => {
  const { id, modello, audio } = e.data;
  try {
    if (!libreria) {
      invia({ id, tipo: 'stato', msg: 'Carico il trascrittore…' });
      libreria = await import(/* @vite-ignore */ INDIRIZZO_LIBRERIA);
    }

    if (!motore || modelloCaricato !== modello) {
      motore = null;
      invia({ id, tipo: 'stato', msg: 'Scarico il modello (solo la prima volta)…' });

      /* Il modello arriva a file: si somma l'avanzamento di tutti per darne uno solo. */
      const file = new Map<string, { caricati: number; totale: number }>();
      motore = await libreria!.pipeline('automatic-speech-recognition', modello, {
        progress_callback: (p: { status: string; file?: string; loaded?: number; total?: number }) => {
          if (p.status !== 'progress' || !p.file || !p.total) return;
          file.set(p.file, { caricati: p.loaded ?? 0, totale: p.total });
          let c = 0;
          let t = 0;
          for (const v of file.values()) {
            c += v.caricati;
            t += v.totale;
          }
          invia({ id, tipo: 'progresso', percento: t ? Math.round((c / t) * 100) : 0 });
        },
      });
      modelloCaricato = modello;
    }

    invia({ id, tipo: 'stato', msg: 'Trascrivo…' });
    const r = (await motore!(audio, {
      language: 'italian',
      task: 'transcribe',
      chunk_length_s: 30,
      stride_length_s: 5,
    })) as { text: string } | { text: string }[];

    invia({ id, tipo: 'fine', testo: (Array.isArray(r) ? r.map((x) => x.text).join(' ') : r.text).trim() });
  } catch (err) {
    invia({ id, tipo: 'errore', msg: err instanceof Error ? err.message : String(err) });
  }
};
