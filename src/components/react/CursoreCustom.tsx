import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

/**
 * Cerchio che insegue il puntatore con un ritardo elastico, si allarga e si
 * riempie di bianco sopra le cose cliccabili.
 *
 * Due regole che non tratto: compare solo dove esiste un mouse vero e chi ha
 * chiesto meno movimento non lo vede; e non tocca mai il contorno di messa a
 * fuoco, che resta quello nativo — chi naviga da tastiera non deve dipendere
 * da un cerchietto che segue un mouse fermo.
 */
export default function CursoreCustom() {
  const [attivo, setAttivo] = useState(false);
  const [sopraLink, setSopraLink] = useState(false);
  const [premuto, setPremuto] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const xMorbido = useSpring(x, { stiffness: 380, damping: 32, mass: 0.45 });
  const yMorbido = useSpring(y, { stiffness: 380, damping: 32, mass: 0.45 });

  const dimensione = useTransform(
    () => (sopraLink ? 46 : 14) * (premuto ? 0.82 : 1)
  );

  useEffect(() => {
    const mouse = window.matchMedia('(pointer: fine)');
    const movimento = window.matchMedia('(prefers-reduced-motion: no-preference)');
    if (!mouse.matches || !movimento.matches) return;

    setAttivo(true);
    document.documentElement.classList.add('cursore-custom');

    const CLICCABILI = 'a, button, [role="button"], input, select, textarea, label, summary';

    const muovi = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const bersaglio = e.target as Element | null;
      setSopraLink(!!bersaglio?.closest?.(CLICCABILI));
    };
    const giu = () => setPremuto(true);
    const su = () => setPremuto(false);
    const esci = () => x.set(-100);

    window.addEventListener('pointermove', muovi, { passive: true });
    window.addEventListener('pointerdown', giu);
    window.addEventListener('pointerup', su);
    document.addEventListener('pointerleave', esci);

    return () => {
      document.documentElement.classList.remove('cursore-custom');
      window.removeEventListener('pointermove', muovi);
      window.removeEventListener('pointerdown', giu);
      window.removeEventListener('pointerup', su);
      document.removeEventListener('pointerleave', esci);
    };
  }, [x, y]);

  if (!attivo) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] rounded-full mix-blend-difference"
      style={{
        x: xMorbido,
        y: yMorbido,
        width: dimensione,
        height: dimensione,
        translateX: '-50%',
        translateY: '-50%',
        backgroundColor: '#FAFAFA',
      }}
      animate={{ opacity: sopraLink ? 0.9 : 1 }}
      transition={{ duration: 0.2 }}
    />
  );
}
