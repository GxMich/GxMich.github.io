import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const CHIAVE = 'preloader-visto';
const DURATA = 1300; // ms del conteggio 0→100

/**
 * Preloader: contatore in mono, barra bianca sotto, e alla fine la barra si
 * raddrizza in una linea verticale che cade dentro la pagina — è la stessa
 * linea del Tracing Beam, ed è la cucitura fra il caricamento e il contenuto.
 *
 * Appare una volta per sessione, non a ogni cambio pagina interno.
 */
/**
 * `mostra` è false su tutte le pagine che non sono la home: chi arriva da una
 * ricerca su /servizi o /progetti vuole leggere, non guardare un contatore. In
 * quel caso il componente si limita a segnare la sessione come vista e a dare
 * il via alla pagina, senza montare niente.
 */
export default function Preloader({ mostra = true }: { mostra?: boolean }) {
  const [attivo, setAttivo] = useState(false);
  const [percentuale, setPercentuale] = useState(0);
  const [fase, setFase] = useState<'conta' | 'cade'>('conta');

  useEffect(() => {
    let visto = true;
    try {
      visto = sessionStorage.getItem(CHIAVE) === '1';
    } catch {
      /* navigazione privata: niente preloader, meglio che bloccarsi */
    }

    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!mostra || visto || ridotto) {
      avvisaLaPagina();
      return;
    }

    setAttivo(true);
    document.documentElement.dataset.preloader = 'attivo';

    const inizio = performance.now();
    let frame = 0;

    const passo = (ora: number) => {
      const t = Math.min(1, (ora - inizio) / DURATA);
      // parte deciso e rallenta: sembra un caricamento vero, non un timer
      const eased = 1 - Math.pow(1 - t, 3);
      setPercentuale(Math.round(eased * 100));
      if (t < 1) {
        frame = requestAnimationFrame(passo);
      } else {
        setFase('cade');
        // La hero parte adesso, mentre la linea sta ancora scendendo: le parole
        // si compongono dietro la caduta invece che dopo. Non è solo estetica —
        // aspettare la fine dell'uscita spostava l'LCP avanti di mezzo secondo.
        window.dispatchEvent(new CustomEvent('preloader:fine'));
      }
    };
    frame = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(frame);
  }, [mostra]);

  function avvisaLaPagina() {
    document.documentElement.removeAttribute('data-preloader');
    // se il preloader non è mai comparso, l'evento va mandato lo stesso
    window.dispatchEvent(new CustomEvent('preloader:fine'));
    try {
      sessionStorage.setItem(CHIAVE, '1');
    } catch {
      /* niente da fare, si rivedrà al prossimo caricamento */
    }
  }

  return (
    <AnimatePresence onExitComplete={avvisaLaPagina}>
      {attivo && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0C]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
          aria-hidden="true"
        >
          <motion.div
            className="flex flex-col items-center"
            animate={fase === 'cade' ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="font-mono text-[#FAFAFA] tabular-nums"
              style={{ fontSize: 'clamp(40px, 9vw, 84px)', letterSpacing: '-0.04em' }}
            >
              {String(percentuale).padStart(3, '0')}
            </span>
            <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#9C9CA4]">
              Caricamento
            </span>
          </motion.div>

          {/* barra orizzontale → linea verticale che cade nella pagina */}
          <motion.div
            className="absolute bg-[#FAFAFA]"
            initial={{ width: 0, height: 1, top: '62%', left: '50%', x: '-50%' }}
            animate={
              fase === 'conta'
                ? { width: `${Math.min(percentuale, 100) * 2.4}px`, height: 1 }
                : { width: 1, height: '130vh', top: '0%' }
            }
            transition={
              fase === 'conta'
                ? { duration: 0.12, ease: 'linear' }
                : { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
            }
            style={{ boxShadow: '0 0 22px rgba(255,255,255,0.45)' }}
            onAnimationComplete={() => {
              if (fase === 'cade') setAttivo(false);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
