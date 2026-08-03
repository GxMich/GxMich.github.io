import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Apertura in due tempi.
 *
 * Prima "ciao" si scrive a mano, disegnato come un tratto continuo che avanza:
 * è lo stesso principio del saluto Apple, un percorso vettoriale che si
 * scopre allungando il tratteggio. Poi la scrittura si ritira e al suo posto
 * compare la frase, battuta un carattere alla volta.
 *
 * Sulla macchina da scrivere avevo delle riserve — è l'effetto più abusato che
 * ci sia e su testi lunghi diventa una tortura. Qui però la frase è corta, si
 * batte una volta sola e non riparte in ciclo: fa il suo mestiere, dice "questa
 * pagina è viva", e finisce prima di stancare.
 *
 * Chi ha chiesto meno movimento vede la frase intera, ferma, subito.
 */

const FRASI = ['Sono Michele.', 'Sviluppatore web & problem solver.'];

export default function SalutoScritto() {
  const ridotto = useReducedMotion();
  const [fase, setFase] = useState<'saluto' | 'scrive'>('saluto');
  const [riga, setRiga] = useState(0);
  const [testo, setTesto] = useState('');
  const [finito, setFinito] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  /* Il saluto dura quanto il disegno, poi cede il posto alla frase. */
  useEffect(() => {
    if (ridotto) {
      setFase('scrive');
      setRiga(FRASI.length - 1);
      setTesto(FRASI[FRASI.length - 1]);
      setFinito(true);
      return;
    }
    const t = window.setTimeout(() => setFase('scrive'), 2100);
    return () => window.clearTimeout(t);
  }, [ridotto]);

  /* Batte la riga corrente, aspetta, cancella e passa alla successiva. */
  useEffect(() => {
    if (fase !== 'scrive' || ridotto || finito) return;

    const obiettivo = FRASI[riga];

    if (testo.length < obiettivo.length) {
      // Le pause fra un carattere e l'altro non sono uguali: una cadenza
      // perfettamente regolare è la cosa che fa sembrare finta la battitura.
      const attesa = 46 + Math.random() * 54;
      timer.current = window.setTimeout(
        () => setTesto(obiettivo.slice(0, testo.length + 1)),
        attesa
      );
      return () => window.clearTimeout(timer.current);
    }

    if (riga < FRASI.length - 1) {
      timer.current = window.setTimeout(() => {
        setRiga(riga + 1);
        setTesto('');
      }, 1150);
      return () => window.clearTimeout(timer.current);
    }

    setFinito(true);
  }, [fase, riga, testo, ridotto, finito]);

  return (
    <div className="saluto-blocco">
      {fase === 'saluto' && !ridotto && (
        <motion.svg
          className="saluto-firma"
          viewBox="0 0 340 150"
          fill="none"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Un tratto solo, scritto in corsivo: "ciao" */}
          <motion.path
            d="M42 96c-14 0-22-10-18-24 4-13 18-20 27-14 6 4 5 12-2 14M78 62c-6 14-10 26-9 33 1 6 8 7 13 1M84 40c0-4 3-7 6-7s5 3 4 6-4 6-7 6-3-2-3-5M108 78c4-12 14-22 23-20 7 2 8 10 4 20-3 8-9 14-14 13-4-1-5-6-3-12M140 95c-3-9 1-22 9-30 7-7 16-8 21-2 6 7 4 20-3 28-6 7-15 9-20 5-3-2-5-6-5-11M186 92c-6 0-11-6-11-15 0-12 9-24 20-24 9 0 14 8 13 19-1 12-9 20-17 20h-3M228 60c-8 16-13 30-11 36"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: [0.33, 0, 0.25, 1] }}
          />
        </motion.svg>
      )}

      {(fase === 'scrive' || ridotto) && (
        <motion.p
          className="saluto-frase"
          initial={ridotto ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* aria-live spento: un lettore di schermo che annuncia una lettera
              alla volta è inservibile. La frase completa sta nel testo
              alternativo qui sotto, letta una volta e per intero. */}
          <span aria-hidden="true">{testo}</span>
          <span className="visually-hidden">{FRASI.join(' ')}</span>
          {!finito && <span className="saluto-cursore" aria-hidden="true" />}
        </motion.p>
      )}
    </div>
  );
}
