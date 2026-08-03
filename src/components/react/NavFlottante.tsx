import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/**
 * Pillola di navigazione che entra da destra quando l'intestazione grande
 * esce di scena.
 *
 * Prima l'intestazione spariva e basta: per tornare al menù bisognava risalire
 * fino in cima, e su una scheda progetto lunga sono parecchi secondi di
 * scorrimento all'indietro. Adesso appena il titolo di apertura è passato
 * compare questa, e resta lì.
 *
 * Non ripete le voci: sarebbero sei bersagli da 11px in una barra alta 44.
 * Tiene le due cose che servono davvero — tornare indietro e scrivere — più
 * un menù che si apre quando serve tutto il resto.
 */
interface Voce {
  href: string;
  label: string;
}

export default function NavFlottante({ voci, percorso }: { voci: Voce[]; percorso: string }) {
  const [visibile, setVisibile] = useState(false);
  const [aperto, setAperto] = useState(false);

  useEffect(() => {
    // La soglia è l'altezza dello schermo: l'apertura di ogni pagina è alta
    // circa così, quindi la pillola arriva quando l'intestazione è appena
    // uscita e non un attimo prima.
    const soglia = () => Math.min(window.innerHeight * 0.82, 620);
    let ultimo = window.scrollY;

    const guarda = () => {
      const y = window.scrollY;
      // Compare risalendo, o comunque superata la soglia: chi torna indietro
      // in genere sta cercando proprio il menù.
      setVisibile(y > soglia());
      if (y > ultimo + 4 && aperto) setAperto(false);
      ultimo = y;
    };

    guarda();
    window.addEventListener('scroll', guarda, { passive: true });
    return () => window.removeEventListener('scroll', guarda);
  }, [aperto]);

  // Esc chiude il pannello, come ci si aspetta da qualunque cosa che si apre.
  useEffect(() => {
    if (!aperto) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAperto(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [aperto]);

  return (
    <AnimatePresence>
      {visibile && (
        <motion.div
          className="pillola"
          initial={{ opacity: 0, x: 28, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 28, scale: 0.94 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence>
            {aperto && (
              <motion.ul
                className="pillola-voci"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
              >
                {voci.map((v) => (
                  <li key={v.href}>
                    <a
                      href={v.href}
                      aria-current={percorso === v.href ? 'page' : undefined}
                      onClick={() => setAperto(false)}
                    >
                      {v.label}
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <div className="pillola-barra">
            <button
              type="button"
              className="pillola-btn"
              aria-expanded={aperto}
              aria-label={aperto ? 'Chiudi il menù' : 'Apri il menù'}
              onClick={() => setAperto((v) => !v)}
            >
              <span className="tratti" data-aperto={aperto || undefined} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>

            <a className="pillola-scrivi" href="/contatti">
              Scrivimi
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
