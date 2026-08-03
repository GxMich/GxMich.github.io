import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

/**
 * Headline che si rivela parola per parola. Non lettera per lettera: a queste
 * dimensioni la macchina da scrivere è la cosa più stancante che ci sia, e il
 * brief la vieta esplicitamente altrove.
 *
 * Aspetta la fine del preloader, così la prima cosa che vedi dopo il conteggio
 * è la frase che si compone. Se il preloader non c'è (visita successiva nella
 * stessa sessione) parte subito.
 */
interface Props {
  /** Ogni riga è un array di parole: così i ritorni a capo restano voluti */
  righe: string[][];
  className?: string;
}

export default function TitoloHero({ righe, className = '' }: Props) {
  const [parti, setParti] = useState(false);

  useEffect(() => {
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (ridotto || !document.documentElement.dataset.preloader) {
      setParti(true);
      return;
    }
    const alVia = () => setParti(true);
    window.addEventListener('preloader:fine', alVia, { once: true });
    // se per qualsiasi motivo l'evento non arriva, il titolo non resta invisibile
    const salvagente = setTimeout(() => setParti(true), 3500);
    return () => {
      window.removeEventListener('preloader:fine', alVia);
      clearTimeout(salvagente);
    };
  }, []);

  let indice = 0;

  return (
    <h1 className={className}>
      {righe.map((riga, r) => (
        <span key={r} className="block">
          {riga.map((parola) => {
            const i = indice++;
            return (
              <motion.span
                key={`${r}-${i}`}
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={parti ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {parola}
                {' '}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
