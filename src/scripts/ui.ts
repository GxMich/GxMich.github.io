/**
 * Comparsa allo scroll delle sezioni che non hanno un effetto proprio, più il
 * contatore numerico.
 *
 * Sta fuori da React di proposito: è l'unica animazione che serve su ogni
 * pagina, comprese quelle senza isole, e in versione vanilla costa una
 * frazione. Gli effetti pesanti — beams, tilt, macbook, bordo animato,
 * tracing beam — vivono nei componenti React e si caricano solo dove servono.
 *
 * La rivelazione parola per parola del testo lungo non è qui: è tutta in CSS,
 * con animation-timeline. Non serviva JavaScript e quindi non ce n'è.
 */
import { animate, inView } from 'motion';

const root = document.documentElement;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const gia = new WeakSet<Element>();

/**
 * Ogni inView() apre un IntersectionObserver che resta attivo finché non lo
 * si ferma. Con la navigazione client-side le pagine si succedono senza
 * ricaricare il documento, quindi senza questa lista gli osservatori delle
 * pagine già viste si accumulerebbero per tutta la sessione.
 */
let daFermare: (() => void)[] = [];

function fermaTutto() {
  daFermare.forEach((stop) => stop());
  daFermare = [];
}

function mostra(el: HTMLElement) {
  el.style.opacity = '1';
  el.style.transform = 'none';
  gia.add(el);
}

function revealAlloScroll() {
  // I blocchi dell'hero li anima il CSS, prima e senza dipendere da JS.
  document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-hero] *)').forEach((el) => {
    const gruppo = el.closest('[data-reveal-group]');
    const indice = gruppo ? Array.from(gruppo.querySelectorAll('[data-reveal]')).indexOf(el) : 0;

    /**
     * Tre modi di entrare, sempre più decisi.
     *
     * La versione originale era una salita di sedici pixel con dissolvenza:
     * corretta, educata e completamente invisibile. Scorrendo la pagina non
     * si notava che stesse succedendo qualcosa, e un'animazione che non si
     * nota tanto vale toglierla.
     *
     *   maschera   → il testo emerge da sotto un bordo invisibile
     *   sfocatura  → arriva fuori fuoco e si mette a fuoco arrivando
     *   (default)  → salita più lunga con un filo di scala
     */
    const modo = el.dataset.reveal;

    const fotogrammi =
      modo === 'maschera'
        ? {
            opacity: [0, 1],
            y: [40, 0],
            clipPath: ['inset(0 0 100% 0)', 'inset(-0.35em 0 -0.35em 0)'],
          }
        : modo === 'sfocatura'
          ? { opacity: [0, 1], y: [30, 0], filter: ['blur(14px)', 'blur(0px)'] }
          : { opacity: [0, 1], y: [26, 0], scale: [0.985, 1] };

    const durata = modo === 'maschera' ? 0.85 : modo === 'sfocatura' ? 0.8 : 0.62;

    const stop = inView(
      el,
      () => {
        if (gia.has(el)) return;
        gia.add(el);
        animate(el, fotogrammi, {
          duration: durata,
          ease: EASE_OUT,
          // Scaglionamento più largo: a 0,06 il gruppo arrivava tutto insieme
          // e sembrava un blocco solo che si accende.
          delay: Math.min(indice, 6) * 0.085,
        }).finished.then(() => {
          // La sfocatura lasciata sull'elemento costringe la scheda video a
          // ridisegnarlo a ogni scorrimento anche da ferma.
          el.style.filter = '';
          el.style.willChange = '';
        });
      },
      { margin: '0px 0px -90px 0px', amount: 0.05 }
    );
    daFermare.push(stop);
  });
}

/**
 * Contatore: il numero finale è già nell'HTML, quindi chi non ha JavaScript e
 * i motori di ricerca leggono il valore vero. L'animazione parte solo quando
 * l'elemento entra nello schermo e riscrive lo stesso numero partendo da zero.
 */
function contatori() {
  document.querySelectorAll<HTMLElement>('[data-conta]').forEach((el) => {
    const arrivo = Number(el.dataset.conta);
    if (!Number.isFinite(arrivo)) return;

    const decimali = Number(el.dataset.decimali ?? 0);
    const formato = new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: decimali,
      maximumFractionDigits: decimali,
    });
    // Larghezza bloccata sul valore finale: senza, la riga si allarga mentre
    // le cifre crescono e trascina il testo accanto.
    el.style.display = 'inline-block';
    el.style.minWidth = `${el.getBoundingClientRect().width}px`;

    const stop = inView(
      el,
      () => {
        if (gia.has(el)) return;
        gia.add(el);
        const durata = 1100;
        const avvio = performance.now();
        const passo = (ora: number) => {
          const t = Math.min(1, (ora - avvio) / durata);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = formato.format(arrivo * eased);
          if (t < 1) requestAnimationFrame(passo);
          else el.textContent = formato.format(arrivo);
        };
        requestAnimationFrame(passo);
      },
      { amount: 0.6 }
    );
    daFermare.push(stop);
  });
}

function init() {
  fermaTutto();

  if (!root.classList.contains('can-animate')) return;

  // Scheda aperta in secondo piano: l'IntersectionObserver non scatta.
  // Aspetto che diventi visibile e, come rete, dopo tre secondi mostro
  // comunque il contenuto — senza però disattivare le animazioni.
  if (document.visibilityState === 'hidden') {
    const quandoVisibile = () => {
      if (document.hidden) return;
      document.removeEventListener('visibilitychange', quandoVisibile);
      revealAlloScroll();
      contatori();
    };
    document.addEventListener('visibilitychange', quandoVisibile);
    setTimeout(() => {
      if (document.hidden) {
        document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
          if (!gia.has(el)) mostra(el);
        });
      }
    }, 3000);
    return;
  }

  revealAlloScroll();
  contatori();
}

/**
 * astro:page-load scatta al primo caricamento e dopo ogni navigazione di
 * ClientRouter. Con DOMContentLoaded, che scatta una volta sola per documento,
 * dalla seconda pagina in poi il contenuto restava fermo a opacità zero:
 * invisibile, ma occupava lo spazio. È il modo più silenzioso che conosco per
 * rompere un sito.
 */
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', fermaTutto);
