import { useEffect, useState } from 'react';
import { BackgroundBeams } from '@/components/ui/background-beams';

/**
 * I Beams sono cinquanta tracciati con altrettanti gradienti animati in
 * contemporanea: su desktop sono il momento cinematografico dell'hero, su un
 * telefono di fascia media sono il modo più rapido per far crollare i frame.
 * Qui sotto i 768px, e per chi ha chiesto meno movimento, restano solo due
 * bagliori radiali statici: stessa atmosfera, costo zero.
 */
export default function SfondoBeams() {
  const [animati, setAnimati] = useState(false);

  useEffect(() => {
    const grande = window.matchMedia('(min-width: 768px)');
    const movimento = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const valuta = () => setAnimati(grande.matches && movimento.matches);

    valuta();
    grande.addEventListener('change', valuta);
    movimento.addEventListener('change', valuta);
    return () => {
      grande.removeEventListener('change', valuta);
      movimento.removeEventListener('change', valuta);
    };
  }, []);

  if (!animati) {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 55% at 50% 0%, rgba(255,255,255,0.10), transparent 68%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(45% 40% at 82% 78%, rgba(255,255,255,0.05), transparent 70%)',
          }}
        />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <BackgroundBeams />
      {/* alone che tiene il testo staccato dai raggi senza usare colore */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 40%, rgba(5,5,5,0.55), transparent 70%)',
        }}
      />
    </div>
  );
}
