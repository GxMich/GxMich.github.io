/**
 * Trascrizione dal microfono, per l'incontro.
 *
 * Usa il riconoscimento vocale del browser (Web Speech API). Due cose da
 * sapere, e vanno dette al cliente prima di accendere:
 *
 *  - l'audio non lo elabora questo sito: lo manda il browser al servizio che
 *    lo trascrive (Google in Chrome ed Edge, Apple in Safari). Il sito non
 *    registra e non conserva nessun audio, salva solo il testo che torna;
 *  - non distingue chi parla: per questo la pagina ha un interruttore
 *    «parla il cliente / parlo io» che prefigge ogni riga.
 *
 * Il browser ferma da solo l'ascolto dopo qualche secondo di silenzio: finché
 * l'ho acceso io, qui lo si riavvia. Se si ferma subito più volte di fila,
 * qualcosa non va (microfono occupato, permesso) e ci si ferma con un messaggio
 * invece di girare a vuoto.
 */

interface Callback {
  /** Una frase conclusa dal riconoscitore. */
  finale: (testo: string) => void;
  /** Quello che sta dicendo adesso, ancora provvisorio. */
  provvisorio: (testo: string) => void;
  stato: (attiva: boolean, messaggio: string) => void;
}

/* L'API non è nei tipi standard del DOM. */
type Riconoscitore = any; // eslint-disable-line @typescript-eslint/no-explicit-any

const costruttore = (): (new () => Riconoscitore) | undefined => {
  const w = window as unknown as Record<string, new () => Riconoscitore>;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

export const trascrizioneDisponibile = () => Boolean(costruttore());

export class Trascrizione {
  attiva = false;
  private voluta = false;
  private rec: Riconoscitore | null = null;
  private partenza = 0;
  private fermiRapidi = 0;

  constructor(private readonly cb: Callback) {}

  avvia() {
    if (!costruttore()) {
      this.cb.stato(false, 'Questo browser non sa trascrivere la voce: usa Chrome, Edge o Safari.');
      return;
    }
    this.voluta = true;
    this.fermiRapidi = 0;
    this.crea();
  }

  ferma() {
    this.voluta = false;
    try {
      this.rec?.stop();
    } catch {
      /* già fermo */
    }
  }

  private crea() {
    const R = costruttore()!;
    const r = new R();
    r.lang = 'it-IT';
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;

    r.onstart = () => {
      this.attiva = true;
      this.partenza = Date.now();
      this.cb.stato(true, 'In ascolto…');
    };

    r.onresult = (e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => {
      let provvisorio = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const risultato = e.results[i];
        const testo = risultato[0].transcript.trim();
        if (risultato.isFinal) {
          if (testo) this.cb.finale(testo);
        } else {
          provvisorio += `${testo} `;
        }
      }
      this.cb.provvisorio(provvisorio.trim());
    };

    r.onerror = (e: { error: string }) => {
      /* Silenzio e interruzioni volute non sono errori: onend riparte da solo. */
      if (e.error === 'no-speech' || e.error === 'aborted') return;

      this.voluta = false;
      const messaggi: Record<string, string> = {
        'not-allowed': 'Il microfono è bloccato: consentilo dal lucchetto vicino all’indirizzo e riprova.',
        'service-not-allowed': 'Il browser non permette il riconoscimento vocale su questa pagina.',
        'audio-capture': 'Non trovo nessun microfono.',
        network: 'Il riconoscimento vocale ha bisogno di internet: senza connessione non funziona.',
      };
      this.cb.stato(false, messaggi[e.error] ?? `La trascrizione si è fermata (${e.error}).`);
    };

    r.onend = () => {
      this.attiva = false;
      this.cb.provvisorio('');
      if (!this.voluta) {
        this.cb.stato(false, 'Trascrizione ferma.');
        return;
      }

      /* Chiusure dopo meno di un secondo, tre di fila: non è silenzio. */
      this.fermiRapidi = Date.now() - this.partenza < 1000 ? this.fermiRapidi + 1 : 0;
      if (this.fermiRapidi >= 3) {
        this.voluta = false;
        this.cb.stato(false, 'Il microfono si ferma subito: controlla che nessun’altra app lo stia usando.');
        return;
      }
      window.setTimeout(() => {
        if (this.voluta) this.crea();
      }, 250);
    };

    this.rec = r;
    try {
      r.start();
    } catch {
      this.voluta = false;
      this.cb.stato(false, 'Non riesco ad accendere il microfono.');
    }
  }
}
