import { useEffect, useState } from 'react';
import { MacbookScroll } from '@/components/ui/macbook-scroll';

/**
 * Il mockup del laptop che si apre mentre scorri. Vale solo per i progetti di
 * tipo "sito": per un tool o un'automazione mettere il sito dentro un portatile
 * racconterebbe la cosa sbagliata.
 *
 * Su mobile non lo mostro. Non per pigrizia: l'originale occupa due schermate
 * intere di scroll per disegnare un laptop ridotto al 35%, cioè si paga tutto
 * lo scroll e non si vede niente. Al suo posto va lo screenshot in una cornice,
 * che su un telefono è esattamente ciò che si voleva far vedere.
 */
interface Props {
  src: string;
  titolo: string;
  alt: string;
}

export default function MacbookProgetto({ src, titolo, alt }: Props) {
  const [completo, setCompleto] = useState<boolean | null>(null);

  useEffect(() => {
    const grande = window.matchMedia('(min-width: 768px)');
    const movimento = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const valuta = () => setCompleto(grande.matches && movimento.matches);
    valuta();
    grande.addEventListener('change', valuta);
    movimento.addEventListener('change', valuta);
    return () => {
      grande.removeEventListener('change', valuta);
      movimento.removeEventListener('change', valuta);
    };
  }, []);

  // finché non so su che schermo sono, mostro la versione leggera
  if (completo !== true) {
    return (
      <figure className="mx-auto w-full max-w-[900px]">
        <div className="overflow-hidden rounded-xl border border-[#33333B] bg-[#1E1E24]">
          <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full" />
        </div>
        <figcaption className="mt-4 font-mono text-[11px] tracking-[0.14em] text-[#9C9CA4] uppercase">
          {titolo}
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="overflow-hidden">
      <MacbookScroll
        src={src}
        title={
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#9C9CA4] uppercase">
            {titolo}
          </span>
        }
        showGradient={false}
      />
    </div>
  );
}
