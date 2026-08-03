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

    // --- i cinque blocchi ---
    contesto: z.string(), // 1. chi è il cliente / contesto
    problema: z.string(), // 2. il problema reale
    soluzione: z.string(), // 3. la direzione scelta e perché
    risultato: z
      .array(z.object({ voce: z.string(), dettaglio: z.string() }))
      .default([]), // 4. il risultato, in dettagli concreti

    schermate: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
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
