import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Un case study = un file markdown in src/content/progetti/.
 * I cinque blocchi narrativi sono nello schema, non nel corpo del testo:
 * se ne manca uno la build si ferma. È il modo più semplice per non
 * ritrovarsi, fra un anno, con schede di progetto raccontate in modi diversi.
 */
const progetti = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/progetti' }),
  schema: z.object({
    titolo: z.string(),
    cliente: z.string(),
    tipo: z.enum(['sito', 'tool']),
    anno: z.number(),
    /** Una riga sul problema risolto: è quella che si legge nella griglia */
    riassunto: z.string(),

    /**
     * Da dove nasce il lavoro. Serve a non far passare per commessa un progetto
     * nato da solo: un portfolio che confonde le due cose si smonta al primo
     * cliente che chiede il riferimento.
     *  - cliente:    commissionato e pagato
     *  - iniziativa: nato da me, non richiesto da nessuno
     *  - interno:    fatto dentro un'azienda, coperto da riservatezza
     */
    natura: z.enum(['cliente', 'iniziativa', 'interno']).default('cliente'),
    /** "In produzione dal 2023", "In corso — 85%", … */
    stato: z.string().optional(),
    /** Quanto è durato, in parole: "tre settimane" */
    durata: z.string().optional(),
    /** Se è online e visitabile */
    link: z.string().url().optional(),
    /** Repository pubblico, quando il codice è consultabile */
    codice: z.string().url().optional(),

    // --- i cinque blocchi ---
    contesto: z.string(), // 1. chi è il cliente / contesto
    problema: z.string(), // 1. il problema reale

    /**
     * 2. La strada scartata, e perché non reggeva.
     *
     * Opzionale per non rompere le schede già scritte, ma è il blocco che
     * convince di più: mostrare il tentativo sbagliato è l'unica prova di
     * competenza che non si può fingere. Finché è vuoto, il racconto salta
     * dal problema alla soluzione come se la soluzione fosse ovvia — e se
     * fosse stata ovvia non ci sarebbe voluto un mestiere.
     */
    ricerca: z.string().optional(),

    soluzione: z.string(), // 3. la direzione scelta, dal lato di chi la usa

    /**
     * 4. La decisione di codice e il perché, separata dalla soluzione di
     * prodotto: sono due cose diverse e mescolarle le indebolisce entrambe.
     */
    tecnica: z.string().optional(),

    risultato: z
      .array(z.object({ voce: z.string(), dettaglio: z.string() }))
      .default([]), // 5. il risultato, in dettagli concreti

    schermate: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),

    /**
     * Slot per il video, quando ci sarà. Il percorso è dentro public/video/.
     * Previsto ma non indispensabile: la scheda deve reggere anche vuota,
     * altrimenti il sito dipende da materiale che non esiste.
     */
    video: z
      .object({
        src: z.string(),
        poster: z.string().optional(),
        descrizione: z.string(),
      })
      .optional(),
    tecnologie: z.array(z.string()).default([]),
    /** Immagine di anteprima nella griglia: percorso dentro src/assets/progetti/ */
    anteprima: z.string().optional(),

    inEvidenza: z.boolean().default(false),
    ordine: z.number().default(99),

    metaTitolo: z.string(),
    metaDescrizione: z.string(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { progetti };
