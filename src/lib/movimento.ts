/**
 * Movimento — comparse e caricamento di GSAP.
 *
 * Due responsabilità e nient'altro:
 *  1. rivelare gli elementi marcati `data-anima` quando entrano in vista;
 *  2. procurare GSAP e ScrollTrigger solo a chi ne ha davvero bisogno.
 *
 * Le comparse girano in CSS: qui c'è solo l'osservatore che aggiunge la classe.
 * È la parte che deve funzionare anche se tutto il resto fallisce, quindi non
 * dipende da nessuna libreria.
 */

const CLASSE_VISIBILE = 'visibile';

/** Il movimento è concesso solo se il guscio l'ha dichiarato prima del disegno. */
export const movimentoConcesso = () =>
  document.documentElement.classList.contains('puo-animare');

/**
 * Rivela gli elementi `data-anima` quando entrano in vista.
 *
 * Ripetibile senza danni: ogni elemento porta un segno, così un secondo
 * montaggio — con la navigazione senza ricaricamento capita a ogni pagina — non
 * installa un secondo osservatore sugli stessi nodi.
 */
export function montaComparse(radice: ParentNode = document) {
  const bersagli = Array.from(
    radice.querySelectorAll<HTMLElement>('[data-anima]:not([data-anima-montato])')
  );
  if (bersagli.length === 0) return;

  bersagli.forEach((el) => el.setAttribute('data-anima-montato', ''));

  if (!movimentoConcesso() || !('IntersectionObserver' in window)) {
    bersagli.forEach((el) => el.classList.add(CLASSE_VISIBILE));
    return;
  }

  const osservatore = new IntersectionObserver(
    (voci) => {
      voci.forEach((v) => {
        if (!v.isIntersecting) return;
        v.target.classList.add(CLASSE_VISIBILE);
        // Una comparsa che si ripete a ogni risalita è la definizione di
        // animazione fastidiosa: visto una volta, resta visto.
        osservatore.unobserve(v.target);
      });
    },
    { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
  );

  bersagli.forEach((el) => {
    // Chi è già passato sopra la piega non entrerà mai in intersezione.
    if (el.getBoundingClientRect().bottom < 0) el.classList.add(CLASSE_VISIBILE);
    else osservatore.observe(el);
  });

  /**
   * Rete di sicurezza. L'osservatore non scatta finché il documento non viene
   * disegnato: una pagina aperta in una scheda di sfondo ha `visibilityState`
   * a 'hidden' e resta ferma. Al ritorno in primo piano riparte da sola, ma se
   * per qualunque ragione non lo facesse, un sito il cui contenuto principale
   * è testo non può permettersi di restare bianco.
   */
  window.setTimeout(() => {
    bersagli.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.5) {
        el.classList.add(CLASSE_VISIBILE);
      }
    });
  }, 3000);
}

type Gsap = typeof import('gsap');
type ScrollTriggerModulo = typeof import('gsap/ScrollTrigger');

let promessa: Promise<{ gsap: Gsap['gsap']; ScrollTrigger: ScrollTriggerModulo['ScrollTrigger'] }> | null =
  null;

/**
 * Carica GSAP e ScrollTrigger su richiesta, una volta sola.
 *
 * Import dinamico e non statico: così le pagine senza sezioni agganciate —
 * servizi, contatti, privacy — non se lo trascinano dietro.
 *
 * Niente Lenis, e vale la pena scrivere perché. Misurato: GSAP 27,3 KB più
 * ScrollTrigger 17,8 fanno già 45,1 KB compressi, e con Lenis la home saliva a
 * 58,7 contro un tetto di 55. Ma il motivo non è solo il peso: `scrub: 1`
 * interpola già l'animazione con un ritardo morbido, cioè dà la fluidità
 * esattamente dove serve — sul movimento — senza prendere il controllo dello
 * scorrimento della pagina, che è la parte che su telefono dà fastidio e che
 * alcune tecnologie assistive gestiscono male.
 */
export function caricaGsap() {
  if (promessa) return promessa;

  promessa = (async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);

    gsap.registerPlugin(ScrollTrigger);

    return { gsap, ScrollTrigger };
  })();

  return promessa;
}

/** Sotto questa soglia niente aggancio, niente scorrimento orizzontale, niente parallasse. */
export const SOGLIA_MOVIMENTO_RICCO = 768;

export const movimentoRiccoAmmesso = () =>
  movimentoConcesso() && window.innerWidth >= SOGLIA_MOVIMENTO_RICCO;
